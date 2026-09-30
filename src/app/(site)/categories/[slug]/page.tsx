import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";

import { ArticleCard } from "@/components/home/article-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Grid } from "@/components/ui/grid";
import { Pagination } from "@/components/ui/pagination";
import { Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";
import { getArticles } from "@/lib/queries/articles";
import { getCategoryBySlug } from "@/lib/queries/categories";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const title = `${category.name} Articles — ${siteConfig.name}`;
  const description =
    category.description || `Browse in-depth articles on ${category.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/categories/${category.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [category, { articles, total, pageSize }] = await Promise.all([
    getCategoryBySlug(slug),
    getArticles({ categorySlug: slug, page, pageSize: 12 }),
  ]);

  if (!category) {
    notFound();
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <Section spacing="sm">
      <Container>
        <div className="mb-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground -ml-2 gap-1.5"
          >
            <Link href="/categories">
              <ArrowLeft className="size-4" />
              All Categories
            </Link>
          </Button>
        </div>

        {/* Category Header */}
        <div className="border-border mb-10 flex flex-col gap-3 border-b pb-8">
          <div className="text-primary flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <BookOpen className="size-4" />
            <span>Category Archive ({total} articles)</span>
          </div>
          <H1 className="text-3xl sm:text-5xl">{category.name}</H1>
          {category.description && (
            <Lead className="text-muted-foreground max-w-2xl text-base sm:text-lg">
              {category.description}
            </Lead>
          )}
        </div>

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <Grid cols={3} className="gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </Grid>
        ) : (
          <EmptyState
            title="No articles in this category"
            description="Check back soon for new stories."
            className="my-12 py-12"
          />
        )}

        {/* Pagination */}
        <div className="mt-12">
          <Pagination
            basePath={`/categories/${category.slug}`}
            page={page}
            totalPages={totalPages}
          />
        </div>
      </Container>
    </Section>
  );
}
