import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: `Important information about the content published on ${siteConfig.name}.`,
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <LegalPage title="Disclaimer" updatedAt="July 28, 2026">
      <h2>Editorial accuracy</h2>
      <p>
        We work to ensure the information published on {siteConfig.name} is
        accurate and up to date at the time of publication. However, world
        events change quickly, and we make no warranties about the completeness
        or ongoing accuracy of any article.
      </p>
      <h2>Not professional advice</h2>
      <p>
        Content on this site — including country profiles covering economy,
        travel, and history — is provided for general informational purposes
        only and should not be treated as financial, legal, or travel advice.
        Always consult a qualified professional or official source before making
        decisions based on our content.
      </p>
      <h2>External links</h2>
      <p>
        Our articles may link to third-party websites. We are not responsible
        for the content or practices of external sites.
      </p>
      <h2>Corrections</h2>
      <p>
        If you spot an error, please let us know via our{" "}
        <a href="/contact">Contact page</a> and we&apos;ll review it promptly.
      </p>
    </LegalPage>
  );
}
