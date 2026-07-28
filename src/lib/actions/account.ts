"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { ActionState } from "@/lib/actions/admin/types";
import { saveUploadedFile } from "@/lib/actions/admin/media";
import { getCurrentUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().optional(),
});

export async function updateProfile(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) {
    return { status: "error", message: "Unauthorized." };
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    bio: formData.get("bio") || undefined,
    avatarUrl: formData.get("avatarUrl") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: parsed.data.name,
      bio: parsed.data.bio,
      avatarUrl: parsed.data.avatarUrl || null,
    },
  });

  revalidatePath("/account/profile");
  revalidatePath("/account");

  return { status: "success", message: "Profile updated." };
}

export async function uploadAvatar(
  formData: FormData,
): Promise<{ id: string; url: string } | { error: string }> {
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Unauthorized." };
  }

  return saveUploadedFile(formData, user.id);
}
