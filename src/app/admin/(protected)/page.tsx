import {
  Clock,
  FolderTree,
  Globe2,
  Newspaper,
  Tag,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { H1, H3, Muted } from "@/components/ui/typography";
import { getCurrentAdmin } from "@/lib/auth/session";
import { formatDate } from "@/lib/format";
import { getDashboardStats } from "@/lib/queries/admin/dashboard";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  DRAFT: "outline",
  IN_REVIEW: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "destructive",
};

export default async function AdminDashboardPage() {
  const [admin, stats] = await Promise.all([
    getCurrentAdmin(),
    getDashboardStats(),
  ]);

  const cards = [
    {
      label: "Published articles",
      value: stats.articles.published,
      icon: Newspaper,
    },
    { label: "Scheduled", value: stats.articles.scheduled, icon: Clock },
    { label: "Drafts", value: stats.articles.draft, icon: TrendingUp },
    { label: "Countries", value: stats.countryCount, icon: Globe2 },
    { label: "Categories", value: stats.categoryCount, icon: FolderTree },
    { label: "Tags", value: stats.tagCount, icon: Tag },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <H1>Welcome, {admin?.name}</H1>
        <Muted>Here&apos;s what&apos;s happening across Globe Report.</Muted>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex items-center gap-3">
              <span className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                <card.icon className="text-primary size-4" aria-hidden />
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-semibold">{card.value}</span>
                <span className="text-muted-foreground text-xs">
                  {card.label}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <H3>Recently updated</H3>
        <Card>
          <CardContent className="divide-border flex flex-col divide-y p-0">
            {stats.recentArticles.length === 0 && (
              <p className="text-muted-foreground p-4 text-sm">
                No articles yet.
              </p>
            )}
            {stats.recentArticles.map((article) => {
              const isScheduled =
                article.status === "PUBLISHED" &&
                article.publishedAt !== null &&
                article.publishedAt > new Date();

              return (
                <Link
                  key={article.id}
                  href={`/admin/articles/${article.id}/edit`}
                  className="hover:bg-muted/50 flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors"
                >
                  <span className="truncate font-medium">{article.title}</span>
                  <span className="flex shrink-0 items-center gap-2">
                    <Badge variant={STATUS_VARIANT[article.status]}>
                      {isScheduled ? "SCHEDULED" : article.status}
                    </Badge>
                    <span className="text-muted-foreground text-xs">
                      {formatDate(article.updatedAt)}
                    </span>
                  </span>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
