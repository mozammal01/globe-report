import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function ArticleLoading() {
  return (
    <>
      <Skeleton className="aspect-21/9 w-full rounded-none" />
      <Section spacing="sm">
        <Container size="narrow">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-5 w-64" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </Container>
      </Section>
    </>
  );
}
