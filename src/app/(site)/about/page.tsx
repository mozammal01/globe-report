import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${siteConfig.name}'s mission to deliver in-depth movie ending explanations, viral cinema theories, and reviews.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <LegalPage
      title={`About ${siteConfig.name}`}
      description={siteConfig.tagline}
    >
      <p>
        {siteConfig.name} is a premier entertainment and cinema analysis portal
        delivering deep-dive movie ending explanations, hidden Easter eggs,
        character breakdowns, and streaming guides. We bridge the gap between
        viral short-form clips and comprehensive, thought-provoking film
        theories.
      </p>
      <h2>Our Mission</h2>
      <p>
        We believe that great cinema and storytelling deserve meaningful
        analysis. Every article we publish aims to give film lovers and series
        bingers the context they need to unravel complex twists, uncover hidden
        foreshadowing, and understand the thematic core of the world&apos;s
        biggest blockbusters.
      </p>
      <h2>What We Cover</h2>
      <ul>
        <li>In-depth Ending Explanations & Climax Theories</li>
        <li>Post-Credit Scene Breakdowns & Cinematic Universe Connections</li>
        <li>
          Spoiler-Free Movie & Web Series Reviews with OTT Streaming Guides
        </li>
        <li>Hidden Symbolism, Easter Eggs & Comic Lore Analysis</li>
      </ul>
      <h2>Get in touch</h2>
      <p>
        Have a tip, correction, or question? Visit our{" "}
        <a href="/contact">Contact page</a> — we&apos;d love to hear from you.
      </p>
    </LegalPage>
  );
}
