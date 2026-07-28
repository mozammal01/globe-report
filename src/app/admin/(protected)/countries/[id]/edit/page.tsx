import { notFound } from "next/navigation";

import { CountryForm } from "@/components/admin/country-form";
import { H1 } from "@/components/ui/typography";
import { getCountryForAdmin } from "@/lib/queries/admin/countries";

export default async function EditCountryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const country = await getCountryForAdmin(id);

  if (!country) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <H1>Edit Country</H1>
      <CountryForm country={country} />
    </div>
  );
}
