import Link from "next/link";

import { CategoriesTable } from "@/components/admin/categories-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { H1 } from "@/components/ui/typography";
import { getCategoriesWithCounts } from "@/lib/queries/categories";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <H1>Categories</H1>
        <Button asChild>
          <Link href="/admin/categories/new">New Category</Link>
        </Button>
      </div>

      {categories.length > 0 ? (
        <CategoriesTable categories={categories} />
      ) : (
        <EmptyState title="No categories yet." />
      )}
    </div>
  );
}
