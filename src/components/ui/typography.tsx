import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function H1({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl",
        className,
      )}
      {...props}
    />
  );
}

export function H2({ className, ...props }: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "font-heading text-3xl font-semibold tracking-tight text-balance",
        className,
      )}
      {...props}
    />
  );
}

export function H3({ className, ...props }: ComponentProps<"h3">) {
  return (
    <h3
      className={cn(
        "font-heading text-2xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export function H4({ className, ...props }: ComponentProps<"h4">) {
  return (
    <h4
      className={cn(
        "font-heading text-xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export function P({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-foreground text-base leading-7", className)}
      {...props}
    />
  );
}

export function Lead({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground text-xl text-balance", className)}
      {...props}
    />
  );
}

export function Large({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("text-lg font-semibold", className)} {...props} />;
}

export function Small({ className, ...props }: ComponentProps<"small">) {
  return (
    <small
      className={cn("text-sm leading-none font-medium", className)}
      {...props}
    />
  );
}

export function Muted({ className, ...props }: ComponentProps<"p">) {
  return (
    <p className={cn("text-muted-foreground text-sm", className)} {...props} />
  );
}
