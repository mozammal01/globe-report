export type ParentLookup = (
  id: string,
) => Promise<{ parentId: string | null } | null>;

// Pure, DB-agnostic so it's unit-testable without a database — the caller
// supplies how to look up a category's parent (Prisma in production, an
// in-memory map in tests).
export async function wouldCreateCycle(
  categoryId: string,
  proposedParentId: string,
  getParent: ParentLookup,
): Promise<boolean> {
  if (proposedParentId === categoryId) return true;

  let currentId: string | null = proposedParentId;
  for (let i = 0; i < 50 && currentId; i++) {
    const current = await getParent(currentId);
    if (!current) return false;
    if (current.parentId === categoryId) return true;
    currentId = current.parentId;
  }

  return false;
}
