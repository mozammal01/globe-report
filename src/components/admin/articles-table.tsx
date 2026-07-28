"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteArticle } from "@/lib/actions/admin/articles";
import { formatDate } from "@/lib/format";
import type { AdminArticlesResult } from "@/lib/queries/admin/articles";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  DRAFT: "outline",
  IN_REVIEW: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "destructive",
};

export function ArticlesTable({
  articles,
}: {
  articles: AdminArticlesResult["articles"];
}) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Published</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => {
          const isScheduled =
            article.status === "PUBLISHED" &&
            article.publishedAt !== null &&
            article.publishedAt > new Date();

          return (
            <TableRow key={article.id}>
              <TableCell className="max-w-64 truncate font-medium">
                {article.title}
              </TableCell>
              <TableCell>{article.category.name}</TableCell>
              <TableCell>
                <Badge variant={STATUS_VARIANT[article.status]}>
                  {isScheduled ? "SCHEDULED" : article.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(article.publishedAt)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/articles/${article.id}/preview`}>
                      Preview
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/articles/${article.id}/edit`}>
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
                    title="Delete article?"
                    description={`This will permanently delete "${article.title}". This cannot be undone.`}
                    onConfirm={async () => {
                      const result = await deleteArticle(article.id);
                      if (!result?.error) router.refresh();
                      return result;
                    }}
                  />
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
