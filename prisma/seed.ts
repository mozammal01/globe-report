import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";

import { PrismaClient } from "../src/generated/prisma/client";
import { ROLE, ROLE_DEFINITIONS } from "../src/lib/rbac";
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

async function seedRoles() {
  for (const key of Object.values(ROLE)) {
    const definition = ROLE_DEFINITIONS[key];

    await prisma.role.upsert({
      where: { key },
      update: { name: definition.name, description: definition.description },
      create: {
        key,
        name: definition.name,
        description: definition.description,
      },
    });
  }

  console.log(`Seeded ${Object.values(ROLE).length} roles.`);
}

async function seedAdminUser() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    console.log(
      "Skipped admin bootstrap (ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD not set).",
    );
    return;
  }

  const adminRole = await prisma.role.findUniqueOrThrow({
    where: { key: ROLE.ADMIN },
  });

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name,
      email,
      emailVerified: true,
      status: "ACTIVE",
      roleId: adminRole.id,
    },
  });

  const existingCredentialAccount = await prisma.account.findFirst({
    where: { userId: user.id, providerId: "credential" },
  });

  if (existingCredentialAccount) {
    console.log(`Admin user already exists: ${email}`);
    return;
  }

  const hashedPassword = await hashPassword(password);

  await prisma.account.create({
    data: {
      userId: user.id,
      providerId: "credential",
      accountId: user.id,
      password: hashedPassword,
    },
  });

  console.log(`Seeded admin user: ${email}`);
}

async function main() {
  await seedCountries();
  await seedRoles();
  await seedAdminUser();
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
