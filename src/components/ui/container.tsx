import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ElementType } from "react";

import { cn } from "@/lib/utils";

const containerVariants = cva("mx-auto w-full px-4 sm:px-6 lg:px-8", {
  variants: {
    size: {
      narrow: "max-w-3xl",
      default: "max-w-6xl",
      wide: "max-w-7xl",
      full: "max-w-none",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export function Container({
  as: Tag = "div",
  className,
  size,
  ...props
}: ComponentProps<"div"> &
  VariantProps<typeof containerVariants> & { as?: ElementType }) {
  return (
    <Tag className={cn(containerVariants({ size }), className)} {...props} />
  );
}
