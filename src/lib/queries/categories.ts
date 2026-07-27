import "server-only";

import { prisma } from "@/lib/prisma";

const categoryOptionSelect = { id: true, name: true, slug: true } as const;

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    select: categoryOptionSelect,
  });
}

export type CategoryOption = Awaited<ReturnType<typeof getCategories>>[number];
