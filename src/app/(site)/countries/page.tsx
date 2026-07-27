import type { Metadata } from "next";

import { CountryRegionSection } from "@/components/country/country-region-section";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";
import { getCountries } from "@/lib/queries/countries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Countries",
  description:
    "Browse country profiles from around the world, with population, capital, economy, travel, and history at a glance.",
  alternates: { canonical: "/countries" },
};

const REGION_ORDER = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

export default async function CountriesPage() {
  const countries = await getCountries();

  const regions = new Map<string, typeof countries>();
  for (const country of countries) {
    const region = country.region ?? "Other";
    const bucket = regions.get(region) ?? [];
    bucket.push(country);
    regions.set(region, bucket);
  }

  const orderedRegions = [
    ...REGION_ORDER.filter((region) => regions.has(region)),
    ...[...regions.keys()].filter((region) => !REGION_ORDER.includes(region)),
  ];

  return (
    <Section spacing="sm">
      <Container>
        <div className="mb-10 flex flex-col gap-2">
          <H1>Countries</H1>
          <Lead>
            Explore country profiles with population, capital, currency,
            economy, travel tips, and history.
          </Lead>
        </div>

        <div className="flex flex-col gap-12">
          {orderedRegions.map((region) => (
            <CountryRegionSection
              key={region}
              region={region}
              countries={regions.get(region)!}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
