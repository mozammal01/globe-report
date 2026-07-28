"use server";

import { getCurrentAdmin } from "@/lib/auth/session";
import { saveUploadedFile } from "@/lib/media/save-uploaded-file";

export async function uploadMedia(
  formData: FormData,
): Promise<{ id: string; url: string } | { error: string }> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized." };
  }

  return saveUploadedFile(formData, admin.id);
}
