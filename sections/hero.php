<?php
// sections/hero.php
?>
<section class="relative isolate px-6 pt-12 pb-20 lg:pt-24 lg:pb-28 border-b border-slate-100 overflow-hidden">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_#eef2ff,_white)] opacity-70"></div>
    <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="animate-fade-in">
                <div class="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-4 py-1.5 text-indigo-700 text-sm font-medium mb-6 border border-indigo-100">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                    </span>
                    Live public sentiment
                </div>
                <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                    The Pulse of the Public,<br> 
                    <span class="text-indigo-600">In Real Time.</span><br>
                    Privacy-first polling for leaders.
                </h1>
                <p class="text-lg text-slate-600 mt-6 max-w-lg leading-relaxed">
                    A dual-sided ecosystem coming soon: creators build targeted, transparent polls — users vote, discuss, and track live trends without sacrificing their privacy.
                </p>
                <div class="flex flex-wrap gap-4 mt-8">
                    <!-- FIXED: Removed absolute forward slashes from relative file linking targets -->
                    <a href="contact.php" class="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition-all hover:shadow-lg hover:scale-[1.02]">
                        Coming Soon
                    </a>
                    <a href="signup.php" class="inline-block border border-slate-300 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 font-medium px-8 py-3 rounded-xl transition-all">
                        Pre-Launch Sign up
                    </a>
                </div>
                <div class="flex items-center gap-5 mt-8 text-sm text-slate-500">
                    <span class="flex items-center gap-1">✓ No personal data selling</span>
                    <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span class="flex items-center gap-1">✓ Real-time results</span>
                    <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span class="flex items-center gap-1">✓ Anonymous but verified ID groups</span>
                </div>
            </div>
            
            <!-- Hero Interactive Dashboard Mockup Widget -->
            <div class="relative bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 transition-all hover:shadow-xl">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                        <span class="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                        <span class="w-2.5 h-2.5 rounded-full bg-green-400"></span>
                    </div>
                    <span class="text-xs text-slate-400 font-mono">quorumcheck.app/poll/42</span>
                </div>
                <div class="space-y-4">
                    <div class="flex justify-between items-start">
                        <h3 class="font-bold text-slate-800 text-lg">Should the city invest more in green spaces?</h3>
                        <span class="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full">LIVE · 1.2k votes</span>
                    </div>
                    <div class="space-y-3">
                        <div>
                            <div class="flex justify-between text-sm text-slate-600 mb-1">
                                <span>✅ Strongly support</span>
                                <span id="percentYes" class="font-mono font-medium text-slate-900">64%</span>
                            </div>
                            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div id="barYes" class="h-full bg-indigo-600 rounded-full transition-all duration-500 ease-out" style="width: 64%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm text-slate-600 mb-1">
                                <span>🤔 Neutral / Unsure</span>
                                <span id="percentNeutral" class="font-mono font-medium text-slate-900">22%</span>
                            </div>
                            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div id="barNeutral" class="h-full bg-slate-400 rounded-full transition-all duration-500 ease-out" style="width: 22%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm text-slate-600 mb-1">
                                <span>❌ Oppose</span>
                                <span id="percentNo" class="font-mono font-medium text-slate-900">14%</span>
                            </div>
                            <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div id="barNo" class="h-full bg-slate-300 rounded-full transition-all duration-500 ease-out" style="width: 14%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-between items-center pt-2 text-xs text-slate-400 border-t border-slate-100 mt-2">
                        <span>⏱️ Updated live · 342 online</span>
                        <span class="text-indigo-600 font-medium">💬 47 comments</span>
                    </div>
                    <div class="bg-slate-50 rounded-xl p-3 text-sm space-y-2">
                        <div class="flex gap-2">
                            <span class="font-semibold text-slate-700 shrink-0">@GreenCityNow</span>
                            <span class="text-slate-600">Great initiative! Hope this passes.</span>
                        </div>
                        <div class="flex gap-2 border-t border-slate-100 pt-2">
                            <span class="font-semibold text-slate-700 shrink-0">@Taxpayer_anon</span>
                            <span class="text-slate-600">Need a detailed budget proposal first.</span>
                        </div>
                        <div class="flex justify-center pt-1">
                            <span class="text-indigo-600 text-xs font-medium cursor-pointer hover:underline">+ 12 more replies</span>
                        </div>
                    </div>
                </div>
                <div class="absolute -bottom-2 -right-2 w-24 h-24 bg-indigo-100 rounded-full blur-2xl -z-10 opacity-40"></div>
            </div>
        </div>
    </div>
</section>