"use client";

import { CheckCircle2 } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  subscribeToNewsletter,
  type NewsletterFormState,
} from "@/lib/actions/newsletter";

const initialState: NewsletterFormState = { status: "idle" };

export function NewsletterForm({ className }: { className?: string }) {
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletter,
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
    <div className={className}>
      <form
        action={formAction}
        className="flex w-full max-w-sm flex-col gap-2 sm:flex-row"
      >
        <Input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          aria-label="Email address"
          className="flex-1"
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>

      {state.status === "error" && (
        <p className={cn("text-destructive mt-2 text-sm")}>{state.message}</p>
      )}
    </div>
  );
}
