import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function SiteLoading() {
  return (
    <Section spacing="sm">
      <Container size="narrow">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-9 w-64 max-w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Container>
    </Section>
  );
}
