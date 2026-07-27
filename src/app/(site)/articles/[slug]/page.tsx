import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { H1, P } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/format";
import { getArticleBySlug } from "@/lib/queries/articles";

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

  const paragraphs = article.content
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

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
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{article.category.name}</Badge>
              {article.country && (
                <span className="text-muted-foreground text-sm">
                  {article.country.flagEmoji} {article.country.name}
                </span>
              )}
            </div>

            <H1>{article.title}</H1>

            <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span>By {article.author.name}</span>
              <span aria-hidden>&middot;</span>
              <time dateTime={article.publishedAt?.toISOString()}>
                {formatDate(article.publishedAt)}
              </time>
              {article.readingTimeMinutes && (
                <>
                  <span aria-hidden>&middot;</span>
                  <span>{article.readingTimeMinutes} min read</span>
                </>
              )}
            </div>

            <div className="border-border flex flex-col gap-4 border-t pt-6">
              {paragraphs.map((paragraph, index) => (
                <P key={index}>{paragraph}</P>
              ))}
            </div>

            {article.tags.length > 0 && (
              <div className="border-border flex flex-wrap gap-2 border-t pt-6">
                {article.tags.map((tag) => (
                  <Badge key={tag.slug} variant="outline">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}

            <Link
              href="/"
              className="text-primary mt-2 text-sm font-medium hover:underline"
            >
              &larr; Back to home
            </Link>
          </div>
        </Container>
      </Section>
    </>
  );
}
