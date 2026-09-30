"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const createCommentSchema = z.object({
  articleId: z.string().min(1, "Article ID is required"),
  content: z
    .string()
    .trim()
    .min(2, "Comment must be at least 2 characters")
    .max(2000, "Comment cannot exceed 2000 characters"),
  parentId: z.string().optional().nullable(),
});

export type CommentActionResult =
  { success: true; message?: string } | { error: string };

export async function createComment(
  input: z.infer<typeof createCommentSchema>,
): Promise<CommentActionResult> {
  const parsed = createCommentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const user = await getCurrentUser();
  if (!user) {
    return { error: "You must be signed in to leave a comment." };
  }

  if (!rateLimit(`comment:${user.id}`, 10, 60_000)) {
    return { error: "You are commenting too fast. Please wait a minute." };
  }

  const article = await prisma.article.findUnique({
    where: { id: parsed.data.articleId },
    select: { id: true, slug: true },
  });

  if (!article) {
    return { error: "Article not found." };
  }

  if (parsed.data.parentId) {
    const parentComment = await prisma.comment.findUnique({
      where: { id: parsed.data.parentId },
      select: { id: true, articleId: true },
    });
    if (!parentComment || parentComment.articleId !== article.id) {
      return { error: "Parent comment not found." };
    }
  }

  await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: parsed.data.content,
        articleId: article.id,
        userId: user.id,
        parentId: parsed.data.parentId || null,
        status: "APPROVED",
      },
    }),
    prisma.article.update({
      where: { id: article.id },
      data: { commentCount: { increment: 1 } },
    }),
  ]);

  revalidatePath(`/articles/${article.slug}`);
  revalidatePath(`/blog/${article.slug}`);

  return { success: true };
}

export async function deleteComment(
  commentId: string,
): Promise<CommentActionResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized." };
  }

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: { article: { select: { slug: true } } },
  });

  if (!comment) {
    return { error: "Comment not found." };
  }

  // Only the comment author or an admin can delete
  const isAdmin = ["ADMIN", "EDITOR"].includes(user.role.key);
  if (comment.userId !== user.id && !isAdmin) {
    return { error: "You do not have permission to delete this comment." };
  }

  await prisma.$transaction([
    prisma.comment.delete({
      where: { id: commentId },
    }),
    prisma.article.update({
      where: { id: comment.articleId },
      data: { commentCount: { decrement: 1 } },
    }),
  ]);

  revalidatePath(`/articles/${comment.article.slug}`);
  revalidatePath(`/blog/${comment.article.slug}`);

  return { success: true };
}
