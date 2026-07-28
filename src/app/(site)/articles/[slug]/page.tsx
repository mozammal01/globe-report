import { Newspaper } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleView } from "@/components/article/article-view";
import { ShareButtons } from "@/components/article/share-buttons";
import { ViewTracker } from "@/components/article/view-tracker";
import { ArticleSection } from "@/components/home/article-section";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { siteConfig } from "@/config/site";
import { getArticleBySlug, getRelatedArticles } from "@/lib/queries/articles";

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt ?? undefined,
    image: article.coverImage ? [article.coverImage.url] : undefined,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    author: [{ "@type": "Person", name: article.author.name }],
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/articles/${article.slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

            <div className="border-border border-t pt-6">
              <ShareButtons url={articleUrl} title={article.title} />
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
    </>
  );
}
