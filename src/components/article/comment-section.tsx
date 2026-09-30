import { MessageSquare, LogIn } from "lucide-react";
import Link from "next/link";

import { CommentForm } from "@/components/article/comment-form";
import { CommentItem } from "@/components/article/comment-item";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { getArticleComments } from "@/lib/queries/comments";

type CommentSectionProps = {
  articleId: string;
};

export async function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, user] = await Promise.all([
    getArticleComments(articleId),
    getCurrentUser(),
  ]);

  const isAdmin = user ? ["ADMIN", "EDITOR"].includes(user.role.key) : false;
  const totalComments = comments.reduce(
    (acc, curr) => acc + 1 + (curr.replies?.length || 0),
    0,
  );

  return (
    <section className="border-border mt-8 border-t pt-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="text-primary size-5" />
          <h3 className="font-heading text-xl font-bold tracking-tight">
            Discussion ({totalComments})
          </h3>
        </div>
      </div>

      {/* Comment Form or Auth Prompt */}
      <div className="mb-8">
        {user ? (
          <div className="border-border/80 bg-card rounded-2xl border p-4 shadow-sm sm:p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-medium">
                Commenting as{" "}
                <strong className="text-foreground">{user.name}</strong>
              </span>
            </div>
            <CommentForm articleId={articleId} />
          </div>
        ) : (
          <div className="border-border bg-muted/30 flex flex-col items-center justify-between gap-4 rounded-2xl border border-dashed p-5 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-foreground text-sm font-medium">
                Join the conversation
              </p>
              <p className="text-muted-foreground mt-0.5 text-xs">
                Sign in to share your thoughts, insights, or ask questions.
              </p>
            </div>
            <Button
              asChild
              size="sm"
              variant="default"
              className="shrink-0 gap-2"
            >
              <Link href="/login">
                <LogIn className="size-3.5" />
                Sign In to Comment
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div className="flex flex-col gap-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="border-border/40 bg-card/50 hover:border-border/80 rounded-xl border p-4 transition-colors"
            >
              <CommentItem
                comment={comment}
                articleId={articleId}
                currentUserId={user?.id}
                isAdmin={isAdmin}
              />
            </div>
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-sm">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
