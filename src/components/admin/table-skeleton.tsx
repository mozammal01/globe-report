import { Skeleton } from "@/components/ui/skeleton";

export function AdminTableSkeleton({
  rows = 8,
  filters = 0,
  withCreateButton = true,
}: {
  rows?: number;
  filters?: number;
  withCreateButton?: boolean;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-40" />
        {withCreateButton && <Skeleton className="h-9 w-32" />}
      </div>

      {filters > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          {Array.from({ length: filters }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-40" />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} className="h-12 w-full" />
        ))}
      </div>
    </div>
  );
}
