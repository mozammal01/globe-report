import { Flame } from "lucide-react";

import { ArticleSection } from "@/components/home/article-section";
import { getPopularArticles } from "@/lib/queries/articles";

export async function PopularSection() {
  const popular = await getPopularArticles(4);

  return (
    <ArticleSection
      title="Popular"
      description="All-time reader favorites"
      icon={Flame}
      articles={popular}
      cols={4}
    />
  );
}
