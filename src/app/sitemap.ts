import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getCountrySlugs } from "@/lib/queries/countries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const countries = await getCountrySlugs();

  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/countries`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    ...countries.map((country) => ({
      url: `${siteConfig.url}/countries/${country.slug}`,
      lastModified: country.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
