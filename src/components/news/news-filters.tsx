"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import type { CategoryOption } from "@/lib/queries/categories";
import type { CountryOption } from "@/lib/queries/countries";

const selectClassName =
  "border-input h-8 rounded-lg border bg-transparent px-2.5 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function NewsFilters({
  categories,
  countries,
  selectedCategory,
  selectedCountry,
}: {
  categories: CategoryOption[];
  countries: CountryOption[];
  selectedCategory?: string;
  selectedCountry?: string;
}) {
  const router = useRouter();

  function hrefFor(next: { category?: string; country?: string }) {
    const category = "category" in next ? next.category : selectedCategory;
    const country = "country" in next ? next.country : selectedCountry;
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (country) params.set("country", country);
    const qs = params.toString();
    return `/news${qs ? `?${qs}` : ""}`;
  }

  const regions = new Map<string, CountryOption[]>();
  for (const country of countries) {
    const key = country.region ?? "Other";
    const bucket = regions.get(key) ?? [];
    bucket.push(country);
    regions.set(key, bucket);
  }

  const hasActiveFilters = Boolean(selectedCategory || selectedCountry);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        aria-label="Filter by category"
        value={selectedCategory ?? ""}
        onChange={(event) =>
          router.push(hrefFor({ category: event.target.value || undefined }))
        }
        className={selectClassName}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by country"
        value={selectedCountry ?? ""}
        onChange={(event) =>
          router.push(hrefFor({ country: event.target.value || undefined }))
        }
        className={selectClassName}
      >
        <option value="">All countries</option>
        {[...regions.entries()].map(([region, list]) => (
          <optgroup key={region} label={region}>
            {list.map((country) => (
              <option key={country.slug} value={country.slug}>
                {country.flagEmoji} {country.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" asChild>
          <Link href="/news">Clear filters</Link>
        </Button>
      )}
    </div>
  );
}
