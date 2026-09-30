import "server-only";

import { prisma } from "@/lib/prisma";

const categoryOptionSelect = { id: true, name: true, slug: true } as const;

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: categoryOptionSelect,
  });
}

export async function getCategoriesWithCounts() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parent: { select: { id: true, name: true } },
      _count: { select: { articles: true } },
    },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          articles: {
            where: {
              status: "PUBLISHED",
              publishedAt: { lte: new Date() },
            },
          },
        },
      },
    },
  });
}

export type CategoryOption = Awaited<ReturnType<typeof getCategories>>[number];
export type CategoryWithCounts = Awaited<
  ReturnType<typeof getCategoriesWithCounts>
>[number];
export type CategoryDetail = NonNullable<
  Awaited<ReturnType<typeof getCategoryById>>
>;
