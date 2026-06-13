<?php
// sections/dual-audience.php
?>
<section class="px-6 py-20 max-w-7xl mx-auto" id="features">
    <div class="text-center mb-12">
        <span class="text-indigo-600 font-semibold text-sm tracking-wide">ONE PLATFORM, TWO POWERFUL EXPERIENCES</span>
        <h2 class="text-3xl md:text-4xl font-bold mt-3 text-slate-900">Built for creators & the public</h2>
        <p class="text-slate-500 max-w-2xl mx-auto mt-4">Whether you're driving decisions or sharing your voice — Quorum Check brings clarity.</p>
    </div>

    <div class="flex justify-center mb-10">
        <div class="inline-flex bg-slate-100 p-1 rounded-full gap-1">
            <button id="tabCreatorsBtn" class="bg-white text-slate-900 shadow-sm px-8 py-2.5 rounded-full text-sm font-semibold transition-all">For Poll Creators</button>
            <button id="tabPublicBtn" class="text-slate-600 hover:text-slate-900 px-8 py-2.5 rounded-full text-sm font-semibold transition-all">For Public Users</button>
        </div>
    </div>

    <div id="creatorsPanel" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300">
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div class="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl">📊</div>
            <h3 class="text-xl font-bold text-slate-900">Advanced Analytics</h3>
            <p class="text-slate-500 mt-2 text-sm leading-relaxed">Filter results by cross-tabulated demographics, timeline progressions, and verified location boundaries without exposing individuals.</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div class="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl">🎯</div>
            <h3 class="text-xl font-bold text-slate-900">Targeted Audiences</h3>
            <p class="text-slate-500 mt-2 text-sm leading-relaxed">Reach specific verified pools, micro-communities, local council areas, or broad global audiences based on true participation layers.</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all md:col-span-2 lg:col-span-1">
            <div class="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl">⚡</div>
            <h3 class="text-xl font-bold text-slate-900">API Integrations</h3>
            <p class="text-slate-500 mt-2 text-sm leading-relaxed">Embed secure, interactive polling components directly inside your custom workflows, external corporate websites, or internal intranets.</p>
        </div>
    </div>

    <div id="publicPanel" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300 hidden">
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div class="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl">🔒</div>
            <h3 class="text-xl font-bold text-slate-900">Privacy-First Experience</h3>
            <p class="text-slate-500 mt-2 text-sm leading-relaxed">Zero PII sold, complete data control, and completely anonymous public voting by default to keep you safe.</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
            <div class="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl">📍</div>
            <h3 class="text-xl font-bold text-slate-900">Hyper-Local Feed</h3>
            <p class="text-slate-500 mt-2 text-sm leading-relaxed">Discover trending polls near you, built dynamically around verified local community topics and regional interests.</p>
        </div>
        <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all md:col-span-2 lg:col-span-1">
            <div class="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-xl">🏆</div>
            <h3 class="text-xl font-bold text-slate-900">Gamified Rewards</h3>
            <p class="text-slate-500 mt-2 text-sm leading-relaxed">Earn community reputation points, complete login streaks, and claim badges while playing an active role in shaping local choices.</p>
        </div>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const tabCreatorsBtn = document.getElementById('tabCreatorsBtn');
    const tabPublicBtn = document.getElementById('tabPublicBtn');
    const creatorsPanel = document.getElementById('creatorsPanel');
    const publicPanel = document.getElementById('publicPanel');

    function switchTab(activeBtn, inactiveBtn, showPanel, hidePanel) {
        // Handle Button States
        activeBtn.className = "bg-white text-slate-900 shadow-sm px-8 py-2.5 rounded-full text-sm font-semibold transition-all";
        inactiveBtn.className = "text-slate-600 hover:text-slate-900 px-8 py-2.5 rounded-full text-sm font-semibold transition-all";
        
        // Handle Visibility
        showPanel.classList.remove('hidden');
        hidePanel.classList.add('hidden');
    }

    if(tabCreatorsBtn && tabPublicBtn && creatorsPanel && publicPanel) {
        tabCreatorsBtn.addEventListener('click', () => {
            switchTab(tabCreatorsBtn, tabPublicBtn, creatorsPanel, publicPanel);
        });

        tabPublicBtn.addEventListener('click', () => {
            switchTab(tabPublicBtn, tabCreatorsBtn, publicPanel, creatorsPanel);
        });
    }
});
</script>