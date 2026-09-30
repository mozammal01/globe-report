import type { Metadata } from "next";
import { Fragment } from "react";
import { Sparkles } from "lucide-react";

import { AdSlot } from "@/components/ads/ad-slot";
import { BlogFilters } from "@/components/blog/blog-filters";
import { ArticleCard } from "@/components/home/article-card";
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
import { breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog — Movie Stories, Ending Explanations & Theories",
  description: `Explore the latest movie articles, ending explanations, viral clips, and cinema theories on the ${siteConfig.name} blog.`,
  alternates: { canonical: "/blog" },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    q?: string;
    page?: string;
  }>;
}) {
  const { category, tag, q, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [categories, { articles, total, pageSize }] = await Promise.all([
    getCategories(),
    getArticles({
      categorySlug: category,
      tagSlug: tag,
      searchQuery: q,
      page,
      pageSize: 12,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "Blog", url: `${siteConfig.url}/blog` },
  ]);

  return (
    <Section spacing="sm">
      <Container>
        <JsonLd data={breadcrumb} />

        {/* Blog Header */}
        <div className="mb-8 flex flex-col gap-3">
          <div className="text-primary flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="size-4" />
            <span>Stories, Technology & Perspective</span>
          </div>
          <H1 className="text-3xl sm:text-5xl">The Blog</H1>
          <Lead className="text-muted-foreground max-w-2xl text-base sm:text-lg">
            Dive into thoughtful writing, deep dives, expert insights, and
            engaging narratives shaping our modern world.
          </Lead>
        </div>

        {/* Search & Category Pills */}
        <div className="mb-10">
          <BlogFilters
            categories={categories}
            selectedCategory={category}
            searchQuery={q}
          />
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <Grid cols={3} className="gap-6">
            {articles.map((article, index) => (
              <Fragment key={article.id}>
                <ArticleCard article={article} />
                {index === 5 && articles.length > 6 && (
                  <AdSlot
                    variant="in-feed"
                    className="my-2 sm:col-span-2 lg:col-span-3"
                  />
                )}
              </Fragment>
            ))}
          </Grid>
        ) : (
          <EmptyState
            title="No blog posts found"
            description="Try changing your search term or selecting a different topic."
            className="my-12 py-12"
          />
        )}

        {/* Pagination */}
        <div className="mt-12">
          <Pagination
            basePath="/blog"
            page={page}
            totalPages={totalPages}
            params={{ category, tag, q }}
          />
        </div>
      </Container>
    </Section>
  );
}
