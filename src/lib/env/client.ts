import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url({
    error: "NEXT_PUBLIC_SITE_URL must be a valid URL",
  }),
});

function getSiteUrl() {
  let url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url && process.env.NEXT_PUBLIC_VERCEL_URL) {
    url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  if (!url && process.env.VERCEL_URL) {
    url = `https://${process.env.VERCEL_URL}`;
  }
  if (!url) {
    url = "http://localhost:3000";
  }
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  return url;
}

function parseClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: getSiteUrl(),
  });

  if (!parsed.success) {
    console.error(
      "❌ Invalid client environment variables:",
      z.treeifyError(parsed.error),
    );
    throw new Error("Invalid client environment variables");
  }

  return parsed.data;
}

export const clientEnv = parseClientEnv();
