import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern your use of ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updatedAt="July 28, 2026">
      <h2>Acceptance of terms</h2>
      <p>
        By accessing or using {siteConfig.name}, you agree to be bound by these
        terms. If you do not agree, please do not use the site.
      </p>
      <h2>Accounts</h2>
      <p>
        You&apos;re responsible for maintaining the confidentiality of your
        account credentials and for all activity under your account. You must
        provide accurate information when creating an account.
      </p>
      <h2>Acceptable use</h2>
      <ul>
        <li>Do not misuse the site, its content, or its infrastructure</li>
        <li>
          Do not attempt to access accounts or data that aren&apos;t yours
        </li>
        <li>Do not republish our content without attribution</li>
      </ul>
      <h2>Content</h2>
      <p>
        All articles, images, and other content on {siteConfig.name} are
        provided for informational purposes and remain the property of{" "}
        {siteConfig.name} or its licensors unless otherwise noted.
      </p>
      <h2>Changes</h2>
      <p>
        We may update these terms from time to time. Continued use of the site
        after changes constitutes acceptance of the revised terms.
      </p>
    </LegalPage>
  );
}
