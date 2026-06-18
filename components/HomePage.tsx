"use client";

import Link from "next/link";
import { useState } from "react";
import { MarketingHeader, MinimalFooter } from "@/components/SiteChrome";

const feedPolls = [
  {
    tag: "Campus Opinion Week",
    rep: "Rep 914",
    question: "Should final exam schedules be redesigned around student sleep data?",
    options: ["Yes, publish a healthier schedule", "Keep departments flexible", "No change this year"],
    p: [58, 28, 14],
  },
  {
    tag: "City Budget Priorities",
    rep: "Rep 761",
    question: "Which public service should receive the next community grant?",
    options: ["Safer bus stops", "Local health clinics", "Youth sports programs"],
    p: [42, 39, 19],
  },
  {
    tag: "Product Council",
    rep: "Rep 1,204",
    question: "What should launch first in the verified organization dashboard?",
    options: ["Audience analytics", "Moderation workflow", "Embeddable polls"],
    p: [47, 21, 32],
  },
];

const insights = [
  ["Voting trends", "Young voters moved 12 points toward verified public dashboards after seeing transparency controls."],
  ["Key discussions", "Top debate threads center on funding, safety, privacy, and long-term accountability."],
  ["Polarization level", "Moderate divergence. Two regions show high confidence but low consensus."],
  ["Consensus level", "Strong agreement appears when options include timeline and budget details."],
];

const features = [
  ["Poll Stories", "Vertical tap-to-vote polls with timed results and live reactions."],
  ["Poll Rooms", "Public, private, and topic rooms with moderators and shared analytics."],
  ["Live Poll Events", "Town halls, elections, launches, countdowns, host controls, and live Q&A."],
  ["Poll Reputation Score", "Participation, accuracy, debate quality, fact-checking, badges, and streaks."],
  ["Poll Challenges", "Campus weeks, city priorities, startup ideas, rewards, rankings, and badges."],
  ["Anonymous Confession Polls", "Sensitive prompts with privacy labels, safe discussion, and moderation."],
  ["Community Fact Check", "Claim detection, source submissions, accuracy voting, and warnings."],
  ["Poll Recommendations", "Suggested polls, rooms, debates, and communities based on voting context."],
  ["Public Opinion Timeline", "Historical graphs, event markers, regional filters, and sentiment shifts."],
  ["Creator Analytics", "Exports, embedded polls, saved segments, topic performance, and conversion."],
  ["Accessibility Controls", "Readable contrast, keyboard flow, reduced motion, and multilingual polls."],
  ["Anti-Spam Protection", "Bot detection, rate limits, report flow, moderation queues, and trust scoring."],
];

const regions = {
  city: ["New York City", "+21 support shift in 18 minutes"],
  state: ["California", "+14 consensus gain across verified voters"],
  country: ["United Kingdom", "Split opinion, high debate quality"],
  age: ["18-24 voters", "+32 toward AI-assisted learning"],
} as const;

