import * as React from "react";
import { Globe2 } from "lucide-react";

import { cn } from "@/lib/utils";

export type BrandLoaderProps = {
  text?: string;
  size?: "sm" | "default" | "lg" | "fullscreen";
  className?: string;
};

export function BrandLoader({
  text = "Loading stories...",
  size = "default",
  className,
}: BrandLoaderProps) {
  const isFullscreen = size === "fullscreen";

  return (
    <div
      role="status"
      aria-label={text}
      className={cn(
        "flex flex-col items-center justify-center gap-3 select-none",
        isFullscreen
          ? "bg-background/80 fixed inset-0 z-50 backdrop-blur-sm"
          : "py-12",
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Pulsing outer glow ring */}
        <div className="bg-primary/20 absolute -inset-3 animate-pulse rounded-full blur-md" />

        {/* Spinning outer dotted border */}
        <div
          className={cn(
            "border-primary/30 border-t-primary animate-spin rounded-full border-2 border-dashed",
            size === "sm" && "size-8",
            (size === "default" || isFullscreen) && "size-12",
            size === "lg" && "size-16",
          )}
          style={{ animationDuration: "3s" }}
        />

        {/* Center Brand Icon */}
        <div className="text-primary absolute flex items-center justify-center">
          <Globe2
            className={cn(
              "animate-pulse",
              size === "sm" && "size-4",
              (size === "default" || isFullscreen) && "size-6",
              size === "lg" && "size-8",
            )}
            aria-hidden="true"
          />
        </div>
      </div>

      {text && (
        <p className="text-muted-foreground animate-pulse text-xs font-medium tracking-wide">
          {text}
        </p>
      )}
    </div>
  );
}
