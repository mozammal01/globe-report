import "server-only";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";

import { clientEnv } from "@/lib/env/client";
import { serverEnv } from "@/lib/env/server";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: clientEnv.NEXT_PUBLIC_SITE_URL,
  trustedOrigins: [clientEnv.NEXT_PUBLIC_SITE_URL],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  user: {
    fields: {
      image: "avatarUrl",
    },
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  databaseHooks: {
    session: {
      create: {
        before: async (session) => {
          const user = await prisma.user.findUnique({
            where: { id: session.userId },
            select: { status: true },
          });

          if (!user || user.status !== "ACTIVE") {
            return false;
          }
        },
        after: async (session) => {
          await prisma.user.update({
            where: { id: session.userId },
            data: { lastLoginAt: new Date() },
          });
        },
      },
    },
  },
  plugins: [nextCookies()],
});
