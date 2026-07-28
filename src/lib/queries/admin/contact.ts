import "server-only";

import { prisma } from "@/lib/prisma";

export async function getContactMessagesAdmin() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export type AdminContactMessage = Awaited<
  ReturnType<typeof getContactMessagesAdmin>
>[number];
