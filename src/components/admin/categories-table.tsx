"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteCategory } from "@/lib/actions/admin/categories";
import type { CategoryWithCounts } from "@/lib/queries/categories";

export function CategoriesTable({
  categories,
}: {
  categories: CategoryWithCounts[];
}) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Parent</TableHead>
          <TableHead>Articles</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell className="text-muted-foreground">
              {category.slug}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {category.parent?.name ?? "—"}
            </TableCell>
            <TableCell>{category._count.articles}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/categories/${category.id}/edit`}>
                    Edit
                  </Link>
                </Button>
                <ConfirmDialog
                  trigger={
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                    >
                      Delete
                    </Button>
                  }
                  title="Delete category?"
                  description={`This will permanently delete "${category.name}".`}
                  onConfirm={async () => {
                    const result = await deleteCategory(category.id);
                    if (!result?.error) router.refresh();
                    return result;
                  }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
