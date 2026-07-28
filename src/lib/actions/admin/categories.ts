"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import type { ActionState } from "@/lib/actions/admin/types";
import { getCurrentAdmin } from "@/lib/auth/session";
import { wouldCreateCycle } from "@/lib/category-cycle";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slug";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required.").max(100),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .transform((value) => toSlug(value)),
  description: z.string().max(300).optional(),
  parentId: z.string().optional(),
});

function readCategoryFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    parentId: formData.get("parentId") || undefined,
  };
}

function getCategoryParent(id: string) {
  return prisma.category.findUnique({
    where: { id },
    select: { parentId: true },
  });
}

function revalidateCategoryPaths() {
  revalidatePath("/admin/categories");
  revalidatePath("/news");
  revalidatePath("/");
}

export async function createCategory(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { status: "error", message: "Unauthorized." };
  }

  const parsed = categorySchema.safeParse(readCategoryFormData(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || null,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        status: "error",
        message: "Please fix the errors below.",
        fieldErrors: { slug: ["This slug is already in use."] },
      };
    }
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  revalidateCategoryPaths();
  redirect("/admin/categories");
}

export async function updateCategory(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { status: "error", message: "Unauthorized." };
  }

  const parsed = categorySchema.safeParse(readCategoryFormData(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  if (
    data.parentId &&
    (await wouldCreateCycle(id, data.parentId, getCategoryParent))
  ) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: {
        parentId: ["This parent would create a category hierarchy cycle."],
      },
    };
  }

  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        parentId: data.parentId || null,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        status: "error",
        message: "Please fix the errors below.",
        fieldErrors: { slug: ["This slug is already in use."] },
      };
    }
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  revalidateCategoryPaths();
  redirect("/admin/categories");
}

export async function deleteCategory(
  id: string,
): Promise<{ error?: string } | void> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized." };
  }

  const articleCount = await prisma.article.count({
    where: { categoryId: id },
  });
  if (articleCount > 0) {
    return {
      error: `Cannot delete: ${articleCount} article(s) use this category.`,
    };
  }

  await prisma.category.delete({ where: { id } });
  revalidateCategoryPaths();
}
