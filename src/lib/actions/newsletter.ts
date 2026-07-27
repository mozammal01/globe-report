"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";

const newsletterSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }),
});

export type NewsletterFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function subscribeToNewsletter(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Invalid email address.",
    };
  }

  const { email } = parsed.data;

  await prisma.newsletter.upsert({
    where: { email },
    update: {
      status: "SUBSCRIBED",
      subscribedAt: new Date(),
      unsubscribedAt: null,
    },
    create: {
      email,
      status: "SUBSCRIBED",
      subscribedAt: new Date(),
    },
  });

  return {
    status: "success",
    message: "You're subscribed. Thanks for joining Globe Report.",
  };
}
