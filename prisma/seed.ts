import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";

import { PrismaClient } from "../src/generated/prisma/client";
import { ROLE, ROLE_DEFINITIONS } from "../src/lib/rbac";
import { articles } from "./seed-data/articles";
import { categories } from "./seed-data/categories";
import { countryDetails } from "./seed-data/country-details";
import { countries } from "./seed-data/countries";
import { tags } from "./seed-data/tags";

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

const countryDetailsByIso2 = new Map(
  countryDetails.map((details) => [details.iso2, details]),
);

async function seedCountries() {
  for (const country of countries) {
    const slug = toSlug(country.name);
    const flagEmoji = toFlagEmoji(country.iso2);
    const details = countryDetailsByIso2.get(country.iso2) ?? {};

    await prisma.country.upsert({
      where: { iso2: country.iso2 },
      update: {
        name: country.name,
        slug,
        iso3: country.iso3,
        region: country.region,
        flagEmoji,
        ...details,
      },
      create: {
        name: country.name,
        slug,
        iso2: country.iso2,
        iso3: country.iso3,
        region: country.region,
        flagEmoji,
        ...details,
      },
    });
  }

  console.log(
    `Seeded ${countries.length} countries (${countryDetails.length} with rich content).`,
  );
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

async function seedCategories() {
  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category,
    });
  }

  console.log(`Seeded ${categories.length} categories.`);
}

async function seedTags() {
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: tag,
    });
  }

  console.log(`Seeded ${tags.length} tags.`);
}

function estimateReadingMinutes(paragraphs: string[]): number {
  const wordCount = paragraphs.join(" ").split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / 200));
}

async function seedArticles() {
  const admin = await prisma.user.findFirst({
    where: { role: { key: ROLE.ADMIN } },
  });

  if (!admin) {
    console.log("Skipped article seeding (no admin user found).");
    return;
  }

  for (const article of articles) {
    const [category, country] = await Promise.all([
      prisma.category.findUniqueOrThrow({
        where: { slug: article.categorySlug },
      }),
      prisma.country.findUniqueOrThrow({
        where: { iso2: article.countryIso2 },
      }),
    ]);

    const publishedAt = new Date(
      Date.now() - article.daysAgo * 24 * 60 * 60 * 1000,
    );
    const coverImageUrl = `https://picsum.photos/seed/${article.coverSeed}/1200/800`;
    const content = article.content.join("\n\n");
    const readingTimeMinutes = estimateReadingMinutes(article.content);

    const existing = await prisma.article.findUnique({
      where: { slug: article.slug },
    });

    if (existing) {
      if (existing.coverMediaId) {
        await prisma.media.update({
          where: { id: existing.coverMediaId },
          data: { url: coverImageUrl, altText: article.title },
        });
      }

      await prisma.article.update({
        where: { slug: article.slug },
        data: {
          title: article.title,
          excerpt: article.excerpt,
          content,
          categoryId: category.id,
          countryId: country.id,
          status: "PUBLISHED",
          publishedAt,
          viewCount: article.viewCount,
          bookmarkCount: article.bookmarkCount,
          commentCount: article.commentCount,
          isFeatured: article.isFeatured,
          readingTimeMinutes,
          tags: { set: article.tagSlugs.map((slug) => ({ slug })) },
        },
      });
      continue;
    }

    const coverMedia = await prisma.media.create({
      data: {
        url: coverImageUrl,
        type: "IMAGE",
        altText: article.title,
        uploadedById: admin.id,
      },
    });

    await prisma.article.create({
      data: {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content,
        authorId: admin.id,
        categoryId: category.id,
        countryId: country.id,
        coverMediaId: coverMedia.id,
        status: "PUBLISHED",
        publishedAt,
        viewCount: article.viewCount,
        bookmarkCount: article.bookmarkCount,
        commentCount: article.commentCount,
        isFeatured: article.isFeatured,
        readingTimeMinutes,
        tags: { connect: article.tagSlugs.map((slug) => ({ slug })) },
      },
    });
  }

  console.log(`Seeded ${articles.length} articles.`);
}

async function main() {
  await seedCountries();
  await seedRoles();
  await seedAdminUser();
  await seedCategories();
  await seedTags();
  await seedArticles();
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
