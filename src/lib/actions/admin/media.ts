"use server";

import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

import { getCurrentAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export async function uploadMedia(
  formData: FormData,
): Promise<{ id: string; url: string } | { error: string }> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: "Unauthorized." };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { error: "No file provided." };
  }

  const extension = ALLOWED_MIME_TYPES[file.type];
  if (!extension) {
    return { error: "Unsupported file type. Use JPEG, PNG, WebP, or GIF." };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { error: "File is too large. Maximum size is 5MB." };
  }

  const filename = `${randomUUID()}.${extension}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, filename), buffer);

  const media = await prisma.media.create({
    data: {
      url: `/uploads/${filename}`,
      type: "IMAGE",
      mimeType: file.type,
      sizeBytes: file.size,
      uploadedById: admin.id,
    },
    select: { id: true, url: true },
  });

  return media;
}
