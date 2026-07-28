import { describe, expect, it } from "vitest";

import { formatCompactNumber, formatDate, isHtmlContent } from "@/lib/format";

describe("isHtmlContent", () => {
  it("detects sanitized HTML content", () => {
    expect(isHtmlContent("<p>Hello</p>")).toBe(true);
  });

  it("returns false for plain text", () => {
    expect(isHtmlContent("Just plain text.\n\nSecond paragraph.")).toBe(false);
  });

  it("returns false for text that merely mentions angle brackets", () => {
    expect(isHtmlContent("2 < 3 and 4 > 1")).toBe(false);
  });
});

describe("formatCompactNumber", () => {
  it("compacts large numbers", () => {
    expect(formatCompactNumber(1500)).toBe("1.5K");
  });

  it("leaves small numbers as-is", () => {
    expect(formatCompactNumber(42)).toBe("42");
  });
});

describe("formatDate", () => {
  it("returns an empty string for null/undefined", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
  });

  it("formats a date consistently", () => {
    // Noon UTC keeps this stable across the realistic range of local
    // timezones a dev machine or CI runner might be in.
    expect(formatDate(new Date("2026-01-15T12:00:00Z"))).toBe("Jan 15, 2026");
  });
});
