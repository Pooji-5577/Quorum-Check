"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Building2,
  ChevronRight,
  Gift,
  Globe,
  Lock,
  MessageSquareText,
  QrCode,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
  Users,
  Vote,
} from "lucide-react";

type Role = "creator" | "voter" | null;

const creatorFeatures = [
  { icon: Sliders, label: "Poll Builder", desc: "Multiple-choice, scale, ranked-choice, and open-ended questions" },
  { icon: Users, label: "Granular Targeting", desc: "Filter by location, age brackets, and interests" },
  { icon: QrCode, label: "Omnichannel Distribution", desc: "Shareable links, QR codes, embeds, SMS, and email" },
  { icon: BarChart3, label: "Real-Time Analytics", desc: "Dashboards with demographic breakdowns and exports" },
  { icon: ShieldCheck, label: "Verification Badges", desc: "Trust markers for verified entities" },
];

const voterFeatures = [
  { icon: TrendingUp, label: "Personalised Feed", desc: "Trending polls, followed orgs, and interest-based suggestions" },
  { icon: Sparkles, label: "Instant Gratification", desc: "Live results unlocked immediately after voting" },
  { icon: MessageSquareText, label: "Topic-Based Discussion", desc: "Moderated comment threads on public polls" },
  { icon: Gift, label: "Gamified Rewards", desc: "Points, badges, and streaks for participation" },
  { icon: Lock, label: "Privacy-by-Design", desc: "Zero data-selling, granular consent for demographics" },
];

export default function RoleSelectScreen() {
  const [selected, setSelected] = useState<Role>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    router.push(selected === "creator" ? "/creator-studio" : "/feed");
    router.refresh();
  }

  return (
    <main className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col items-center justify-center px-5 py-14 sm:px-7">
      <div className="text-center">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-lilac">
          One last step
        </p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
          How will you use Quorum Check?
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-black/55">
          Choose your primary role. You can always access both experiences later from your profile settings.
        </p>
      </div>

      <div className="mt-10 grid w-full gap-5 sm:grid-cols-2">
        {/* Poll Creator Card */}
        <button
          type="button"
          onClick={() => setSelected("creator")}
          className={`group relative w-full rounded-[2rem] border-2 p-6 text-left transition-all sm:p-8 ${
            selected === "creator"
              ? "border-lilac bg-white shadow-float"
              : "border-black/8 bg-white/72 shadow-soft hover:border-lilac/30 hover:-translate-y-1"
          }`}
        >
          {selected === "creator" && (
            <div className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-lilac text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="3">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lilac/10">
            <Building2 className="h-7 w-7 text-lilac" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-extrabold">Poll Creator</h2>
          <p className="mt-1 text-sm text-black/50">
            For organisations, businesses, and councils
          </p>
          <div className="mt-5 space-y-3">
            {creatorFeatures.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-lilac" />
                <div>
                  <p className="text-sm font-bold">{label}</p>
                  <p className="text-xs leading-5 text-black/45">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </button>

        {/* Public User (Voter) Card */}
        <button
          type="button"
          onClick={() => setSelected("voter")}
          className={`group relative w-full rounded-[2rem] border-2 p-6 text-left transition-all sm:p-8 ${
            selected === "voter"
              ? "border-lilac bg-white shadow-float"
              : "border-black/8 bg-white/72 shadow-soft hover:border-lilac/30 hover:-translate-y-1"
          }`}
        >
          {selected === "voter" && (
            <div className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-lilac text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="3">
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-butter">
            <Vote className="h-7 w-7 text-[#d17a00]" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-extrabold">Public User</h2>
          <p className="mt-1 text-sm text-black/50">
            Vote, discuss, and follow what matters to you
          </p>
          <div className="mt-5 space-y-3">
            {voterFeatures.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#d17a00]" />
                <div>
                  <p className="text-sm font-bold">{label}</p>
                  <p className="text-xs leading-5 text-black/45">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </button>
      </div>

      <button
        type="button"
        disabled={!selected || loading}
        onClick={handleContinue}
        className="mt-8 flex items-center gap-2 rounded-full bg-lilac px-8 py-4 text-sm font-extrabold text-white shadow-float transition hover:-translate-y-0.5 hover:bg-[#d93e1b] focus:outline-none focus:ring-4 focus:ring-lilac/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Setting up..." : "Continue"}
        {!loading && <ChevronRight className="h-4 w-4" />}
      </button>

      <p className="mt-4 text-center text-xs text-black/40">
        You can switch roles anytime from your profile settings.
      </p>
    </main>
  );
}
