"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const finishTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const start = React.useCallback(() => {
    if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    setVisible(true);
    setIsLoading(true);
    setProgress(15);

    timerRef.current = setTimeout(() => {
      setProgress(50);
      timerRef.current = setTimeout(() => {
        setProgress(75);
        timerRef.current = setTimeout(() => {
          setProgress(88);
        }, 800);
      }, 400);
    }, 150);
  }, []);

  const finish = React.useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setProgress(100);
    setIsLoading(false);

    finishTimerRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 250);
  }, []);

  // Listen to path or search changes
  React.useEffect(() => {
    finish();
  }, [pathname, searchParams, finish]);

  // Intercept click on internal links
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      const targetAttr = target.getAttribute("target");

      // Don't intercept external links, hashes, new tabs, or downloads
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        targetAttr === "_blank" ||
        target.hasAttribute("download") ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // Check if it's an internal link
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;

        // Don't trigger if it's the exact same page and hash
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search
        ) {
          return;
        }

        start();
      } catch {
        // Ignore invalid URLs
      }
    }

    function handlePopState() {
      start();
    }

    window.addEventListener("click", handleClick, { capture: true });
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("click", handleClick, { capture: true });
      window.removeEventListener("popstate", handlePopState);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current);
    };
  }, [start]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Page loading"
      className="pointer-events-none fixed inset-x-0 top-0 z-[99999] h-[3px] overflow-hidden"
    >
      <div
        className="bg-primary h-full shadow-[0_0_10px_var(--primary)] transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          opacity: isLoading ? 1 : 0,
        }}
      />
    </div>
  );
}
