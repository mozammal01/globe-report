"use client";

import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import type { ChangeEvent } from "react";
import { useRef, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { uploadMedia } from "@/lib/actions/admin/media";

export type MediaValue = { id: string; url: string };

export function MediaUploader({
  value,
  onChange,
  label,
}: {
  value: MediaValue | null;
  onChange: (value: MediaValue | null) => void;
  label: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    const formData = new FormData();
    formData.set("file", file);

    startTransition(async () => {
      const result = await uploadMedia(formData);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      onChange(result);
    });

    event.target.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{label}</span>

      {value ? (
        <div className="border-border relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
          <Image src={value.url} alt="" fill className="object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            className="absolute top-2 right-2"
            onClick={() => onChange(null)}
          >
            <X />
            <span className="sr-only">Remove image</span>
          </Button>
        </div>
      ) : (
        <div className="border-border flex aspect-video w-full max-w-sm flex-col items-center justify-center gap-2 rounded-lg border border-dashed">
          {isPending ? (
            <Spinner size="sm" />
          ) : (
            <>
              <ImagePlus
                className="text-muted-foreground size-6"
                aria-hidden="true"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                Upload image
              </Button>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
