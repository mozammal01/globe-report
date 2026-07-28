import { notFound } from "next/navigation";

import { CategoryForm } from "@/components/admin/category-form";
import { H1 } from "@/components/ui/typography";
import { getCategories, getCategoryById } from "@/lib/queries/categories";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [category, categories] = await Promise.all([
    getCategoryById(id),
    getCategories(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <H1>Edit Category</H1>
      <CategoryForm category={category} categories={categories} />
    </div>
  );
}
