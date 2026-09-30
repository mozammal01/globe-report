"use client";

import { MessageSquare, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";

import { CommentForm } from "@/components/article/comment-form";
import { Button } from "@/components/ui/button";
import { deleteComment } from "@/lib/actions/comments";
import { formatDate } from "@/lib/format";
import type { CommentItemData } from "@/lib/queries/comments";

type CommentItemProps = {
  comment: CommentItemData;
  articleId: string;
  currentUserId?: string;
  isAdmin?: boolean;
};

export function CommentItem({
  comment,
  articleId,
  currentUserId,
  isAdmin,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isPending, startTransition] = useTransition();

  const canDelete =
    Boolean(currentUserId && currentUserId === comment.user.id) ||
    Boolean(isAdmin);

  function handleDelete(commentId: string) {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    startTransition(async () => {
      await deleteComment(commentId);
    });
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="group/comment flex flex-col gap-3">
      <div className="flex items-start gap-3">
        {comment.user.avatarUrl ? (
          <Image
            src={comment.user.avatarUrl}
            alt={comment.user.name}
            width={36}
            height={36}
            className="ring-border rounded-full object-cover ring-1"
          />
        ) : (
          <div className="bg-primary/10 text-primary ring-border flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-medium ring-1">
            {getInitials(comment.user.name)}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-sm font-semibold">
                {comment.user.name}
              </span>
              <span className="text-muted-foreground text-xs">&middot;</span>
              <time className="text-muted-foreground text-xs">
                {formatDate(comment.createdAt)}
              </time>
            </div>

            {canDelete && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive size-7 p-0 opacity-0 transition-opacity group-hover/comment:opacity-100"
                onClick={() => handleDelete(comment.id)}
                disabled={isPending}
                title="Delete comment"
              >
                <Trash2 className="size-3.5" />
              </Button>
            )}
          </div>

          <p className="text-foreground/90 mt-1.5 text-sm leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>

          <div className="mt-2 flex items-center gap-3">
            {currentUserId && (
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-7 gap-1 px-2 text-xs"
                onClick={() => setIsReplying((prev) => !prev)}
              >
                <MessageSquare className="size-3" />
                Reply
              </Button>
            )}
          </div>

          {isReplying && (
            <div className="border-primary/30 mt-3 border-l-2 pl-2">
              <CommentForm
                articleId={articleId}
                parentId={comment.id}
                placeholder={`Replying to ${comment.user.name}...`}
                onSuccess={() => setIsReplying(false)}
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="border-border/80 ml-5 flex flex-col gap-4 border-l pt-2 pl-4 sm:ml-9">
          {comment.replies.map((reply) => {
            const canDeleteReply =
              Boolean(currentUserId && currentUserId === reply.user.id) ||
              Boolean(isAdmin);

            return (
              <div
                key={reply.id}
                className="group/reply flex items-start gap-3"
              >
                {reply.user.avatarUrl ? (
                  <Image
                    src={reply.user.avatarUrl}
                    alt={reply.user.name}
                    width={28}
                    height={28}
                    className="ring-border rounded-full object-cover ring-1"
                  />
                ) : (
                  <div className="bg-secondary text-secondary-foreground ring-border flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium ring-1">
                    {getInitials(reply.user.name)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-xs font-medium">
                        {reply.user.name}
                      </span>
                      <span className="text-muted-foreground text-[10px]">
                        &middot;
                      </span>
                      <time className="text-muted-foreground text-[10px]">
                        {formatDate(reply.createdAt)}
                      </time>
                    </div>

                    {canDeleteReply && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive size-6 p-0 opacity-0 transition-opacity group-hover/reply:opacity-100"
                        onClick={() => handleDelete(reply.id)}
                        disabled={isPending}
                        title="Delete reply"
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    )}
                  </div>

                  <p className="text-foreground/90 mt-1 text-xs leading-relaxed whitespace-pre-wrap">
                    {reply.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
