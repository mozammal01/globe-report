import { NewsletterTable } from "@/components/admin/newsletter-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { Pagination } from "@/components/ui/pagination";
import { H1 } from "@/components/ui/typography";
import { getSubscribersAdmin } from "@/lib/queries/admin/newsletter";

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: "PENDING" | "SUBSCRIBED" | "UNSUBSCRIBED";
    page?: string;
  }>;
}) {
  const { search, status, page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { subscribers, total, pageSize } = await getSubscribersAdmin({
    search,
    status,
    page,
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col gap-6">
      <H1>Newsletter</H1>

      <form className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          name="search"
          placeholder="Search email..."
          defaultValue={search}
          className="max-w-xs"
        />
        <NativeSelect name="status" defaultValue={status ?? ""}>
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="SUBSCRIBED">Subscribed</option>
          <option value="UNSUBSCRIBED">Unsubscribed</option>
        </NativeSelect>
        <Button type="submit" variant="outline" size="sm">
          Filter
        </Button>
      </form>

      {subscribers.length > 0 ? (
        <NewsletterTable subscribers={subscribers} />
      ) : (
        <EmptyState title="No subscribers found." />
      )}

      <Pagination
        basePath="/admin/newsletter"
        page={page}
        totalPages={totalPages}
        params={{ search, status }}
      />
    </div>
  );
}
