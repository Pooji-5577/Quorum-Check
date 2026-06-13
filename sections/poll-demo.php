<?php
// sections/poll-demo.php
?>
<section class="px-6 py-20 bg-slate-50 border-y border-slate-100">
    <div class="max-w-4xl mx-auto text-center">
        <div class="inline-block bg-white rounded-full px-4 py-1 text-sm font-medium text-indigo-600 shadow-sm border border-slate-200 mb-4">✨ Try the interactive demo</div>
        <h2 class="text-3xl font-bold text-slate-900">Your voice, instantly reflected</h2>
        <p class="text-slate-500 mt-3 max-w-xl mx-auto">Click an option below — watch live results animate in real-time.</p>
    </div>

    <div class="max-w-2xl mx-auto mt-12 bg-white rounded-2xl shadow-xl border border-slate-200 p-6 md:p-8 transition-all" id="demoPollCard">
        <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-slate-800">How should organisations balance data collection with user privacy?</h3>
            <span class="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full">live demo</span>
        </div>
        
        <div class="mt-6 space-y-3" id="pollOptionsContainer">
            <div data-opt="strict" class="poll-option cursor-pointer group border border-slate-200 hover:border-indigo-300 rounded-xl p-4 bg-white transition-all hover:bg-indigo-50/30">
                <div class="flex justify-between items-center">
                    <span class="font-medium text-slate-700 group-hover:text-slate-900">🔒 Strict 1:1 Identity Verification</span>
                    <span class="text-slate-500 text-sm font-mono" id="strictPercentDisplay">0%</span>
                </div>
                <div class="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div id="strictBar" class="h-full bg-indigo-600 result-bar transition-all duration-500 ease-out" style="width: 0%"></div>
                </div>
            </div>

            <div data-opt="aggregated" class="poll-option cursor-pointer group border border-slate-200 hover:border-indigo-300 rounded-xl p-4 bg-white transition-all hover:bg-indigo-50/30">
                <div class="flex justify-between items-center">
                    <span class="font-medium text-slate-700 group-hover:text-slate-900">📊 Aggregated Demographic Opt-in</span>
                    <span class="text-slate-500 text-sm font-mono" id="aggregatedPercentDisplay">0%</span>
                </div>
                <div class="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div id="aggregatedBar" class="h-full bg-indigo-600 result-bar transition-all duration-500 ease-out" style="width: 0%"></div>
                </div>
            </div>

            <div data-opt="rewards" class="poll-option cursor-pointer group border border-slate-200 hover:border-indigo-300 rounded-xl p-4 bg-white transition-all hover:bg-indigo-50/30">
                <div class="flex justify-between items-center">
                    <span class="font-medium text-slate-700 group-hover:text-slate-900">🎁 Full Transparency & Rewards</span>
                    <span class="text-slate-500 text-sm font-mono" id="rewardsPercentDisplay">0%</span>
                </div>
                <div class="h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                    <div id="rewardsBar" class="h-full bg-indigo-600 result-bar transition-all duration-500 ease-out" style="width: 0%"></div>
                </div>
            </div>
        </div>

        <div class="mt-6 flex justify-between items-center border-t border-slate-100 pt-5">
            <div class="text-sm text-slate-400" id="totalVotesDemo">Calculating votes...</div>
            <button id="discussionMockBtn" class="text-indigo-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">Join the Discussion &rarr;</button>
        </div>
    </div>
</section>

<script>
document.addEventListener('DOMContentLoaded', function() {
    const pollId = 'demo';
    const container = document.getElementById('pollOptionsContainer');
    const options = document.querySelectorAll('.poll-option');
    const totalDisplay = document.getElementById('totalVotesDemo');

    // UI tracking definitions
    const displays = {
        strict: { bar: document.getElementById('strictBar'), percent: document.getElementById('strictPercentDisplay') },
        aggregated: { bar: document.getElementById('aggregatedBar'), percent: document.getElementById('aggregatedPercentDisplay') },
        rewards: { bar: document.getElementById('rewardsBar'), percent: document.getElementById('rewardsPercentDisplay') }
    };

    // Helper to rendering live states
    function updateUI(percentages, total) {
        totalDisplay.textContent = `${Number(total).toLocaleString()} total votes · real-time simulation`;
        Object.keys(percentages).forEach(key => {
            if (displays[key]) {
                displays[key].bar.style.width = percentages[key] + '%';
                displays[key].percent.textContent = percentages[key] + '%';
            }
        });
    }

    // Optional: Pre-fetch initial counts on page load if API endpoint supports GET
    // For standalone structural display, seed defaults matching your installer fallback database state:
    updateUI({ strict: 50, aggregated: 34, rewards: 16 }, 257);

    options.forEach(optionElement => {
        optionElement.addEventListener('click', async function() {
            const chosenOption = this.getAttribute('data-opt');
            
            // Add native lock states to prevent duplicate double-click mutations
            container.classList.add('pointer-events-none', 'opacity-80');
            this.classList.add('ring-2', 'ring-indigo-500', 'bg-indigo-50/20');

            try {
                const response = await fetch('api/vote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ poll_id: pollId, option: chosenOption })
                });
                
                const data = await response.json();
                
                if (data.success && data.percentages) {
                    updateUI(data.percentages, data.total || 258);
                } else {
                    console.error('Polling failure message:', data.error || 'Unknown failure state');
                }
            } catch (err) {
                console.error('Network failure connecting to vote API endpoints:', err);
            }
        });
    });

    // Mock discussion click feedback
    const discBtn = document.getElementById('discussionMockBtn');
    if (discBtn) {
        discBtn.addEventListener('click', () => {
            alert('The discussion forum structure is launching soon in the next major pre-launch app release.');
        });
    }
});
</script>