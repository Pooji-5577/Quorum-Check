<?php
// includes/footer.php
?>
<footer class="bg-white border-t border-slate-100 py-12 mt-20">
    <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-100 pb-8 mb-8">
            <div>
                <a href="index.php" class="text-lg font-bold tracking-tight text-slate-900 hover:text-indigo-600 transition-colors">
                    Quorum<span class="text-indigo-600">Check</span>
                </a>
                <p class="text-xs text-slate-400 mt-1">Real-time, privacy-first public opinion polling.</p>
            </div>
            
            <nav class="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-slate-500">
                <a href="index.php#features" class="hover:text-indigo-600 transition">Features</a>
                <a href="index.php#pricing" class="hover:text-indigo-600 transition">Pricing</a>
                <a href="contact.php" class="hover:text-indigo-600 transition">Contact Support</a>
                <a href="signup.php" class="text-indigo-600 hover:text-indigo-700 font-semibold transition">Get Early Access</a>
            </nav>
        </div>
        
        <div class="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-400">
            <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 order-2 md:order-1">
                <p>&copy; <?php echo date('Y'); ?> Quorum Check. All rights reserved.</p>
                <div class="flex gap-6">
                    <a href="privacy.php" class="hover:text-indigo-600 transition">Privacy Policy</a>
                    <a href="terms.php" class="hover:text-indigo-600 transition">Terms of Service</a>
                    <a href="cookies.php" class="hover:text-indigo-600 transition">Cookie Policy</a>
                </div>
            </div>

            <div class="flex items-center gap-4 order-1 md:order-2">
                <a href="https://x.com/QuorumCheck" target="_blank" rel="noopener noreferrer" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition" title="Follow Quorum Check on X">
                    <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
                    </svg>
                </a>
                <a href="https://www.facebook.com/QuorumCheck" target="_blank" rel="noopener noreferrer" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition" title="Follow Quorum Check on Facebook">
                    <svg class="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</footer>
<?php 
if (file_exists(__DIR__ . '/cookie-banner.php')) {
    include_once __DIR__ . '/cookie-banner.php';
}
?>