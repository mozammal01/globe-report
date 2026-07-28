import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Pagination({
  basePath,
  page,
  totalPages,
  params = {},
}: {
  basePath: string;
  page: number;
  totalPages: number;
  params?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) {
    return null;
  }

  function hrefFor(target: number) {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value) search.set(key, value);
    }
    if (target > 1) search.set("page", String(target));
    const qs = search.toString();
    return `${basePath}${qs ? `?${qs}` : ""}`;
  }

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <nav
      className="flex items-center justify-center gap-3"
      aria-label="Pagination"
    >
      {hasPrev ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={hrefFor(page - 1)}>Prev</Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Prev
        </Button>
      )}

      <span className="text-muted-foreground text-sm">
        Page {page} of {totalPages}
      </span>

      {hasNext ? (
        <Button variant="outline" size="sm" asChild>
          <Link href={hrefFor(page + 1)}>Next</Link>
        </Button>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      )}
    </nav>
  );
}
