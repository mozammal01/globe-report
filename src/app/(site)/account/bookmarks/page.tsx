import { ArticleCard } from "@/components/home/article-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Grid } from "@/components/ui/grid";
import { H1 } from "@/components/ui/typography";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserBookmarks } from "@/lib/queries/bookmarks";

export default async function AccountBookmarksPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const bookmarks = await getUserBookmarks(user.id);

  return (
    <div className="flex flex-col gap-6">
      <H1>Bookmarks</H1>

      {bookmarks.length > 0 ? (
        <Grid cols={3}>
          {bookmarks.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </Grid>
      ) : (
        <EmptyState title="You haven't bookmarked any articles yet." />
      )}
    </div>
  );
}
