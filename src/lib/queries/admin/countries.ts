import "server-only";

import { prisma } from "@/lib/prisma";

const ADMIN_COUNTRIES_PAGE_SIZE = 20;

export async function getCountriesAdmin({
  search,
  page = 1,
  pageSize = ADMIN_COUNTRIES_PAGE_SIZE,
}: {
  search?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { iso2: { contains: search, mode: "insensitive" as const } },
          { iso3: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [countries, total] = await Promise.all([
    prisma.country.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        name: true,
        slug: true,
        iso2: true,
        iso3: true,
        region: true,
        flagEmoji: true,
        _count: { select: { articles: true } },
      },
    }),
    prisma.country.count({ where }),
  ]);

  return { countries, total, page, pageSize };
}

export async function getCountryForAdmin(id: string) {
  return prisma.country.findUnique({ where: { id } });
}

export type AdminCountriesResult = Awaited<
  ReturnType<typeof getCountriesAdmin>
>;
export type AdminCountry = NonNullable<
  Awaited<ReturnType<typeof getCountryForAdmin>>
>;
