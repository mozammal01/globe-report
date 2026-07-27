import "server-only";

import { prisma } from "@/lib/prisma";

const countryCardSelect = {
  id: true,
  name: true,
  slug: true,
  region: true,
  flagEmoji: true,
  heroImageUrl: true,
  capital: true,
  population: true,
} as const;

export async function getCountries() {
  return prisma.country.findMany({
    orderBy: [{ region: "asc" }, { name: "asc" }],
    select: countryCardSelect,
  });
}

export async function getCountryBySlug(slug: string) {
  return prisma.country.findUnique({
    where: { slug },
    select: {
      ...countryCardSelect,
      iso2: true,
      iso3: true,
      heroImageAlt: true,
      currency: true,
      religion: true,
      economy: true,
      gdpSummary: true,
      travel: true,
      history: true,
      interestingFacts: true,
      seoTitle: true,
      seoDescription: true,
      updatedAt: true,
    },
  });
}

export async function getCountrySlugs() {
  return prisma.country.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { slug: "asc" },
  });
}

export type CountryCard = Awaited<ReturnType<typeof getCountries>>[number];
export type CountryDetail = NonNullable<
  Awaited<ReturnType<typeof getCountryBySlug>>
>;
