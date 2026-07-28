"use server";

import { z } from "zod";

import type { ActionState } from "@/lib/actions/admin/types";
import { serverEnv } from "@/lib/env/server";
import { contactNotificationEmail } from "@/lib/email/templates";
import { resend } from "@/lib/email/resend";
import { prisma } from "@/lib/prisma";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required.").max(100),
  email: z.email({ error: "Please enter a valid email address." }),
  subject: z.string().min(1, "Subject is required.").max(200),
  message: z.string().min(1, "Message is required.").max(2000),
});

export type ContactFormState = ActionState;

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const ip = await getClientIp();
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60_000)) {
    return {
      status: "error",
      message: "Too many attempts. Please try again in a few minutes.",
    };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await prisma.contactMessage.create({ data: parsed.data });

  try {
    const { subject, html } = contactNotificationEmail(parsed.data);
    await resend.emails.send({
      from: "Globe Report <onboarding@resend.dev>",
      to: serverEnv.CONTACT_EMAIL,
      replyTo: parsed.data.email,
      subject,
      html,
    });
  } catch (error) {
    console.error("Failed to send contact notification email:", error);
  }

  return {
    status: "success",
    message: "Thanks for reaching out — we'll get back to you soon.",
  };
}
