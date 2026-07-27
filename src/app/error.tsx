"use client";

import { useEffect } from "react";

import { Container } from "@/components/ui/container";
import { ErrorState } from "@/components/ui/error-state";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container size="narrow" className="flex min-h-[60vh] items-center">
      <ErrorState
        title="Something went wrong"
        description="An unexpected error occurred. Please try again."
        onRetry={reset}
        className="w-full"
      />
    </Container>
  );
}
