import { clientEnv } from "@/lib/env/client";

export type NavItem = {
  title: string;
  href: string;
};

export const siteConfig = {
  name: "CineShortsWorld",
  shortName: "CineShorts",
  tagline: "Viral Movie Shorts, Ending Explanations & Cinema Theories",
  description:
    "CineShortsWorld is your ultimate destination for in-depth movie ending explanations, viral film breakdowns, web series theories, and honest cinema reviews.",
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
  locale: "en_US",
  nav: [
    { title: "Home", href: "/" },
    { title: "Blog", href: "/blog" },
    { title: "Categories", href: "/categories" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ] satisfies NavItem[],
  legalNav: [
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
    { title: "Privacy", href: "/privacy" },
    { title: "Terms", href: "/terms" },
    { title: "Disclaimer", href: "/disclaimer" },
    { title: "Cookies", href: "/cookies" },
  ] satisfies NavItem[],
} as const;
