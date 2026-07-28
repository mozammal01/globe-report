import { describe, expect, it } from "vitest";

import { toSlug } from "@/lib/slug";

describe("toSlug", () => {
  it("lowercases and hyphenates spaces", () => {
    expect(toSlug("Hello World")).toBe("hello-world");
  });

  it("strips diacritics", () => {
    expect(toSlug("Côte d'Ivoire")).toBe("cote-d-ivoire");
  });

  it("collapses runs of punctuation into a single hyphen", () => {
    expect(toSlug("A -- B ++ C")).toBe("a-b-c");
  });

  it("trims leading and trailing hyphens", () => {
    expect(toSlug("--edge case--")).toBe("edge-case");
  });

  it("handles an already-clean slug unchanged", () => {
    expect(toSlug("already-a-slug")).toBe("already-a-slug");
  });
});
