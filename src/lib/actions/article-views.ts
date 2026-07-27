"use server";

import { prisma } from "@/lib/prisma";

export async function incrementArticleView(articleId: string) {
  await prisma.article.update({
    where: { id: articleId },
    data: { viewCount: { increment: 1 } },
  });
}
