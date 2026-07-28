"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";

export default function SiteError({
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
    <Container
      size="narrow"
      className="flex min-h-[70vh] items-center justify-center"
    >
      <EmptyState
        icon={AlertTriangle}
        title="Something went wrong"
        description="An unexpected error occurred while loading this page. Please try again."
        action={
          <Button variant="outline" size="sm" onClick={reset}>
            Try again
          </Button>
        }
        className="w-full"
      />
    </Container>
  );
}
