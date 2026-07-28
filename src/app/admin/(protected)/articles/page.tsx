import Link from "next/link";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { ArticlesTable } from "@/components/admin/articles-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { H1 } from "@/components/ui/typography";
import { getAdminArticles } from "@/lib/queries/admin/articles";

const STATUSES = ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"] as const;

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string; page?: string }>;
}) {
  const { search, status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { articles, total, pageSize } = await getAdminArticles({
    search,
    status: status as (typeof STATUSES)[number] | undefined,
    page,
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <H1>Articles</H1>
        <Button asChild>
          <Link href="/admin/articles/new">New Article</Link>
        </Button>
      </div>

      <form className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          name="search"
          placeholder="Search title or excerpt..."
          defaultValue={search}
          className="max-w-xs"
        />
        <NativeSelect name="status" defaultValue={status ?? ""}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </NativeSelect>
        <Button type="submit" variant="outline" size="sm">
          Filter
        </Button>
      </form>

      {articles.length > 0 ? (
        <ArticlesTable articles={articles} />
      ) : (
        <EmptyState title="No articles found." />
      )}

      <AdminPagination
        basePath="/admin/articles"
        page={page}
        totalPages={totalPages}
        params={{ search, status }}
      />
    </div>
  );
}
