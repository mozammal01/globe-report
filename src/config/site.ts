import { clientEnv } from "@/lib/env/client";

export type NavItem = {
  title: string;
  href: string;
};

export const siteConfig = {
  name: "Globe Report",
  shortName: "Globe Blog",
  tagline: "Stories, Ideas & Global Perspectives",
  description:
    "Globe Report is a modern blog and digital publication delivering in-depth articles, technology insights, and thought-provoking stories.",
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
