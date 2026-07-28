import { Container } from "@/components/ui/container";
import { Grid } from "@/components/ui/grid";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function CountriesLoading() {
  return (
    <Section spacing="sm">
      <Container>
        <div className="mb-10 flex flex-col gap-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>

        <div className="flex flex-col gap-12">
          {Array.from({ length: 2 }).map((_, section) => (
            <div key={section} className="flex flex-col gap-4">
              <Skeleton className="h-6 w-32" />
              <Grid cols={4}>
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton key={index} className="h-24 w-full" />
                ))}
              </Grid>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
