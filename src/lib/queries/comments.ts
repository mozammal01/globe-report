import "server-only";

import { prisma } from "@/lib/prisma";

export type CommentItemData = {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  replies: {
    id: string;
    content: string;
    createdAt: Date;
    parentId: string | null;
    user: {
      id: string;
      name: string;
      avatarUrl: string | null;
    };
  }[];
};

export async function getArticleComments(
  articleId: string,
): Promise<CommentItemData[]> {
  const comments = await prisma.comment.findMany({
    where: {
      articleId,
      status: "APPROVED",
      parentId: null, // Top-level comments
    },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      replies: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  return comments;
}
