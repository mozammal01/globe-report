"use client";

import * as React from "react";
import { ArrowRight, Clapperboard, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/format";

export type BioArticleItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  publishedAt: Date | null;
  readingTimeMinutes: number | null;
  category: { name: string; slug: string };
  coverImage: { url: string; altText: string | null } | null;
};

export function BioLinksFeed({ articles }: { articles: BioArticleItem[] }) {
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    if (!query.trim()) return articles;
    const lower = query.toLowerCase();
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(lower) ||
        a.category.name.toLowerCase().includes(lower) ||
        (a.excerpt && a.excerpt.toLowerCase().includes(lower)),
    );
  }, [articles, query]);

  return (
    <div className="flex flex-col gap-5">
      {/* Search Input */}
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3.5 size-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search movie title or ending explained..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="bg-card/70 border-border/80 h-11 rounded-xl pr-4 pl-10 text-sm shadow-xs backdrop-blur-xs focus-visible:ring-1"
        />
      </div>

      {/* Results Count / Hint */}
      {query && (
        <p className="text-muted-foreground px-1 text-xs">
          Found {filtered.length} {filtered.length === 1 ? "story" : "stories"}{" "}
          matching &ldquo;{query}&rdquo;
        </p>
      )}

      {/* Article Cards Grid */}
      <div className="flex flex-col gap-3.5">
        {filtered.map((item, idx) => (
          <Link
            key={item.id}
            href={`/articles/${item.slug}`}
            className="group border-border/70 bg-card/80 hover:border-primary/50 relative flex items-center gap-3.5 overflow-hidden rounded-xl border p-2.5 shadow-xs backdrop-blur-xs transition-all hover:shadow-md sm:p-3"
          >
            {/* Thumbnail */}
            <div className="border-border/60 bg-muted relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg border sm:w-32">
              {item.coverImage ? (
                <Image
                  src={item.coverImage.url}
                  alt={item.coverImage.altText ?? item.title}
                  fill
                  sizes="128px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                  <Clapperboard className="size-6" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col justify-center gap-1 overflow-hidden">
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="secondary"
                  className="px-1.5 py-0 text-[10px] font-medium"
                >
                  {item.category.name}
                </Badge>
                {idx === 0 && !query && (
                  <span className="bg-primary/10 text-primary inline-flex items-center gap-0.5 rounded-full px-1.5 py-0 text-[10px] font-semibold">
                    <Sparkles className="size-2.5" /> Latest
                  </span>
                )}
              </div>

              <h3 className="text-foreground group-hover:text-primary line-clamp-2 text-sm leading-snug font-semibold transition-colors sm:text-base">
                {item.title}
              </h3>

              <div className="text-muted-foreground flex items-center gap-2 text-[11px]">
                {item.publishedAt && (
                  <span>{formatDate(item.publishedAt)}</span>
                )}
                {item.readingTimeMinutes && (
                  <>
                    <span>&middot;</span>
                    <span>{item.readingTimeMinutes} min read</span>
                  </>
                )}
              </div>
            </div>

            {/* Arrow */}
            <div className="text-muted-foreground group-hover:text-primary flex size-8 shrink-0 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5">
              <ArrowRight className="size-4" />
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="border-border/60 bg-muted/20 flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center">
            <Clapperboard className="text-muted-foreground/50 size-10" />
            <h4 className="text-foreground mt-3 text-sm font-semibold">
              No movies found
            </h4>
            <p className="text-muted-foreground mt-1 max-w-xs text-xs">
              We couldn&apos;t find any articles matching your search. Check
              back soon for new movie reviews!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
