"use server";

import { randomUUID } from "crypto";

import { z } from "zod";

import { newsletterConfirmationEmail } from "@/lib/email/templates";
import { resend } from "@/lib/email/resend";
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
  const token = randomUUID();

  const existing = await prisma.newsletter.findUnique({ where: { email } });

  if (existing?.status === "SUBSCRIBED") {
    return {
      status: "success",
      message: "You're already subscribed. Thanks for being here.",
    };
  }

  await prisma.newsletter.upsert({
    where: { email },
    update: { status: "PENDING", token },
    create: { email, status: "PENDING", token },
  });

  try {
    const { subject, html } = newsletterConfirmationEmail(token);
    await resend.emails.send({
      from: "Globe Report <onboarding@resend.dev>",
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send newsletter confirmation email:", error);
  }

  return {
    status: "success",
    message: "Almost there — check your inbox to confirm your subscription.",
  };
}
