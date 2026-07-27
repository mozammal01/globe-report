import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/format";
import type { CountryCard as CountryCardData } from "@/lib/queries/countries";

export function CountryCard({ country }: { country: CountryCardData }) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <Link
        href={`/countries/${country.slug}`}
        className="bg-muted relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden"
      >
        {country.heroImageUrl ? (
          <Image
            src={country.heroImageUrl}
            alt={country.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover/card:scale-105"
          />
        ) : (
          <span className="text-4xl" aria-hidden>
            {country.flagEmoji}
          </span>
        )}
      </Link>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {country.region && (
            <Badge variant="secondary">{country.region}</Badge>
          )}
        </div>

        <Link href={`/countries/${country.slug}`}>
          <h3 className="font-heading text-lg leading-snug font-semibold hover:underline">
            <span aria-hidden>{country.flagEmoji}</span> {country.name}
          </h3>
        </Link>

        {(country.capital || country.population) && (
          <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
            {country.capital && <span>{country.capital}</span>}
            {country.capital && country.population && (
              <span aria-hidden>&middot;</span>
            )}
            {country.population && (
              <span>{formatCompactNumber(country.population)} people</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
