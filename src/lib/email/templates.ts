import { siteConfig } from "@/config/site";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function newsletterConfirmationEmail(token: string) {
  const confirmUrl = `${siteConfig.url}/newsletter/confirm?token=${token}`;

  return {
    subject: `Confirm your subscription to ${siteConfig.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="font-size: 20px;">Confirm your subscription</h1>
        <p>Click the link below to start receiving ${siteConfig.name} updates in your inbox.</p>
        <p><a href="${confirmUrl}" style="display:inline-block;padding:10px 16px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">Confirm subscription</a></p>
        <p style="color:#666;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };
}

export function contactNotificationEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return {
    subject: `[Contact] ${data.subject}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="font-size: 20px;">New contact message</h1>
        <p><strong>From:</strong> ${escapeHtml(data.name)} (${escapeHtml(data.email)})</p>
        <p><strong>Subject:</strong> ${escapeHtml(data.subject)}</p>
        <p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>
      </div>
    `,
  };
}
