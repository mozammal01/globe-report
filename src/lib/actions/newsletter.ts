"use server";

import { randomUUID } from "crypto";

import { z } from "zod";

import type { ActionState } from "@/lib/actions/admin/types";
import { newsletterConfirmationEmail } from "@/lib/email/templates";
import { resend } from "@/lib/email/resend";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const newsletterSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }),
});

export type NewsletterFormState = ActionState;

export async function subscribeToNewsletter(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const ip = await getClientIp();
  if (!rateLimit(`newsletter:${ip}`, 5, 10 * 60_000)) {
    return {
      status: "error",
      message: "Too many attempts. Please try again in a few minutes.",
    };
  }

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
