import { TagsManager } from "@/components/admin/tags-manager";
import { getTagsWithCounts } from "@/lib/queries/tags";

export default async function AdminTagsPage() {
  const tags = await getTagsWithCounts();

  return <TagsManager tags={tags} />;
}
