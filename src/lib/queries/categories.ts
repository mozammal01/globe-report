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

export type CategoryOption = Awaited<ReturnType<typeof getCategories>>[number];
export type CategoryWithCounts = Awaited<
  ReturnType<typeof getCategoriesWithCounts>
>[number];
export type CategoryDetail = NonNullable<
  Awaited<ReturnType<typeof getCategoryById>>
>;
