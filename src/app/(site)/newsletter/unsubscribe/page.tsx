import { MailX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { H1, P } from "@/components/ui/typography";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false },
};

export default async function NewsletterUnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  const subscriber = token
    ? await prisma.newsletter.findUnique({ where: { token } })
    : null;

  if (subscriber) {
    await prisma.newsletter.update({
      where: { id: subscriber.id },
      data: { status: "UNSUBSCRIBED", unsubscribedAt: new Date() },
    });
  }

  return (
    <Section spacing="sm">
      <Container size="narrow">
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <MailX className="text-muted-foreground size-10" aria-hidden />
          <H1>{subscriber ? "You've been unsubscribed" : "Invalid link"}</H1>
          <P className="text-muted-foreground">
            {subscriber
              ? "You won't receive any more emails from Globe Report. You can resubscribe anytime."
              : "This unsubscribe link is no longer valid."}
          </P>
          <Link
            href="/"
            className="text-primary text-sm font-medium hover:underline"
          >
            &larr; Back to home
          </Link>
        </div>
      </Container>
    </Section>
  );
}
