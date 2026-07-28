import { describe, expect, it } from "vitest";

import { extractHeadings, injectHeadingIds } from "@/lib/toc";

describe("extractHeadings", () => {
  it("extracts h2/h3 headings with slugified ids", () => {
    const html = "<h2>Getting Started</h2><p>...</p><h3>Next Steps</h3>";
    expect(extractHeadings(html)).toEqual([
      { level: 2, text: "Getting Started", id: "getting-started" },
      { level: 3, text: "Next Steps", id: "next-steps" },
    ]);
  });

  it("returns an empty array when there are no headings", () => {
    expect(extractHeadings("<p>Just a paragraph.</p>")).toEqual([]);
  });

  it("dedupes ids for repeated heading text", () => {
    const html = "<h2>Overview</h2><h2>Overview</h2>";
    const headings = extractHeadings(html);
    expect(headings.map((h) => h.id)).toEqual(["overview", "overview-1"]);
  });
});

describe("injectHeadingIds", () => {
  it("adds matching ids to headings", () => {
    const html = "<h2>Getting Started</h2>";
    expect(injectHeadingIds(html)).toBe(
      '<h2 id="getting-started">Getting Started</h2>',
    );
  });

  it("does not overwrite an existing id", () => {
    const html = '<h2 id="custom">Getting Started</h2>';
    expect(injectHeadingIds(html)).toBe(html);
  });

  it("produces the same ids extractHeadings would report", () => {
    const html = "<h2>Overview</h2><h2>Overview</h2>";
    const injected = injectHeadingIds(html);
    const ids = [...injected.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
    expect(ids).toEqual(extractHeadings(html).map((h) => h.id));
  });
});
