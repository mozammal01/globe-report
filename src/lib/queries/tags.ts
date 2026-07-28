import "server-only";

import { prisma } from "@/lib/prisma";

const tagOptionSelect = { id: true, name: true, slug: true } as const;

export async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    select: tagOptionSelect,
  });
}

export async function getTagsWithCounts() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { articles: true } },
    },
  });
}

export async function getTagById(id: string) {
  return prisma.tag.findUnique({ where: { id } });
}

export type TagOption = Awaited<ReturnType<typeof getTags>>[number];
export type TagWithCounts = Awaited<
  ReturnType<typeof getTagsWithCounts>
>[number];
export type TagDetail = NonNullable<Awaited<ReturnType<typeof getTagById>>>;