function PollOption({ label, initial, color = "bg-lilac" }: { label: string; initial: number; color?: string }) {
  const [value, setValue] = useState(initial);
  const [active, setActive] = useState(false);

  function vote() {
    setValue((current) => Math.min(92, current + Math.floor(Math.random() * 7) + 2));
    setActive(true);
    window.setTimeout(() => setActive(false), 900);
  }

  return (
    <button
      onClick={vote}
      className={`rounded-2xl border border-black/8 bg-mist/60 p-4 text-left transition hover:border-lilac/30 ${active ? "ring-2 ring-lilac/30" : ""}`}
      type="button"
    >
      <span className="flex justify-between gap-4 text-sm font-extrabold">
        <span>{label}</span>
        <span>{value}%</span>
      </span>
      <span className="mt-2 block h-2 overflow-hidden rounded-full bg-black/5">
        <span className={`block h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </span>
    </button>
  );
}

export default function HomePage() {
  const [region, setRegion] = useState<keyof typeof regions>("city");
  const regionData = regions[region];

  return (
    <>
      <MarketingHeader />
      <main className="relative z-10">
        <section className="mx-auto max-w-[94rem] px-4 pb-14 pt-8 sm:px-7 lg:pb-24 lg:pt-12">
          <div className="relative overflow-hidden after:pointer-events-none after:absolute after:inset-x-8 after:bottom-0 after:h-28 after:rounded-full after:bg-black/12 after:blur-3xl after:content-['']">
            <div className="relative overflow-hidden px-5 py-20 sm:px-10 lg:px-20 lg:py-32">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_40%,rgba(255,244,232,.86),transparent_26rem),radial-gradient(circle_at_70%_25%,rgba(246,247,251,.88),transparent_28rem),radial-gradient(circle_at_78%_70%,rgba(240,74,35,.16),transparent_24rem)]" />
              <div className="pixel-field pixel-field--hero" />
              <div className="absolute left-1/2 top-8 h-[560px] w-[760px] -translate-x-1/2 grid-mesh opacity-70" />
              <div className="relative mx-auto max-w-5xl text-center">
                <h1 className="font-display text-5xl font-black leading-[0.96] text-ink sm:text-7xl lg:text-8xl">
                  Where Public Opinion Comes Alive
                </h1>
                <p className="mx-auto mt-8 max-w-3xl text-xl leading-8 text-black/62 sm:text-2xl sm:leading-9">
                  Create polls, debate ideas, track sentiment, and discover what people really think in real time.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="#create" className="rounded-full bg-ink px-8 py-4 text-base font-extrabold text-white shadow-soft transition hover:-translate-y-0.5">
                    Start Polling
                  </Link>
                  <Link href="#feed" className="rounded-full border border-black/10 bg-white px-8 py-4 text-base font-extrabold shadow-sm transition hover:-translate-y-0.5">
                    Explore Live Opinions
                  </Link>
                </div>
              </div>
              <div className="relative mt-20 grid gap-5 lg:grid-cols-[1fr_1.18fr_1fr]">
                <div className="space-y-4">
                  <article className="glass rotate-[-2deg] rounded-3xl p-6">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-lilac/10 px-3 py-1 text-xs font-extrabold text-lilac">LIVE POLL</span>
                      <span className="text-xs font-bold text-black/45">12.8k votes</span>
                    </div>
                    <h3 className="mt-5 text-xl font-extrabold">Should universities use AI tutors in every course?</h3>
                    <div className="mt-4 space-y-3">
                      <PollOption label="Yes, with policy" initial={61} />
                      <PollOption label="Only optional" initial={29} color="bg-[#2457ff]" />
                    </div>
                  </article>
                  <article className="glass rounded-3xl p-6">
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-black/38">Anonymous trust</p>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-ink text-white"><span className="font-mono text-xl">ID</span></div>
                      <div><p className="font-extrabold">Private vote, valid person</p><p className="text-sm text-black/55">Duplicate and bot checks without exposing identity.</p></div>
                    </div>
                  </article>
                </div>
                <article className="glass rounded-[2rem] p-6 shadow-float">
                  <div className="flex items-center justify-between border-b border-black/5 pb-4">
                    <div><p className="text-xs font-extrabold uppercase tracking-[0.22em] text-black/38">Social feed preview</p><h2 className="mt-1 text-3xl font-extrabold">Every post is a poll</h2></div>
                    <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">Trending</span>
                  </div>
                  <div className="mt-5 rounded-3xl border border-black/5 bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div><p className="font-extrabold">What should our city prioritize next?</p><p className="mt-1 text-sm text-black/50">Posted by CivicLab · Rep 842 · 4 min ago</p></div>
                      <span className="rounded-full bg-lilac px-3 py-1 text-xs font-bold text-white">Debate</span>
                    </div>
                    <div className="mt-5 grid gap-3">
                      <PollOption label="Transit reliability" initial={54} />
                      <PollOption label="Green spaces" initial={31} color="bg-[#2457ff]" />
                      <PollOption label="Housing permits" initial={15} color="bg-[#ffb23f]" />
                    </div>
                    <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-bold text-black/50">
                      <span>AI: transit frustration is strongest among daily commuters.</span>
                      <span className="rounded-full bg-black/5 px-2 py-1">342 comments</span>
                      <span className="rounded-full bg-black/5 px-2 py-1">Save</span>
                      <span className="rounded-full bg-black/5 px-2 py-1">Share</span>
                    </div>
                  </div>
                </article>
                <div className="space-y-4">
                  <article className="glass rotate-[2deg] rounded-3xl p-6"><p className="text-xs font-extrabold uppercase tracking-[0.22em] text-black/38">AI insight</p><h3 className="mt-3 font-extrabold">Consensus is rising in three regions.</h3><p className="mt-2 text-sm leading-6 text-black/55">The strongest argument cites budget transparency and measurable timelines.</p></article>
                  <article className="glass rounded-3xl p-6"><div className="flex items-center justify-between"><span className="font-extrabold">Sentiment map</span><span className="rounded-full bg-[#2457ff]/10 px-3 py-1 text-xs font-bold text-[#1a3ab2]">Live</span></div><div className="sentiment-map-bg relative mt-4 h-48 overflow-hidden rounded-3xl"><span className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/82 p-3 text-xs font-bold shadow-sm">Austin +18 support · Boston split · London +32 verified turnout</span></div></article>
                  <article className="glass rounded-3xl p-6"><p className="text-xs font-extrabold uppercase tracking-[0.22em] text-black/38">Prediction market</p><div className="mt-3 flex items-end justify-between"><div><p className="font-extrabold">Will policy pass?</p><p className="text-sm text-black/50">Forecast confidence</p></div><p className="font-mono text-3xl font-bold">68%</p></div></article>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="feed" className="mx-auto max-w-7xl px-5 py-16 sm:px-7">
          <div className="grid gap-8 lg:grid-cols-[0.88fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Social poll feed</p>
              <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">An opinion network where every post asks the room.</h2>
              <p className="mt-5 text-lg leading-8 text-black/58">Quorum Check blends a social feed with structured decision tools: vote, discuss, save, share, follow topics, launch debate mode, and see instant AI summaries.</p>
            </div>
            <div className="space-y-5">
              {feedPolls.map((poll) => (
                <article key={poll.question} className="feature-card rounded-[1.75rem] border border-black/8 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink font-mono text-sm font-bold text-white">PS</span><div><p className="font-extrabold">{poll.tag}</p><p className="text-sm text-black/48">Verified topic · {poll.rep} · 6 min ago</p></div></div>
                    <span className="rounded-full bg-lilac/10 px-3 py-1 text-xs font-extrabold text-lilac">Trending</span>
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold leading-snug">{poll.question}</h3>
                  <div className="mt-5 grid gap-3">
                    {poll.options.map((option, index) => <PollOption key={option} label={option} initial={poll.p[index]} color={index === 0 ? "bg-lilac" : index === 1 ? "bg-[#2457ff]" : "bg-[#ffb23f]"} />)}
                  </div>
                  <div className="mt-5 grid gap-3 rounded-2xl border border-white/60 bg-white/55 p-4 text-sm text-black/60 shadow-sm backdrop-blur-xl sm:grid-cols-[1fr_auto]">
                    <p><span className="font-extrabold text-ink">AI insight:</span> The most persuasive comments mention measurable outcomes and transparent reporting.</p>
                    <button className="rounded-full bg-ink px-4 py-2 text-xs font-extrabold text-white" type="button">Open debate</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="map" className="mx-auto max-w-7xl px-5 py-16 sm:px-7">
          <div className="glass rounded-[2rem] p-5 sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
              <div>
                <p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Real-time sentiment map</p>
                <h2 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">See how opinion changes by city, state, country, age, and community.</h2>
                <div className="mt-6 flex flex-wrap gap-2">
                  {(Object.keys(regions) as Array<keyof typeof regions>).map((key) => (
                    <button key={key} onClick={() => setRegion(key)} className={`rounded-full px-4 py-2 text-sm font-bold ${region === key ? "bg-ink text-white" : "bg-black/5"}`} type="button">
                      {key === "age" ? "Age group" : key[0].toUpperCase() + key.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="glass rounded-3xl p-5"><p className="text-sm font-bold text-black/45">Most active region</p><p className="mt-2 text-2xl font-extrabold">{regionData[0]}</p><p className="mt-1 text-sm text-black/55">{regionData[1]}</p></div>
                <div className="glass rounded-3xl p-5"><p className="text-sm font-bold text-black/45">Verified turnout</p><p className="mt-2 text-2xl font-extrabold">86,420</p><p className="mt-1 text-sm text-black/55">Duplicate votes blocked: 3,184</p></div>
              </div>
            </div>
            <div className="sentiment-map-bg relative mt-8 min-h-[500px] overflow-hidden rounded-[2rem] p-6">
              <div className="absolute bottom-6 left-6 right-6 grid gap-3 md:grid-cols-4">
                {["Austin: Transit +34", "Boston: Housing split", "London: Climate +27", "Mumbai: Education +41"].map((item) => {
                  const [city, text] = item.split(": ");
                  return <div key={city} className="glass rounded-2xl p-4"><p className="text-xs font-bold text-black/45">{city}</p><p className="font-extrabold">{text}</p></div>;
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="insights" className="mx-auto max-w-7xl px-5 py-16 sm:px-7">
          <div className="mb-10 max-w-3xl"><p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">AI-generated insights</p><h2 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Opinion intelligence without making teams read every comment.</h2></div>
          <div className="grid gap-5 lg:grid-cols-4">{insights.map(([title, body]) => <article key={title} className="feature-card rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-sm"><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-black/38">{title}</p><p className="mt-5 text-lg font-extrabold leading-snug">{body}</p></article>)}</div>
        </section>

        <section id="debate" className="mx-auto max-w-7xl px-5 py-16 sm:px-7">
          <div className="grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div><p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Debate mode</p><h2 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Let each option make its strongest case.</h2><p className="mt-5 text-lg leading-8 text-black/58">Users argue for an option, the community votes on the strongest reasoning, and AI summarizes where the debate is actually moving.</p></div>
            <div className="grid gap-4 md:grid-cols-2">
              <article className="rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-soft"><span className="rounded-full bg-lilac/10 px-3 py-1 text-xs font-extrabold text-lilac">Option A</span><h3 className="mt-4 text-xl font-extrabold">Invest in transit first</h3><p className="mt-3 text-sm leading-6 text-black/58">The strongest argument links commute time, worker retention, and local business access.</p><div className="mt-5 flex items-center justify-between rounded-2xl bg-mist p-4"><span className="text-sm font-bold">Strongest argument</span><span className="font-mono text-xl font-bold">71%</span></div></article>
              <article className="rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-soft"><span className="rounded-full bg-[#ff6f61]/15 px-3 py-1 text-xs font-extrabold text-[#9b2f26]">Option B</span><h3 className="mt-4 text-xl font-extrabold">Fund parks first</h3><p className="mt-3 text-sm leading-6 text-black/58">Fact-checkers confirmed three sources on health outcomes and heat reduction.</p><div className="mt-5 flex items-center justify-between rounded-2xl bg-mist p-4"><span className="text-sm font-bold">Respect score</span><span className="font-mono text-xl font-bold">94</span></div></article>
              <article className="rounded-[1.75rem] border border-black/8 bg-[#17171f] p-6 text-white shadow-soft md:col-span-2"><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/45">AI debate summary</p><p className="mt-4 text-xl font-extrabold">The winning arguments cite measurable civic outcomes. Claims without source links are being downranked by community fact check.</p></article>
            </div>
          </div>
        </section>

        <section id="communities" className="mx-auto max-w-7xl px-5 py-16 sm:px-7">
          <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div className="max-w-3xl"><p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Verified community polls</p><h2 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Official polls from colleges, businesses, local governments, and organizations.</h2></div><Link href="/contact" className="w-fit rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white shadow-soft">Verify your community</Link></div>
          <div className="grid gap-5 md:grid-cols-3">{[["Northbridge College", "Student services vote", "42,100 participants"], ["Greenfield City Hall", "Budget priorities", "18,940 residents"], ["Orbit Labs", "Product council", "7,820 customers"]].map(([name, topic, participants]) => <article key={name} className="feature-card verified-card rounded-[1.75rem] border border-black/8 p-6 shadow-sm"><div className="flex items-center justify-between gap-4"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink text-sm font-extrabold text-white shadow-soft">QC</span><span className="rounded-full border border-white/70 bg-white/65 px-3 py-1 text-xs font-extrabold text-lilac shadow-sm backdrop-blur-xl">Verified</span></div><h3 className="mt-5 text-xl font-extrabold">{name}</h3><p className="mt-2 text-black/55">{topic}</p><p className="mt-5 rounded-2xl border border-white/70 bg-white/60 p-4 text-sm font-bold text-black/66 shadow-sm backdrop-blur-xl">{participants} · public results · deadline visible</p></article>)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-7">
          <div className="grid gap-5 lg:grid-cols-3">
            <article className="rounded-[2rem] bg-ink p-8 text-white shadow-soft"><p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-white/45">Anonymous but accountable</p><h2 className="mt-4 font-display text-4xl font-extrabold leading-tight">Private identity. Valid vote.</h2><p className="mt-5 leading-8 text-white/68">Quorum Check protects privacy while stopping duplicate votes, bots, spam, and low-quality participation.</p></article>
            <div className="grid gap-5 md:grid-cols-2 lg:col-span-2">{["Anonymous public identity", "Duplicate vote prevention", "Bot protection", "Verified human checks", "Reputation-based trust", "Report abuse and moderation"].map((item) => <div key={item} className="feature-card rounded-[1.75rem] border border-black/8 bg-white p-6 shadow-sm"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#e3fffa] font-mono text-sm font-bold text-lilac">ID</span><p className="mt-4 text-lg font-extrabold">{item}</p></div>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-7">
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-soft"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Prediction markets</p><h2 className="mt-3 font-display text-4xl font-extrabold">Forecast outcomes, not just opinions.</h2></div><span className="rounded-full bg-ink px-4 py-2 text-xs font-extrabold text-white">Future feature</span></div><div className="mt-8 rounded-3xl bg-mist p-5"><div className="flex items-end justify-between"><div><p className="font-extrabold">Will turnout exceed 70%?</p><p className="text-sm text-black/50">Market probability · resolves June 30</p></div><p className="font-mono text-5xl font-bold text-lilac">64%</p></div><div className="mt-5 h-3 overflow-hidden rounded-full bg-black/5"><div className="h-full w-[64%] rounded-full bg-lilac" /></div></div></article>
            <article id="create" className="rounded-[2rem] border border-black/8 bg-white p-8 shadow-soft"><p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Advanced survey logic</p><h2 className="mt-3 font-display text-4xl font-extrabold">A poll builder with Qualtrics-grade control.</h2><div className="mt-8 grid gap-3 sm:grid-cols-2">{["Branching logic", "Skip logic", "Weighted answers", "Demographic targeting", "Scheduled polls", "Visibility controls", "Anonymous response mode", "AI question improvement"].map((item) => <div key={item} className="rounded-2xl bg-mist p-4 text-sm font-extrabold">{item}</div>)}</div></article>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-7">
          <div className="mb-10 max-w-3xl"><p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Complete feature ecosystem</p><h2 className="mt-4 font-display text-4xl font-extrabold leading-tight sm:text-5xl">Everything a serious public-opinion product needs.</h2></div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{features.map(([title, body]) => <article key={title} className="feature-card rounded-[1.5rem] border border-black/8 bg-white p-5 shadow-sm"><h3 className="text-lg font-extrabold">{title}</h3><p className="mt-3 text-sm leading-6 text-black/55">{body}</p></article>)}</div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-7">
          <div className="overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-soft">
            <div className="grid lg:grid-cols-[.9fr_1.1fr]">
              <div className="p-8 sm:p-10"><p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Organization dashboard</p><h2 className="mt-4 font-display text-4xl font-extrabold leading-tight">Run verified community polls with clarity.</h2><p className="mt-5 text-lg leading-8 text-black/58">Manage official polls, export reports, moderate debate, inspect sentiment maps, and track member participation.</p><Link href="/contact" className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white shadow-soft">Request organization access</Link></div>
              <div className="bg-mist p-6"><div className="rounded-[1.75rem] bg-white p-5 shadow-sm"><div className="mb-5 flex items-center justify-between"><p className="font-extrabold">Verified dashboard</p><span className="rounded-full bg-[#00a884]/10 px-3 py-1 text-xs font-extrabold text-[#007a63]">Healthy</span></div><div className="grid gap-3 sm:grid-cols-3">{[["Active polls", "38", "bg-[#e9fbff]"], ["Response rate", "74%", "bg-[#fff0ec]"], ["Exports", "12", "bg-[#eafff8]"]].map(([label, value, bg]) => <div key={label} className={`rounded-2xl ${bg} p-4`}><p className="text-xs font-bold text-black/45">{label}</p><p className="mt-2 font-mono text-3xl font-bold">{value}</p></div>)}</div><div className="mt-4 rounded-2xl border border-black/5 p-4"><div className="mb-2 flex justify-between text-sm font-bold"><span>Moderation queue</span><span>18 reviewed</span></div><div className="h-2 rounded-full bg-black/5"><div className="h-2 w-[72%] rounded-full bg-lilac" /></div></div></div></div>
            </div>
          </div>
        </section>
      </main>
      <MinimalFooter />
    </>
  );
}
