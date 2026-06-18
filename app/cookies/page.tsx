import { LegalPage } from "@/components/LegalPage";

export const metadata = { title: "Cookie Policy · Quorum Check" };

export default function CookiesPage() {
  return (
    <LegalPage
      eyebrow="Transparency Profile"
      title="Cookie Policy"
      intro={[
        'To provide a clean, secure, and accurate real-time polling ecosystem, <strong>Quorum Check</strong> uses cookies and equivalent web storage technologies.',
      ]}
      sections={[
        { title: "1. What Are Cookies and Web Storage Objects?", body: "Cookies are compact text strings downloaded onto your device when loading a web application. We also use browser-based Session Storage and Local Storage for interface preferences and platform integrity." },
        { title: "2. How We Use Cookies & Tracking Frameworks", body: "Our tracking mechanics fall into strictly necessary elements and optional performance or preference settings.", bullets: ["<strong>Strictly Necessary:</strong> Session state and anti-double-voting validation.", "<strong>Performance & Preferences:</strong> Billing display preferences and authorized dashboard continuity."] },
        { title: "3. Cookie Configuration Matrix", bullets: ["<strong>quorum_session:</strong> Maintains navigation states and local geofencing session parameters.", "<strong>voter_id:</strong> Used to block script-driven double voting.", "<strong>billing_toggle:</strong> Remembers monthly or annual pricing display preferences."] },
        { title: "4. How to Control and Clear Your Cookies", body: "Most browsers accept cookies by default, but you can modify settings to decline, block, or wipe existing records. Clearing data may reset anti-double-voting validation and saved preferences." },
        { title: "Cookie Support Channel", body: "Email: technical@quorumcheck.com", panel: true },
      ]}
    />
  );
}
