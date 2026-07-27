import { Globe2 } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Grid } from "@/components/ui/grid";
import { Section } from "@/components/ui/section";
import { H2 } from "@/components/ui/typography";
import type { FeaturedCountry } from "@/lib/queries/articles";

export function FeaturedCountriesSection({
  countries,
}: {
  countries: FeaturedCountry[];
}) {
  return (
    <Section spacing="sm" className="border-border bg-muted/30 border-t">
      <Container>
        <div className="mb-6 flex items-center gap-2.5">
          <Globe2 className="text-primary size-5" aria-hidden />
          <H2 className="text-2xl">Featured Countries</H2>
        </div>

        {countries.length > 0 ? (
          <Grid cols={4} gap="sm">
            {countries.map((country) => (
              <Link
                key={country.id}
                href={`/countries/${country.slug}`}
                className="border-border bg-card hover:bg-muted/60 flex items-center gap-3 rounded-lg border px-4 py-3 transition-colors"
              >
                <span className="text-2xl" aria-hidden>
                  {country.flagEmoji}
                </span>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{country.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {country.articleCount}{" "}
                    {country.articleCount === 1 ? "story" : "stories"}
                  </span>
                </div>
              </Link>
            ))}
          </Grid>
        ) : (
          <EmptyState title="No countries with published stories yet." />
        )}
      </Container>
    </Section>
  );
}
