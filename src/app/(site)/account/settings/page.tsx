import { ChangePasswordForm } from "@/components/account/change-password-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { H1, H3, Muted } from "@/components/ui/typography";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AccountSettingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="flex flex-col gap-8">
      <H1>Settings</H1>

      <div className="flex flex-col gap-3">
        <H3>Account</H3>
        <Card>
          <CardContent className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Muted>Email</Muted>
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <Muted>Status</Muted>
              <Badge variant="secondary">{user.status}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-3">
        <H3>Change password</H3>
        <Card>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
