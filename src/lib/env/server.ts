import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.url({
    error: "DATABASE_URL must be a valid connection string",
  }),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters"),
});

function parseServerEnv() {
  const parsed = serverEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  });

  if (!parsed.success) {
    console.error(
      "❌ Invalid server environment variables:",
      z.treeifyError(parsed.error),
    );
    throw new Error("Invalid server environment variables");
  }

  return parsed.data;
}

export const serverEnv = parseServerEnv();
