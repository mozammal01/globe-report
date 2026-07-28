import { notFound } from "next/navigation";

import { ArticleView } from "@/components/article/article-view";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getArticleForAdmin } from "@/lib/queries/admin/articles";

export default async function ArticlePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleForAdmin(id);

  if (!article) {
    notFound();
  }

  const isScheduled =
    article.status === "PUBLISHED" &&
    article.publishedAt !== null &&
    article.publishedAt > new Date();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Alert>
        <AlertTitle className="flex items-center gap-2">
          Draft Preview
          <Badge variant="secondary">
            {isScheduled ? "SCHEDULED" : article.status}
          </Badge>
        </AlertTitle>
        <AlertDescription>
          This is a preview only. It is not visible to the public until
          published.
        </AlertDescription>
      </Alert>

      <ArticleView article={article} />
    </div>
  );
}
