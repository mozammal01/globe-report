export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export function isHtmlContent(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content);
}

// `unstable_cache` serializes cached return values to JSON, so a Date field
// on data that passed through it comes back as a plain ISO string, not a
// real Date instance — this normalizes either shape before calling
// .toISOString() so <time dateTime> doesn't crash on cached data.
export function toIsoStringSafe(
  date: Date | string | null | undefined,
): string | undefined {
  if (!date) return undefined;
  return new Date(date).toISOString();
}
