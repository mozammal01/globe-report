import { ArticleCardSkeleton } from "@/components/home/article-card-skeleton";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <Section spacing="sm">
      <Container>
        <div className="mb-8 flex flex-col gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96 max-w-full" />
        </div>

        <div className="mb-10 flex flex-col gap-4">
          <Skeleton className="h-11 w-full max-w-md rounded-xl" />
          <div className="flex gap-2 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>

        <Grid cols={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <ArticleCardSkeleton key={i} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
