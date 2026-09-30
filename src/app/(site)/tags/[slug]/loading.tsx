import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function TagDetailLoading() {
  return (
    <Section spacing="default">
      <Container>
        {/* Tag Header Skeleton */}
        <div className="mb-10 flex flex-col gap-3">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-10 w-64 max-w-full rounded-lg" />
          <Skeleton className="h-5 w-80 max-w-full rounded-md" />
        </div>

        {/* Article Cards Grid Skeleton */}
        <Grid cols={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="border-border/60 flex flex-col overflow-hidden rounded-xl border"
            >
              <Skeleton className="aspect-16/9 w-full rounded-none" />
              <div className="flex flex-col gap-3 p-4">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
                <div className="mt-2 flex items-center gap-2">
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="h-3 w-24 rounded-md" />
                </div>
              </div>
            </div>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
