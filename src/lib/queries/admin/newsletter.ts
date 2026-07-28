import "server-only";

import { prisma } from "@/lib/prisma";

const SUBSCRIBERS_PAGE_SIZE = 20;

export async function getSubscribersAdmin({
  search,
  status,
  page = 1,
  pageSize = SUBSCRIBERS_PAGE_SIZE,
}: {
  search?: string;
  status?: "PENDING" | "SUBSCRIBED" | "UNSUBSCRIBED";
  page?: number;
  pageSize?: number;
} = {}) {
  const where = {
    ...(search
      ? { email: { contains: search, mode: "insensitive" as const } }
      : {}),
    ...(status ? { status } : {}),
  };

  const [subscribers, total] = await Promise.all([
    prisma.newsletter.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.newsletter.count({ where }),
  ]);

  return { subscribers, total, page, pageSize };
}

export type AdminSubscribersResult = Awaited<
  ReturnType<typeof getSubscribersAdmin>
>;
export type AdminSubscriber = AdminSubscribersResult["subscribers"][number];
