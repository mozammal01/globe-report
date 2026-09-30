import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthorDetailLoading() {
  return (
    <Section spacing="default">
      <Container>
        {/* Author Bio Header Skeleton */}
        <div className="border-border/80 bg-card/60 mb-10 flex flex-col items-center gap-4 rounded-2xl border p-8 text-center sm:flex-row sm:text-left">
          <Skeleton className="size-24 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-8 w-56 rounded-lg" />
            <Skeleton className="h-4 w-full max-w-md rounded-md" />
            <Skeleton className="h-4 w-3/4 max-w-xs rounded-md" />
          </div>
        </div>

        {/* Author Articles Grid Skeleton */}
        <Grid cols={3}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-border/60 flex flex-col overflow-hidden rounded-xl border"
            >
              <Skeleton className="aspect-16/9 w-full rounded-none" />
              <div className="flex flex-col gap-3 p-4">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-6 w-full rounded-md" />
                <Skeleton className="h-4 w-3/4 rounded-md" />
              </div>
            </div>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
