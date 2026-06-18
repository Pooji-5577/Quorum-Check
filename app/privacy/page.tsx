import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Privacy Policy · Quorum Check" };

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal Infrastructure"
      title="Privacy Policy"
      intro={[
        'At <strong>Quorum Check</strong>, we treat privacy as a fundamental architectural requirement rather than a compliance afterthought. This Privacy Policy outlines how we collect, process, and safeguard your data across our public polling platform, APIs, and administrative dashboards.',
        "We operate strictly in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.",
      ]}
      sections={[
        { title: "1. Information We Collect and Process", body: "Depending on how you interact with Quorum Check, we collect different tiers of data:", bullets: ["<strong>Public Participants:</strong> We issue a session identifier and log IP address/User-Agent solely to prevent double-voting and manipulation.", "<strong>Account Holders:</strong> We collect account, organization, and payment reference data for premium workspace services.", "<strong>Waitlist & Correspondence:</strong> We retain email address, name, and inquiry contents when voluntarily submitted."] },
        { title: "2. Legal Basis and How We Use Your Data", body: "We process data under contractual necessity, legitimate interests, and consent for waitlist or newsletter messages.", bullets: ["To manage creator accounts and subscription tiers.", "To monitor security and protect against malicious Sybil attacks.", "To distribute pre-launch notifications and product updates when requested."] },
        { title: "3. Geolocation and Verification Architecture", body: "Quorum Check uses visitor IP processing to support local pricing, geofenced poll configuration, and demographic integrity metrics without storing IP records alongside unhashed demographic outputs." },
        { title: "4. Data Retention Framework", body: "General contact data and waitlist records are held for up to 24 months after your last communication unless a deletion request is processed." },
        { title: "5. Third-Party Data Disclosures", body: "We do not trade, sell, or rent user database fields to external monetization networks.", bullets: ["Database hosting providers.", "Secure subscription merchant processors.", "Network telemetry systems for performance routing."] },
        { title: "6. Your Data Rights (UK GDPR)", body: "You may request export, erasure, correction, or objection to specific automated tracking configurations." },
        { title: "7. Contact & Privacy Support", body: "Email: privacy@quorumcheck.com. Mailing: Quorum Check Legal Operations, Manchester, UK", panel: true },
      ]}
    />
  );
}
