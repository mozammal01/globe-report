"use client";

import { Bookmark } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { toggleBookmark } from "@/lib/actions/bookmarks";
import { cn } from "@/lib/utils";

export function BookmarkButton({ articleId }: { articleId: string }) {
  const router = useRouter();
  const [bookmarked, setBookmarked] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/bookmarks/${articleId}`)
      .then(
        (res) =>
          res.json() as Promise<{ signedIn: boolean; bookmarked: boolean }>,
      )
      .then((data) => {
        if (cancelled) return;
        setSignedIn(data.signedIn);
        setBookmarked(data.bookmarked);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  function handleClick() {
    if (!signedIn) {
      router.push("/login");
      return;
    }

    startTransition(async () => {
      const result = await toggleBookmark(articleId);
      if ("bookmarked" in result) {
        setBookmarked(result.bookmarked);
      }
    });
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={bookmarked}
    >
      <Bookmark
        className={cn("size-4", bookmarked && "fill-current")}
        aria-hidden="true"
      />
      {bookmarked ? "Bookmarked" : "Bookmark"}
    </Button>
  );
}
