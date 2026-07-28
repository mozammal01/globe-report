import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects your data.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updatedAt="July 28, 2026">
      <h2>Information we collect</h2>
      <p>
        When you create an account, we collect your name and email address. When
        you subscribe to our newsletter, we collect your email address. We also
        record basic reading activity (which articles you view) to power
        features like bookmarks and reading history.
      </p>
      <h2>How we use your information</h2>
      <p>
        We use your information to operate your account, send newsletter content
        you&apos;ve subscribed to, and improve our editorial coverage through
        aggregate, anonymized analytics. We never sell your personal information
        to third parties.
      </p>
      <h2>Cookies</h2>
      <p>
        We use essential cookies to keep you signed in and remember your theme
        preference. See our <a href="/cookies">Cookie Policy</a> for details.
      </p>
      <h2>Your rights</h2>
      <p>
        You can update or delete your account information at any time from{" "}
        <a href="/account/settings">Account Settings</a>, and unsubscribe from
        the newsletter using the link in any email we send.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about this policy? Reach out via our{" "}
        <a href="/contact">Contact page</a>.
      </p>
    </LegalPage>
  );
}
