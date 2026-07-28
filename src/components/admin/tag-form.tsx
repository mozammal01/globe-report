"use client";

import { useActionState, useEffect } from "react";

import { FormField } from "@/components/admin/form-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { createTag, updateTag } from "@/lib/actions/admin/tags";
import { IDLE_STATE } from "@/lib/actions/admin/types";

export function TagForm({
  tag,
  onSuccess,
}: {
  tag?: { id: string; name: string; slug: string };
  onSuccess: () => void;
}) {
  const action = tag ? updateTag.bind(null, tag.id) : createTag;
  const [state, formAction] = useActionState(action, IDLE_STATE);

  useEffect(() => {
    if (state.status === "success") onSuccess();
  }, [state.status, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormField label="Name" name="name" error={state.fieldErrors?.name}>
        <Input id="name" name="name" defaultValue={tag?.name} required />
      </FormField>

      <FormField label="Slug" name="slug" error={state.fieldErrors?.slug}>
        <Input id="slug" name="slug" defaultValue={tag?.slug} required />
      </FormField>

      {state.status === "error" && !state.fieldErrors && (
        <p className="text-destructive text-sm">{state.message}</p>
      )}

      <div className="flex justify-end">
        <SubmitButton>{tag ? "Save changes" : "Create tag"}</SubmitButton>
      </div>
    </form>
  );
}
