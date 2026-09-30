import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function SiteLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="bg-muted/40 relative flex min-h-[50vh] items-end overflow-hidden sm:min-h-[460px]">
        <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
        <Container className="relative py-10 sm:py-14">
          <div className="flex max-w-2xl flex-col gap-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-12 w-full max-w-xl rounded-lg" />
            <Skeleton className="h-4 w-full max-w-md rounded-md" />
            <Skeleton className="h-4 w-3/4 max-w-sm rounded-md" />
          </div>
        </Container>
      </div>

      <Section spacing="sm">
        <Container>
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-5 rounded-md" />
              <Skeleton className="h-8 w-44 rounded-md" />
            </div>
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>

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
    </>
  );
}
