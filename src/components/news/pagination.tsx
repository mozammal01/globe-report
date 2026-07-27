import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Pagination({
  page,
  totalPages,
  category,
  country,
  tag,
}: {
  page: number;
  totalPages: number;
  category?: string;
  country?: string;
  tag?: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  function hrefFor(target: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (country) params.set("country", country);
    if (tag) params.set("tag", tag);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return `/news${qs ? `?${qs}` : ""}`;
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
