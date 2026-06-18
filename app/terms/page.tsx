import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Terms of Service · Quorum Check" };

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal Framework"
      title="Terms of Service"
      intro={[
        'Welcome to <strong>Quorum Check</strong>. By accessing our public polling services, APIs, or administrative web properties, you agree to be bound by these Terms of Service.',
        "Please read these terms carefully before engaging with the platform. If you do not agree with any part of these terms, you must cease using our infrastructure immediately.",
      ]}
      sections={[
        { title: "1. Use of the Platform & Voting Integrity", body: "Quorum Check provides tools to capture real-time, privacy-first public opinion data.", bullets: ["<strong>Public Voting:</strong> Public participants may cast votes on active, eligible polls.", "<strong>Manipulation Prohibited:</strong> Bots, scraping, Sybil techniques, and vote manipulation are forbidden."] },
        { title: "2. Account Registration & Premium Subscriptions", body: "To launch active polls or access advanced demographic arrays, you must register a workspace account and provide accurate information." },
        { title: "3. Content Rules & Regional Compliance", body: "Creators retain ownership of query text but may not publish unlawful, abusive, malicious, phishing, spam, or disguised advertising content." },
        { title: "4. Intellectual Property Rights", body: "The interface designs, algorithms, database structures, source code, and logo configurations comprising Quorum Check are the exclusive intellectual property of Quorum Check." },
        { title: "5. Limitation of Liability", body: 'Quorum Check provides its applications and reporting suites on an "as-is" and "as-available" basis without warranties of any kind.' },
        { title: "6. Termination & Service Adjustments", body: "We may modify, suspend, or terminate access if a user breaches these terms or compromises system integrity." },
        { title: "7. Governing Law & Jurisdiction", body: "These Terms of Service are governed by the laws of England and Wales." },
        { title: "Legal Support Contact", body: "Email: legal@quorumcheck.com", panel: true },
      ]}
    />
  );
}
