import { ContactInbox } from "@/components/admin/contact-inbox";
import { EmptyState } from "@/components/ui/empty-state";
import { H1 } from "@/components/ui/typography";
import { getContactMessagesAdmin } from "@/lib/queries/admin/contact";

export default async function AdminContactPage() {
  const messages = await getContactMessagesAdmin();

  return (
    <div className="flex flex-col gap-6">
      <H1>Contact Messages</H1>

      {messages.length > 0 ? (
        <ContactInbox messages={messages} />
      ) : (
        <EmptyState title="No messages yet." />
      )}
    </div>
  );
}
