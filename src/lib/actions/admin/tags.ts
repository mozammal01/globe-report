"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import type { ActionState } from "@/lib/actions/admin/types";
import { getCurrentAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slug";

const tagSchema = z.object({
  name: z.string().min(1, "Name is required.").max(50),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .transform((value) => toSlug(value)),
});

function readTagFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
  };
}

function revalidateTagPaths() {
  revalidatePath("/admin/tags");
  revalidatePath("/news");
}

// Tags use inline Dialog-based CRUD (no dedicated route to redirect to) —
// these deliberately return ActionState instead of calling redirect().
export async function createTag(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { status: "error", message: "Unauthorized." };
  }

  const parsed = tagSchema.safeParse(readTagFormData(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.tag.create({ data: parsed.data });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        status: "error",
        message: "A tag with this name already exists.",
        fieldErrors: { name: ["A tag with this name already exists."] },
      };
    }
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  revalidateTagPaths();
  return { status: "success" };
}

export async function updateTag(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { status: "error", message: "Unauthorized." };
  }

  const parsed = tagSchema.safeParse(readTagFormData(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.tag.update({ where: { id }, data: parsed.data });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        status: "error",
        message: "A tag with this name already exists.",
        fieldErrors: { name: ["A tag with this name already exists."] },
      };
    }
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  revalidateTagPaths();
  return { status: "success" };
}

export async function deleteTag(
  id: string,
): Promise<{ error?: string } | void> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized." };
  }

  await prisma.tag.delete({ where: { id } });
  revalidateTagPaths();
}
