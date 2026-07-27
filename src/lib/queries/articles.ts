import "server-only";

import { prisma } from "@/lib/prisma";

const articleCardSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  publishedAt: true,
  readingTimeMinutes: true,
  viewCount: true,
  bookmarkCount: true,
  isFeatured: true,
  category: { select: { name: true, slug: true } },
  country: { select: { name: true, flagEmoji: true } },
  coverImage: { select: { url: true, altText: true } },
  author: { select: { name: true } },
} as const;

export async function getHeroArticle() {
  return prisma.article.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    select: articleCardSelect,
  });
}

export async function getLatestArticles(limit = 6, excludeId?: string) {
  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: articleCardSelect,
  });
}

export async function getTrendingArticles(limit = 4) {
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  return prisma.article.findMany({
    where: { status: "PUBLISHED", publishedAt: { gte: since } },
    orderBy: { viewCount: "desc" },
    take: limit,
    select: articleCardSelect,
  });
}

export async function getPopularArticles(limit = 4) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ viewCount: "desc" }, { bookmarkCount: "desc" }],
    take: limit,
    select: articleCardSelect,
  });
}

export async function getEditorsPicks(limit = 3) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: articleCardSelect,
  });
}

export async function getFeaturedCountries(limit = 8) {
  const grouped = await prisma.article.groupBy({
    by: ["countryId"],
    where: { status: "PUBLISHED", countryId: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { countryId: "desc" } },
    take: limit,
  });

  const countryIds = grouped
    .map((row) => row.countryId)
    .filter((id): id is string => id !== null);

  const countries = await prisma.country.findMany({
    where: { id: { in: countryIds } },
    select: { id: true, name: true, slug: true, flagEmoji: true },
  });

  const countryById = new Map(
    countries.map((country) => [country.id, country]),
  );

  return grouped
    .map((row) => {
      const country = row.countryId ? countryById.get(row.countryId) : null;
      return country ? { ...country, articleCount: row._count._all } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

export async function getArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      ...articleCardSelect,
      content: true,
      seoTitle: true,
      seoDescription: true,
      updatedAt: true,
      tags: { select: { name: true, slug: true } },
    },
  });
}

export type ArticleCard = NonNullable<
  Awaited<ReturnType<typeof getHeroArticle>>
>;
export type FeaturedCountry = Awaited<
  ReturnType<typeof getFeaturedCountries>
>[number];
export type ArticleDetail = NonNullable<
  Awaited<ReturnType<typeof getArticleBySlug>>
>;
