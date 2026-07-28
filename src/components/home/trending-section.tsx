import { TrendingUp } from "lucide-react";

import { ArticleSection } from "@/components/home/article-section";
import { getTrendingArticles } from "@/lib/queries/articles";

export async function TrendingSection() {
  const trending = await getTrendingArticles(4);

  return (
    <ArticleSection
      title="Trending"
      description="What readers are following right now"
      icon={TrendingUp}
      articles={trending}
      cols={4}
      emptyMessage="No trending stories in the last two weeks."
    />
  );
}
