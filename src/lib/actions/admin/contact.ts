"use server";

import { revalidatePath } from "next/cache";

import { getCurrentAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function markMessageRead(
  id: string,
): Promise<{ error?: string } | void> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized." };
  }

  await prisma.contactMessage.update({
    where: { id },
    data: { readAt: new Date() },
  });

  revalidatePath("/admin/contact");
}

export async function deleteMessage(
  id: string,
): Promise<{ error?: string } | void> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized." };
  }

  await prisma.contactMessage.delete({ where: { id } });

  revalidatePath("/admin/contact");
}
