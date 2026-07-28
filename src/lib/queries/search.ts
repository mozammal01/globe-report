import "server-only";

import { prisma } from "@/lib/prisma";

const SEARCH_RESULT_LIMIT = 5;

export async function searchAll(query: string) {
  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return { articles: [], countries: [], categories: [], tags: [] };
  }

  const [articles, countries, categories, tags] = await Promise.all([
    prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { lte: new Date() },
        title: { contains: trimmed, mode: "insensitive" },
      },
      orderBy: { publishedAt: "desc" },
      take: SEARCH_RESULT_LIMIT,
      select: {
        id: true,
        title: true,
        slug: true,
        category: { select: { name: true } },
      },
    }),
    prisma.country.findMany({
      where: { name: { contains: trimmed, mode: "insensitive" } },
      orderBy: { name: "asc" },
      take: SEARCH_RESULT_LIMIT,
      select: { id: true, name: true, slug: true, flagEmoji: true },
    }),
    prisma.category.findMany({
      where: { name: { contains: trimmed, mode: "insensitive" } },
      orderBy: { name: "asc" },
      take: SEARCH_RESULT_LIMIT,
      select: { id: true, name: true, slug: true },
    }),
    prisma.tag.findMany({
      where: { name: { contains: trimmed, mode: "insensitive" } },
      orderBy: { name: "asc" },
      take: SEARCH_RESULT_LIMIT,
      select: { id: true, name: true, slug: true },
    }),
  ]);

  return { articles, countries, categories, tags };
}

export type SearchResults = Awaited<ReturnType<typeof searchAll>>;
