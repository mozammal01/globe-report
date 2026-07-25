import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url({
    error: "NEXT_PUBLIC_SITE_URL must be a valid URL",
  }),
});

function parseClientEnv() {
  const parsed = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
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
