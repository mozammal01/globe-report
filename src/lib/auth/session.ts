import "server-only";
import { headers } from "next/headers";
import { cache } from "react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ADMIN_ACCESS_ROLES } from "@/lib/rbac";

export const getCurrentAdmin = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!user || user.status !== "ACTIVE") {
    return null;
  }

  if (!(ADMIN_ACCESS_ROLES as string[]).includes(user.role.key)) {
    return null;
  }

  return user;
});

export const getCurrentUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { role: true },
  });

  if (!user || user.status !== "ACTIVE") {
    return null;
  }

  return user;
});
