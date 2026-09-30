"use client";

import * as React from "react";
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SpoilerBoxProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function SpoilerBox({
  title = "Major Spoilers Ahead!",
  subtitle = "The following section explains the ending, climactic plot twists, and secret revelations.",
  children,
  defaultOpen = false,
  className,
}: SpoilerBoxProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div
      className={cn(
        "border-border/80 bg-muted/20 my-6 overflow-hidden rounded-xl border transition-all",
        isOpen
          ? "border-amber-500/40 bg-amber-500/5 dark:bg-amber-500/10"
          : "hover:border-border",
        className,
      )}
    >
      {/* Spoiler Header */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500 dark:bg-amber-500/20">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-foreground text-base font-bold tracking-tight sm:text-lg">
              {title}
            </h3>
            <p className="text-muted-foreground mt-0.5 text-xs sm:text-sm">
              {subtitle}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant={isOpen ? "outline" : "default"}
          size="sm"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "shrink-0 self-start font-medium transition-all sm:self-center",
            !isOpen && "bg-amber-600 text-white shadow-xs hover:bg-amber-700",
          )}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <>
              <EyeOff className="size-3.5" aria-hidden="true" />
              <span>Hide Spoilers</span>
              <ChevronUp className="size-3.5" aria-hidden="true" />
            </>
          ) : (
            <>
              <Eye className="size-3.5" aria-hidden="true" />
              <span>Reveal Ending</span>
              <ChevronDown className="size-3.5" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="border-border/60 animate-in fade-in-50 border-t p-4 pt-5 duration-200 sm:p-6">
          <div className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed sm:text-base">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
