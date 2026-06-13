<?php
// sections/trust-footer.php
?>
<section class="px-6 py-20 max-w-5xl mx-auto text-center border-t border-slate-100 mt-10">
    <div class="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <div class="absolute -top-10 -left-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative z-10">
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-100/60 px-3 py-1 rounded-full">
                Privacy-First Framework
            </span>
            <h2 class="text-3xl md:text-4xl font-bold mt-4 text-slate-900 tracking-tight">
                No third-party cookies. No data selling. Ever.
            </h2>
            <p class="text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed text-base md:text-lg">
                Quorum Check operates entirely on an aggregated anonymity model. We verify individual participation integrity without linking specific votes to personal identity records or storing identifiable tracking data.
            </p>
            <div class="flex flex-wrap justify-center gap-4 mt-8">
                <a href="signup.php" class="bg-indigo-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all">
                    Secure Early Access Slot
                </a>
                <a href="docs/architectureblueprint.pdf" target="_blank" rel="noopener noreferrer" class="bg-white border border-slate-200 text-slate-700 font-semibold px-8 py-3 rounded-xl hover:bg-slate-50 transition-all">
    Read Our Architecture Blueprint
</a>
            </div>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 border-t border-indigo-100/50 pt-8 max-w-3xl mx-auto text-left md:text-center">
                <div>
                    <div class="text-2xl font-bold text-indigo-600">0%</div>
                    <div class="text-xs text-slate-400 mt-1 uppercase font-medium tracking-wider">PII Trackers Retained</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-indigo-600">100%</div>
                    <div class="text-xs text-slate-400 mt-1 uppercase font-medium tracking-wider">GDPR & UK DPA Compliance</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-indigo-600">AES-256</div>
                    <div class="text-xs text-slate-400 mt-1 uppercase font-medium tracking-wider">Database Encryption</div>
                </div>
                <div>
                    <div class="text-2xl font-bold text-indigo-600">Dual</div>
                    <div class="text-xs text-slate-400 mt-1 uppercase font-medium tracking-wider">Layer Verification</div>
                </div>
            </div>
        </div>
    </div>
</section>