// Reserved ad space only — no ad network script is loaded. To integrate
// AdSense later: drop the AdSense loader script in `src/app/layout.tsx` and
// render an `<ins class="adsbygoogle">` inside the div below, targeted by
// `data-ad-slot`. The fixed min-height per variant must stay so a filled
// slot never shifts surrounding layout (CLS).
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const adSlotVariants = cva(
  "border-border bg-muted/30 text-muted-foreground flex w-full items-center justify-center rounded-lg border border-dashed text-xs tracking-wide uppercase",
  {
    variants: {
      variant: {
        leaderboard: "min-h-22.5 sm:min-h-32",
        "in-article": "min-h-62.5",
        "in-feed": "min-h-50",
        sidebar: "min-h-75 w-full sm:max-w-75",
      },
    },
    defaultVariants: {
      variant: "in-article",
    },
  },
);

export function AdSlot({
  variant,
  className,
}: {
  variant?: VariantProps<typeof adSlotVariants>["variant"];
  className?: string;
}) {
  return (
    <div
      role="complementary"
      aria-label="Advertisement"
      data-ad-slot={variant ?? "in-article"}
      className={cn(adSlotVariants({ variant }), className)}
    >
      Advertisement
    </div>
  );
}
