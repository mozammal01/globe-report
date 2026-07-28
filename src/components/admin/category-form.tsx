"use client";

import { useActionState } from "react";

import { FormField } from "@/components/admin/form-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";
import { createCategory, updateCategory } from "@/lib/actions/admin/categories";
import { IDLE_STATE } from "@/lib/actions/admin/types";
import type { CategoryDetail, CategoryOption } from "@/lib/queries/categories";

export function CategoryForm({
  category,
  categories,
}: {
  category?: CategoryDetail;
  categories: CategoryOption[];
}) {
  const action = category
    ? updateCategory.bind(null, category.id)
    : createCategory;
  const [state, formAction] = useActionState(action, IDLE_STATE);

  const parentOptions = categories.filter((c) => c.id !== category?.id);

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <FormField label="Name" name="name" error={state.fieldErrors?.name}>
        <Input id="name" name="name" defaultValue={category?.name} required />
      </FormField>

      <FormField label="Slug" name="slug" error={state.fieldErrors?.slug}>
        <Input id="slug" name="slug" defaultValue={category?.slug} required />
      </FormField>

      <FormField
        label="Description"
        name="description"
        error={state.fieldErrors?.description}
      >
        <Textarea
          id="description"
          name="description"
          defaultValue={category?.description ?? ""}
          rows={3}
        />
      </FormField>

      <FormField
        label="Parent category"
        name="parentId"
        error={state.fieldErrors?.parentId}
      >
        <NativeSelect
          id="parentId"
          name="parentId"
          defaultValue={category?.parentId ?? ""}
        >
          <option value="">No parent</option>
          {parentOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </NativeSelect>
      </FormField>

      {state.status === "error" && !state.fieldErrors && (
        <p className="text-destructive text-sm">{state.message}</p>
      )}

      <div className="flex justify-end">
        <SubmitButton>
          {category ? "Save changes" : "Create category"}
        </SubmitButton>
      </div>
    </form>
  );
}
