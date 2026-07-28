import { notFound } from "next/navigation";

import { ArticleForm } from "@/components/admin/article-form";
import { H1 } from "@/components/ui/typography";
import { getArticleForAdmin } from "@/lib/queries/admin/articles";
import { getCategories } from "@/lib/queries/categories";
import { getCountryOptions } from "@/lib/queries/countries";
import { getTags } from "@/lib/queries/tags";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [article, categories, countries, tags] = await Promise.all([
    getArticleForAdmin(id),
    getCategories(),
    getCountryOptions(),
    getTags(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <H1>Edit Article</H1>
      <ArticleForm
        article={article}
        categories={categories}
        countries={countries}
        tags={tags}
      />
    </div>
  );
}
