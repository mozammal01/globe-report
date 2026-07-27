import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ElementType } from "react";

import { cn } from "@/lib/utils";

const sectionVariants = cva("w-full", {
  variants: {
    spacing: {
      none: "",
      sm: "py-8 sm:py-10",
      default: "py-12 sm:py-16 lg:py-20",
      lg: "py-16 sm:py-24 lg:py-32",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
});

export function Section({
  as: Tag = "section",
  className,
  spacing,
  ...props
}: ComponentProps<"section"> &
  VariantProps<typeof sectionVariants> & { as?: ElementType }) {
  return (
    <Tag className={cn(sectionVariants({ spacing }), className)} {...props} />
  );
}
