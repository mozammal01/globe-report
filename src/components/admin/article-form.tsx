"use client";

import { useActionState, useState } from "react";

import { FormField } from "@/components/admin/form-field";
import {
  MediaUploader,
  type MediaValue,
} from "@/components/admin/media-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { SubmitButton } from "@/components/admin/submit-button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { H3 } from "@/components/ui/typography";
import { createArticle, updateArticle } from "@/lib/actions/admin/articles";
import { IDLE_STATE } from "@/lib/actions/admin/types";
import type { AdminArticle } from "@/lib/queries/admin/articles";
import type { CategoryOption } from "@/lib/queries/categories";
import type { CountryOption } from "@/lib/queries/countries";
import type { TagOption } from "@/lib/queries/tags";

const STATUSES = ["DRAFT", "IN_REVIEW", "PUBLISHED", "ARCHIVED"] as const;

function toDatetimeLocalValue(date: Date | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function ArticleForm({
  article,
  categories,
  countries,
  tags,
}: {
  article?: AdminArticle;
  categories: CategoryOption[];
  countries: CountryOption[];
  tags: TagOption[];
}) {
  const action = article ? updateArticle.bind(null, article.id) : createArticle;
  const [state, formAction] = useActionState(action, IDLE_STATE);

  const [content, setContent] = useState(article?.content ?? "");
  const [coverImage, setCoverImage] = useState<MediaValue | null>(
    article?.coverMediaId && article.coverImage
      ? { id: article.coverMediaId, url: article.coverImage.url }
      : null,
  );
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(
    new Set(article?.tags.map((tag) => tag.id) ?? []),
  );

  function toggleTag(id: string) {
    setSelectedTagIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-6">
      <div className="flex flex-col gap-4">
        <FormField label="Title" name="title" error={state.fieldErrors?.title}>
          <Input
            id="title"
            name="title"
            defaultValue={article?.title}
            required
          />
        </FormField>

        <FormField label="Slug" name="slug" error={state.fieldErrors?.slug}>
          <Input id="slug" name="slug" defaultValue={article?.slug} required />
        </FormField>

        <FormField
          label="Excerpt"
          name="excerpt"
          error={state.fieldErrors?.excerpt}
        >
          <Textarea
            id="excerpt"
            name="excerpt"
            rows={2}
            defaultValue={article?.excerpt ?? ""}
          />
        </FormField>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <H3>Content</H3>
        <RichTextEditor value={content} onChange={setContent} />
        <input type="hidden" name="content" value={content} />
        {state.fieldErrors?.content && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.content[0]}
          </p>
        )}
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <H3>Cover image</H3>
        <MediaUploader
          label="Cover image"
          value={coverImage}
          onChange={setCoverImage}
        />
        <input type="hidden" name="coverMediaId" value={coverImage?.id ?? ""} />
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Category"
          name="categoryId"
          error={state.fieldErrors?.categoryId}
        >
          <NativeSelect
            id="categoryId"
            name="categoryId"
            defaultValue={article?.categoryId ?? ""}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        <FormField
          label="Country"
          name="countryId"
          error={state.fieldErrors?.countryId}
        >
          <NativeSelect
            id="countryId"
            name="countryId"
            defaultValue={article?.countryId ?? ""}
          >
            <option value="">No country</option>
            {countries.map((country) => (
              <option key={country.id} value={country.id}>
                {country.flagEmoji} {country.name}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        <FormField
          label="Status"
          name="status"
          error={state.fieldErrors?.status}
        >
          <NativeSelect
            id="status"
            name="status"
            defaultValue={article?.status ?? "DRAFT"}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </NativeSelect>
        </FormField>

        <FormField
          label="Publish date"
          name="publishedAt"
          hint="Set a future date to schedule."
          error={state.fieldErrors?.publishedAt}
        >
          <Input
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            defaultValue={toDatetimeLocalValue(article?.publishedAt)}
          />
        </FormField>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isFeatured"
          name="isFeatured"
          defaultChecked={article?.isFeatured}
        />
        <Label htmlFor="isFeatured">Featured article</Label>
      </div>

      <Separator />

      <div className="flex flex-col gap-2">
        <H3>Tags</H3>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2">
              <Checkbox
                id={`tag-${tag.id}`}
                checked={selectedTagIds.has(tag.id)}
                onCheckedChange={() => toggleTag(tag.id)}
              />
              <Label htmlFor={`tag-${tag.id}`}>{tag.name}</Label>
              {selectedTagIds.has(tag.id) && (
                <input type="hidden" name="tagIds" value={tag.id} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <H3>SEO</H3>
        <FormField
          label="SEO title"
          name="seoTitle"
          error={state.fieldErrors?.seoTitle}
        >
          <Input
            id="seoTitle"
            name="seoTitle"
            defaultValue={article?.seoTitle ?? ""}
          />
        </FormField>
        <FormField
          label="SEO description"
          name="seoDescription"
          error={state.fieldErrors?.seoDescription}
        >
          <Textarea
            id="seoDescription"
            name="seoDescription"
            rows={2}
            defaultValue={article?.seoDescription ?? ""}
          />
        </FormField>
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <p className="text-destructive text-sm">{state.message}</p>
      )}

      <div className="flex justify-end">
        <SubmitButton>
          {article ? "Save changes" : "Create article"}
        </SubmitButton>
      </div>
    </form>
  );
}
