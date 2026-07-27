"use client";

import { CheckCircle2, Mail } from "lucide-react";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { H2, Muted } from "@/components/ui/typography";
import {
  subscribeToNewsletter,
  type NewsletterFormState,
} from "@/lib/actions/newsletter";

const initialState: NewsletterFormState = { status: "idle" };

export function NewsletterSection() {
  const [state, formAction, isPending] = useActionState(
    subscribeToNewsletter,
    initialState,
  );

  return (
    <Section spacing="sm" className="border-border border-t">
      <Container size="narrow">
        <div className="border-border bg-card flex flex-col items-center gap-4 rounded-xl border px-6 py-10 text-center">
          <Mail className="text-primary size-8" aria-hidden />
          <H2 className="text-2xl">Stay Informed</H2>
          <Muted className="max-w-md">
            Get the day&apos;s most important stories delivered straight to your
            inbox.
          </Muted>

          {state.status === "success" ? (
            <p className="text-primary flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="size-4" aria-hidden />
              {state.message}
            </p>
          ) : (
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
          )}

          {state.status === "error" && (
            <p className="text-destructive text-sm">{state.message}</p>
          )}
        </div>
      </Container>
    </Section>
  );
}
