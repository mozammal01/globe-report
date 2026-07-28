import { Sparkles } from "lucide-react";

import { ArticleSection } from "@/components/home/article-section";
import { getRecommendedArticles } from "@/lib/queries/articles";

export async function RecommendedSection({
  article,
  excludeIds = [],
}: {
  article: {
    id: string;
    countryId: string | null;
    categoryId: string;
    tagSlugs?: string[];
  };
  excludeIds?: string[];
}) {
  const recommended = await getRecommendedArticles(article, excludeIds, 3);

  if (recommended.length === 0) {
    return null;
  }

  return (
    <ArticleSection
      title="Recommended for You"
      description="More stories you might find useful"
      icon={Sparkles}
      articles={recommended}
      cols={3}
    />
  );
}
