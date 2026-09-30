"use client";

import { Send } from "lucide-react";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createComment } from "@/lib/actions/comments";

type CommentFormProps = {
  articleId: string;
  parentId?: string | null;
  placeholder?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function CommentForm({
  articleId,
  parentId,
  placeholder = "Write a thoughtful comment...",
  onSuccess,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;

    setError(null);
    startTransition(async () => {
      const res = await createComment({
        articleId,
        content,
        parentId,
      });

      if ("error" in res && res.error) {
        setError(res.error);
      } else {
        setContent("");
        onSuccess?.();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        disabled={isPending}
        className="border-border/80 bg-background/50 focus-visible:ring-primary/20 min-h-[90px] resize-y rounded-xl text-sm"
        rows={3}
      />

      {error && <p className="text-destructive text-xs">{error}</p>}

      <div className="flex items-center justify-between gap-2">
        <p className="text-muted-foreground text-xs">
          Markdown formatting supported
        </p>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            disabled={isPending || !content.trim()}
            className="gap-1.5"
          >
            {isPending ? (
              "Posting..."
            ) : (
              <>
                <Send className="size-3.5" />
                <span>{parentId ? "Reply" : "Post Comment"}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
