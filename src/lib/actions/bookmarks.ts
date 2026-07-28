"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function toggleBookmark(
  articleId: string,
): Promise<{ bookmarked: boolean } | { error: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Sign in to bookmark articles." };
  }

  const existing = await prisma.bookmark.findUnique({
    where: { userId_articleId: { userId: user.id, articleId } },
    select: { id: true },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.bookmark.delete({ where: { id: existing.id } }),
      prisma.article.update({
        where: { id: articleId },
        data: { bookmarkCount: { decrement: 1 } },
      }),
    ]);
    revalidatePath("/account/bookmarks");
    return { bookmarked: false };
  }

  await prisma.$transaction([
    prisma.bookmark.create({ data: { userId: user.id, articleId } }),
    prisma.article.update({
      where: { id: articleId },
      data: { bookmarkCount: { increment: 1 } },
    }),
  ]);
  revalidatePath("/account/bookmarks");
  return { bookmarked: true };
}
