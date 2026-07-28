import { CategoryForm } from "@/components/admin/category-form";
import { H1 } from "@/components/ui/typography";
import { getCategories } from "@/lib/queries/categories";

export default async function NewCategoryPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <H1>New Category</H1>
      <CategoryForm categories={categories} />
    </div>
  );
}
