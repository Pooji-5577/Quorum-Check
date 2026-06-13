<?php
// Force error reporting while troubleshooting setup errors
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// cookies.php - Cookie Policy Page for Quorum Check
session_start();
require_once 'config/database.php';

// Include the layout header wrapper
include_once 'includes/header.php';
?>

<main class="bg-slate-50 text-slate-800 antialiased py-16 px-6">
    <div class="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm">
        
        <!-- Header -->
        <div class="border-b border-slate-100 pb-8 mb-8">
            <span class="text-indigo-600 font-semibold text-sm tracking-wide uppercase">TRANSPARENCY PROFILE</span>
            <h1 class="text-3xl md:text-4xl font-bold mt-2 text-slate-900">Cookie Policy</h1>
            <p class="text-slate-500 mt-2 text-sm">Last updated: June 2026</p>
        </div>

        <!-- Introduction -->
        <section class="space-y-6 text-slate-600 leading-relaxed">
            <p>
                To provide a clean, secure, and accurate real-time polling ecosystem, <strong>Quorum Check</strong> uses cookies and equivalent web storage technologies. This policy details how we use these tools, what they track, and your rights to manage them under UK data protection standards.
            </p>
        </section>

        <hr class="my-8 border-slate-100" />

        <!-- Core Sections -->
        <div class="space-y-10 text-slate-600 leading-relaxed">
            
            <!-- 1. What Are Cookies -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">1. What Are Cookies and Web Storage Objects?</h2>
                <p>
                    Cookies are compact text strings downloaded onto your device when loading a web application. Alongside standard cookies, we use browser-based <strong>Session Storage</strong> and <strong>Local Storage</strong> objects. These tokens serve to retain interface preferences and prevent platform manipulation without constructing intrusive permanent data trails about your browsing history elsewhere on the web.
                </p>
            </section>

            <!-- 2. How We Use Cookies -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">2. How We Use Cookies & Tracking Frameworks</h2>
                <p class="mb-4">Our tracking mechanics fall into two distinct operational groupings:</p>
                
                <div class="space-y-4">
                    <div class="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <h3 class="font-bold text-slate-900 text-sm uppercase tracking-wider mb-2">A. Strictly Necessary Elements (Always Active)</h3>
                        <p class="text-sm mb-3">These are vital for basic infrastructure stability, system operations, and voting reliability. Because the platform cannot run safely without them, they cannot be individualised or disabled manually via choice arrays:</p>
                        <ul class="list-disc pl-6 space-y-1 text-sm text-slate-500">
                            <li><strong>PHPSESSID:</strong> A core system cookie used to manage encrypted visitor states, pass pricing metrics derived from regional IP routing, and hold temporary dynamic form confirmations.</li>
                            <li><strong>Voter Anti-Sybil Tokens:</strong> Local storage identifiers used specifically to flag that a user has participated in a given simulation or demo check. This prevents multiple submissions from the same terminal session, protecting the validity of the data.</li>
                        </ul>
                    </div>

                    <div class="p-5 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                        <h3 class="font-bold text-indigo-900 text-sm uppercase tracking-wider mb-2">B. Performance & Preferences (Optional Setup)</h3>
                        <p class="text-sm mb-3">These support quality-of-life adjustments across our dashboards, such as remembering your billing configuration choices or keeping account profiles logged in safely over multiple sessions:</p>
                        <ul class="list-disc pl-6 space-y-1 text-sm text-indigo-950/70">
                            <li><strong>Billing Preferences:</strong> Retains your selected toggle parameters (Monthly vs Annual billing layouts) across pricing panels so you do not have to flip toggles on subsequent visits.</li>
                            <li><strong>Session Persist:</strong> Retains active, authorized administrator keys across workspace dashboards when premium accounts opt for continuous access.</li>
                        </ul>
                    </div>
                </div>
            </section>

            <!-- 3. Cookie Inventory Table -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">3. Cookie Configuration Matrix</h2>
                <div class="overflow-x-auto border border-slate-200 rounded-2xl">
                    <table class="w-full text-left border-collapse text-sm text-slate-600">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-200 text-slate-800 font-semibold">
                                <th class="p-4">Identifier Name</th>
                                <th class="p-4">Classification</th>
                                <th class="p-4">Functional Purpose</th>
                                <th class="p-4">Lifespan</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr>
                                <td class="p-4 font-mono text-xs text-indigo-600">PHPSESSID</td>
                                <td class="p-4">Strictly Necessary</td>
                                <td class="p-4">Maintains application navigation states and local geofencing session parameters.</td>
                                <td class="p-4">End of Session</td>
                            </tr>
                            <tr>
                                <td class="p-4 font-mono text-xs text-indigo-600">voter_id</td>
                                <td class="p-4">Strictly Necessary</td>
                                <td class="p-4">Cryptographic tracker token utilized to block script-driven double voting.</td>
                                <td class="p-4">Browser Managed</td>
                            </tr>
                            <tr>
                                <td class="p-4 font-mono text-xs text-indigo-600">billing_toggle</td>
                                <td class="p-4">Preferences</td>
                                <td class="p-4">Remembers user preference for monthly or annual pricing displays.</td>
                                <td class="p-4">30 Days</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- 4. Controlling Cookies -->
            <section>
                <h2 class="text-xl font-bold text-slate-900 mb-4">4. How to Control and Clear Your Cookies</h2>
                <p class="mb-4">
                    Most standard browsers accept cookies by default. However, you maintain absolute control over these files and can modify your browser settings to decline, block, or completely wipe existing records.
                </p>
                <p>
                    Please note that if you clear your browser data or use an aggressive incognito configuration, any active anti-double-voting validation strings will reset, and saved selection preferences across our dashboard pricing components will return to defaults.
                </p>
            </section>

            <!-- 5. Operational Help -->
            <section class="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
                <h2 class="text-lg font-bold text-indigo-900 mb-2">Cookie Support Channel</h2>
                <p class="text-indigo-950 text-sm mb-4">
                    If you have questions regarding our minimalist data collection choices, or need a deeper technical analysis of our real-time tracking frameworks, our support operations desk is happy to help:
                </p>
                <div class="text-sm text-indigo-900">
                    <p><strong>Email:</strong> technical@quorumcheck.com</p>
                </div>
            </section>

        </div>
    </div>
</main>

<?php 
// Include the layout footer wrapper
include_once 'includes/footer.php'; 
?>