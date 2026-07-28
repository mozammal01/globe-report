import "server-only";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { betterAuth } from "better-auth";

import { clientEnv } from "@/lib/env/client";
import { serverEnv } from "@/lib/env/server";
import { prisma } from "@/lib/prisma";
import { ROLE } from "@/lib/rbac";

export const auth = betterAuth({
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: clientEnv.NEXT_PUBLIC_SITE_URL,
  trustedOrigins: [clientEnv.NEXT_PUBLIC_SITE_URL],
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  user: {
    fields: {
      image: "avatarUrl",
    },
    additionalFields: {
      // Registered so the create hook below can set it — `input: false`
      // stops it from ever being accepted from a client-supplied payload.
      roleId: { type: "string", required: false, input: false },
    },
  },
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    minPasswordLength: 8,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  databaseHooks: {
    user: {
      create: {
        // Self-signup always lands as READER — admin/editor/author accounts
        // are provisioned only via seed/DB, never via the public signup form.
        before: async (user) => {
          const readerRole = await prisma.role.findUnique({
            where: { key: ROLE.READER },
          });

          if (!readerRole) return;

          return { data: { ...user, roleId: readerRole.id } };
        },
      },
    },
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
