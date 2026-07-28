"use client";

import { useActionState, useState } from "react";

import { FormField } from "@/components/admin/form-field";
import {
  MediaUploader,
  type MediaValue,
} from "@/components/admin/media-uploader";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile, uploadAvatar } from "@/lib/actions/account";
import { IDLE_STATE } from "@/lib/actions/admin/types";

export function ProfileForm({
  user,
}: {
  user: { name: string; bio: string | null; avatarUrl: string | null };
}) {
  const [state, formAction] = useActionState(updateProfile, IDLE_STATE);
  const [avatar, setAvatar] = useState<MediaValue | null>(
    user.avatarUrl ? { id: "current", url: user.avatarUrl } : null,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <MediaUploader
        label="Avatar"
        value={avatar}
        onChange={setAvatar}
        action={uploadAvatar}
      />
      <input type="hidden" name="avatarUrl" value={avatar?.url ?? ""} />

      <FormField label="Name" name="name" error={state.fieldErrors?.name}>
        <Input id="name" name="name" defaultValue={user.name} required />
      </FormField>

      <FormField label="Bio" name="bio" error={state.fieldErrors?.bio}>
        <Textarea id="bio" name="bio" rows={4} defaultValue={user.bio ?? ""} />
      </FormField>

      {state.status === "success" && (
        <p className="text-primary text-sm">{state.message}</p>
      )}
      {state.status === "error" && !state.fieldErrors && (
        <p className="text-destructive text-sm">{state.message}</p>
      )}

      <div className="flex justify-end">
        <SubmitButton>Save changes</SubmitButton>
      </div>
    </form>
  );
}
