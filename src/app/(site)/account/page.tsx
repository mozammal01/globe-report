import { Bookmark, Clock } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { H1, Muted } from "@/components/ui/typography";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getUserBookmarkCount,
  getUserReadingHistory,
} from "@/lib/queries/bookmarks";

export default async function AccountOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [bookmarkCount, history] = await Promise.all([
    getUserBookmarkCount(user.id),
    getUserReadingHistory(user.id, 5),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <H1>Welcome, {user.name}</H1>
        <Muted>Your reading activity at a glance.</Muted>
      </div>

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
