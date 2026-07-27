import { Compass } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container
      size="narrow"
      className="flex min-h-[70vh] items-center justify-center"
    >
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you're looking for doesn't exist or may have been moved."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href="/">Go home</Link>
          </Button>
        }
        className="w-full"
      />
    </Container>
  );
}
