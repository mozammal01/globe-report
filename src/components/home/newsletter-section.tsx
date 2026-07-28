import { Mail } from "lucide-react";

import { NewsletterForm } from "@/components/shared/newsletter-form";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { H2, Muted } from "@/components/ui/typography";

export function NewsletterSection() {
  return (
    <Section spacing="sm" className="border-border border-t">
      <Container size="narrow">
        <div className="border-border bg-card flex flex-col items-center gap-4 rounded-xl border px-6 py-10 text-center">
          <Mail className="text-primary size-8" aria-hidden />
          <H2 className="text-2xl">Stay Informed</H2>
          <Muted className="max-w-md">
            Get the day&apos;s most important stories delivered straight to your
            inbox.
          </Muted>

          <NewsletterForm />
        </div>
      </Container>
    </Section>
  );
}
