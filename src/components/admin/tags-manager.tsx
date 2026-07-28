"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { TagForm } from "@/components/admin/tag-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { H1 } from "@/components/ui/typography";
import { deleteTag } from "@/lib/actions/admin/tags";
import type { TagWithCounts } from "@/lib/queries/tags";

export function TagsManager({ tags }: { tags: TagWithCounts[] }) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  function handleSuccess() {
    setCreateOpen(false);
    setEditingTagId(null);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <H1>Tags</H1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4" aria-hidden="true" />
              New Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Tag</DialogTitle>
            </DialogHeader>
            <TagForm onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      {tags.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Articles</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell className="font-medium">{tag.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {tag.slug}
                </TableCell>
                <TableCell>{tag._count.articles}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Dialog
                      open={editingTagId === tag.id}
                      onOpenChange={(open) =>
                        setEditingTagId(open ? tag.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Tag</DialogTitle>
                        </DialogHeader>
                        <TagForm tag={tag} onSuccess={handleSuccess} />
                      </DialogContent>
                    </Dialog>
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
                      title="Delete tag?"
                      description={`This will permanently delete "${tag.name}".`}
                      onConfirm={async () => {
                        const result = await deleteTag(tag.id);
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
      ) : (
        <EmptyState title="No tags yet." />
      )}
    </div>
  );
}
