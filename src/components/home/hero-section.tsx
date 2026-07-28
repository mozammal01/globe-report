import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { H1 } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";
import { formatDate, toIsoStringSafe } from "@/lib/format";
import type { ArticleCard } from "@/lib/queries/articles";

export function HeroSection({ article }: { article: ArticleCard | null }) {
  if (!article) {
    return (
      <Container className="py-16">
        <h1 className="sr-only">{siteConfig.name}</h1>
        <EmptyState
          title="No articles published yet"
          description="Check back soon for the latest stories."
        />
      </Container>
    );
  }

  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-neutral-900 text-white sm:min-h-[560px]">
      {article.coverImage && (
        <Image
          src={article.coverImage.url}
          alt={article.coverImage.altText ?? article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

      <Container className="relative py-10 sm:py-14">
        <div className="flex max-w-2xl flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{article.category.name}</Badge>
            {article.country && (
              <span className="text-sm text-white/80">
                {article.country.flagEmoji} {article.country.name}
              </span>
            )}
          </div>

          <Link href={`/articles/${article.slug}`}>
            <H1 className="text-white sm:text-4xl md:text-5xl">
              {article.title}
            </H1>
          </Link>

          {article.excerpt && (
            <p className="max-w-xl text-base text-white/85 sm:text-lg">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-white/70">
            <span>{article.author.name}</span>
            <span aria-hidden>&middot;</span>
            <time dateTime={toIsoStringSafe(article.publishedAt)}>
              {formatDate(article.publishedAt)}
            </time>
          </div>

          <Button asChild className="mt-2 w-fit">
            <Link href={`/articles/${article.slug}`}>
              Read the full story
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
