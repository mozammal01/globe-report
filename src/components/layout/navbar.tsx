import { Globe2 } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserNav } from "@/components/layout/user-nav";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

const GlobalSearch = dynamic(() =>
  import("@/components/search/global-search").then((mod) => mod.GlobalSearch),
);

export function Navbar() {
  return (
    <header className="border-border bg-background/80 supports-backdrop-filter:bg-background/60 sticky top-0 z-40 w-full border-b backdrop-blur-sm">
      <Container className="flex h-14 items-center justify-between">
        <Link
          href="/"
          className="font-heading flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <Globe2 className="text-primary size-5" aria-hidden="true" />
          <span>{siteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <GlobalSearch />
          <ThemeToggle />
          <UserNav />
          <MobileNav />
        </div>
      </Container>
    </header>
  );
}
