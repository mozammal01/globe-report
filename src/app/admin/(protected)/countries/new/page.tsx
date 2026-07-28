import { CountryForm } from "@/components/admin/country-form";
import { H1 } from "@/components/ui/typography";

export default function NewCountryPage() {
  return (
    <div className="flex flex-col gap-6">
      <H1>New Country</H1>
      <CountryForm />
    </div>
  );
}
