import type { Metadata } from "next";
import { Fragment } from "react";

import { AdSlot } from "@/components/ads/ad-slot";
import { ArticleCard } from "@/components/home/article-card";
import { NewsFilters } from "@/components/news/news-filters";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Grid } from "@/components/ui/grid";
import { Pagination } from "@/components/ui/pagination";
import { Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";
import { getArticles } from "@/lib/queries/articles";
import { getCategories } from "@/lib/queries/categories";
import { getCountryOptions } from "@/lib/queries/countries";
import { breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "News",
  description:
    "Browse the latest news from Globe Report, filterable by category and country.",
  alternates: { canonical: "/news" },
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    country?: string;
    tag?: string;
    page?: string;
  }>;
}) {
  const { category, country, tag, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [categories, countries, { articles, total, pageSize }] =
    await Promise.all([
      getCategories(),
      getCountryOptions(),
      getArticles({
        categorySlug: category,
        countrySlug: country,
        tagSlug: tag,
        page,
      }),
    ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "News", url: `${siteConfig.url}/news` },
  ]);

  return (
    <Section spacing="sm">
      <Container>
        <JsonLd data={breadcrumb} />
        <div className="mb-6 flex flex-col gap-2">
          <H1>News</H1>
          <Lead>
            Browse the latest stories, filtered by category and country.
          </Lead>
        </div>

        <NewsFilters
          categories={categories}
          countries={countries}
          selectedCategory={category}
          selectedCountry={country}
        />

        {articles.length > 0 ? (
          <Grid cols={3} className="mt-8">
            {articles.map((article, index) => (
              <Fragment key={article.id}>
                <ArticleCard article={article} />
                {index === 5 && articles.length > 6 && (
                  <AdSlot
                    variant="in-feed"
                    className="sm:col-span-2 lg:col-span-3"
                  />
                )}
              </Fragment>
            ))}
          </Grid>
        ) : (
          <EmptyState
            title="No articles match these filters."
            className="mt-8"
          />
        )}

        <div className="mt-10">
          <Pagination
            basePath="/news"
            page={page}
            totalPages={totalPages}
            params={{ category, country, tag }}
          />
        </div>
      </Container>
    </Section>
  );
}
