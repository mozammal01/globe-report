import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `How ${siteConfig.name} uses cookies.`,
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalPage title="Cookie Policy" updatedAt="July 28, 2026">
      <h2>What are cookies</h2>
      <p>
        Cookies are small text files stored on your device that help websites
        remember information about your visit.
      </p>
      <h2>How we use cookies</h2>
      <ul>
        <li>
          <strong>Essential:</strong> to keep you signed in and secure your
          session
        </li>
        <li>
          <strong>Preference:</strong> to remember your light/dark theme choice
        </li>
      </ul>
      <p>We do not use third-party advertising or tracking cookies.</p>
      <h2>Managing cookies</h2>
      <p>
        You can control or delete cookies through your browser settings.
        Disabling essential cookies may prevent you from staying signed in.
      </p>
    </LegalPage>
  );
}
