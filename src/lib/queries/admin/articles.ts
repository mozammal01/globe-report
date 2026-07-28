import "server-only";

import { prisma } from "@/lib/prisma";
import { articleCardSelect } from "@/lib/queries/articles";

const ADMIN_ARTICLES_PAGE_SIZE = 20;

export async function getAdminArticles({
  search,
  status,
  page = 1,
  pageSize = ADMIN_ARTICLES_PAGE_SIZE,
}: {
  search?: string;
  status?: "DRAFT" | "IN_REVIEW" | "PUBLISHED" | "ARCHIVED";
  page?: number;
  pageSize?: number;
} = {}) {
  const where = {
    ...(status ? { status } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { excerpt: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: { ...articleCardSelect, status: true },
    }),
    prisma.article.count({ where }),
  ]);

  return { articles, total, page, pageSize };
}

export async function getArticleForAdmin(id: string) {
  return prisma.article.findUnique({
    where: { id },
    select: {
      ...articleCardSelect,
      content: true,
      categoryId: true,
      countryId: true,
      coverMediaId: true,
      status: true,
      seoTitle: true,
      seoDescription: true,
      tags: { select: { id: true, name: true, slug: true } },
    },
  });
}

export type AdminArticlesResult = Awaited<ReturnType<typeof getAdminArticles>>;
export type AdminArticle = NonNullable<
  Awaited<ReturnType<typeof getArticleForAdmin>>
>;
