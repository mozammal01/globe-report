import { getCurrentAdmin } from "@/lib/auth/session";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">
        Welcome, {admin?.name}
      </h1>
      <p className="text-muted-foreground">
        You are signed in as an administrator.
      </p>
    </div>
  );
}
