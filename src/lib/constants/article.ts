export const ARTICLE_STATUSES = [
  "DRAFT",
  "IN_REVIEW",
  "PUBLISHED",
  "ARCHIVED",
] as const;

export type ArticleStatusValue = (typeof ARTICLE_STATUSES)[number];

export const ARTICLE_STATUS_VARIANT: Record<
  ArticleStatusValue,
  "default" | "secondary" | "outline" | "destructive"
> = {
  DRAFT: "outline",
  IN_REVIEW: "secondary",
  PUBLISHED: "default",
  ARCHIVED: "destructive",
};

export const CONTENT_TYPES = ["ARTICLE", "GUIDE"] as const;
export type ContentTypeValue = (typeof CONTENT_TYPES)[number];
