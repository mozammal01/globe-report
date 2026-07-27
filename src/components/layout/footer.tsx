import { Globe2 } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { siteConfig } from "@/config/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border border-t">
      <Container className="flex flex-col gap-6 py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="font-heading flex items-center gap-2 text-base font-semibold tracking-tight"
            >
              <Globe2 className="text-primary size-5" aria-hidden="true" />
              <span>{siteConfig.name}</span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm">
              {siteConfig.tagline}
            </p>
          </div>

          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <p className="text-muted-foreground text-xs">
          &copy; {year} {siteConfig.name}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
