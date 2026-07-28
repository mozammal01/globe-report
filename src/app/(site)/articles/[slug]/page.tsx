import { Newspaper } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AdSlot } from "@/components/ads/ad-slot";
import { ArticleView } from "@/components/article/article-view";
import { BookmarkButton } from "@/components/article/bookmark-button";
import { ShareButtons } from "@/components/article/share-buttons";
import { ViewTracker } from "@/components/article/view-tracker";
import { ArticleSection } from "@/components/home/article-section";
import { RecommendedSection } from "@/components/home/recommended-section";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { getArticleBySlug, getRelatedArticles } from "@/lib/queries/articles";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found" };
  }

  const title = article.seoTitle ?? article.title;
  const description = article.seoDescription ?? article.excerpt ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: [article.author.name],
      images: article.coverImage ? [{ url: article.coverImage.url }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: article.coverImage ? [article.coverImage.url] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = await getRelatedArticles(
    { id: article.id, categoryId: article.categoryId },
    3,
  );

  const articleUrl = `${siteConfig.url}/articles/${article.slug}`;

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteConfig.url },
    { name: "News", url: `${siteConfig.url}/news` },
    { name: article.title, url: articleUrl },
  ]);

  return (
    <>
      <JsonLd data={articleJsonLd(article, articleUrl)} />
      <JsonLd data={breadcrumb} />
      <ViewTracker articleId={article.id} />

      {article.coverImage && (
        <div className="bg-muted relative aspect-21/9 w-full overflow-hidden">
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.altText ?? article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      )}

      <Section spacing="sm">
        <Container size="narrow">
          <div className="flex flex-col gap-4">
            <ArticleView article={article} />

            <AdSlot variant="in-article" />

            <div className="border-border flex flex-wrap items-center justify-between gap-3 border-t pt-6">
              <ShareButtons url={articleUrl} title={article.title} />
              <BookmarkButton articleId={article.id} />
            </div>

            <Link
              href="/"
              className="text-primary mt-2 text-sm font-medium hover:underline"
            >
              &larr; Back to home
            </Link>
          </div>
        </Container>
      </Section>

      <ArticleSection
        title="Related Articles"
        icon={Newspaper}
        articles={related}
        cols={3}
        emptyMessage="No related articles yet."
      />

      <RecommendedSection
        article={{
          id: article.id,
          countryId: article.countryId,
          categoryId: article.categoryId,
          tagSlugs: article.tags.map((tag) => tag.slug),
        }}
        excludeIds={related.map((item) => item.id)}
      />
    </>
  );
}
