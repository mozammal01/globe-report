"use client";

import * as React from "react";
import { X } from "lucide-react";

import { AdSlot } from "@/components/ads/ad-slot";
import { cn } from "@/lib/utils";

export function StickyMobileAd({ className }: { className?: string }) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div
      className={cn(
        "bg-background/95 border-border animate-in slide-in-from-bottom fixed inset-x-0 bottom-0 z-40 border-t py-1.5 shadow-lg backdrop-blur-md duration-300 sm:hidden",
        className,
      )}
    >
      <div className="relative mx-auto flex w-full max-w-sm items-center justify-center px-2">
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="text-muted-foreground hover:text-foreground bg-muted/60 border-border absolute -top-3 right-2 flex size-5 items-center justify-center rounded-full border text-xs transition-colors"
          aria-label="Close advertisement"
        >
          <X className="size-3" aria-hidden="true" />
        </button>

        <AdSlot
          variant="mobile-anchor"
          className="bg-muted/20 border-none text-[10px]"
        />
      </div>
    </div>
  );
}
