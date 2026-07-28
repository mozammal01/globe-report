import { Eye } from "lucide-react";

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
  category: { name: string };
  country: { name: string; flagEmoji: string | null } | null;
  author: { name: string };
  tags: { name: string; slug: string }[];
};

export function ArticleView({ article }: { article: ArticleViewData }) {
  const isGuide = article.contentType === "GUIDE";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {isGuide && <Badge>Guide</Badge>}
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
            <Badge key={tag.slug} variant="outline">
              {tag.name}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
