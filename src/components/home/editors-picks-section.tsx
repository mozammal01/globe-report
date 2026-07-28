import { Star } from "lucide-react";

import { ArticleSection } from "@/components/home/article-section";
import { getEditorsPicks } from "@/lib/queries/articles";

export async function EditorsPicksSection() {
  const editorsPicks = await getEditorsPicks(3);

  return (
    <ArticleSection
      title="Editor's Picks"
      description="Hand-picked stories worth your time"
      icon={Star}
      articles={editorsPicks}
      cols={3}
    />
  );
}
