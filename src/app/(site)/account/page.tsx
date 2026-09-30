import {
  Bookmark,
  Clock,
  LayoutDashboard,
  Newspaper,
  PenSquare,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { H1, Muted } from "@/components/ui/typography";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getUserBookmarkCount,
  getUserReadingHistory,
} from "@/lib/queries/bookmarks";
import { ADMIN_ACCESS_ROLES } from "@/lib/rbac";

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isAdmin = (ADMIN_ACCESS_ROLES as string[]).includes(user.role.key);

  const [bookmarkCount, history] = await Promise.all([
    getUserBookmarkCount(user.id),
    getUserReadingHistory(user.id, 5),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <H1>Welcome, {user.name}</H1>
        <Muted>Your reading and creator activity at a glance.</Muted>
      </div>

      {isAdmin && (
        <Card className="border-primary/20 from-primary/10 via-primary/5 to-background bg-gradient-to-br shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="gap-1 text-xs">
                  <Sparkles className="size-3" />
                  Admin & Creator Studio
                </Badge>
                <span className="text-muted-foreground text-xs font-medium">
                  {user.role.name}
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Publish a New Blog or Movie Analysis
              </h2>
              <p className="text-muted-foreground max-w-xl text-sm">
                Ready to publish ending explanations, movie reviews, or
                franchise theories? Use the full-featured rich editor to craft
                your next viral story.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2.5">
              <Button
                asChild
                size="default"
                className="gap-2 font-semibold shadow-xs"
              >
                <Link href="/admin/articles/new">
                  <PenSquare className="size-4" aria-hidden="true" />
                  <span>Write New Blog</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="gap-2"
              >
                <Link href="/admin">
                  <LayoutDashboard className="size-4" aria-hidden="true" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="default"
                className="text-muted-foreground gap-1.5"
              >
                <Link href="/admin/articles">
                  <Newspaper className="size-4" aria-hidden="true" />
                  <span>Manage Articles</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Link href="/account/bookmarks">
          <Card>
            <CardContent className="flex items-center gap-3">
              <span className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Bookmark className="text-primary size-4" aria-hidden />
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-semibold">{bookmarkCount}</span>
                <span className="text-muted-foreground text-xs">Bookmarks</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/account/history">
          <Card>
            <CardContent className="flex items-center gap-3">
              <span className="bg-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                <Clock className="text-primary size-4" aria-hidden />
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-semibold">{history.length}</span>
                <span className="text-muted-foreground text-xs">
                  Recently read
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold">Recently read</h2>
        <Card>
          <CardContent className="divide-border flex flex-col divide-y p-0">
            {history.length === 0 && (
              <p className="text-muted-foreground p-4 text-sm">
                No reading history yet.
              </p>
            )}
            {history.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="hover:bg-muted/50 flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors"
              >
                <span className="truncate font-medium">{article.title}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
