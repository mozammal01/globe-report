import "server-only";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    draftCount,
    inReviewCount,
    publishedCount,
    archivedCount,
    scheduledCount,
    countryCount,
    categoryCount,
    tagCount,
    recentArticles,
  ] = await Promise.all([
    prisma.article.count({ where: { status: "DRAFT" } }),
    prisma.article.count({ where: { status: "IN_REVIEW" } }),
    prisma.article.count({ where: { status: "PUBLISHED" } }),
    prisma.article.count({ where: { status: "ARCHIVED" } }),
    prisma.article.count({
      where: { status: "PUBLISHED", publishedAt: { gt: new Date() } },
    }),
    prisma.country.count(),
    prisma.category.count(),
    prisma.tag.count(),
    prisma.article.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        status: true,
        updatedAt: true,
        publishedAt: true,
      },
    }),
  ]);

  return {
    articles: {
      draft: draftCount,
      inReview: inReviewCount,
      published: publishedCount,
      archived: archivedCount,
      scheduled: scheduledCount,
      total: draftCount + inReviewCount + publishedCount + archivedCount,
    },
    countryCount,
    categoryCount,
    tagCount,
    recentArticles,
  };
}

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>;
