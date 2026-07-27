"use client";

import { useEffect, useRef } from "react";

import { incrementArticleView } from "@/lib/actions/article-views";

export function ViewTracker({ articleId }: { articleId: string }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    void incrementArticleView(articleId);
  }, [articleId]);

  return null;
}
