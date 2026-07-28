import Link from "next/link";

import { ArticlesTable } from "@/components/admin/articles-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Pagination } from "@/components/ui/pagination";
import { H1 } from "@/components/ui/typography";
import {
  ARTICLE_STATUSES,
  type ArticleStatusValue,
  type ContentTypeValue,
} from "@/lib/constants/article";
import { getAdminArticles } from "@/lib/queries/admin/articles";

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    contentType?: string;
    page?: string;
  }>;
}) {
  const { search, status, contentType, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { articles, total, pageSize } = await getAdminArticles({
    search,
    status: status as ArticleStatusValue | undefined,
    contentType: contentType as ContentTypeValue | undefined,
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
          {ARTICLE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </NativeSelect>
        <NativeSelect name="contentType" defaultValue={contentType ?? ""}>
          <option value="">All content types</option>
          <option value="ARTICLE">Article</option>
          <option value="GUIDE">Guide</option>
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

      <Pagination
        basePath="/admin/articles"
        page={page}
        totalPages={totalPages}
        params={{ search, status, contentType }}
      />
    </div>
  );
}
