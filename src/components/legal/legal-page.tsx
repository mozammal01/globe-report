import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { H1, Lead } from "@/components/ui/typography";
import { PROSE_CLASSNAME } from "@/lib/prose";
import { cn } from "@/lib/utils";

export function LegalPage({
  title,
  description,
  updatedAt,
  children,
}: {
  title: string;
  description?: string;
  updatedAt?: string;
  children: ReactNode;
}) {
  return (
    <Section spacing="sm">
      <Container size="narrow">
        <div className="flex flex-col gap-2">
          <H1>{title}</H1>
          {description && <Lead>{description}</Lead>}
          {updatedAt && (
            <p className="text-muted-foreground text-xs">
              Last updated: {updatedAt}
            </p>
          )}
        </div>

        <div className={cn("mt-8 max-w-none", PROSE_CLASSNAME)}>{children}</div>
      </Container>
    </Section>
  );
}
