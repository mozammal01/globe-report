import { ArticleCardSkeleton } from "@/components/home/article-card-skeleton";
import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export function ArticleSectionSkeleton({
  cols = 3,
  count = 3,
}: {
  cols?: 2 | 3 | 4;
  count?: number;
}) {
  return (
    <Section spacing="sm" className="border-border border-t">
      <Container>
        <Skeleton className="mb-6 h-7 w-40" />
        <Grid cols={cols}>
          {Array.from({ length: count }).map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </Grid>
      </Container>
    </Section>
  );
}
