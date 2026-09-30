import "server-only";

import { prisma } from "@/lib/prisma";
import { articleCardSelect } from "@/lib/queries/articles";

function publishedWhere() {
  return { status: "PUBLISHED" as const, publishedAt: { lte: new Date() } };
}

export async function getAuthorBySlug(slugOrId: string) {
  const author = await prisma.user.findFirst({
    where: {
      OR: [{ slug: slugOrId }, { id: slugOrId }],
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      avatarUrl: true,
      bio: true,
      createdAt: true,
      role: { select: { name: true, key: true } },
      _count: {
        select: {
          articles: {
            where: publishedWhere(),
          },
        },
      },
    },
  });

  if (!author) return null;

  const articles = await prisma.article.findMany({
    where: {
      authorId: author.id,
      ...publishedWhere(),
    },
    orderBy: { publishedAt: "desc" },
    select: articleCardSelect,
  });

  return {
    ...author,
    articles,
  };
}

export type AuthorDetail = NonNullable<
  Awaited<ReturnType<typeof getAuthorBySlug>>
>;
