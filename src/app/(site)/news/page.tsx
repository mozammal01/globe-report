import type { Metadata } from "next";

import { ArticleCard } from "@/components/home/article-card";
import { NewsFilters } from "@/components/news/news-filters";
import { Pagination } from "@/components/news/pagination";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Grid } from "@/components/ui/grid";
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

  const selectedCategoryName = categories.find(
    (item) => item.slug === category,
  )?.name;
  const selectedCountryName = countries.find(
    (item) => item.slug === country,
  )?.name;
  const filterLabel = selectedCategoryName ?? selectedCountryName ?? tag;

  const breadcrumb = breadcrumbJsonLd(
    [
      { name: "Home", url: siteConfig.url },
      { name: "News", url: `${siteConfig.url}/news` },
      filterLabel ? { name: filterLabel, url: `${siteConfig.url}/news` } : null,
    ].filter((item): item is { name: string; url: string } => item !== null),
  );

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
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
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
            page={page}
            totalPages={totalPages}
            category={category}
            country={country}
            tag={tag}
          />
        </div>
      </Container>
    </Section>
  );
}
