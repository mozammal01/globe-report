"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";

export default function AdminError({
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
      <ErrorState
        title="Failed to load the dashboard"
        description="Something went wrong while loading this page."
        onRetry={reset}
        className="w-full max-w-md"
      />
      <Button asChild variant="link" size="sm">
        <Link href="/admin/login">Return to login</Link>
      </Button>
    </div>
  );
}
