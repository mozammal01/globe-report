import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { ArticleCard } from "@/components/home/article-card";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";
import { Grid } from "@/components/ui/grid";
import { Section } from "@/components/ui/section";
import { H2 } from "@/components/ui/typography";
import type { ArticleCard as ArticleCardData } from "@/lib/queries/articles";
import { cn } from "@/lib/utils";

export function ArticleSection({
  title,
  description,
  icon: Icon,
  articles,
  cols = 3,
  emptyMessage = "No articles to show yet.",
  viewAllHref,
  className,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  articles: ArticleCardData[];
  cols?: 2 | 3 | 4;
  emptyMessage?: string;
  viewAllHref?: string;
  className?: string;
}) {
  return (
    <Section spacing="sm" className={cn("border-border border-t", className)}>
      <Container>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {Icon && <Icon className="text-primary size-5" aria-hidden />}
            <div>
              <H2 className="text-2xl">{title}</H2>
              {description && (
                <p className="text-muted-foreground text-sm">{description}</p>
              )}
            </div>
          </div>
          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="text-primary hover:text-primary/80 text-xs font-semibold tracking-wide uppercase transition-colors hover:underline"
            >
              View all &rarr;
            </Link>
          )}
        </div>

        {articles.length > 0 ? (
          <Grid cols={cols}>
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </Grid>
        ) : (
          <EmptyState title={emptyMessage} />
        )}
      </Container>
    </Section>
  );
}
