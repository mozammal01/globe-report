"use client";

import { useActionState, useState } from "react";

import { FormField } from "@/components/admin/form-field";
import {
  MediaUploader,
  type MediaValue,
} from "@/components/admin/media-uploader";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { H3 } from "@/components/ui/typography";
import { createCountry, updateCountry } from "@/lib/actions/admin/countries";
import { IDLE_STATE } from "@/lib/actions/admin/types";
import type { AdminCountry } from "@/lib/queries/admin/countries";

const REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania"] as const;

export function CountryForm({ country }: { country?: AdminCountry }) {
  const action = country ? updateCountry.bind(null, country.id) : createCountry;
  const [state, formAction] = useActionState(action, IDLE_STATE);
  const [heroImage, setHeroImage] = useState<MediaValue | null>(
    country?.heroImageUrl ? { id: "", url: country.heroImageUrl } : null,
  );

  return (
    <form action={formAction} className="flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-4">
        <H3>Basic info</H3>
        <FormField label="Name" name="name" error={state.fieldErrors?.name}>
          <Input id="name" name="name" defaultValue={country?.name} required />
        </FormField>

        <FormField label="Slug" name="slug" error={state.fieldErrors?.slug}>
          <Input id="slug" name="slug" defaultValue={country?.slug} required />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="ISO2" name="iso2" error={state.fieldErrors?.iso2}>
            <Input
              id="iso2"
              name="iso2"
              maxLength={2}
              defaultValue={country?.iso2}
              required
            />
          </FormField>
          <FormField label="ISO3" name="iso3" error={state.fieldErrors?.iso3}>
            <Input
              id="iso3"
              name="iso3"
              maxLength={3}
              defaultValue={country?.iso3}
              required
            />
          </FormField>
        </div>

        <FormField
          label="Region"
          name="region"
          error={state.fieldErrors?.region}
        >
          <NativeSelect
            id="region"
            name="region"
            defaultValue={country?.region ?? ""}
          >
            <option value="">No region</option>
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </NativeSelect>
        </FormField>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <H3>Hero image</H3>
        <MediaUploader
          label="Hero image"
          value={heroImage}
          onChange={setHeroImage}
        />
        <input type="hidden" name="heroImageUrl" value={heroImage?.url ?? ""} />
        <FormField
          label="Hero image alt text"
          name="heroImageAlt"
          error={state.fieldErrors?.heroImageAlt}
        >
          <Input
            id="heroImageAlt"
            name="heroImageAlt"
            defaultValue={country?.heroImageAlt ?? ""}
          />
        </FormField>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <H3>Facts</H3>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Population"
            name="population"
            error={state.fieldErrors?.population}
          >
            <Input
              id="population"
              name="population"
              type="number"
              min={0}
              defaultValue={country?.population ?? ""}
            />
          </FormField>
          <FormField
            label="Capital"
            name="capital"
            error={state.fieldErrors?.capital}
          >
            <Input
              id="capital"
              name="capital"
              defaultValue={country?.capital ?? ""}
            />
          </FormField>
          <FormField
            label="Currency"
            name="currency"
            error={state.fieldErrors?.currency}
          >
            <Input
              id="currency"
              name="currency"
              defaultValue={country?.currency ?? ""}
            />
          </FormField>
          <FormField
            label="Religion"
            name="religion"
            error={state.fieldErrors?.religion}
          >
            <Input
              id="religion"
              name="religion"
              defaultValue={country?.religion ?? ""}
            />
          </FormField>
        </div>

        <FormField
          label="GDP summary"
          name="gdpSummary"
          error={state.fieldErrors?.gdpSummary}
        >
          <Input
            id="gdpSummary"
            name="gdpSummary"
            defaultValue={country?.gdpSummary ?? ""}
          />
        </FormField>

        <FormField
          label="Economy"
          name="economy"
          error={state.fieldErrors?.economy}
        >
          <Textarea
            id="economy"
            name="economy"
            rows={3}
            defaultValue={country?.economy ?? ""}
          />
        </FormField>

        <FormField
          label="Travel"
          name="travel"
          error={state.fieldErrors?.travel}
        >
          <Textarea
            id="travel"
            name="travel"
            rows={3}
            defaultValue={country?.travel ?? ""}
          />
        </FormField>

        <FormField
          label="History"
          name="history"
          error={state.fieldErrors?.history}
        >
          <Textarea
            id="history"
            name="history"
            rows={3}
            defaultValue={country?.history ?? ""}
          />
        </FormField>

        <FormField
          label="Interesting facts"
          name="interestingFacts"
          hint="One fact per line."
          error={state.fieldErrors?.interestingFacts}
        >
          <Textarea
            id="interestingFacts"
            name="interestingFacts"
            rows={4}
            defaultValue={country?.interestingFacts.join("\n") ?? ""}
          />
        </FormField>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <H3>SEO</H3>
        <FormField
          label="SEO title"
          name="seoTitle"
          error={state.fieldErrors?.seoTitle}
        >
          <Input
            id="seoTitle"
            name="seoTitle"
            defaultValue={country?.seoTitle ?? ""}
          />
        </FormField>
        <FormField
          label="SEO description"
          name="seoDescription"
          error={state.fieldErrors?.seoDescription}
        >
          <Textarea
            id="seoDescription"
            name="seoDescription"
            rows={2}
            defaultValue={country?.seoDescription ?? ""}
          />
        </FormField>
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <p className="text-destructive text-sm">{state.message}</p>
      )}

      <div className="flex justify-end">
        <SubmitButton>
          {country ? "Save changes" : "Create country"}
        </SubmitButton>
      </div>
    </form>
  );
}
