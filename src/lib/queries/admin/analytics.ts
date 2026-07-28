import "server-only";

import {
  getPopularArticles,
  getTrendingArticles,
} from "@/lib/queries/articles";
import { prisma } from "@/lib/prisma";

async function getMostVisitedCountries(limit = 8) {
  const grouped = await prisma.article.groupBy({
    by: ["countryId"],
    where: { countryId: { not: null } },
    _sum: { viewCount: true },
    orderBy: { _sum: { viewCount: "desc" } },
    take: limit,
  });

  const countryIds = grouped
    .map((row) => row.countryId)
    .filter((id): id is string => id !== null);

  const countries = await prisma.country.findMany({
    where: { id: { in: countryIds } },
    select: { id: true, name: true, flagEmoji: true, slug: true },
  });
  const countryById = new Map(countries.map((c) => [c.id, c]));

  return grouped
    .map((row) => {
      const country = row.countryId ? countryById.get(row.countryId) : null;
      return country
        ? { ...country, viewCount: row._sum.viewCount ?? 0 }
        : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

async function getPopularCategories(limit = 8) {
  const grouped = await prisma.article.groupBy({
    by: ["categoryId"],
    _sum: { viewCount: true },
    _count: { _all: true },
    orderBy: { _sum: { viewCount: "desc" } },
    take: limit,
  });

  const categories = await prisma.category.findMany({
    where: { id: { in: grouped.map((row) => row.categoryId) } },
    select: { id: true, name: true, slug: true },
  });
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  return grouped
    .map((row) => {
      const category = categoryById.get(row.categoryId);
      return category
        ? {
            ...category,
            viewCount: row._sum.viewCount ?? 0,
            articleCount: row._count._all,
          }
        : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

async function getRecentActivity(limit = 20) {
  return prisma.view.findMany({
    orderBy: { viewedAt: "desc" },
    take: limit,
    select: {
      id: true,
      viewedAt: true,
      article: { select: { id: true, title: true, slug: true } },
      user: { select: { id: true, name: true } },
    },
  });
}

async function getReadingStats() {
  const [totals, publishedCount] = await Promise.all([
    prisma.article.aggregate({
      where: { status: "PUBLISHED" },
      _sum: { viewCount: true, readingTimeMinutes: true },
      _avg: { readingTimeMinutes: true },
    }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
  ]);

  const totalViews = totals._sum.viewCount ?? 0;
  const avgReadingTimeMinutes = totals._avg.readingTimeMinutes ?? 0;

  return {
    totalViews,
    publishedCount,
    avgReadingTimeMinutes: Math.round(avgReadingTimeMinutes * 10) / 10,
    estimatedReadingMinutes: Math.round(totalViews * avgReadingTimeMinutes),
  };
}

export async function getAnalyticsOverview() {
  const [
    mostViewed,
    trending,
    mostVisitedCountries,
    popularCategories,
    recentActivity,
    readingStats,
  ] = await Promise.all([
    getPopularArticles(10),
    getTrendingArticles(10),
    getMostVisitedCountries(8),
    getPopularCategories(8),
    getRecentActivity(20),
    getReadingStats(),
  ]);

  return {
    mostViewed,
    trending,
    mostVisitedCountries,
    popularCategories,
    recentActivity,
    readingStats,
  };
}

export type AnalyticsOverview = Awaited<
  ReturnType<typeof getAnalyticsOverview>
>;
