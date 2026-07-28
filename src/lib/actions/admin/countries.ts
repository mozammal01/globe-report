"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import type { ActionState } from "@/lib/actions/admin/types";
import { getCurrentAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { toSlug } from "@/lib/slug";

function toFlagEmoji(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

const countrySchema = z.object({
  name: z.string().min(1, "Name is required.").max(100),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .transform((value) => toSlug(value)),
  iso2: z
    .string()
    .min(1, "ISO2 is required.")
    .transform((value) => value.trim().toUpperCase())
    .refine((value) => value.length === 2, "ISO2 must be exactly 2 letters."),
  iso3: z
    .string()
    .min(1, "ISO3 is required.")
    .transform((value) => value.trim().toUpperCase())
    .refine((value) => value.length === 3, "ISO3 must be exactly 3 letters."),
  region: z
    .enum(["Africa", "Americas", "Asia", "Europe", "Oceania"])
    .optional(),
  heroImageUrl: z.string().optional(),
  heroImageAlt: z.string().max(200).optional(),
  population: z.coerce.number().int().positive().optional(),
  capital: z.string().max(100).optional(),
  currency: z.string().max(100).optional(),
  religion: z.string().max(200).optional(),
  economy: z.string().max(2000).optional(),
  gdpSummary: z.string().max(200).optional(),
  travel: z.string().max(2000).optional(),
  history: z.string().max(2000).optional(),
  interestingFacts: z
    .string()
    .optional()
    .transform((value) =>
      (value ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
    ),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(300).optional(),
});

function readCountryFormData(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    iso2: formData.get("iso2"),
    iso3: formData.get("iso3"),
    region: formData.get("region") || undefined,
    heroImageUrl: formData.get("heroImageUrl") || undefined,
    heroImageAlt: formData.get("heroImageAlt") || undefined,
    population: formData.get("population") || undefined,
    capital: formData.get("capital") || undefined,
    currency: formData.get("currency") || undefined,
    religion: formData.get("religion") || undefined,
    economy: formData.get("economy") || undefined,
    gdpSummary: formData.get("gdpSummary") || undefined,
    travel: formData.get("travel") || undefined,
    history: formData.get("history") || undefined,
    interestingFacts: formData.get("interestingFacts") || undefined,
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
  };
}

function revalidateCountryPaths(slug: string) {
  revalidatePath("/admin/countries");
  revalidatePath("/countries");
  revalidatePath(`/countries/${slug}`);
  revalidatePath("/");
}

export async function createCountry(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { status: "error", message: "Unauthorized." };
  }

  const parsed = countrySchema.safeParse(readCountryFormData(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    await prisma.country.create({
      data: {
        ...data,
        flagEmoji: toFlagEmoji(data.iso2),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = (error.meta?.target as string[] | undefined) ?? [];
      const field = target.includes("iso2")
        ? "iso2"
        : target.includes("iso3")
          ? "iso3"
          : "slug";
      return {
        status: "error",
        message: "Please fix the errors below.",
        fieldErrors: { [field]: [`This ${field} is already in use.`] },
      };
    }
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  revalidateCountryPaths(data.slug);
  redirect("/admin/countries");
}

export async function updateCountry(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { status: "error", message: "Unauthorized." };
  }

  const parsed = countrySchema.safeParse(readCountryFormData(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  try {
    await prisma.country.update({
      where: { id },
      data: {
        ...data,
        flagEmoji: toFlagEmoji(data.iso2),
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      const target = (error.meta?.target as string[] | undefined) ?? [];
      const field = target.includes("iso2")
        ? "iso2"
        : target.includes("iso3")
          ? "iso3"
          : "slug";
      return {
        status: "error",
        message: "Please fix the errors below.",
        fieldErrors: { [field]: [`This ${field} is already in use.`] },
      };
    }
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  revalidateCountryPaths(data.slug);
  redirect("/admin/countries");
}

export async function deleteCountry(
  id: string,
): Promise<{ error?: string } | void> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized." };
  }

  const country = await prisma.country.delete({
    where: { id },
    select: { slug: true },
  });

  revalidateCountryPaths(country.slug);
}
