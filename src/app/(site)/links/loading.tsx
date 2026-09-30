import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function LinksLoading() {
  return (
    <Section spacing="sm" className="min-h-screen">
      <Container size="narrow" className="max-w-xl">
        <div className="flex flex-col gap-6">
          {/* Header Profile Skeleton */}
          <div className="flex flex-col items-center gap-3 text-center">
            <Skeleton className="size-16 rounded-2xl" />
            <Skeleton className="h-7 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-md" />

            {/* Social Buttons Skeleton */}
            <div className="mt-2 flex gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>

          {/* Ad Slot Skeleton */}
          <Skeleton className="h-32 w-full rounded-xl" />

          {/* Search Bar Skeleton */}
          <Skeleton className="h-11 w-full rounded-xl" />

          {/* Feed Cards Skeleton */}
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="border-border/60 flex items-center gap-3.5 rounded-xl border p-2.5 sm:p-3"
              >
                <Skeleton className="aspect-video w-24 shrink-0 rounded-lg sm:w-32" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-3.5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-3 w-28 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
