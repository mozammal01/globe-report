import "server-only";

import { prisma } from "@/lib/prisma";

const tagOptionSelect = { id: true, name: true, slug: true } as const;

export async function getTags() {
  return prisma.tag.findMany({
    orderBy: { name: "asc" },
    select: tagOptionSelect,
  });
}

export type TagOption = Awaited<ReturnType<typeof getTags>>[number];
