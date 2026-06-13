<?php
// Force error reporting while troubleshooting setup errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// terms.php - Terms of Service Page for Quorum Check
session_start();
require_once 'config/database.php';

// Include the layout header wrapper
include_once 'includes/header.php';
?>

<main class="bg-slate-50 text-slate-800 antialiased py-16 px-6">
    <div class="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
        
        <!-- Header -->
        <div class="border-b border-slate-100 pb-8 mb-8">
            <span class="text-indigo-600 font-semibold text-sm tracking-wide uppercase">LEGAL FRAMEWORK</span>
            <h1 class="text-3xl md:text-4xl font-bold mt-2 text-slate-900">Terms of Service</h1>
            <p class="text-slate-500 mt-2 text-sm">Last updated: June 2026</p>
        </div>

        <!-- Introduction -->
        <section class="space-y-6 text-slate-600 leading-relaxed">
            <p>
                Welcome to <strong>Quorum Check</strong>. By accessing our public polling services, APIs, or administrative web properties, you agree to be bound by these Terms of Service. If you are entering into this agreement on behalf of an organisation or business entity, you represent that you hold the authority to bind that entity to these conditions.
            </p>
            <p>
                Please read these terms carefully before engaging with the platform. If you do not agree with any part of these terms, you must cease using our infrastructure immediately.
            </p>
        </section>

        <hr class="my-8 border-slate-100" />

        <!-- Core Sections -->
        <div class="space-y-10 text-slate-600 leading-relaxed">
            
            <!-- 1. Use of Service -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">1. Use of the Platform & Voting Integrity</h2>
                <p class="mb-3">Quorum Check provides tools to capture real-time, privacy-first public opinion data. To ensure fair utility for all users, you agree to the following operational parameters:</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li><strong>Public Voting:</strong> Public participants are permitted to cast votes on active, unexpired polls where eligible. Voting is restricted to one transaction per unique visitor session.</li>
                    <li><strong>Manipulation Prohibited:</strong> You must not use automated bots, scripts, scraping tools, or Sybil techniques to artificially inflate or manipulate vote metrics. Defeating or attempting to bypass our telemetry, logging systems, or session verification architecture will result in an immediate service block.</li>
                </ul>
            </section>

            <!-- 2. Account Registration -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">2. Account Registration & Premium Subscriptions</h2>
                <p class="mb-3">To launch active, concurrent polls or access advanced demographic arrays, you must register a workspace account.</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li>You must provide accurate, current information during the signup sequence. You remain fully responsible for the security of your session keys, access credentials, and any activity occurring under your account.</li>
                    <li>Premium tier options are processed via independent, encrypted billing processors. Fees are charged in advance based on your selected billing profile (monthly or annual subscription terms). All payments are non-refundable unless specified under statutory UK consumer rights.</li>
                </ul>
            </section>

            <!-- 3. Acceptable Content & Geofencing -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">3. Content Rules & Regional Compliance</h2>
                <p class="mb-3">Account creators retain ownership of the query text and parameters they deploy. However, you agree that you will not construct polls, descriptions, or choices that contain:</p>
                <ul class="list-disc pl-6 space-y-2">
                    <li>Defamatory, abusive, threatening, or unlawful material.</li>
                    <li>Malicious source code, phishing traps, or tracking vectors designed to extract private personal datasets from voters.</li>
                    <li>Spam or commercial product advertisements disguised as public statistical inquiries.</li>
                </ul>
                <p class="mt-3">
                    We use server-side location mapping to manage local pricing bundles and regional demographic filters. Attempting to intentionally obfuscate your regional location metrics to fraudulently secure lower subscription packages violates these rules.
                </p>
            </section>

            <!-- 4. Intellectual Property -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">4. Intellectual Property Rights</h2>
                <p>
                    The visual interface designs, algorithms, underlying backend database structures, source code, and logo configurations comprising Quorum Check are the exclusive intellectual property of Quorum Check. Your right to use the platform is strictly restricted to the terms of your premium license or public user status. You may not duplicate, reverse engineer, or scrape source infrastructure without explicit written authorisation.
                </p>
            </section>

            <!-- 5. Limitation of Liability -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">5. Limitation of Liability</h2>
                <p>
                    Quorum Check provides its applications and demographic reporting suites on an "as-is" and "as-available" baseline without warranties of any kind. While we make every attempt to prevent script manipulation, we do not warrant that all public charts will be entirely free from external statistical skew. Quorum Check shall not be held liable for any indirect, consequential, or economic loss resulting from poll data fluctuations or platform downtime.
                </p>
            </section>

            <!-- 6. Termination of Service -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">6. Termination & Service Adjustments</h2>
                <p>
                    We reserve the right to modify, suspend, or terminate access to any portion of our infrastructure at any time—including account access or specific active polls—if we determine, in our sole discretion, that a user has breached these terms or compromised system integrity. 
                </p>
            </section>

            <!-- 7. Governing Law -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">7. Governing Law & Jurisdiction</h2>
                <p>
                    These Terms of Service, along with any disputes or structural claims arising from them, are governed exclusively by the laws of England and Wales. The courts of England and Wales hold sole jurisdiction over any disputes related to this agreement.
                </p>
            </section>

            <!-- Support Contact -->
            <section class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                <h2 class="text-lg font-bold text-indigo-900 mb-2">Legal Support Contact</h2>
                <p class="text-indigo-950 text-sm mb-4">
                    For inquiries regarding platform licensing agreements, copyright clearances, or commercial permissions, please write to our operations desk:
                </p>
                <div class="text-sm text-indigo-900">
                    <p><strong>Email:</strong> legal@quorumcheck.com</p>
                </div>
            </section>

        </div>
    </div>
</main>

<?php 
// Include the layout footer wrapper
include_once 'includes/footer.php'; 
?>