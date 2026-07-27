import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    },
    gap: {
      sm: "gap-4",
      default: "gap-6",
      lg: "gap-8",
    },
  },
  defaultVariants: {
    cols: 3,
    gap: "default",
  },
});

export function Grid({
  className,
  cols,
  gap,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof gridVariants>) {
  return (
    <div className={cn(gridVariants({ cols, gap }), className)} {...props} />
  );
}
