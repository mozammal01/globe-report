"use server";

import DOMPurify from "isomorphic-dompurify";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import type { ActionState } from "@/lib/actions/admin/types";
import { getCurrentAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slug";

const articleSchema = z.object({
  title: z.string().min(1, "Title is required.").max(200),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .transform((value) => toSlug(value)),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1, "Content is required."),
  status: z.enum(["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"]),
  isFeatured: z.boolean(),
  publishedAt: z.string().optional(),
  categoryId: z.string().min(1, "Category is required."),
  countryId: z.string().optional(),
  coverMediaId: z.string().optional(),
  tagIds: z.array(z.string()),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(300).optional(),
});

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "blockquote",
    "a",
  ],
  ALLOWED_ATTR: ["href", "target", "rel"],
};

function readArticleFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content"),
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured") === "on",
    publishedAt: formData.get("publishedAt") || undefined,
    categoryId: formData.get("categoryId"),
    countryId: formData.get("countryId") || undefined,
    coverMediaId: formData.get("coverMediaId") || undefined,
    tagIds: formData.getAll("tagIds"),
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
  };
}

function computeReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, " ");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function resolvePublishedAt(
  publishedAt: string | undefined,
  status: string,
): Date | null {
  if (publishedAt) return new Date(publishedAt);
  if (status === "PUBLISHED") return new Date();
  return null;
}

async function revalidateArticlePaths(slug: string, countrySlug?: string) {
  revalidatePath("/admin/articles");
  revalidatePath("/news");
  revalidatePath("/");
  revalidatePath(`/articles/${slug}`);
  if (countrySlug) revalidatePath(`/countries/${countrySlug}`);
}

export async function createArticle(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { status: "error", message: "Unauthorized." };
  }

  const parsed = articleSchema.safeParse(readArticleFormData(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const sanitizedContent = DOMPurify.sanitize(data.content, SANITIZE_CONFIG);
  const publishedAt = resolvePublishedAt(data.publishedAt, data.status);

  let createdSlug: string;
  let createdCountrySlug: string | undefined;

  try {
    const created = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: sanitizedContent,
        status: data.status,
        isFeatured: data.isFeatured,
        publishedAt,
        readingTimeMinutes: computeReadingTime(sanitizedContent),
        authorId: admin.id,
        categoryId: data.categoryId,
        countryId: data.countryId || null,
        coverMediaId: data.coverMediaId || null,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        tags: { connect: data.tagIds.map((id) => ({ id })) },
      },
      select: { slug: true, country: { select: { slug: true } } },
    });
    createdSlug = created.slug;
    createdCountrySlug = created.country?.slug;
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

  await revalidateArticlePaths(createdSlug, createdCountrySlug);
  redirect("/admin/articles");
}

export async function updateArticle(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { status: "error", message: "Unauthorized." };
  }

  const parsed = articleSchema.safeParse(readArticleFormData(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;
  const sanitizedContent = DOMPurify.sanitize(data.content, SANITIZE_CONFIG);
  const publishedAt = resolvePublishedAt(data.publishedAt, data.status);

  let updatedSlug: string;
  let updatedCountrySlug: string | undefined;

  try {
    const updated = await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: sanitizedContent,
        status: data.status,
        isFeatured: data.isFeatured,
        publishedAt,
        readingTimeMinutes: computeReadingTime(sanitizedContent),
        categoryId: data.categoryId,
        countryId: data.countryId || null,
        coverMediaId: data.coverMediaId || null,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        tags: { set: data.tagIds.map((tagId) => ({ id: tagId })) },
      },
      select: { slug: true, country: { select: { slug: true } } },
    });
    updatedSlug = updated.slug;
    updatedCountrySlug = updated.country?.slug;
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

  await revalidateArticlePaths(updatedSlug, updatedCountrySlug);
  redirect("/admin/articles");
}

export async function deleteArticle(
  id: string,
): Promise<{ error?: string } | void> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized." };
  }

  const article = await prisma.article.delete({
    where: { id },
    select: { slug: true, country: { select: { slug: true } } },
  });

  await revalidateArticlePaths(article.slug, article.country?.slug);
}
