"use client";

import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/format";
import {
  deleteSubscriber,
  unsubscribeSubscriber,
} from "@/lib/actions/admin/newsletter";
import type { AdminSubscriber } from "@/lib/queries/admin/newsletter";

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  PENDING: "outline",
  SUBSCRIBED: "default",
  UNSUBSCRIBED: "destructive",
};

export function NewsletterTable({
  subscribers,
}: {
  subscribers: AdminSubscriber[];
}) {
  const router = useRouter();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Subscribed</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscribers.map((subscriber) => (
          <TableRow key={subscriber.id}>
            <TableCell className="font-medium">{subscriber.email}</TableCell>
            <TableCell>
              <Badge variant={STATUS_VARIANT[subscriber.status]}>
                {subscriber.status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {subscriber.subscribedAt
                ? formatDate(subscriber.subscribedAt)
                : "—"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-1">
                {subscriber.status !== "UNSUBSCRIBED" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      await unsubscribeSubscriber(subscriber.id);
                      router.refresh();
                    }}
                  >
                    Unsubscribe
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
                  title="Delete subscriber?"
                  description={`This will permanently delete "${subscriber.email}".`}
                  onConfirm={async () => {
                    const result = await deleteSubscriber(subscriber.id);
                    if (!result?.error) router.refresh();
                    return result;
                  }}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
