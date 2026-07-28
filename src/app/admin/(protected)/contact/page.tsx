import { ContactInbox } from "@/components/admin/contact-inbox";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { H1 } from "@/components/ui/typography";
import { getContactMessagesAdmin } from "@/lib/queries/admin/contact";

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { messages, total, pageSize } = await getContactMessagesAdmin({
    page,
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="flex flex-col gap-6">
      <H1>Contact Messages</H1>

      {messages.length > 0 ? (
        <ContactInbox messages={messages} />
      ) : (
        <EmptyState title="No messages yet." />
      )}

      <Pagination
        basePath="/admin/contact"
        page={page}
        totalPages={totalPages}
        params={{}}
      />
    </div>
  );
}
