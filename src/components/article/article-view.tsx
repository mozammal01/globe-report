import { Eye } from "lucide-react";
import Link from "next/link";

import { ArticleBody } from "@/components/article/article-body";
import { GuideToc } from "@/components/article/guide-toc";
import { Badge } from "@/components/ui/badge";
import { H1 } from "@/components/ui/typography";
import { formatCompactNumber, formatDate } from "@/lib/format";

type ArticleViewData = {
  title: string;
  content: string;
  contentType: "ARTICLE" | "GUIDE";
  publishedAt: Date | null;
  readingTimeMinutes: number | null;
  viewCount: number;
  category: { name: string; slug?: string };
  country: { name: string; flagEmoji: string | null } | null;
  author: {
    id?: string;
    name: string;
    slug?: string | null;
    avatarUrl?: string | null;
    bio?: string | null;
  };
  tags: { name: string; slug: string }[];
};

export function ArticleView({ article }: { article: ArticleViewData }) {
  const isGuide = article.contentType === "GUIDE";

  const categoryHref = article.category.slug
    ? `/categories/${article.category.slug}`
    : `/blog?category=${encodeURIComponent(article.category.name.toLowerCase())}`;
  const authorHref = `/authors/${article.author.slug || article.author.id || ""}`;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {isGuide && <Badge>Guide</Badge>}
        <Link href={categoryHref}>
          <Badge
            variant="secondary"
            className="hover:bg-secondary/80 cursor-pointer transition-colors"
          >
            {article.category.name}
          </Badge>
        </Link>
        {article.country && (
          <span className="text-muted-foreground text-sm">
            {article.country.flagEmoji} {article.country.name}
          </span>
        )}
      </div>

      <H1>{article.title}</H1>

      <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        {article.author.id || article.author.slug ? (
          <Link
            href={authorHref}
            className="text-foreground/90 hover:text-primary font-medium transition-colors hover:underline"
          >
            By {article.author.name}
          </Link>
        ) : (
          <span>By {article.author.name}</span>
        )}
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
        <span aria-hidden>&middot;</span>
        <span className="inline-flex items-center gap-1">
          <Eye className="size-3.5" aria-hidden />
          {formatCompactNumber(article.viewCount)} views
        </span>
      </div>

      {isGuide && <GuideToc content={article.content} />}

      <div className="border-border border-t pt-6">
        <ArticleBody content={article.content} withHeadingIds={isGuide} />
      </div>

      {article.tags.length > 0 && (
        <div className="border-border flex flex-wrap gap-2 border-t pt-6">
          {article.tags.map((tag) => (
            <Link key={tag.slug} href={`/tags/${tag.slug}`}>
              <Badge
                variant="outline"
                className="hover:border-primary/50 hover:bg-muted/40 cursor-pointer transition-colors"
              >
                #{tag.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
