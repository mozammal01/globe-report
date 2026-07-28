import Link from "next/link";

import { AdminPagination } from "@/components/admin/admin-pagination";
import { CountriesTable } from "@/components/admin/countries-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { H1 } from "@/components/ui/typography";
import { getCountriesAdmin } from "@/lib/queries/admin/countries";

export default async function AdminCountriesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const { search, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { countries, total, pageSize } = await getCountriesAdmin({
    search,
    page,
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <H1>Countries</H1>
        <Button asChild>
          <Link href="/admin/countries/new">New Country</Link>
        </Button>
      </div>

      <form className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          name="search"
          placeholder="Search name, ISO2, or ISO3..."
          defaultValue={search}
          className="max-w-xs"
        />
        <Button type="submit" variant="outline" size="sm">
          Search
        </Button>
      </form>

      {countries.length > 0 ? (
        <CountriesTable countries={countries} />
      ) : (
        <EmptyState title="No countries found." />
      )}

      <AdminPagination
        basePath="/admin/countries"
        page={page}
        totalPages={totalPages}
        params={{ search }}
      />
    </div>
  );
}
