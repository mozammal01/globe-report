import "server-only";

import { articleCardSelect } from "@/lib/queries/articles";
import { prisma } from "@/lib/prisma";

export async function getUserBookmarks(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { article: { select: articleCardSelect } },
  });

  return bookmarks.map((bookmark) => bookmark.article);
}

export async function isArticleBookmarked(userId: string, articleId: string) {
  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_articleId: { userId, articleId } },
    select: { id: true },
  });

  return bookmark !== null;
}

export async function getUserReadingHistory(userId: string, limit = 30) {
  const views = await prisma.view.findMany({
    where: { userId },
    orderBy: { viewedAt: "desc" },
    distinct: ["articleId"],
    take: limit,
    select: { article: { select: articleCardSelect } },
  });

  return views.map((view) => view.article);
}
