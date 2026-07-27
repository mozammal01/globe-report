import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Container } from "@/components/ui/container";
import { getCurrentAdmin } from "@/lib/auth/session";
import { ROLE_DEFINITIONS, type RoleKey } from "@/lib/rbac";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-full flex-col">
      <header className="border-border border-b">
        <Container className="flex h-14 items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{admin.name}</span>
            <span className="text-muted-foreground text-xs">
              {ROLE_DEFINITIONS[admin.role.key as RoleKey]?.name ??
                admin.role.key}
            </span>
          </div>
          <SignOutButton />
        </Container>
      </header>
      <Container as="main" className="flex-1 py-10">
        {children}
      </Container>
    </div>
  );
}
