import { ArticleCard } from "@/components/home/article-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Grid } from "@/components/ui/grid";
import { H1 } from "@/components/ui/typography";
import { getCurrentUser } from "@/lib/auth/session";
import { getUserReadingHistory } from "@/lib/queries/bookmarks";

export default async function AccountHistoryPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const history = await getUserReadingHistory(user.id);

  return (
    <div className="flex flex-col gap-6">
      <H1>Reading History</H1>

      {history.length > 0 ? (
        <Grid cols={3}>
          {history.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </Grid>
      ) : (
        <EmptyState title="You haven't read any articles yet." />
      )}
    </div>
  );
}
