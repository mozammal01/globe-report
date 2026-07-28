"use server";

import { headers } from "next/headers";

import { getCurrentUser } from "@/lib/auth/session";
import { hashIp } from "@/lib/hash";
import { prisma } from "@/lib/prisma";

export async function incrementArticleView(articleId: string) {
  const [user, headersList] = await Promise.all([getCurrentUser(), headers()]);

  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0]!.trim() : null;

  await prisma.$transaction([
    prisma.article.update({
      where: { id: articleId },
      data: { viewCount: { increment: 1 } },
    }),
    prisma.view.create({
      data: {
        articleId,
        userId: user?.id ?? null,
        ipHash: hashIp(ip),
        userAgent: headersList.get("user-agent"),
      },
    }),
  ]);
}
