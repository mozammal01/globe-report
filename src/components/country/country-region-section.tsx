import { CountryCard } from "@/components/country/country-card";
import { Grid } from "@/components/ui/grid";
import { H2 } from "@/components/ui/typography";
import type { CountryCard as CountryCardData } from "@/lib/queries/countries";

export function CountryRegionSection({
  region,
  countries,
}: {
  region: string;
  countries: CountryCardData[];
}) {
  return (
    <div className="flex flex-col gap-6">
      <H2 className="text-2xl">{region}</H2>
      <Grid cols={4} gap="sm">
        {countries.map((country) => (
          <CountryCard key={country.id} country={country} />
        ))}
      </Grid>
    </div>
  );
}
