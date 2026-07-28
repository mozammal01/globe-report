import { ProfileForm } from "@/components/account/profile-form";
import { H1 } from "@/components/ui/typography";
import { getCurrentUser } from "@/lib/auth/session";

export default async function AccountProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="flex flex-col gap-6">
      <H1>Profile</H1>
      <ProfileForm user={user} />
    </div>
  );
}
