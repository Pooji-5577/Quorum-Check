<?php
// includes/cookie-banner.php
?>
<div id="cookieComplianceBanner" class="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 z-50 transform translate-y-20 opacity-0 transition-all duration-500 hidden">
    <div class="flex items-start gap-4">
        <div class="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl shrink-0 text-xl">
            🍪
        </div>
        <div class="space-y-1">
            <h4 class="text-sm font-bold text-slate-900">Cookie compliance & privacy</h4>
            <p class="text-xs text-slate-500 leading-relaxed">
                We use essential cookies to keep our platform secure and functional. With your permission, we also use minor analytics to help us improve the Quorum Check experience. We never sell your data.
            </p>
        </div>
    </div>
    
    <div class="flex flex-col sm:flex-row items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100">
        <button id="declineCookiesBtn" class="w-full sm:w-auto text-xs font-semibold text-slate-500 hover:text-slate-700 px-4 py-2 rounded-xl transition">
            Essential Only
        </button>
        <button id="acceptCookiesBtn" class="w-full sm:w-auto text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 px-5 py-2.5 rounded-xl shadow-sm transition">
            Accept All
        </button>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const banner = document.getElementById('cookieComplianceBanner');
    const acceptBtn = document.getElementById('acceptCookiesBtn');
    const declineBtn = document.getElementById('declineCookiesBtn');
    const storageKey = 'quorumcheck_cookies';

    // Check if the user has already set their cookie choices
    const cookieConsent = localStorage.getItem(storageKey);

    if (!cookieConsent) {
        // Reveal the banner smoothly if no preference exists
        banner.classList.remove('hidden');
        setTimeout(() => {
            banner.classList.remove('translate-y-20', 'opacity-0');
        }, 100);
    }

    function hideBanner() {
        banner.classList.add('translate-y-20', 'opacity-0');
        setTimeout(() => {
            banner.classList.add('hidden');
        }, 500);
    }

    if (acceptBtn && declineBtn) {
        // User accepts all cookies
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem(storageKey, 'accepted');
            hideBanner();
            // Optional: Trigger your analytical trackers initialization here
        });

        // User declines non-essential cookies
        declineBtn.addEventListener('click', () => {
            localStorage.setItem(storageKey, 'declined');
            hideBanner();
            // Optional: Ensure non-essential scripts stay disabled
        });
    }
});
</script>