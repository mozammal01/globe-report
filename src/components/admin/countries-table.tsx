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
import { deleteCountry } from "@/lib/actions/admin/countries";
import type { AdminCountriesResult } from "@/lib/queries/admin/countries";

export function CountriesTable({
  countries,
}: {
  countries: AdminCountriesResult["countries"];
}) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Country</TableHead>
          <TableHead>ISO2</TableHead>
          <TableHead>Region</TableHead>
          <TableHead>Articles</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {countries.map((country) => (
          <TableRow key={country.id}>
            <TableCell className="font-medium">
              <span aria-hidden>{country.flagEmoji}</span> {country.name}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {country.iso2}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {country.region ?? "—"}
            </TableCell>
            <TableCell>{country._count.articles}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/countries/${country.id}/edit`}>Edit</Link>
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
                  title="Delete country?"
                  description={
                    country._count.articles > 0
                      ? `${country._count.articles} article(s) reference "${country.name}" and will be unlinked.`
                      : `This will permanently delete "${country.name}".`
                  }
                  onConfirm={async () => {
                    const result = await deleteCountry(country.id);
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
