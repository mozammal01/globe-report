import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin text-muted-foreground", {
  variants: {
    size: {
      sm: "size-4",
      default: "size-6",
      lg: "size-8",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export function Spinner({
  className,
  size,
  ...props
}: ComponentProps<"svg"> & VariantProps<typeof spinnerVariants>) {
  return (
    <Loader2
      role="status"
      aria-label="Loading"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}

export function LoadingOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex flex-1 items-center justify-center py-24", className)}
    >
      <Spinner size="lg" />
    </div>
  );
}
