import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Section spacing="sm">
      <Container size="narrow">
        <div className="mb-8 flex flex-col gap-2">
          <H1>Contact Us</H1>
          <Lead>
            Have a tip, question, or correction? We&apos;d love to hear from
            you.
          </Lead>
        </div>

        <ContactForm />
      </Container>
    </Section>
  );
}
