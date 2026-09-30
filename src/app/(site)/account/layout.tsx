import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AccountNav } from "@/components/account/account-nav";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { getCurrentUser } from "@/lib/auth/session";
import { ADMIN_ACCESS_ROLES } from "@/lib/rbac";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/account");
  }

  const isAdmin = (ADMIN_ACCESS_ROLES as string[]).includes(user.role.key);

  return (
    <Section spacing="sm">
      <Container className="flex flex-col gap-8 sm:flex-row">
        <AccountNav isAdmin={isAdmin} />
        <div className="min-w-0 flex-1">{children}</div>
      </Container>
    </Section>
  );
}
