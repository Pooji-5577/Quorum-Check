<?php
// sections/pricing.php
// Inherit the global location and pricing configuration variables computed by index.php
global $currency, $creator_price, $enterprise_price;
?>
<section class="px-6 py-20 max-w-7xl mx-auto" id="pricing">
    <div class="text-center mb-16">
        <span class="text-indigo-600 font-semibold text-sm tracking-wide uppercase">PRICING PLANS</span>
        <h2 class="text-3xl md:text-4xl font-bold mt-3 text-slate-900">Scalable options for every scope</h2>
        <p class="text-slate-500 max-w-2xl mx-auto mt-4">Get started for free during our pre-launch phase, or lock in advanced tier tracking capabilities early.</p>
    </div>

    <div class="flex justify-center mb-12">
        <div class="relative bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button id="monthlyBtn" type="button" class="bg-white shadow-sm text-slate-800 px-4 py-2 rounded-lg text-sm font-semibold transition-all">
                Monthly billing
            </button>
            <button id="annualBtn" type="button" class="text-slate-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2">
                Annually
                <span class="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wider">-20%</span>
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        <div class="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative">
            <div>
                <h3 class="text-xl font-bold text-slate-900">Public Tier</h3>
                <p class="text-slate-400 text-sm mt-1">For everyday voters and citizens.</p>
                <div class="mt-6 flex items-baseline gap-1">
                    <span class="text-4xl font-extrabold tracking-tight text-slate-900"><?php echo htmlspecialchars($currency); ?>0</span>
                    <span class="text-slate-500 text-sm font-medium">/ forever</span>
                </div>
                
                <ul class="mt-8 space-y-4 text-sm text-slate-600">
                    <li class="flex items-center gap-3">
                        <span class="text-indigo-600 font-bold text-base">✓</span> Vote on unlimited public polls
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="text-indigo-600 font-bold text-base">✓</span> Access real-time public charts
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="text-indigo-600 font-bold text-base">✓</span> Join community discussion boards
                    </li>
                </ul>
            </div>
            <div class="mt-8">
                <a href="signup.php?tier=free" class="block text-center bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold py-3 px-6 rounded-xl transition">
                    Create Free Account
                </a>
            </div>
        </div>

        <div class="bg-white border-2 border-indigo-600 rounded-3xl p-8 flex flex-col justify-between shadow-lg relative transform md:-translate-y-2">
            <div class="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-sm">
                Most Popular
            </div>
            <div>
                <h3 class="text-xl font-bold text-slate-900">Creator Core</h3>
                <p class="text-slate-400 text-sm mt-1">For researchers, local organizations, and businesses.</p>
                <div class="mt-6 flex items-baseline gap-1">
                    <span class="text-4xl font-extrabold tracking-tight text-slate-900">
                        <?php echo htmlspecialchars($currency); ?><span id="proPrice"><?php echo (int)$creator_price; ?></span>
                    </span>
                    <span class="text-slate-500 text-sm font-medium">/ month</span>
                </div>
                
                <ul class="mt-8 space-y-4 text-sm text-slate-600">
                    <li class="flex items-center gap-3">
                        <span class="text-indigo-600 font-bold text-base">✓</span> Everything in Public Tier
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="text-indigo-600 font-bold text-base">✓</span> Launch up to 10 active concurrent polls
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="text-indigo-600 font-bold text-base">✓</span> Cross-tabulate demographic results
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="text-indigo-600 font-bold text-base">✓</span> Geofenced location verification
                    </li>
                </ul>
            </div>
            <div class="mt-8">
                <a href="signup.php?tier=creator" class="block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition">
                    Secure Early Access Slot
                </a>
            </div>
        </div>

        <div class="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative">
            <div>
                <h3 class="text-xl font-bold text-slate-900">Enterprise</h3>
                <p class="text-slate-400 text-sm mt-1">For full API scaling and custom data sets.</p>
                <div class="mt-6 flex items-baseline gap-1">
                    <span class="text-4xl font-extrabold tracking-tight text-slate-900">
                        <?php echo htmlspecialchars($currency); ?><?php echo (int)$enterprise_price; ?>
                    </span>
                    <span class="text-slate-500 text-sm font-medium">/ month</span>
                </div>
                
                <ul class="mt-8 space-y-4 text-sm text-slate-600">
                    <li class="flex items-center gap-3">
                        <span class="text-indigo-600 font-bold text-base">✓</span> Unlimited active concurrent polls
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="text-indigo-600 font-bold text-base">✓</span> Full Webhook & REST API integrations
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="text-indigo-600 font-bold text-base">✓</span> White-label custom embedded widgets
                    </li>
                    <li class="flex items-center gap-3">
                        <span class="text-indigo-600 font-bold text-base">✓</span> Dedicated support account manager
                    </li>
                </ul>
            </div>
            <div class="mt-8">
                <a href="signup.php?tier=enterprise" class="block text-center bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-xl transition">
                    Contact Sales
                </a>
            </div>
        </div>
    </div>
</section>