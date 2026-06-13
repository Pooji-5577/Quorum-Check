<?php
session_start();

if (!isset($_SESSION['quorumcheck_votes'])) {
    $_SESSION['quorumcheck_votes'] = [
        'campus' => [62, 24, 14],
        'city' => [48, 37, 15],
        'product' => [71, 18, 11],
    ];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quorum Check - Real-Time Social Polling Platform</title>
    <meta name="description" content="Quorum Check is a premium social polling platform with debate mode, real-time sentiment maps, AI insights, verified community polls, and anonymous accountable voting.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        display: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
                        sans: ['DM Sans', 'system-ui', 'sans-serif'],
                        mono: ['Space Grotesk', 'monospace']
                    },
                    colors: {
                        ink: '#111114',
                        lilac: '#f04a23',
                        blush: '#f6f7fb',
                        butter: '#fff4e8',
                        peach: '#ffd8c6',
                        mist: '#fbf7f2'
                    },
                    boxShadow: {
                        soft: '0 22px 70px rgba(23, 23, 31, 0.10)',
                        float: '0 16px 45px rgba(240, 74, 35, 0.18)'
                    }
                }
            }
        }
    </script>
    <style>
        :root {
            --grid: rgba(23, 23, 31, 0.075);
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            background:
                radial-gradient(circle at 16% 16%, rgba(255, 244, 232, 0.82), transparent 25rem),
                radial-gradient(circle at 84% 18%, rgba(246, 247, 251, 0.86), transparent 27rem),
                radial-gradient(circle at 76% 48%, rgba(240, 74, 35, 0.16), transparent 24rem),
                #ffffff;
        }

        .grid-mesh {
            background-image:
                linear-gradient(var(--grid) 1px, transparent 1px),
                linear-gradient(90deg, var(--grid) 1px, transparent 1px);
            background-size: 48px 48px;
            mask-image: radial-gradient(circle at center, black, transparent 72%);
        }

        .glass {
            background:
                linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.52)),
                linear-gradient(180deg, rgba(255, 255, 255, 0.55), rgba(255, 255, 255, 0));
            border: 1px solid rgba(255, 255, 255, 0.72);
            box-shadow:
                inset 0 1px 0 rgba(255, 255, 255, 0.95),
                inset 0 -1px 0 rgba(17, 17, 20, 0.05),
                0 24px 78px rgba(17, 17, 20, 0.14);
            backdrop-filter: blur(28px) saturate(1.35);
        }

        .vote-bar {
            transition: width 600ms cubic-bezier(.2, .8, .2, 1);
        }

        .feature-card {
            background:
                linear-gradient(135deg, rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.58)) !important;
            border-color: rgba(255, 255, 255, 0.68) !important;
            box-shadow:
                inset 0 1px 0 rgba(255, 255, 255, 0.92),
                0 18px 55px rgba(17, 17, 20, 0.10) !important;
            backdrop-filter: blur(22px) saturate(1.22);
            transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
        }

        .feature-card:hover {
            transform: translateY(-4px);
            border-color: rgba(240, 74, 35, 0.28);
            box-shadow: 0 18px 55px rgba(23, 23, 31, 0.10);
        }

        .font-display {
            letter-spacing: -0.015em;
            font-variation-settings: "opsz" 48;
        }

        .map-dot {
            animation: pulse 2.5s infinite;
        }

        .pixel-field {
            position: absolute;
            pointer-events: none;
            opacity: 0.82;
            filter: blur(0.15px);
            mix-blend-mode: multiply;
            z-index: 0;
        }

        .pixel-field::before,
        .pixel-field::after {
            content: "";
            position: absolute;
            inset: 0;
            background-size: 54px 54px, 108px 108px, 162px 162px;
            animation: pixelDrift 12s ease-in-out infinite alternate;
        }

        .pixel-field::before {
            background-image:
                linear-gradient(90deg, rgba(240, 74, 35, 0.78) 0 54px, transparent 54px),
                linear-gradient(90deg, rgba(255, 132, 46, 0.42) 0 54px, transparent 54px),
                linear-gradient(90deg, rgba(255, 194, 91, 0.22) 0 54px, transparent 54px);
            animation: pixelDrift 12s ease-in-out infinite alternate, pixelHue 7s steps(4, end) infinite;
        }

        .pixel-field::after {
            background-image:
                linear-gradient(0deg, rgba(240, 74, 35, 0.48) 0 54px, transparent 54px),
                linear-gradient(0deg, rgba(255, 198, 91, 0.26) 0 54px, transparent 54px),
                linear-gradient(0deg, rgba(194, 45, 18, 0.14) 0 54px, transparent 54px);
            animation: pixelDrift 12s ease-in-out infinite alternate-reverse, pixelHue 7s steps(4, end) infinite;
            animation-delay: -4s, -2s;
        }

        .pixel-field--hero {
            right: -1%;
            bottom: 7%;
            width: min(40vw, 480px);
            height: 300px;
            opacity: 0.86;
            background-image:
                linear-gradient(90deg, rgba(240, 74, 35, 0.22) 0 48px, transparent 48px),
                linear-gradient(0deg, rgba(255, 178, 63, 0.16) 0 48px, transparent 48px);
            background-size: 48px 48px, 96px 96px;
            mask-image: linear-gradient(135deg, transparent 0%, black 20%, black 76%, transparent 100%);
        }

        .pixel-field--map {
            right: -4%;
            bottom: -18%;
            width: 420px;
            height: 320px;
            opacity: 0.56;
            mask-image: linear-gradient(135deg, transparent 0%, black 42%, transparent 100%);
        }

        @keyframes pixelDrift {
            0% { transform: translate3d(-12px, 10px, 0); opacity: 0.72; }
            100% { transform: translate3d(16px, -14px, 0); opacity: 0.94; }
        }

        @keyframes pixelHue {
            0% { filter: hue-rotate(0deg) saturate(1); }
            25% { filter: hue-rotate(-7deg) saturate(1.1); }
            50% { filter: hue-rotate(8deg) saturate(1.18); }
            75% { filter: hue-rotate(16deg) saturate(1.08); }
            100% { filter: hue-rotate(0deg) saturate(1); }
        }

        .verified-card {
            position: relative;
            overflow: hidden;
            background:
                linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 250, 246, 0.62)) !important;
            border: 1px solid rgba(255, 255, 255, 0.78) !important;
        }

        .verified-card::before {
            content: "";
            position: absolute;
            inset: auto 0 0 auto;
            width: 58%;
            height: 42%;
            background-size: 42px 42px, 84px 84px;
            background-image:
                linear-gradient(90deg, rgba(240, 74, 35, 0.38) 0 42px, transparent 42px),
                linear-gradient(0deg, rgba(255, 178, 63, 0.22) 0 42px, transparent 42px);
            mask-image: linear-gradient(135deg, transparent 0%, black 26%, black 86%);
            opacity: 0.68;
            animation: pixelHue 6s steps(4, end) infinite;
        }

        .verified-card > * {
            position: relative;
            z-index: 1;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: .84; }
            50% { transform: scale(1.35); opacity: .48; }
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation: none !important;
                transition: none !important;
                scroll-behavior: auto !important;
            }
        }
    </style>
