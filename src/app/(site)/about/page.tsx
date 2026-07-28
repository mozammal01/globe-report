import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${siteConfig.name}'s mission to deliver clear, reliable global news.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <LegalPage
      title={`About ${siteConfig.name}`}
      description={siteConfig.tagline}
    >
      <p>
        {siteConfig.name} is a global news and knowledge portal delivering
        clear, reliable reporting on the stories that shape the world. We cover
        politics, economics, culture, and country-level developments with an
        emphasis on accuracy and context over noise.
      </p>
      <h2>Our mission</h2>
      <p>
        We believe understanding the world shouldn&apos;t require wading through
        jargon or sensationalism. Every article we publish aims to give readers
        the context they need to understand not just what happened, but why it
        matters.
      </p>
      <h2>What we cover</h2>
      <ul>
        <li>Breaking and in-depth news from every region of the world</li>
        <li>Country profiles with economic, cultural, and travel context</li>
        <li>Analysis that connects local events to global trends</li>
      </ul>
      <h2>Get in touch</h2>
      <p>
        Have a tip, correction, or question? Visit our{" "}
        <a href="/contact">Contact page</a> — we&apos;d love to hear from you.
      </p>
    </LegalPage>
  );
}
