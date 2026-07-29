import { AdminTableSkeleton } from "@/components/admin/table-skeleton";

export default function AdminNewsletterLoading() {
  return <AdminTableSkeleton filters={2} withCreateButton={false} />;
}
