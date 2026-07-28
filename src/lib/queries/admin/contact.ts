import "server-only";

import { prisma } from "@/lib/prisma";

const ADMIN_CONTACT_PAGE_SIZE = 20;

export async function getContactMessagesAdmin({
  page = 1,
  pageSize = ADMIN_CONTACT_PAGE_SIZE,
}: {
  page?: number;
  pageSize?: number;
} = {}) {
  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactMessage.count(),
  ]);

  return { messages, total, page, pageSize };
}

export type AdminContactMessagesResult = Awaited<
  ReturnType<typeof getContactMessagesAdmin>
>;
export type AdminContactMessage =
  AdminContactMessagesResult["messages"][number];
