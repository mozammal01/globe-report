"use server";

import { revalidatePath } from "next/cache";

import { getCurrentAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export async function unsubscribeSubscriber(
  id: string,
): Promise<{ error?: string } | void> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized." };
  }

  await prisma.newsletter.update({
    where: { id },
    data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
  });

  revalidatePath("/admin/newsletter");
}

export async function deleteSubscriber(
  id: string,
): Promise<{ error?: string } | void> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized." };
  }

  await prisma.newsletter.delete({ where: { id } });

  revalidatePath("/admin/newsletter");
}
