"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const articleIdSchema = z.string().min(1);

export async function toggleBookmark(
  articleId: string,
): Promise<{ bookmarked: boolean } | { error: string }> {
  const parsed = articleIdSchema.safeParse(articleId);
  if (!parsed.success) {
    return { error: "Invalid article." };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { error: "Sign in to bookmark articles." };
  }

  if (!rateLimit(`bookmark:${user.id}`, 30, 60_000)) {
    return { error: "Too many requests. Please try again shortly." };
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
