import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function CountryLoading() {
  return (
    <>
      <Skeleton className="aspect-21/9 w-full rounded-none" />
      <Section spacing="sm">
        <Container size="narrow">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-10 w-72 max-w-full" />
            <Skeleton className="h-5 w-56" />
            <Skeleton className="mt-4 h-40 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </Container>
      </Section>
    </>
  );
}
