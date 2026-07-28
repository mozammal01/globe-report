"use client";

import { CheckCircle2 } from "lucide-react";
import { useActionState } from "react";

import { FormField } from "@/components/admin/form-field";
import { SubmitButton } from "@/components/admin/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  submitContactMessage,
  type ContactFormState,
} from "@/lib/actions/contact";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm() {
  const [state, formAction] = useActionState(
    submitContactMessage,
    initialState,
  );

  if (state.status === "success") {
    return (
      <p className="text-primary flex items-center gap-2 text-sm font-medium">
        <CheckCircle2 className="size-4" aria-hidden />
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <FormField label="Name" name="name" error={state.fieldErrors?.name}>
        <Input id="name" name="name" required />
      </FormField>

      <FormField label="Email" name="email" error={state.fieldErrors?.email}>
        <Input id="email" name="email" type="email" required />
      </FormField>

      <FormField
        label="Subject"
        name="subject"
        error={state.fieldErrors?.subject}
      >
        <Input id="subject" name="subject" required />
      </FormField>

      <FormField
        label="Message"
        name="message"
        error={state.fieldErrors?.message}
      >
        <Textarea id="message" name="message" rows={6} required />
      </FormField>

      {state.status === "error" && !state.fieldErrors && (
        <p className="text-destructive text-sm">{state.message}</p>
      )}

      <div className="flex justify-end">
        <SubmitButton>Send message</SubmitButton>
      </div>
    </form>
  );
}
