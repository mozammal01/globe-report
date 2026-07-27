import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { SignOutButton } from "@/components/auth/sign-out-button";
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
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{admin.name}</span>
            <span className="text-muted-foreground text-xs">
              {ROLE_DEFINITIONS[admin.role.key as RoleKey]?.name ??
                admin.role.key}
            </span>
          </div>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
