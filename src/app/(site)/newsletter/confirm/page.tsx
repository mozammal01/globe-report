import { randomUUID } from "crypto";

import { CheckCircle2, XCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { H1, P } from "@/components/ui/typography";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Confirm Subscription",
  robots: { index: false },
};

export default async function NewsletterConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  const subscriber = token
    ? await prisma.newsletter.findUnique({ where: { token } })
    : null;

  let unsubscribeToken: string | null = null;

  if (subscriber) {
    unsubscribeToken = randomUUID();
    await prisma.newsletter.update({
      where: { id: subscriber.id },
      data: {
        status: "SUBSCRIBED",
        subscribedAt: new Date(),
        unsubscribedAt: null,
        token: unsubscribeToken,
      },
    });
  }

  return (
    <Section spacing="sm">
      <Container size="narrow">
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          {subscriber ? (
            <>
              <CheckCircle2 className="text-primary size-10" aria-hidden />
              <H1>You&apos;re subscribed!</H1>
              <P className="text-muted-foreground">
                Thanks for confirming. You&apos;ll now receive Globe
                Report&apos;s top stories in your inbox.
              </P>
              {unsubscribeToken && (
                <Link
                  href={`${siteConfig.url}/newsletter/unsubscribe?token=${unsubscribeToken}`}
                  className="text-muted-foreground text-xs hover:underline"
                >
                  Unsubscribe anytime
                </Link>
              )}
            </>
          ) : (
            <>
              <XCircle className="text-destructive size-10" aria-hidden />
              <H1>Invalid or expired link</H1>
              <P className="text-muted-foreground">
                This confirmation link is no longer valid. You can subscribe
                again from the homepage.
              </P>
            </>
          )}
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
