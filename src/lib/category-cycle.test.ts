import { describe, expect, it } from "vitest";

import { wouldCreateCycle, type ParentLookup } from "@/lib/category-cycle";

// Simple in-memory tree: A -> B -> C (C's parent is B, B's parent is A, A is root)
function makeLookup(tree: Record<string, string | null>): ParentLookup {
  return async (id: string) => {
    if (!(id in tree)) return null;
    return { parentId: tree[id]! };
  };
}

describe("wouldCreateCycle", () => {
  it("rejects a category being made its own parent", async () => {
    const lookup = makeLookup({ A: null });
    expect(await wouldCreateCycle("A", "A", lookup)).toBe(true);
  });

  it("rejects setting a descendant as the parent (multi-level cycle)", async () => {
    // A -> B -> C; trying to set C's descendant relationship A.parent = C
    const lookup = makeLookup({ A: null, B: "A", C: "B" });
    expect(await wouldCreateCycle("A", "C", lookup)).toBe(true);
  });

  it("allows a valid reparenting that does not create a cycle", async () => {
    const lookup = makeLookup({ A: null, B: "A", C: "A", D: null });
    expect(await wouldCreateCycle("C", "D", lookup)).toBe(false);
  });

  it("allows moving a node under an unrelated root", async () => {
    const lookup = makeLookup({ A: null, B: "A" });
    expect(await wouldCreateCycle("B", "A", lookup)).toBe(false);
  });

  it("treats a missing proposed parent as safe (no cycle found)", async () => {
    const lookup = makeLookup({ A: null });
    expect(await wouldCreateCycle("A", "does-not-exist", lookup)).toBe(false);
  });
});
