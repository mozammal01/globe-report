import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import { countries } from "./seed-data/countries";

const COMBINING_DIACRITICS = new RegExp(
  "[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]",
  "g",
);

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(COMBINING_DIACRITICS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toFlagEmoji(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seedCountries() {
  for (const country of countries) {
    const slug = toSlug(country.name);
    const flagEmoji = toFlagEmoji(country.iso2);

    await prisma.country.upsert({
      where: { iso2: country.iso2 },
      update: {
        name: country.name,
        slug,
        iso3: country.iso3,
        region: country.region,
        flagEmoji,
      },
      create: {
        name: country.name,
        slug,
        iso2: country.iso2,
        iso3: country.iso3,
        region: country.region,
        flagEmoji,
      },
    });
  }

  console.log(`Seeded ${countries.length} countries.`);
}

async function main() {
  await seedCountries();
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
