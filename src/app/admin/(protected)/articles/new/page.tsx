import { ArticleForm } from "@/components/admin/article-form";
import { H1 } from "@/components/ui/typography";
import { getCategories } from "@/lib/queries/categories";
import { getCountryOptions } from "@/lib/queries/countries";
import { getTags } from "@/lib/queries/tags";

export default async function NewArticlePage() {
  const [categories, countries, tags] = await Promise.all([
    getCategories(),
    getCountryOptions(),
    getTags(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <H1>New Article</H1>
      <ArticleForm categories={categories} countries={countries} tags={tags} />
    </div>
  );
}
