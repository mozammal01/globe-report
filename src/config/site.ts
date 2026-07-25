import { clientEnv } from "@/lib/env/client";

export type NavItem = {
  title: string;
  href: string;
};

export const siteConfig = {
  name: "Globe Report",
  shortName: "Globe Report",
  tagline: "Global News & Knowledge, Clearly Reported",
  description:
    "Globe Report is a global news and knowledge portal delivering clear, reliable reporting on the stories that shape the world.",
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  locale: "en_US",
  nav: [{ title: "Home", href: "/" }] satisfies NavItem[],
} as const;
