import type { Metadata } from "next";
import Link from "next/link";
import { Film } from "lucide-react";

import { AdSlot } from "@/components/ads/ad-slot";
import {
  BioLinksFeed,
  type BioArticleItem,
} from "@/components/entertainment/bio-links-feed";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { prisma } from "@/lib/prisma";

function YoutubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export const revalidate = 60;

export const metadata: Metadata = {
  title: `Movie Stories & Ending Explanations | ${siteConfig.name}`,
  description:
    "Explore the latest movie reviews, plot breakdowns, hidden details, and ending explanations featured on our social media channels.",
  alternates: { canonical: "/links" },
  openGraph: {
    title: `Movie Stories & Ending Explanations | ${siteConfig.name}`,
    description:
      "All the movie clips, climax breakdowns, and ending explanations from our Instagram, Facebook, and YouTube channels.",
    url: `${siteConfig.url}/links`,
  },
};

export default async function LinksPage() {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { lte: new Date() },
    },
    orderBy: { publishedAt: "desc" },
    take: 24,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      publishedAt: true,
      readingTimeMinutes: true,
      category: { select: { name: true, slug: true } },
      coverImage: { select: { url: true, altText: true } },
    },
  });

  return (
    <Section spacing="sm" className="min-h-screen">
      <Container size="narrow" className="max-w-xl">
        <div className="flex flex-col gap-6">
          {/* Channel Header Profile */}
          <div className="flex flex-col items-center text-center">
            <div className="border-border/80 bg-primary/10 text-primary flex size-16 items-center justify-center rounded-2xl border shadow-sm">
              <Film className="size-8" aria-hidden="true" />
            </div>

            <h1 className="text-foreground mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
              {siteConfig.name} Cinema
            </h1>
            <p className="text-muted-foreground mt-1 max-w-sm text-xs sm:text-sm">
              Ending explanations, hidden details, and complete movie analysis
              featured in our viral clips.
            </p>

            {/* Social Media Follow Channels */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card/80 border-border/80 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:border-red-500/50"
                aria-label="Follow our YouTube Channel"
              >
                <YoutubeIcon className="size-3.5 text-red-500" />
                <span>YouTube</span>
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card/80 border-border/80 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:border-pink-500/50"
                aria-label="Follow our Instagram Page"
              >
                <InstagramIcon className="size-3.5 text-pink-500" />
                <span>Instagram</span>
              </a>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-card/80 border-border/80 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors hover:border-blue-500/50"
                aria-label="Follow our Facebook Page"
              >
                <FacebookIcon className="size-3.5 text-blue-500" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* Reserved Ad Space (Monetize social click-throughs) */}
          <AdSlot variant="in-feed" className="my-1" />

          {/* Search and Article Feed */}
          <BioLinksFeed articles={articles as BioArticleItem[]} />

          {/* Footer Back Link */}
          <div className="border-border/60 text-muted-foreground flex flex-col items-center gap-2 border-t pt-6 text-center text-xs">
            <Link
              href="/"
              className="text-foreground hover:text-primary font-medium underline-offset-4 transition-colors hover:underline"
            >
              Visit Full {siteConfig.name} Website &rarr;
            </Link>
            <p>
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
