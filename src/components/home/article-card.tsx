import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, toIsoStringSafe } from "@/lib/format";
import type { ArticleCard as ArticleCardData } from "@/lib/queries/articles";

export function ArticleCard({ article }: { article: ArticleCardData }) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <Link
        href={`/articles/${article.slug}`}
        className="bg-muted relative block aspect-[16/10] w-full overflow-hidden"
      >
        {article.coverImage && (
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.altText ?? article.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover/card:scale-105"
          />
        )}
      </Link>
      <CardContent className="flex flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{article.category.name}</Badge>
          {article.country && (
            <span className="text-muted-foreground text-xs">
              {article.country.flagEmoji} {article.country.name}
            </span>
          )}
        </div>

        <Link href={`/articles/${article.slug}`}>
          <h3 className="font-heading text-lg leading-snug font-semibold hover:underline">
            {article.title}
          </h3>
        </Link>

        {article.excerpt && (
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {article.excerpt}
          </p>
        )}

        <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
          <span>{article.author.name}</span>
          <span aria-hidden>&middot;</span>
          <time dateTime={toIsoStringSafe(article.publishedAt)}>
            {formatDate(article.publishedAt)}
          </time>
          {article.readingTimeMinutes && (
            <>
              <span aria-hidden>&middot;</span>
              <span>{article.readingTimeMinutes} min read</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
