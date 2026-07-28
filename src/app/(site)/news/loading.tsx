import { ArticleCardSkeleton } from "@/components/home/article-card-skeleton";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsLoading() {
  return (
    <Section spacing="sm">
      <Container>
        <div className="mb-6 flex flex-col gap-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>

        <div className="flex gap-3">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>

        <Grid cols={3} className="mt-8">
          {Array.from({ length: 12 }).map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
