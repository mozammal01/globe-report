"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { hashIp } from "@/lib/hash";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const articleIdSchema = z.string().min(1);

// Skip logging a repeat view from the same IP for the same article within
// this window — cheap dedup against trivial refresh-to-inflate-views abuse.
const VIEW_DEDUP_WINDOW_MS = 30 * 60 * 1000;

export async function incrementArticleView(articleId: string) {
  const parsed = articleIdSchema.safeParse(articleId);
  if (!parsed.success) return;

  const ip = await getClientIp();
  if (!rateLimit(`view:${ip}`, 60, 60_000)) return;

  const [user, headersList] = await Promise.all([getCurrentUser(), headers()]);
  const ipHash = hashIp(ip === "unknown" ? null : ip);

  const recentView = await prisma.view.findFirst({
    where: {
      articleId,
      ipHash,
      viewedAt: { gte: new Date(Date.now() - VIEW_DEDUP_WINDOW_MS) },
    },
    select: { id: true },
  });
  if (recentView) return;

  try {
    await prisma.$transaction([
      prisma.article.update({
        where: { id: articleId },
        data: { viewCount: { increment: 1 } },
      }),
      prisma.view.create({
        data: {
          articleId,
          userId: user?.id ?? null,
          ipHash,
          userAgent: headersList.get("user-agent"),
        },
      }),
    ]);
  } catch (error) {
    console.error("Failed to record article view:", error);
  }
}
