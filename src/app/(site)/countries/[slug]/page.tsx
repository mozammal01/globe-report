import {
  Landmark,
  Newspaper,
  PlaneTakeoff,
  Scroll,
  Sparkles,
  Users,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ads/ad-slot";
import { ArticleSection } from "@/components/home/article-section";
import { CountryDetailSection } from "@/components/country/country-detail-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Section } from "@/components/ui/section";
import { H1, Muted, P } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";
import { formatCompactNumber } from "@/lib/format";
import { getArticlesByCountry } from "@/lib/queries/articles";
import { getCountryBySlug } from "@/lib/queries/countries";
import { breadcrumbJsonLd, countryJsonLd } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);

  if (!country) {
    return { title: "Country Not Found" };
  }

  const title = country.seoTitle ?? country.name;
  const description =
    country.seoDescription ??
    `${country.name} country profile: capital, population, currency, and travel information.`;

  return {
    title,
    description,
    alternates: { canonical: `/countries/${country.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      images: country.heroImageUrl ? [{ url: country.heroImageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: country.heroImageUrl ? [country.heroImageUrl] : [],
    },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = await getCountryBySlug(slug);

  if (!country) {
    notFound();
  }

  const articles = await getArticlesByCountry(country.id, 6);

  const hasRichContent = Boolean(
    country.economy ||
    country.religion ||
    country.travel ||
    country.history ||
    country.interestingFacts.length,
  );

  const countryUrl = `${siteConfig.url}/countries/${country.slug}`;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Countries", url: `${siteConfig.url}/countries` },
    { name: country.name, url: countryUrl },
  ]);

  return (
    <>
      <JsonLd data={countryJsonLd(country, countryUrl)} />
      <JsonLd data={breadcrumb} />

      {country.heroImageUrl && (
        <div className="bg-muted relative aspect-21/9 w-full overflow-hidden">
          <Image
            src={country.heroImageUrl}
            alt={country.heroImageAlt ?? country.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <Section spacing="sm">
        <Container size="narrow">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {country.region && (
                <Badge variant="secondary">{country.region}</Badge>
              )}
              <Muted>
                {country.iso2} &middot; {country.iso3}
              </Muted>
            </div>

            <H1>
              <span aria-hidden>{country.flagEmoji}</span> {country.name}
            </H1>

            <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              {country.capital && <span>{country.capital}</span>}
              {country.capital && country.population && (
                <span aria-hidden>&middot;</span>
              )}
              {country.population && (
                <span>{formatCompactNumber(country.population)} people</span>
              )}
              {(country.capital || country.population) && country.currency && (
                <span aria-hidden>&middot;</span>
              )}
              {country.currency && <span>{country.currency}</span>}
            </div>

            {hasRichContent ? (
              <>
                {(country.economy || country.gdpSummary) && (
                  <CountryDetailSection title="Economy" icon={Landmark}>
                    {country.gdpSummary && (
                      <p className="text-foreground text-sm font-medium">
                        {country.gdpSummary}
                      </p>
                    )}
                    {country.economy && <P>{country.economy}</P>}
                  </CountryDetailSection>
                )}

                {country.religion && (
                  <CountryDetailSection title="Religion" icon={Users}>
                    <P>{country.religion}</P>
                  </CountryDetailSection>
                )}

                {country.travel && (
                  <CountryDetailSection title="Travel" icon={PlaneTakeoff}>
                    <P>{country.travel}</P>
                  </CountryDetailSection>
                )}

                {country.history && (
                  <CountryDetailSection title="History" icon={Scroll}>
                    <P>{country.history}</P>
                  </CountryDetailSection>
                )}

                {country.interestingFacts.length > 0 && (
                  <CountryDetailSection
                    title="Interesting Facts"
                    icon={Sparkles}
                  >
                    <ul className="flex list-disc flex-col gap-2 pl-5">
                      {country.interestingFacts.map((fact, index) => (
                        <li
                          key={index}
                          className="text-foreground marker:text-primary text-base leading-7"
                        >
                          {fact}
                        </li>
                      ))}
                    </ul>
                  </CountryDetailSection>
                )}
              </>
            ) : (
              <div className="border-border border-t pt-6">
                <EmptyState title="Content coming soon for this country." />
              </div>
            )}

            <Link
              href="/countries"
              className="text-primary mt-2 text-sm font-medium hover:underline"
            >
              &larr; Back to countries
            </Link>
          </div>
        </Container>
      </Section>

      {hasRichContent && (
        <Container size="narrow" className="pb-8">
          <AdSlot variant="in-article" />
        </Container>
      )}

      <ArticleSection
        title={`Latest News from ${country.name}`}
        icon={Newspaper}
        articles={articles}
        cols={3}
        emptyMessage={`No stories about ${country.name} yet.`}
      />
    </>
  );
}
