"use client";

import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { deleteMessage, markMessageRead } from "@/lib/actions/admin/contact";
import type { AdminContactMessage } from "@/lib/queries/admin/contact";

export function ContactInbox({
  messages,
}: {
  messages: AdminContactMessage[];
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <Card key={message.id}>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-medium">{message.subject}</span>
                {!message.readAt && <Badge>New</Badge>}
              </div>
              <span className="text-muted-foreground text-xs">
                {formatDate(message.createdAt)}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              {message.name} &middot; {message.email}
            </p>
            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
            <div className="flex justify-end gap-1">
              {!message.readAt && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await markMessageRead(message.id);
                    router.refresh();
                  }}
                >
                  Mark read
                </Button>
              )}
              <ConfirmDialog
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                  >
                    Delete
                  </Button>
                }
                title="Delete message?"
                description={`This will permanently delete the message from "${message.name}".`}
                onConfirm={async () => {
                  const result = await deleteMessage(message.id);
                  if (!result?.error) router.refresh();
                  return result;
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
