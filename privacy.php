<?php
// Force error reporting while troubleshooting setup errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// privacy.php - Privacy Policy Page for Quorum Check
session_start();
require_once 'config/database.php';

// Include the layout header wrapper
include_once 'includes/header.php';
?>

<main class="bg-slate-50 text-slate-800 antialiased py-16 px-6">
    <div class="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
        
        <!-- Header -->
        <div class="border-b border-slate-100 pb-8 mb-8">
            <span class="text-indigo-600 font-semibold text-sm tracking-wide uppercase">LEGAL INFRASTRUCTURE</span>
            <h1 class="text-3xl md:text-4xl font-bold mt-2 text-slate-900">Privacy Policy</h1>
            <p class="text-slate-500 mt-2 text-sm">Last updated: June 2026</p>
        </div>

        <!-- Introduction -->
        <section class="space-y-6 text-slate-600 leading-relaxed">
            <p>
                At <strong>Quorum Check</strong>, we treat privacy as a fundamental architectural requirement rather than a compliance afterthought. This Privacy Policy outlines how we collect, process, and safeguard your data across our public polling platform, APIs, and administrative dashboards.
            </p>
            <p>
                We operate strictly in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
        </section>

        <hr class="my-8 border-slate-100" />

        <!-- Core Sections -->
        <div class="space-y-10 text-slate-600 leading-relaxed">
            
            <!-- 1. Data We Collect -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">1. Information We Collect and Process</h2>
                <p class="mb-4">Depending on how you interact with Quorum Check, we collect different tiers of data:</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Public Participants (Voters):</strong> To ensure public voting integrity without compromising identity, we issue a cryptographic session identifier stored locally in your browser. We log your IP address and browser User-Agent solely to prevent double-voting and script-based manipulation. This data is separated from your specific vote content to maintain anonymity.</li>
                    <li><strong>Account Holders (Creators & Enterprise):</strong> When you sign up for premium workspace services, we collect your name, business email address, organization details, and payment transaction references.</li>
                    <li><strong>Waitlist & Correspondence:</strong> If you voluntarily register for early access or submit a query through our contact forms, we securely retain your email address, name, and inquiry contents.</li>
                </ul>
            </section>

            <!-- 2. How We Use Data -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">2. Legal Basis and How We Use Your Data</h2>
                <p class="mb-3">We process data under the following lawful basises:</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Contractual Necessity:</strong> To manage creator accounts, handle subscription billing tiers, and grant access to specialized dashboard metrics.</li>
                    <li><strong>Legitimate Interests:</strong> To run location-verification checks (detecting region configurations via IP lookups to serve local pricing packages or geofenced poll configurations) and to monitor platform security infrastructure against malicious sybil attacks.</li>
                    <li><strong>Consent:</strong> For distribution of pre-launch waitlist notifications and promotional newsletter alerts, which you can opt out of at any point instantly.</li>
                </ul>
            </section>

            <!-- 3. Dynamic Location Verification -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">3. Geolocation and Verification Architecture</h2>
                <p>
                    Quorum Check implements automated backend geolocation mapping via visitor IP processing. This framework allows us to cleanly map local currency indicators (e.g., £, $, €) across our service agreements and enforce demographic integrity metrics on regionalized public sentiment arrays. IP records used for dynamic location routing are evaluated on-the-fly and are never permanently stored alongside unhashed demographic outputs.
                </p>
            </section>

            <!-- 4. Data Retention -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">4. Data Retention Framework</h2>
                <p>
                    We retain account configurations and creator profile states for the duration of your active platform agreement. General contact data and waitlist files are held for up to 24 months following your last communication trail unless a formal deletion request is processed. Session tokens generated for public interactive checks clear natively according to client browser variations or specific system parameters.
                </p>
            </section>

            <!-- 5. Third-Party Disclosures -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">5. Third-Party Data Disclosures</h2>
                <p class="mb-3">We do not trade, sell, or rent user database fields to external monetization networks. Data is only communicated to verified sub-processors managing core infrastructure utilities:</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li>Database hosting providers and regional localized computing storage clouds.</li>
                    <li>Secure subscription merchant processors handling premium transactional balances.</li>
                    <li>Network telemetry systems used purely for edge performance delivery routing.</li>
                </ul>
            </section>

            <!-- 6. Your Rights -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">6. Your Data Rights (UK GDPR)</h2>
                <p class="mb-3">Under data protection statutory law, you hold complete autonomy regarding your personal data records, including:</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li>The right to request structural export updates or lookups on your details.</li>
                    <li>The right to demand complete technical erasure of your platform account.</li>
                    <li>The right to object to specific automated tracking configurations.</li>
                </ul>
                <p class="mt-3">To invoke these configurations, please contact our administrative data support channel directly.</p>
            </section>

            <!-- 7. Security Contact -->
            <section class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                <h2 class="text-lg font-bold text-indigo-900 mb-2">7. Contact & Privacy Support</h2>
                <p class="text-indigo-950 text-sm mb-4">
                    For technical validation inquiries, legal clearance issues, or formal data erasure directives, please route your requests to our data controller group:
                </p>
                <div class="text-sm text-indigo-900 space-y-1">
                    <p><strong>Email:</strong> privacy@quorumcheck.com</p>
                    <p><strong>Mailing:</strong> Quorum Check Legal Operations, Manchester, UK</p>
                </div>
            </section>

        </div>
    </div>
</main>

<?php 
// Include the layout footer wrapper
include_once 'includes/footer.php'; 
?>