</head>
<body class="font-sans text-ink antialiased selection:bg-lilac selection:text-white">
    <div class="pointer-events-none fixed inset-0 grid-mesh opacity-70"></div>

    <header class="sticky top-0 z-50 border-b border-black/5 bg-white/74 backdrop-blur-xl">
        <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-7">
            <a href="index.php" class="flex items-center gap-3" aria-label="Quorum Check home">
                <span class="grid h-10 w-10 place-items-center rounded-full bg-ink text-white shadow-soft">
                    <span class="h-5 w-5 rounded-full border-[6px] border-white border-r-lilac"></span>
                </span>
                <span class="font-mono text-xl font-bold">Quorum Check</span>
            </a>

            <nav class="hidden items-center gap-2 rounded-full border border-black/5 bg-white/80 p-1 text-sm font700 shadow-sm lg:flex">
                <a class="rounded-full px-4 py-2 hover:bg-black/5" href="#feed">Feed</a>
                <a class="rounded-full px-4 py-2 hover:bg-black/5" href="#map">Sentiment Map</a>
                <a class="rounded-full px-4 py-2 hover:bg-black/5" href="#debate">Debate</a>
                <a class="rounded-full px-4 py-2 hover:bg-black/5" href="#insights">Insights</a>
                <a class="rounded-full px-4 py-2 hover:bg-black/5" href="#communities">Communities</a>
                <a class="rounded-full px-4 py-2 hover:bg-black/5" href="#create">Create Poll</a>
            </nav>

            <div class="flex items-center gap-3">
                <a href="contact.php" class="hidden rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold shadow-sm hover:border-black/20 sm:inline-flex">Contact</a>
                <a href="signup.php" class="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5">Join Now</a>
            </div>
        </div>
    </header>

    <main class="relative z-10">
        <section class="mx-auto max-w-7xl px-5 pb-14 pt-10 sm:px-7 lg:pb-24 lg:pt-14">
            <div class="overflow-hidden rounded-[2rem] border border-black/8 bg-white/72 shadow-soft">
                <div class="relative overflow-hidden px-5 py-16 sm:px-8 lg:px-16 lg:py-24">
                    <div class="absolute inset-0 bg-[radial-gradient(circle_at_22%_40%,rgba(255,244,232,.86),transparent_26rem),radial-gradient(circle_at_70%_25%,rgba(246,247,251,.88),transparent_28rem),radial-gradient(circle_at_78%_70%,rgba(240,74,35,.16),transparent_24rem)]"></div>
                    <div class="pixel-field pixel-field--hero"></div>
                    <div class="absolute left-1/2 top-8 h-[560px] w-[760px] -translate-x-1/2 grid-mesh opacity-70"></div>

                    <div class="relative mx-auto max-w-4xl text-center">
                        <h1 class="font-display text-5xl font-black leading-[0.96] text-ink sm:text-7xl lg:text-8xl">
                            Where Public Opinion Comes Alive
                        </h1>
                        <p class="mx-auto mt-7 max-w-2xl text-lg leading-8 text-black/62 sm:text-xl">
                            Create polls, debate ideas, track sentiment, and discover what people really think in real time.
                        </p>
                        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <a href="#create" class="rounded-full bg-ink px-7 py-4 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5">Start Polling</a>
                            <a href="#feed" class="rounded-full border border-black/10 bg-white px-7 py-4 text-sm font-extrabold shadow-sm transition hover:-translate-y-0.5">Explore Live Opinions</a>
                        </div>
                    </div>

                    <div class="relative mt-14 grid gap-4 lg:grid-cols-[1fr_1.15fr_1fr]">
                        <div class="space-y-4">
                            <article class="glass rotate-[-2deg] rounded-3xl p-5">
                                <div class="flex items-center justify-between">
                                    <span class="rounded-full bg-lilac/10 px-3 py-1 text-xs font-extrabold text-lilac">LIVE POLL</span>
                                    <span class="text-xs font-bold text-black/45">12.8k votes</span>
                                </div>
                                <h3 class="mt-4 text-lg font-extrabold">Should universities use AI tutors in every course?</h3>
                                <div class="mt-4 space-y-3">
                                    <div>
                                        <div class="mb-1 flex justify-between text-sm font-bold"><span>Yes, with policy</span><span>61%</span></div>
                                        <div class="h-2 rounded-full bg-black/5"><div class="h-2 w-[61%] rounded-full bg-lilac"></div></div>
                                    </div>
                                    <div>
                                        <div class="mb-1 flex justify-between text-sm font-bold"><span>Only optional</span><span>29%</span></div>
                                        <div class="h-2 rounded-full bg-black/5"><div class="h-2 w-[29%] rounded-full bg-[#2457ff]"></div></div>
                                    </div>
                                </div>
                            </article>
                            <article class="glass rounded-3xl p-5">
                                <p class="text-xs font-extrabold uppercase tracking-[0.22em] text-black/38">Anonymous trust</p>
                                <div class="mt-3 flex items-center gap-4">
                                    <div class="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white">
                                        <span class="font-mono text-xl">ID</span>
                                    </div>
                                    <div>
                                        <p class="font-extrabold">Private vote, valid person</p>
                                        <p class="text-sm text-black/55">Duplicate and bot checks without exposing identity.</p>
                                    </div>
                                </div>
                            </article>
                        </div>

                        <article class="glass rounded-[2rem] p-5 shadow-float">
                            <div class="flex items-center justify-between border-b border-black/5 pb-4">
                                <div>
                                    <p class="text-xs font-extrabold uppercase tracking-[0.22em] text-black/38">Social feed preview</p>
                                    <h2 class="mt-1 text-2xl font-extrabold">Every post is a poll</h2>
                                </div>
                                <span class="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">Trending</span>
                            </div>
                            <div class="mt-5 rounded-3xl border border-black/5 bg-white p-5">
                                <div class="flex items-start justify-between gap-4">
                                    <div>
                                        <p class="font-extrabold">What should our city prioritize next?</p>
                                        <p class="mt-1 text-sm text-black/50">Posted by CivicLab · Rep 842 · 4 min ago</p>
                                    </div>
                                    <span class="rounded-full bg-lilac px-3 py-1 text-xs font-bold text-white">Debate</span>
                                </div>
                                <div class="mt-5 space-y-3">
                                    <button class="poll-option w-full rounded-2xl border border-black/8 bg-white p-4 text-left transition hover:border-lilac/40" data-width="54">
                                        <span class="flex justify-between text-sm font-extrabold"><span>Transit reliability</span><span class="result">54%</span></span>
                                        <span class="mt-2 block h-2 overflow-hidden rounded-full bg-black/5"><span class="vote-bar block h-full w-[54%] rounded-full bg-lilac"></span></span>
                                    </button>
                                    <button class="poll-option w-full rounded-2xl border border-black/8 bg-white p-4 text-left transition hover:border-lilac/40" data-width="31">
                                        <span class="flex justify-between text-sm font-extrabold"><span>Green spaces</span><span class="result">31%</span></span>
                                        <span class="mt-2 block h-2 overflow-hidden rounded-full bg-black/5"><span class="vote-bar block h-full w-[31%] rounded-full bg-[#2457ff]"></span></span>
                                    </button>
                                    <button class="poll-option w-full rounded-2xl border border-black/8 bg-white p-4 text-left transition hover:border-lilac/40" data-width="15">
                                        <span class="flex justify-between text-sm font-extrabold"><span>Housing permits</span><span class="result">15%</span></span>
                                        <span class="mt-2 block h-2 overflow-hidden rounded-full bg-black/5"><span class="vote-bar block h-full w-[15%] rounded-full bg-[#ffb23f]"></span></span>
                                    </button>
                                </div>
                                <div class="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold text-black/50">
                                    <span>AI: transit frustration is strongest among daily commuters.</span>
                                    <span class="rounded-full bg-black/5 px-2 py-1">342 comments</span>
                                    <span class="rounded-full bg-black/5 px-2 py-1">Save</span>
                                    <span class="rounded-full bg-black/5 px-2 py-1">Share</span>
                                </div>
                            </div>
                        </article>

                        <div class="space-y-4">
                            <article class="glass rotate-[2deg] rounded-3xl p-5">
                                <p class="text-xs font-extrabold uppercase tracking-[0.22em] text-black/38">AI insight</p>
                                <h3 class="mt-3 font-extrabold">Consensus is rising in three regions.</h3>
                                <p class="mt-2 text-sm leading-6 text-black/55">The strongest argument cites budget transparency and measurable timelines.</p>
                            </article>
                            <article class="glass rounded-3xl p-5">
                                <div class="flex items-center justify-between">
                                    <span class="font-extrabold">Sentiment map</span>
                                    <span class="rounded-full bg-[#2457ff]/10 px-3 py-1 text-xs font-bold text-[#1a3ab2]">Live</span>
                                </div>
                                <div class="relative mt-4 h-40 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#f8fbff,#fff4dd)]">
                                    <span class="map-dot absolute left-[18%] top-[34%] h-5 w-5 rounded-full bg-lilac"></span>
                                    <span class="map-dot absolute left-[48%] top-[52%] h-7 w-7 rounded-full bg-[#2457ff]"></span>
                                    <span class="map-dot absolute left-[72%] top-[30%] h-4 w-4 rounded-full bg-[#ffb23f]"></span>
                                    <span class="absolute inset-x-5 bottom-5 rounded-2xl bg-white/72 p-3 text-xs font-bold shadow-sm">Austin +18 support · Boston split · London +32 verified turnout</span>
                                </div>
                            </article>
                            <article class="glass rounded-3xl p-5">
                                <p class="text-xs font-extrabold uppercase tracking-[0.22em] text-black/38">Prediction market</p>
                                <div class="mt-3 flex items-end justify-between">
                                    <div>
                                        <p class="font-extrabold">Will policy pass?</p>
                                        <p class="text-sm text-black/50">Forecast confidence</p>
                                    </div>
                                    <p class="font-mono text-3xl font-bold">68%</p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="feed" class="mx-auto max-w-7xl px-5 py-16 sm:px-7">
            <div class="grid gap-8 lg:grid-cols-[0.88fr_1.2fr] lg:items-start">
                <div class="lg:sticky lg:top-28">
                    <p class="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Social poll feed</p>
                    <h2 class="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">An opinion network where every post asks the room.</h2>
                    <p class="mt-5 text-lg leading-8 text-black/58">Quorum Check blends a social feed with structured decision tools: vote, discuss, save, share, follow topics, launch debate mode, and see instant AI summaries.</p>
                </div>

                <div class="space-y-5">
                    <?php
                    $polls = [
                        ['tag' => 'Campus Opinion Week', 'rep' => 'Rep 914', 'question' => 'Should final exam schedules be redesigned around student sleep data?', 'a' => 'Yes, publish a healthier schedule', 'b' => 'Keep departments flexible', 'c' => 'No change this year', 'p' => [58, 28, 14]],
                        ['tag' => 'City Budget Priorities', 'rep' => 'Rep 761', 'question' => 'Which public service should receive the next community grant?', 'a' => 'Safer bus stops', 'b' => 'Local health clinics', 'c' => 'Youth sports programs', 'p' => [42, 39, 19]],
                        ['tag' => 'Product Council', 'rep' => 'Rep 1,204', 'question' => 'What should launch first in the verified organization dashboard?', 'a' => 'Audience analytics', 'b' => 'Moderation workflow', 'c' => 'Embeddable polls', 'p' => [47, 21, 32]],
                    ];
                    foreach ($polls as $poll):
                    ?>
                    <article class="feature-card rounded-[1.75rem] border border-black/8 bg-white p-5 shadow-sm">
                        <div class="flex flex-wrap items-center justify-between gap-3">
                            <div class="flex items-center gap-3">
                                <span class="grid h-11 w-11 place-items-center rounded-2xl bg-ink font-mono text-sm font-bold text-white">PS</span>
                                <div>
                                    <p class="font-extrabold"><?php echo htmlspecialchars($poll['tag']); ?></p>
                                    <p class="text-sm text-black/48">Verified topic · <?php echo htmlspecialchars($poll['rep']); ?> · 6 min ago</p>
                                </div>
                            </div>
                            <span class="rounded-full bg-lilac/10 px-3 py-1 text-xs font-extrabold text-lilac">Trending</span>
                        </div>
                        <h3 class="mt-5 text-xl font-extrabold leading-snug"><?php echo htmlspecialchars($poll['question']); ?></h3>
                        <div class="mt-5 grid gap-3">
                            <?php foreach ([$poll['a'], $poll['b'], $poll['c']] as $i => $label): ?>
                            <button class="poll-option rounded-2xl border border-black/8 bg-mist/60 p-4 text-left hover:border-lilac/30" data-width="<?php echo $poll['p'][$i]; ?>">
                                <span class="flex justify-between gap-4 text-sm font-extrabold"><span><?php echo htmlspecialchars($label); ?></span><span class="result"><?php echo $poll['p'][$i]; ?>%</span></span>
                                <span class="mt-2 block h-2 overflow-hidden rounded-full bg-black/5"><span class="vote-bar block h-full rounded-full <?php echo $i === 0 ? 'bg-lilac' : ($i === 1 ? 'bg-[#2457ff]' : 'bg-[#ffb23f]'); ?>" style="width: <?php echo $poll['p'][$i]; ?>%"></span></span>
                            </button>
                            <?php endforeach; ?>
                        </div>
                        <div class="mt-5 grid gap-3 rounded-2xl border border-white/60 bg-white/55 p-4 text-sm text-black/60 shadow-sm backdrop-blur-xl sm:grid-cols-[1fr_auto]">
                            <p><span class="font-extrabold text-ink">AI insight:</span> The most persuasive comments mention measurable outcomes and transparent reporting.</p>
                            <button class="rounded-full bg-ink px-4 py-2 text-xs font-extrabold text-white">Open debate</button>
                        </div>
                        <div class="mt-4 flex flex-wrap gap-2 text-xs font-bold text-black/48">
                            <span class="rounded-full bg-black/5 px-3 py-1.5">Comment</span>
                            <span class="rounded-full bg-black/5 px-3 py-1.5">Share</span>
                            <span class="rounded-full bg-black/5 px-3 py-1.5">Save</span>
                            <span class="rounded-full bg-black/5 px-3 py-1.5">Follow topic</span>
                        </div>
                    </article>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <section id="map" class="mx-auto max-w-7xl px-5 py-16 sm:px-7">
            <div class="glass rounded-[2rem] p-5 sm:p-8">
                <div class="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
                    <div>
                        <p class="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Real-time sentiment map</p>
                        <h2 class="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">See how opinion changes by city, state, country, age, and community.</h2>
                        <div class="mt-6 flex flex-wrap gap-2">
                            <button class="map-filter rounded-full bg-ink px-4 py-2 text-sm font-bold text-white" data-region="city">City</button>
                            <button class="map-filter rounded-full bg-black/5 px-4 py-2 text-sm font-bold" data-region="state">State</button>
                            <button class="map-filter rounded-full bg-black/5 px-4 py-2 text-sm font-bold" data-region="country">Country</button>
                            <button class="map-filter rounded-full bg-black/5 px-4 py-2 text-sm font-bold" data-region="age">Age group</button>
                        </div>
                    </div>
                    <div class="grid gap-3 sm:grid-cols-2">
                        <div class="glass rounded-3xl p-5">
                            <p class="text-sm font-bold text-black/45">Most active region</p>
                            <p id="regionTitle" class="mt-2 text-2xl font-extrabold">New York City</p>
                            <p id="regionDelta" class="mt-1 text-sm text-black/55">+21 support shift in 18 minutes</p>
                        </div>
                        <div class="glass rounded-3xl p-5">
                            <p class="text-sm font-bold text-black/45">Verified turnout</p>
                            <p class="mt-2 text-2xl font-extrabold">86,420</p>
                            <p class="mt-1 text-sm text-black/55">Duplicate votes blocked: 3,184</p>
                        </div>
                    </div>
                </div>

                <div class="relative mt-8 min-h-[420px] overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#fffaf6,#f6f7fb_48%,#fff0e8)] p-6">
                    <div class="pixel-field pixel-field--map"></div>
                    <div class="absolute inset-0 opacity-50 grid-mesh"></div>
                    <div class="absolute left-[8%] top-[22%] h-24 w-24 rounded-full bg-lilac/25 blur-xl"></div>
                    <div class="absolute left-[28%] top-[52%] h-32 w-32 rounded-full bg-[#2457ff]/18 blur-xl"></div>
                    <div class="absolute left-[68%] top-[30%] h-28 w-28 rounded-full bg-[#ffb23f]/20 blur-xl"></div>
                    <span class="map-dot absolute left-[15%] top-[28%] h-6 w-6 rounded-full bg-lilac"></span>
                    <span class="map-dot absolute left-[38%] top-[58%] h-9 w-9 rounded-full bg-[#2457ff]"></span>
                    <span class="map-dot absolute left-[70%] top-[36%] h-7 w-7 rounded-full bg-[#ffb23f]"></span>
                    <span class="map-dot absolute left-[84%] top-[64%] h-5 w-5 rounded-full bg-[#6f7cff]"></span>
                    <div class="absolute bottom-6 left-6 right-6 grid gap-3 md:grid-cols-4">
                        <div class="glass rounded-2xl p-4"><p class="text-xs font-bold text-black/45">Austin</p><p class="font-extrabold">Transit +34</p></div>
                        <div class="glass rounded-2xl p-4"><p class="text-xs font-bold text-black/45">Boston</p><p class="font-extrabold">Housing split</p></div>
                        <div class="glass rounded-2xl p-4"><p class="text-xs font-bold text-black/45">London</p><p class="font-extrabold">Climate +27</p></div>
                        <div class="glass rounded-2xl p-4"><p class="text-xs font-bold text-black/45">Mumbai</p><p class="font-extrabold">Education +41</p></div>
                    </div>
                </div>
            </div>
        </section>

        <section id="insights" class="mx-auto max-w-7xl px-5 py-16 sm:px-7">
            <div class="mb-10 max-w-3xl">
                <p class="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">AI-generated insights</p>
                <h2 class="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Opinion intelligence without making teams read every comment.</h2>
            </div>
            <div class="grid gap-5 lg:grid-cols-4">
                <?php
                $insights = [
                    ['Voting trends', 'Young voters moved 12 points toward verified public dashboards after seeing transparency controls.'],
                    ['Key discussions', 'Top debate threads center on funding, safety, privacy, and long-term accountability.'],
                    ['Polarization level', 'Moderate divergence. Two regions show high confidence but low consensus.'],
                    ['Consensus level', 'Strong agreement appears when options include timeline and budget details.'],
                ];
                foreach ($insights as $insight):
                ?>
                <article class="feature-card rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-sm">
                    <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-black/38"><?php echo htmlspecialchars($insight[0]); ?></p>
                    <p class="mt-5 text-lg font-extrabold leading-snug"><?php echo htmlspecialchars($insight[1]); ?></p>
                </article>
                <?php endforeach; ?>
            </div>
        </section>

        <section id="debate" class="mx-auto max-w-7xl px-5 py-16 sm:px-7">
            <div class="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
                <div>
                    <p class="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Debate mode</p>
                    <h2 class="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Let each option make its strongest case.</h2>
                    <p class="mt-5 text-lg leading-8 text-black/58">Users argue for an option, the community votes on the strongest reasoning, and AI summarizes where the debate is actually moving.</p>
                </div>
                <div class="grid gap-4 md:grid-cols-2">
                    <article class="rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-soft">
                        <span class="rounded-full bg-lilac/10 px-3 py-1 text-xs font-extrabold text-lilac">Option A</span>
                        <h3 class="mt-4 text-xl font-extrabold">Invest in transit first</h3>
                        <p class="mt-3 text-sm leading-6 text-black/58">The strongest argument links commute time, worker retention, and local business access.</p>
                        <div class="mt-5 flex items-center justify-between rounded-2xl bg-mist p-4">
                            <span class="text-sm font-bold">Strongest argument</span>
                            <span class="font-mono text-xl font-bold">71%</span>
                        </div>
                    </article>
                    <article class="rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-soft">
                        <span class="rounded-full bg-[#ff6f61]/15 px-3 py-1 text-xs font-extrabold text-[#9b2f26]">Option B</span>
                        <h3 class="mt-4 text-xl font-extrabold">Fund parks first</h3>
                        <p class="mt-3 text-sm leading-6 text-black/58">Fact-checkers confirmed three sources on health outcomes and heat reduction.</p>
                        <div class="mt-5 flex items-center justify-between rounded-2xl bg-mist p-4">
                            <span class="text-sm font-bold">Respect score</span>
                            <span class="font-mono text-xl font-bold">94</span>
                        </div>
                    </article>
                    <article class="rounded-[1.75rem] border border-black/8 bg-[#17171f] p-6 text-white shadow-soft md:col-span-2">
                        <p class="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/45">AI debate summary</p>
                        <p class="mt-4 text-xl font-extrabold">The winning arguments cite measurable civic outcomes. Claims without source links are being downranked by community fact check.</p>
                    </article>
                </div>
            </div>
        </section>

        <section id="communities" class="mx-auto max-w-7xl px-5 py-16 sm:px-7">
            <div class="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
                <div class="max-w-3xl">
                    <p class="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Verified community polls</p>
                    <h2 class="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Official polls from colleges, businesses, local governments, and organizations.</h2>
                </div>
                <a href="contact.php" class="w-fit rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white shadow-soft">Verify your community</a>
            </div>
            <div class="grid gap-5 md:grid-cols-3">
                <?php
                $orgs = [
                    ['Northbridge College', 'Student services vote', '42,100 participants'],
                    ['Greenfield City Hall', 'Budget priorities', '18,940 residents'],
                    ['Orbit Labs', 'Product council', '7,820 customers'],
                ];
                foreach ($orgs as $org):
                ?>
                <article class="feature-card verified-card rounded-[1.75rem] border border-black/8 p-6 shadow-sm">
                    <div class="flex items-center justify-between gap-4">
                        <span class="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-sm font-extrabold text-white shadow-soft">QC</span>
                        <span class="rounded-full border border-white/70 bg-white/65 px-3 py-1 text-xs font-extrabold text-lilac shadow-sm backdrop-blur-xl">Verified</span>
                    </div>
                    <h3 class="mt-5 text-xl font-extrabold"><?php echo htmlspecialchars($org[0]); ?></h3>
                    <p class="mt-2 text-black/55"><?php echo htmlspecialchars($org[1]); ?></p>
                    <p class="mt-5 rounded-2xl border border-white/70 bg-white/60 p-4 text-sm font-bold text-black/66 shadow-sm backdrop-blur-xl"><?php echo htmlspecialchars($org[2]); ?> · public results · deadline visible</p>
                </article>
                <?php endforeach; ?>
            </div>
        </section>

        <section class="mx-auto max-w-7xl px-5 py-16 sm:px-7">
            <div class="grid gap-5 lg:grid-cols-3">
                <article class="rounded-[2rem] bg-ink p-8 text-white shadow-soft lg:col-span-1">
                    <p class="font-mono text-sm font-bold uppercase tracking-[0.24em] text-white/45">Anonymous but accountable</p>
                    <h2 class="mt-4 font-display text-4xl font-extrabold leading-tight">Private identity. Valid vote.</h2>
                    <p class="mt-5 leading-8 text-white/68">Quorum Check protects privacy while stopping duplicate votes, bots, spam, and low-quality participation.</p>
                </article>
                <div class="grid gap-5 md:grid-cols-2 lg:col-span-2">
                    <?php
                    $trust = ['Anonymous public identity', 'Duplicate vote prevention', 'Bot protection', 'Verified human checks', 'Reputation-based trust', 'Report abuse and moderation'];
                    foreach ($trust as $item):
                    ?>
                    <div class="feature-card rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-sm">
                        <span class="grid h-10 w-10 place-items-center rounded-2xl bg-[#e3fffa] font-mono text-sm font-bold text-lilac">ID</span>
                        <p class="mt-4 text-lg font-extrabold"><?php echo htmlspecialchars($item); ?></p>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </section>

        <section class="mx-auto max-w-7xl px-5 py-16 sm:px-7">
            <div class="grid gap-5 lg:grid-cols-2">
                <article class="rounded-[2rem] border border-black/8 bg-white p-8 shadow-soft">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p class="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Prediction markets</p>
                            <h2 class="mt-3 font-display text-4xl font-extrabold">Forecast outcomes, not just opinions.</h2>
                        </div>
                        <span class="rounded-full bg-ink px-4 py-2 text-xs font-extrabold text-white">Future feature</span>
                    </div>
                    <div class="mt-8 rounded-3xl bg-mist p-5">
                        <div class="flex items-end justify-between">
                            <div><p class="font-extrabold">Will turnout exceed 70%?</p><p class="text-sm text-black/50">Market probability · resolves June 30</p></div>
                            <p class="font-mono text-5xl font-bold text-lilac">64%</p>
                        </div>
                        <div class="mt-5 h-3 overflow-hidden rounded-full bg-black/5"><div class="h-full w-[64%] rounded-full bg-lilac"></div></div>
                    </div>
                </article>

                <article id="create" class="rounded-[2rem] border border-black/8 bg-white p-8 shadow-soft">
                    <p class="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Advanced survey logic</p>
                    <h2 class="mt-3 font-display text-4xl font-extrabold">A poll builder with Qualtrics-grade control.</h2>
                    <div class="mt-8 grid gap-3 sm:grid-cols-2">
                        <?php
                        $logic = ['Branching logic', 'Skip logic', 'Weighted answers', 'Demographic targeting', 'Scheduled polls', 'Visibility controls', 'Anonymous response mode', 'AI question improvement'];
                        foreach ($logic as $item):
                        ?>
                        <div class="rounded-2xl bg-mist p-4 text-sm font-extrabold"><?php echo htmlspecialchars($item); ?></div>
                        <?php endforeach; ?>
                    </div>
                </article>
            </div>
        </section>

        <section class="mx-auto max-w-7xl px-5 py-16 sm:px-7">
            <div class="mb-10 max-w-3xl">
                <p class="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Complete feature ecosystem</p>
                <h2 class="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Everything a serious public-opinion product needs.</h2>
            </div>
            <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <?php
                $features = [
                    ['Poll Stories', 'Vertical tap-to-vote polls with timed results and live reactions.'],
                    ['Poll Rooms', 'Public, private, and topic rooms with moderators and shared analytics.'],
                    ['Live Poll Events', 'Town halls, elections, launches, countdowns, host controls, and live Q&A.'],
                    ['Poll Reputation Score', 'Participation, accuracy, debate quality, fact-checking, badges, and streaks.'],
                    ['Poll Challenges', 'Campus weeks, city priorities, startup ideas, rewards, rankings, and badges.'],
                    ['Anonymous Confession Polls', 'Sensitive prompts with privacy labels, safe discussion, and moderation.'],
                    ['Community Fact Check', 'Claim detection, source submissions, accuracy voting, and warnings.'],
                    ['Poll Recommendations', 'Suggested polls, rooms, debates, and communities based on voting context.'],
                    ['Public Opinion Timeline', 'Historical graphs, event markers, regional filters, and sentiment shifts.'],
                    ['Creator Analytics', 'Exports, embedded polls, saved segments, topic performance, and conversion.'],
                    ['Accessibility Controls', 'Readable contrast, keyboard flow, reduced motion, and multilingual polls.'],
                    ['Anti-Spam Protection', 'Bot detection, rate limits, report flow, moderation queues, and trust scoring.'],
                ];
                foreach ($features as $feature):
                ?>
                <article class="feature-card rounded-[1.5rem] border border-black/8 bg-white p-5 shadow-sm">
                    <h3 class="text-lg font-extrabold"><?php echo htmlspecialchars($feature[0]); ?></h3>
                    <p class="mt-3 text-sm leading-6 text-black/55"><?php echo htmlspecialchars($feature[1]); ?></p>
                </article>
                <?php endforeach; ?>
            </div>
        </section>

        <section class="mx-auto max-w-7xl px-5 py-16 sm:px-7">
            <div class="overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-soft">
                <div class="grid lg:grid-cols-[.9fr_1.1fr]">
                    <div class="p-8 sm:p-10">
                        <p class="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Organization dashboard</p>
                        <h2 class="mt-4 font-display text-4xl font-extrabold leading-tight">Run verified community polls with clarity.</h2>
                        <p class="mt-5 text-lg leading-8 text-black/58">Manage official polls, export reports, moderate debate, inspect sentiment maps, and track member participation.</p>
                        <a href="contact.php" class="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white shadow-soft">Request organization access</a>
                    </div>
                    <div class="bg-mist p-6">
                        <div class="rounded-[1.75rem] bg-white p-5 shadow-sm">
                            <div class="mb-5 flex items-center justify-between">
                                <p class="font-extrabold">Verified dashboard</p>
                                <span class="rounded-full bg-[#00a884]/10 px-3 py-1 text-xs font-extrabold text-[#007a63]">Healthy</span>
                            </div>
                            <div class="grid gap-3 sm:grid-cols-3">
                                <div class="rounded-2xl bg-[#e9fbff] p-4"><p class="text-xs font-bold text-black/45">Active polls</p><p class="mt-2 font-mono text-3xl font-bold">38</p></div>
                                <div class="rounded-2xl bg-[#fff0ec] p-4"><p class="text-xs font-bold text-black/45">Response rate</p><p class="mt-2 font-mono text-3xl font-bold">74%</p></div>
                                <div class="rounded-2xl bg-[#eafff8] p-4"><p class="text-xs font-bold text-black/45">Exports</p><p class="mt-2 font-mono text-3xl font-bold">12</p></div>
                            </div>
                            <div class="mt-4 rounded-2xl border border-black/5 p-4">
                                <div class="mb-2 flex justify-between text-sm font-bold"><span>Moderation queue</span><span>18 reviewed</span></div>
                                <div class="h-2 rounded-full bg-black/5"><div class="h-2 w-[72%] rounded-full bg-lilac"></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <footer class="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-7">
        <div class="flex flex-col justify-between gap-4 border-t border-black/8 pt-8 text-sm text-black/50 sm:flex-row">
            <p class="font-bold text-ink">Quorum Check</p>
            <p>Social polling, debate, sentiment maps, AI insights, and verified community decision-making.</p>
            <p>&copy; <?php echo date('Y'); ?> Quorum Check.</p>
        </div>
    </footer>

    <script>
        document.querySelectorAll('.poll-option').forEach((button) => {
            button.addEventListener('click', () => {
                const current = Number(button.dataset.width || 50);
                const next = Math.min(92, current + Math.floor(Math.random() * 7) + 2);
                button.dataset.width = String(next);
                const bar = button.querySelector('.vote-bar');
                const result = button.querySelector('.result');
                if (bar) bar.style.width = next + '%';
                if (result) result.textContent = next + '%';
                button.classList.add('ring-2', 'ring-lilac/30');
                setTimeout(() => button.classList.remove('ring-2', 'ring-lilac/30'), 900);
            });
        });

        const regions = {
            city: ['New York City', '+21 support shift in 18 minutes'],
            state: ['California', '+14 consensus gain across verified voters'],
            country: ['United Kingdom', 'Split opinion, high debate quality'],
            age: ['18-24 voters', '+32 toward AI-assisted learning']
        };

        document.querySelectorAll('.map-filter').forEach((button) => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.map-filter').forEach((item) => {
                    item.className = 'map-filter rounded-full bg-black/5 px-4 py-2 text-sm font-bold';
                });
                button.className = 'map-filter rounded-full bg-ink px-4 py-2 text-sm font-bold text-white';
                const data = regions[button.dataset.region];
                document.getElementById('regionTitle').textContent = data[0];
                document.getElementById('regionDelta').textContent = data[1];
            });
        });
    </script>
</body>
</html>
