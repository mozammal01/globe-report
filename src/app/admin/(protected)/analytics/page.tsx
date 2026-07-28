import { BookOpen, Clock, Eye, Flame } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { H1, H3, Muted } from "@/components/ui/typography";
import { formatDate } from "@/lib/format";
import { getAnalyticsOverview } from "@/lib/queries/admin/analytics";

export default async function AdminAnalyticsPage() {
  const {
    mostViewed,
    trending,
    mostVisitedCountries,
    popularCategories,
    recentActivity,
    readingStats,
  } = await getAnalyticsOverview();

  const cards = [
    { label: "Total views", value: readingStats.totalViews, icon: Eye },
    {
      label: "Avg. reading time",
      value: `${readingStats.avgReadingTimeMinutes} min`,
      icon: Clock,
    },
    {
      label: "Est. reading minutes",
      value: readingStats.estimatedReadingMinutes,
      icon: BookOpen,
    },
    {
      label: "Published articles",
      value: readingStats.publishedCount,
      icon: Flame,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <H1>Analytics</H1>
        <Muted>Reader engagement across Globe Report.</Muted>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <H3>Most Viewed Articles</H3>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostViewed.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="max-w-64 truncate font-medium">
                      {article.title}
                    </TableCell>
                    <TableCell className="text-right">
                      {article.viewCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <H3>Trending (14 days)</H3>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trending.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="max-w-64 truncate font-medium">
                      {article.title}
                    </TableCell>
                    <TableCell className="text-right">
                      {article.viewCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <H3>Most Visited Countries</H3>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostVisitedCountries.map((country) => (
                  <TableRow key={country.id}>
                    <TableCell className="font-medium">
                      {country.flagEmoji} {country.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {country.viewCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        <div className="flex flex-col gap-3">
          <H3>Popular Categories</H3>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Articles</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popularCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-right">
                      {category.articleCount}
                    </TableCell>
                    <TableCell className="text-right">
                      {category.viewCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <H3>Recent Activity</H3>
        <Card>
          <CardContent className="divide-border flex flex-col divide-y p-0">
            {recentActivity.length === 0 && (
              <p className="text-muted-foreground p-4 text-sm">
                No activity yet.
              </p>
            )}
            {recentActivity.map((view) => (
              <div
                key={view.id}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              >
                <span className="truncate font-medium">
                  {view.article.title}
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {view.user ? (
                    <Badge variant="secondary">{view.user.name}</Badge>
                  ) : (
                    <Badge variant="outline">Guest</Badge>
                  )}
                  <span className="text-muted-foreground text-xs">
                    {formatDate(view.viewedAt)}
                  </span>
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
