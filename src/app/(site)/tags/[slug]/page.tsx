import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Tag as TagIcon } from "lucide-react";

import { ArticleCard } from "@/components/home/article-card";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Grid } from "@/components/ui/grid";
import { Pagination } from "@/components/ui/pagination";
import { Section } from "@/components/ui/section";
import { H1 } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";
import { getArticles } from "@/lib/queries/articles";
import { getTagBySlug } from "@/lib/queries/tags";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);

  if (!tag) {
    return { title: "Tag Not Found" };
  }

  const title = `Articles tagged #${tag.name} — ${siteConfig.name}`;
  const description = `Read all articles and discussions tagged with #${tag.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/tags/${tag.slug}` },
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const [tag, { articles, total, pageSize }] = await Promise.all([
    getTagBySlug(slug),
    getArticles({ tagSlug: slug, page, pageSize: 12 }),
  ]);

  if (!tag) {
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
            <Link href="/blog">
              <ArrowLeft className="size-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        {/* Tag Header */}
        <div className="border-border mb-10 flex flex-col gap-3 border-b pb-8">
          <div className="text-primary flex items-center gap-2 text-xs font-semibold tracking-wider uppercase">
            <TagIcon className="size-4" />
            <span>Tag Archive ({total} articles)</span>
          </div>
          <H1 className="text-3xl sm:text-5xl">#{tag.name}</H1>
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
            title="No articles found"
            description={`There are currently no published articles tagged with #${tag.name}.`}
            className="my-12 py-12"
          />
        )}

        {/* Pagination */}
        <div className="mt-12">
          <Pagination
            basePath={`/tags/${tag.slug}`}
            page={page}
            totalPages={totalPages}
          />
        </div>
      </Container>
    </Section>
  );
}
