"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  CirclePlus,
  Flame,
  MessageCircle,
  Plus,
  Search,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { PageHeading, Stat } from "./ProductShell";

type ProductPoll = {
  id: number;
  author: string;
  topic: string;
  pollType: string;
  question: string;
  createdAt: string;
  options: Array<{ id: number; label: string; votes: number }>;
  regionalResults: Record<SentimentPeriod, RegionalResult[]>;
  comments: Array<{
    id: number;
    author_name: string;
    stance: string;
    body: string;
    created_at: string;
  }>;
  debate: {
    framingQuestion: string;
    context: string;
    supportLabel: string;
    opposeLabel: string;
    groundRules: string;
    canEdit: boolean;
  } | null;
  votedOptionId: number | null;
};
type Community = {
  id: number;
  name: string;
  description: string;
  members: number;
  joined: number;
};
type ProductData = {
  polls: ProductPoll[];
  communities: Community[];
  personalization: {
    configured: boolean;
    selectedTopics: string[];
    availableTopics: string[];
    rankingStyle: RankingStyle;
    preferredFormats: PreferredFormat[];
    discoveryLevel: DiscoveryLevel;
  };
  insights: {
    polls: number;
    votes: number;
    comments: number;
    communities: number;
  };
};

type FeedScope = "For you" | "Following" | "Newest";
type RankingStyle = "focused" | "balanced" | "fresh";
type PreferredFormat = "Multiple choice" | "Ranking" | "Debate" | "Survey";
type DiscoveryLevel = "familiar" | "balanced" | "adventurous";
type SentimentPeriod = "24 hours" | "7 days" | "30 days";
type RegionalResult = {
  name: string;
  total: number;
  options: Array<{
    optionId: number;
    label: string;
    votes: number;
    percent: number;
  }>;
};

const rankingOptions: Array<{
  value: RankingStyle;
  label: string;
  description: string;
}> = [
  {
    value: "focused",
    label: "Stay focused",
    description: "Prioritize only the topics you selected.",
  },
  {
    value: "balanced",
    label: "Balanced mix",
    description: "Mix your interests with relevant popular discussions.",
  },
  {
    value: "fresh",
    label: "Latest first",
    description: "Favor the newest conversations across Quorum Check.",
  },
];

const formatOptions: Array<{
  value: PreferredFormat;
  label: string;
  description: string;
}> = [
  {
    value: "Multiple choice",
    label: "Quick polls",
    description: "Fast questions with clear choices.",
  },
  {
    value: "Ranking",
    label: "Ranked choices",
    description: "Put several priorities in order.",
  },
  {
    value: "Debate",
    label: "Debates",
    description: "Read and respond to different viewpoints.",
  },
  {
    value: "Survey",
    label: "Detailed surveys",
    description: "Explore a subject through multiple questions.",
  },
];

const discoveryOptions: Array<{
  value: DiscoveryLevel;
  label: string;
  description: string;
}> = [
  {
    value: "familiar",
    label: "Mostly familiar",
    description: "Stay close to the topics you follow.",
  },
  {
    value: "balanced",
    label: "Some discovery",
    description: "Blend followed topics with relevant new ones.",
  },
  {
    value: "adventurous",
    label: "More variety",
    description: "Introduce more perspectives outside your usual interests.",
  },
];

const MOCK_POLLS: ProductPoll[] = [
  {
    id: 1,
    author: "Noah Williams",
    topic: "Technology",
    pollType: "Multiple choice",
    question: "Which safeguard matters most for AI-generated political content?",
    createdAt: new Date().toISOString(),
    options: [
      { id: 1, label: "Visible disclosure labels", votes: 1204 },
      { id: 2, label: "Independent source audits", votes: 793 },
      { id: 3, label: "Platform distribution limits", votes: 544 },
    ],
    regionalResults: {
      "24 hours": [
        { name: "West", total: 420, options: [{ optionId: 1, label: "Visible disclosure labels", votes: 210, percent: 50 }, { optionId: 2, label: "Independent source audits", votes: 130, percent: 31 }, { optionId: 3, label: "Platform distribution limits", votes: 80, percent: 19 }] },
        { name: "Midwest", total: 310, options: [{ optionId: 1, label: "Visible disclosure labels", votes: 140, percent: 45 }, { optionId: 2, label: "Independent source audits", votes: 100, percent: 32 }, { optionId: 3, label: "Platform distribution limits", votes: 70, percent: 23 }] },
        { name: "South", total: 380, options: [{ optionId: 1, label: "Visible disclosure labels", votes: 190, percent: 50 }, { optionId: 2, label: "Independent source audits", votes: 110, percent: 29 }, { optionId: 3, label: "Platform distribution limits", votes: 80, percent: 21 }] },
        { name: "Northeast", total: 290, options: [{ optionId: 1, label: "Visible disclosure labels", votes: 160, percent: 55 }, { optionId: 2, label: "Independent source audits", votes: 80, percent: 28 }, { optionId: 3, label: "Platform distribution limits", votes: 50, percent: 17 }] },
      ],
      "7 days": [
        { name: "West", total: 1200, options: [{ optionId: 1, label: "Visible disclosure labels", votes: 580, percent: 48 }, { optionId: 2, label: "Independent source audits", votes: 370, percent: 31 }, { optionId: 3, label: "Platform distribution limits", votes: 250, percent: 21 }] },
        { name: "Midwest", total: 900, options: [{ optionId: 1, label: "Visible disclosure labels", votes: 410, percent: 46 }, { optionId: 2, label: "Independent source audits", votes: 290, percent: 32 }, { optionId: 3, label: "Platform distribution limits", votes: 200, percent: 22 }] },
        { name: "South", total: 1050, options: [{ optionId: 1, label: "Visible disclosure labels", votes: 520, percent: 50 }, { optionId: 2, label: "Independent source audits", votes: 310, percent: 30 }, { optionId: 3, label: "Platform distribution limits", votes: 220, percent: 21 }] },
        { name: "Northeast", total: 850, options: [{ optionId: 1, label: "Visible disclosure labels", votes: 450, percent: 53 }, { optionId: 2, label: "Independent source audits", votes: 230, percent: 27 }, { optionId: 3, label: "Platform distribution limits", votes: 170, percent: 20 }] },
      ],
      "30 days": [
        { name: "West", total: 3200, options: [{ optionId: 1, label: "Visible disclosure labels", votes: 1540, percent: 48 }, { optionId: 2, label: "Independent source audits", votes: 1020, percent: 32 }, { optionId: 3, label: "Platform distribution limits", votes: 640, percent: 20 }] },
        { name: "Midwest", total: 2400, options: [{ optionId: 1, label: "Visible disclosure labels", votes: 1100, percent: 46 }, { optionId: 2, label: "Independent source audits", votes: 780, percent: 33 }, { optionId: 3, label: "Platform distribution limits", votes: 520, percent: 22 }] },
        { name: "South", total: 2800, options: [{ optionId: 1, label: "Visible disclosure labels", votes: 1380, percent: 49 }, { optionId: 2, label: "Independent source audits", votes: 840, percent: 30 }, { optionId: 3, label: "Platform distribution limits", votes: 580, percent: 21 }] },
        { name: "Northeast", total: 2200, options: [{ optionId: 1, label: "Visible disclosure labels", votes: 1190, percent: 54 }, { optionId: 2, label: "Independent source audits", votes: 600, percent: 27 }, { optionId: 3, label: "Platform distribution limits", votes: 410, percent: 19 }] },
      ],
    },
    comments: [
      { id: 1, author_name: "Sarah K.", stance: "Support", body: "Transparency labels are the bare minimum. People deserve to know when content is AI-generated.", created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, author_name: "Marcus T.", stance: "Oppose", body: "Labels alone won't help if the underlying model is biased. We need audits.", created_at: new Date(Date.now() - 7200000).toISOString() },
    ],
    debate: null,
    votedOptionId: null,
  },
  {
    id: 2,
    author: "Maya Chen",
    topic: "Local Policy",
    pollType: "Multiple choice",
    question: "Should cities convert more downtown parking into public green space?",
    createdAt: new Date().toISOString(),
    options: [
      { id: 4, label: "Yes, prioritize people", votes: 842 },
      { id: 5, label: "Keep current parking", votes: 291 },
      { id: 6, label: "Pilot it in select blocks", votes: 467 },
    ],
    regionalResults: {
      "24 hours": [
        { name: "West", total: 280, options: [{ optionId: 4, label: "Yes, prioritize people", votes: 150, percent: 54 }, { optionId: 5, label: "Keep current parking", votes: 50, percent: 18 }, { optionId: 6, label: "Pilot it in select blocks", votes: 80, percent: 29 }] },
        { name: "Midwest", total: 220, options: [{ optionId: 4, label: "Yes, prioritize people", votes: 90, percent: 41 }, { optionId: 5, label: "Keep current parking", votes: 70, percent: 32 }, { optionId: 6, label: "Pilot it in select blocks", votes: 60, percent: 27 }] },
        { name: "South", total: 260, options: [{ optionId: 4, label: "Yes, prioritize people", votes: 120, percent: 46 }, { optionId: 5, label: "Keep current parking", votes: 60, percent: 23 }, { optionId: 6, label: "Pilot it in select blocks", votes: 80, percent: 31 }] },
        { name: "Northeast", total: 240, options: [{ optionId: 4, label: "Yes, prioritize people", votes: 140, percent: 58 }, { optionId: 5, label: "Keep current parking", votes: 40, percent: 17 }, { optionId: 6, label: "Pilot it in select blocks", votes: 60, percent: 25 }] },
      ],
      "7 days": [
        { name: "West", total: 800, options: [{ optionId: 4, label: "Yes, prioritize people", votes: 430, percent: 54 }, { optionId: 5, label: "Keep current parking", votes: 140, percent: 18 }, { optionId: 6, label: "Pilot it in select blocks", votes: 230, percent: 29 }] },
        { name: "Midwest", total: 620, options: [{ optionId: 4, label: "Yes, prioritize people", votes: 250, percent: 40 }, { optionId: 5, label: "Keep current parking", votes: 200, percent: 32 }, { optionId: 6, label: "Pilot it in select blocks", votes: 170, percent: 27 }] },
        { name: "South", total: 730, options: [{ optionId: 4, label: "Yes, prioritize people", votes: 340, percent: 47 }, { optionId: 5, label: "Keep current parking", votes: 170, percent: 23 }, { optionId: 6, label: "Pilot it in select blocks", votes: 220, percent: 30 }] },
        { name: "Northeast", total: 680, options: [{ optionId: 4, label: "Yes, prioritize people", votes: 400, percent: 59 }, { optionId: 5, label: "Keep current parking", votes: 110, percent: 16 }, { optionId: 6, label: "Pilot it in select blocks", votes: 170, percent: 25 }] },
      ],
      "30 days": [
        { name: "West", total: 2100, options: [{ optionId: 4, label: "Yes, prioritize people", votes: 1130, percent: 54 }, { optionId: 5, label: "Keep current parking", votes: 380, percent: 18 }, { optionId: 6, label: "Pilot it in select blocks", votes: 590, percent: 28 }] },
        { name: "Midwest", total: 1600, options: [{ optionId: 4, label: "Yes, prioritize people", votes: 640, percent: 40 }, { optionId: 5, label: "Keep current parking", votes: 520, percent: 33 }, { optionId: 6, label: "Pilot it in select blocks", votes: 440, percent: 28 }] },
        { name: "South", total: 1900, options: [{ optionId: 4, label: "Yes, prioritize people", votes: 890, percent: 47 }, { optionId: 5, label: "Keep current parking", votes: 430, percent: 23 }, { optionId: 6, label: "Pilot it in select blocks", votes: 580, percent: 31 }] },
        { name: "Northeast", total: 1800, options: [{ optionId: 4, label: "Yes, prioritize people", votes: 1060, percent: 59 }, { optionId: 5, label: "Keep current parking", votes: 290, percent: 16 }, { optionId: 6, label: "Pilot it in select blocks", votes: 450, percent: 25 }] },
      ],
    },
    comments: [
      { id: 3, author_name: "James R.", stance: "Support", body: "More green space improves mental health and property values. Win-win.", created_at: new Date(Date.now() - 5400000).toISOString() },
    ],
    debate: null,
    votedOptionId: null,
  },
];

const MOCK_DATA: ProductData = {
  polls: MOCK_POLLS,
  communities: [
    { id: 1, name: "Better Cities", description: "Urban design, mobility, housing, and public space.", members: 38400, joined: 1 },
    { id: 2, name: "Responsible AI", description: "Practical governance for transparent, accountable AI.", members: 26100, joined: 0 },
    { id: 3, name: "Future of Work", description: "Workplace policy, skills, flexibility, and automation.", members: 19800, joined: 0 },
    { id: 4, name: "Local Climate Action", description: "Community-led resilience and clean-energy decisions.", members: 14300, joined: 0 },
  ],
  personalization: {
    configured: true,
    selectedTopics: ["Local Policy", "Technology"],
    availableTopics: ["Community", "Local Policy", "Technology", "Climate", "Education", "Healthcare", "Work", "Business", "Science", "Culture", "Sports", "Finance", "Housing", "Transportation", "Public Safety"],
    rankingStyle: "focused",
    preferredFormats: ["Multiple choice", "Debate"],
    discoveryLevel: "familiar",
  },
  insights: { polls: 2, votes: 4141, comments: 3, communities: 4 },
};

function useProductData(_scope?: FeedScope) {
  const [data, setData] = useState<ProductData | null>(MOCK_DATA);
  const error = "";
  const refresh = useCallback(async () => {
    setData({ ...MOCK_DATA });
  }, []);
  return { data, error, refresh };
}

async function productAction(_body: Record<string, unknown>) {
  return { success: true };
}

function PollCard({
  poll,
  onChanged,
}: {
  poll: ProductPoll;
  onChanged: () => Promise<void>;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [shared, setShared] = useState(false);
  const total = poll.options.reduce((sum, option) => sum + option.votes, 0);
  async function vote(optionId: number) {
    if (poll.votedOptionId || busy) return;
    setBusy(true);
    setError("");
    try {
      await productAction({ action: "vote", pollId: poll.id, optionId });
      await onChanged();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to vote.");
    } finally {
      setBusy(false);
    }
  }
  async function share() {
    const url = `${window.location.origin}/feed?poll=${poll.id}`;
    try {
      if (navigator.share) await navigator.share({ title: poll.question, url });
      else await navigator.clipboard.writeText(url);
      setShared(true);
    } catch {
      setShared(false);
    }
  }
  return (
    <article className="border-b border-black/8 bg-white px-5 py-6 first:border-t sm:px-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-xs font-extrabold text-white">
            {poll.author
              .split(" ")
              .map((p) => p[0])
              .join("")}
          </span>
          <div>
            <p className="font-extrabold">{poll.author}</p>
            <p className="mt-0.5 text-xs text-black/40">
              {new Date(`${poll.createdAt}Z`).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}{" "}
              · {poll.topic}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <span className="inline-flex rounded-full bg-butter px-3 py-1 text-xs font-extrabold text-lilac">
          {poll.pollType}
        </span>
      </div>
      <h2 className="mt-5 font-display text-xl font-extrabold leading-snug sm:text-2xl">
        {poll.question}
      </h2>
      <div className="mt-5 space-y-2.5">
        {poll.options.map((option) => {
          const percent = total ? Math.round((option.votes / total) * 100) : 0;
          return (
            <button
              disabled={busy || Boolean(poll.votedOptionId)}
              key={option.id}
              onClick={() => vote(option.id)}
              className={`relative flex w-full overflow-hidden rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${poll.votedOptionId === option.id ? "border-lilac" : "border-black/10 hover:border-black/25"}`}
            >
              <span
                className="absolute inset-y-0 left-0 bg-peach/55 transition-all"
                style={{ width: `${poll.votedOptionId ? percent : 0}%` }}
              />
              <span className="relative flex w-full justify-between gap-4">
                <span>{option.label}</span>
                {poll.votedOptionId ? <span>{percent}%</span> : null}
              </span>
            </button>
          );
        })}
      </div>
      {error ? (
        <p className="mt-3 text-xs font-bold text-red-600">{error}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs font-bold text-black/42">
        <span>{total.toLocaleString()} votes</span>
        <div className="flex items-center gap-4">
          <a
            href={`/debate?poll=${poll.id}`}
            className="flex items-center gap-1.5 text-lilac hover:text-ink"
          >
            <MessageCircle className="h-4 w-4" />
            {poll.debate ? "Join debate" : "Start debate"}
            {poll.comments.length ? ` · ${poll.comments.length}` : ""}
          </a>
          <button
            onClick={share}
            className="flex items-center gap-1.5 hover:text-lilac"
          >
            <Share2 className="h-4 w-4" />
            {shared ? "Link copied" : "Share"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function FeedScreen({
  openPersonalization = false,
}: {
  openPersonalization?: boolean;
}) {
  const [scope, setScope] = useState<FeedScope>("For you");
  const [showPreferences, setShowPreferences] = useState(false);
  const [selectedTopics, setSelectedTopics] = useState<string[] | null>(null);
  const [rankingStyle, setRankingStyle] = useState<RankingStyle | null>(null);
  const [preferredFormats, setPreferredFormats] = useState<
    PreferredFormat[] | null
  >(null);
  const [discoveryLevel, setDiscoveryLevel] = useState<DiscoveryLevel | null>(
    null,
  );
  const [preferenceError, setPreferenceError] = useState("");
  const [savingPreferences, setSavingPreferences] = useState(false);
  const router = useRouter();
  const { data, error, refresh } = useProductData(scope);
  const personalization = data?.personalization;
  const activeTopics = selectedTopics ?? personalization?.selectedTopics ?? [];
  const activeRankingStyle =
    rankingStyle ?? personalization?.rankingStyle ?? "balanced";
  const activeFormats = preferredFormats ??
    personalization?.preferredFormats ?? ["Multiple choice"];
  const activeDiscoveryLevel =
    discoveryLevel ?? personalization?.discoveryLevel ?? "balanced";
  const preferencesOpen =
    openPersonalization ||
    showPreferences ||
    personalization?.configured === false;

  function toggleTopic(topic: string) {
    setSelectedTopics((current) =>
      (current ?? activeTopics).includes(topic)
        ? (current ?? activeTopics).filter((item) => item !== topic)
        : [...(current ?? activeTopics), topic],
    );
  }

  function toggleFormat(format: PreferredFormat) {
    setPreferredFormats((current) => {
      const formats = current ?? activeFormats;
      return formats.includes(format)
        ? formats.filter((item) => item !== format)
        : [...formats, format];
    });
  }

  function editPreferences() {
    setSelectedTopics(personalization?.selectedTopics || []);
    setRankingStyle(personalization?.rankingStyle || "balanced");
    setPreferredFormats(
      personalization?.preferredFormats || ["Multiple choice"],
    );
    setDiscoveryLevel(personalization?.discoveryLevel || "balanced");
    setPreferenceError("");
    setShowPreferences(true);
  }

  async function savePreferences() {
    if (!activeTopics.length) {
      setPreferenceError("Choose at least one topic to personalize your feed.");
      return;
    }
    if (!activeFormats.length) {
      setPreferenceError("Choose at least one conversation format.");
      return;
    }
    setSavingPreferences(true);
    setPreferenceError("");
    try {
      await productAction({
        action: "set_topic_preferences",
        topics: activeTopics,
        rankingStyle: activeRankingStyle,
        preferredFormats: activeFormats,
        discoveryLevel: activeDiscoveryLevel,
      });
      await refresh();
      setShowPreferences(false);
      setSelectedTopics(null);
      setRankingStyle(null);
      setPreferredFormats(null);
      setDiscoveryLevel(null);
      router.replace("/feed", { scroll: false });
    } catch (reason) {
      setPreferenceError(
        reason instanceof Error
          ? reason.message
          : "Unable to save your topics.",
      );
    } finally {
      setSavingPreferences(false);
    }
  }

  return (
    <>
      <PageHeading
        title="Your feed"
        description="Live questions and debates selected from the communities and topics you follow."
        action={
          <a
            href="/create-poll"
            className="inline-flex items-center gap-2 rounded-full bg-lilac px-5 py-3 text-sm font-extrabold text-white"
          >
            <CirclePlus className="h-4 w-4" />
            Create poll
          </a>
        }
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-2xl border border-black/8 bg-white shadow-sm">
          <div className="flex flex-wrap gap-2 border-b border-black/8 px-5 py-4">
            {(["For you", "Following", "Newest"] as FeedScope[]).map((item) => (
              <button
                key={item}
                onClick={() => setScope(item)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${scope === item ? "bg-ink text-white" : "text-black/45 hover:bg-black/5"}`}
              >
                {item}
              </button>
            ))}
            {personalization?.configured ? (
              <button
                onClick={editPreferences}
                className="ml-auto rounded-full px-3 py-2 text-xs font-extrabold text-lilac hover:bg-lilac/5"
              >
                Tune feed
              </button>
            ) : null}
          </div>
          {preferencesOpen ? (
            <div className="border-b border-black/8 bg-butter/45 px-5 py-6 sm:px-7">
              <div className="max-w-4xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-lilac">
                  Personalize your feed
                </p>
                <h2 className="mt-2 font-display text-2xl font-extrabold">
                  What topics do you want to follow?
                </h2>
                <p className="mt-2 text-sm leading-6 text-black/52">
                  Your choices shape “For you” and determine what appears in
                  “Following.” Votes and responses also improve your ranking.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {(personalization?.availableTopics || []).map((topic) => {
                    const selected = activeTopics.includes(topic);
                    return (
                      <button
                        type="button"
                        key={topic}
                        aria-pressed={selected}
                        onClick={() => toggleTopic(topic)}
                        className={`rounded-full border px-4 py-2 text-sm font-extrabold transition ${selected ? "border-ink bg-ink text-white" : "border-black/12 bg-white text-black/62 hover:border-black/30"}`}
                      >
                        {selected ? "✓ " : ""}
                        {topic}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-7 text-sm font-extrabold">
                  How should we rank your “For you” feed?
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {rankingOptions.map((option) => {
                    const selected = activeRankingStyle === option.value;
                    return (
                      <button
                        type="button"
                        key={option.value}
                        aria-pressed={selected}
                        onClick={() => setRankingStyle(option.value)}
                        className={`rounded-xl border p-4 text-left transition ${selected ? "border-lilac bg-white ring-2 ring-lilac/10" : "border-black/10 bg-white/60 hover:border-black/25"}`}
                      >
                        <span className="block text-sm font-extrabold">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-black/45">
                          {option.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-7 text-sm font-extrabold">
                  Which conversation formats do you prefer?
                </p>
                <p className="mt-1 text-xs text-black/45">
                  Select one or more.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {formatOptions.map((option) => {
                    const selected = activeFormats.includes(option.value);
                    return (
                      <button
                        type="button"
                        key={option.value}
                        aria-pressed={selected}
                        onClick={() => toggleFormat(option.value)}
                        className={`rounded-xl border p-4 text-left transition ${selected ? "border-ink bg-ink text-white" : "border-black/10 bg-white/60 hover:border-black/25"}`}
                      >
                        <span className="block text-sm font-extrabold">
                          {selected ? "✓ " : ""}
                          {option.label}
                        </span>
                        <span
                          className={`mt-1 block text-xs leading-5 ${selected ? "text-white/60" : "text-black/45"}`}
                        >
                          {option.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-7 text-sm font-extrabold">
                  How much should we broaden your recommendations?
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {discoveryOptions.map((option) => {
                    const selected = activeDiscoveryLevel === option.value;
                    return (
                      <button
                        type="button"
                        key={option.value}
                        aria-pressed={selected}
                        onClick={() => setDiscoveryLevel(option.value)}
                        className={`rounded-xl border p-4 text-left transition ${selected ? "border-lilac bg-white ring-2 ring-lilac/10" : "border-black/10 bg-white/60 hover:border-black/25"}`}
                      >
                        <span className="block text-sm font-extrabold">
                          {option.label}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-black/45">
                          {option.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {preferenceError ? (
                  <p className="mt-3 text-sm font-bold text-red-600">
                    {preferenceError}
                  </p>
                ) : null}
                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="button"
                    disabled={savingPreferences}
                    onClick={savePreferences}
                    className="rounded-full bg-lilac px-5 py-2.5 text-sm font-extrabold text-white disabled:opacity-50"
                  >
                    {savingPreferences ? "Saving..." : "Save preferences"}
                  </button>
                  {personalization?.configured ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowPreferences(false);
                        setSelectedTopics(null);
                        setRankingStyle(null);
                        setPreferredFormats(null);
                        setDiscoveryLevel(null);
                        router.replace("/feed", { scroll: false });
                      }}
                      className="rounded-full px-4 py-2.5 text-sm font-bold text-black/45"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}
          {error ? (
            <p className="p-6 text-sm font-bold text-red-600">{error}</p>
          ) : null}
          {!data ? (
            <p className="p-8 text-sm text-black/40">Loading live polls...</p>
          ) : data.polls.length ? (
            data.polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} onChanged={refresh} />
            ))
          ) : (
            <div className="p-8 text-center">
              <p className="font-display text-xl font-extrabold">
                No followed-topic polls yet
              </p>
              <p className="mt-2 text-sm text-black/45">
                Tune your feed or check Newest for more conversations.
              </p>
            </div>
          )}
        </section>
        <aside className="space-y-7">
          <div>
            <h3 className="font-display text-lg font-extrabold">
              Trending now
            </h3>
            <div className="mt-4 space-y-4">
              {[
                "AI transparency rules",
                "Urban heat planning",
                "Four-day work week",
                "Public transit funding",
              ].map((topic, index) => (
                <div
                  key={topic}
                  className="flex gap-3 border-b border-black/7 pb-4"
                >
                  <span className="font-mono text-sm font-bold text-lilac">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-extrabold">{topic}</p>
                    <p className="mt-1 text-xs text-black/40">
                      {(12.8 - index * 2.1).toFixed(1)}k votes today
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-ink p-6 text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(240,74,35,.42),transparent_19rem),radial-gradient(circle_at_12%_88%,rgba(255,178,63,.18),transparent_22rem)]" />
            <div className="relative">
            <ShieldCheck className="h-6 w-6 text-peach" />
            <h3 className="mt-4 font-display text-xl font-extrabold">
              Verified voices
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Identity checks protect poll integrity without exposing your
              public profile.
            </p>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

const mapMarkerPositions = [
  { left: 22, top: 40 },
  { left: 48, top: 39 },
  { left: 57, top: 64 },
  { left: 74, top: 33 },
];

export function SentimentScreen() {
  const [period, setPeriod] = useState<SentimentPeriod>("7 days");
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null);
  const [selectedRegionName, setSelectedRegionName] = useState("West");
  const { data, error } = useProductData();
  const selectedPoll =
    data?.polls.find((poll) => poll.id === selectedPollId) || data?.polls[0];
  const regions = selectedPoll?.regionalResults[period] || [];
  const region =
    regions.find((item) => item.name === selectedRegionName) || regions[0];
  const leadingOption = region?.options.reduce<
    RegionalResult["options"][number] | null
  >(
    (leading, option) =>
      !leading || option.votes > leading.votes ? option : leading,
    null,
  );
  const nationalTotal =
    selectedPoll?.options.reduce((sum, option) => sum + option.votes, 0) || 0;
  const nationalLeading = selectedPoll?.options.reduce<
    ProductPoll["options"][number] | null
  >(
    (leading, option) =>
      !leading || option.votes > leading.votes ? option : leading,
    null,
  );
  const nationalLeadingPercent =
    nationalTotal && nationalLeading
      ? Math.round((nationalLeading.votes / nationalTotal) * 100)
      : 0;

  return (
    <>
      <PageHeading
        title="Sentiment map"
        description="Compare how each region answered a specific poll question."
        action={
          <div className="flex rounded-full border border-black/10 bg-white p-1">
            {(["24 hours", "7 days", "30 days"] as SentimentPeriod[]).map(
              (item) => (
                <button
                  key={item}
                  onClick={() => setPeriod(item)}
                  className={`rounded-full px-4 py-2 text-xs font-bold ${period === item ? "bg-ink text-white" : "text-black/45"}`}
                >
                  {item}
                </button>
              ),
            )}
          </div>
        }
      />
      {error ? (
        <p className="mb-5 text-sm font-bold text-red-600">{error}</p>
      ) : null}
      <label className="mb-6 block max-w-3xl text-sm font-extrabold">
        Question to map
        <select
          value={selectedPoll?.id || ""}
          onChange={(event) => {
            setSelectedPollId(Number(event.target.value));
            setSelectedRegionName("West");
          }}
          className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3.5 font-normal outline-none focus:border-lilac"
        >
          {!data ? <option>Loading questions...</option> : null}
          {data?.polls.map((poll) => (
            <option key={poll.id} value={poll.id}>
              {poll.question}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-7 lg:grid-cols-[1fr_360px]">
        <section className="relative min-h-[560px] overflow-hidden rounded-2xl border border-black/8 bg-[#eef0e9]">
          <div className="sentiment-map-bg absolute inset-0 opacity-90" />
          <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-extrabold shadow-sm backdrop-blur">
            National leader · {nationalLeading?.label || "No responses"}
            {nationalLeading ? ` · ${nationalLeadingPercent}%` : ""}
          </div>
          {regions.map((item, index) => (
            <button
              key={item.name}
              onClick={() => setSelectedRegionName(item.name)}
              style={{
                left: `${mapMarkerPositions[index]?.left || 50}%`,
                top: `${mapMarkerPositions[index]?.top || 50}%`,
              }}
              title={`${item.name}: ${item.total.toLocaleString()} responses`}
              className={`absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white text-sm font-extrabold shadow-lg transition hover:scale-110 ${region?.name === item.name ? "bg-lilac text-white" : "bg-ink text-white"}`}
            >
              {item.total
                ? Math.max(...item.options.map((option) => option.percent))
                : "—"}
            </button>
          ))}
        </section>
        <aside className="rounded-2xl border border-black/8 bg-white p-6">
          <p className="text-xs font-bold uppercase text-lilac">
            Selected region
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold">
            {region?.name || "No region"}
          </h2>
          <p className="mt-1 text-sm text-black/45">
            {period} · {(region?.total || 0).toLocaleString()} responses
          </p>
          <div className="my-7 border-y border-black/8 py-6">
            <p className="font-display text-6xl font-extrabold">
              {leadingOption?.percent || 0}
              <span className="text-2xl text-black/30">%</span>
            </p>
            <p className="mt-2 text-sm font-extrabold text-lilac">
              {leadingOption?.label || "No responses in this period"}
            </p>
          </div>
          <p className="text-xs font-bold uppercase text-black/35">
            Selected question
          </p>
          <p className="mt-2 text-sm font-extrabold leading-6">
            {selectedPoll?.question || "Loading question..."}
          </p>
          <div className="mt-7 space-y-4">
            {region?.options.map((option) => (
              <div key={option.optionId}>
                <div className="mb-1 flex justify-between text-xs font-bold">
                  <span className="max-w-[220px] truncate">{option.label}</span>
                  <span>{option.percent}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/7">
                  <div
                    className="h-full rounded-full bg-lilac"
                    style={{ width: `${option.percent}%` }}
                  />
                </div>
              </div>
            )) || null}
          </div>
        </aside>
      </div>
    </>
  );
}

function DebateSetupForm({
  poll,
  onSaved,
  onCancel,
}: {
  poll: ProductPoll;
  onSaved: () => Promise<void>;
  onCancel?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) return;
    const fields = new FormData(form);
    setBusy(true);
    setError("");
    try {
      await productAction({
        action: "save_debate",
        pollId: poll.id,
        framingQuestion: fields.get("framingQuestion"),
        context: fields.get("context"),
        supportLabel: fields.get("supportLabel"),
        opposeLabel: fields.get("opposeLabel"),
        groundRules: fields.get("groundRules"),
      });
      await onSaved();
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to save debate.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto max-w-4xl rounded-2xl border border-black/8 bg-white p-6 sm:p-8"
    >
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-lilac">
        {poll.debate ? "Edit debate framing" : "Start a debate"}
      </p>
      <h2 className="mt-2 font-display text-3xl font-extrabold">
        Customize this question for discussion
      </h2>
      <p className="mt-2 text-sm leading-6 text-black/50">
        The original poll stays unchanged. These details help participants
        understand the debate and take clear positions.
      </p>
      <label className="mt-7 block text-sm font-extrabold">
        Debate question
        <textarea
          name="framingQuestion"
          required
          minLength={10}
          maxLength={220}
          rows={3}
          defaultValue={poll.debate?.framingQuestion || poll.question}
          className="mt-2 w-full resize-none rounded-xl border border-black/10 p-4 text-lg font-bold outline-none focus:border-lilac"
        />
      </label>
      <label className="mt-5 block text-sm font-extrabold">
        Context or background
        <textarea
          name="context"
          maxLength={1200}
          rows={4}
          defaultValue={poll.debate?.context || ""}
          placeholder="Add facts, constraints, or background participants should consider."
          className="mt-2 w-full resize-none rounded-xl border border-black/10 p-4 font-normal leading-6 outline-none focus:border-lilac"
        />
      </label>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-extrabold">
          Supporting position label
          <input
            name="supportLabel"
            required
            minLength={2}
            maxLength={40}
            defaultValue={poll.debate?.supportLabel || "Support"}
            className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-lilac"
          />
        </label>
        <label className="text-sm font-extrabold">
          Opposing position label
          <input
            name="opposeLabel"
            required
            minLength={2}
            maxLength={40}
            defaultValue={poll.debate?.opposeLabel || "Oppose"}
            className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3 font-normal outline-none focus:border-lilac"
          />
        </label>
      </div>
      <label className="mt-5 block text-sm font-extrabold">
        Ground rules
        <textarea
          name="groundRules"
          maxLength={500}
          rows={2}
          defaultValue={poll.debate?.groundRules || ""}
          placeholder="For example: cite sources, challenge ideas rather than people."
          className="mt-2 w-full resize-none rounded-xl border border-black/10 p-4 font-normal outline-none focus:border-lilac"
        />
      </label>
      {error ? (
        <p className="mt-4 text-sm font-bold text-red-600">{error}</p>
      ) : null}
      <div className="mt-6 flex gap-3">
        <button
          disabled={busy}
          className="rounded-full bg-lilac px-6 py-3 text-sm font-extrabold text-white disabled:opacity-50"
        >
          {busy ? "Saving..." : poll.debate ? "Save changes" : "Start debate"}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-5 py-3 text-sm font-bold text-black/45"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

export function DebateScreen({ pollId }: { pollId?: number }) {
  const [stance, setStance] = useState<"support" | "unsure" | "oppose">(
    "support",
  );
  const [draft, setDraft] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [editingFraming, setEditingFraming] = useState(false);
  const { data, error, refresh } = useProductData();
  const poll = pollId
    ? data?.polls.find((item) => item.id === pollId)
    : data?.polls[0];
  const debate = poll?.debate;
  const stanceOptions = debate
    ? [
        { value: "support" as const, label: debate.supportLabel },
        { value: "unsure" as const, label: "Unsure" },
        { value: "oppose" as const, label: debate.opposeLabel },
      ]
    : [];
  async function reply(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim() || !poll) return;
    try {
      await productAction({
        action: "comment",
        pollId: poll.id,
        text: draft,
        stance: stanceOptions.find((item) => item.value === stance)?.label,
      });
      setDraft("");
      setSubmitError("");
      await refresh();
    } catch (reason) {
      setSubmitError(
        reason instanceof Error ? reason.message : "Unable to post response.",
      );
    }
  }
  if (data && pollId && !poll) {
    return (
      <div className="py-20 text-center">
        <h1 className="font-display text-3xl font-extrabold">
          Debate question not found
        </h1>
        <a href="/feed" className="mt-5 inline-block font-bold text-lilac">
          Return to feed
        </a>
      </div>
    );
  }
  if (poll && (!debate || editingFraming)) {
    return (
      <>
        <PageHeading
          title={debate ? "Edit debate" : "Start debate"}
          description="Add enough framing for a focused, constructive discussion."
        />
        <DebateSetupForm
          poll={poll}
          onSaved={async () => {
            await refresh();
            setEditingFraming(false);
          }}
          onCancel={debate ? () => setEditingFraming(false) : undefined}
        />
      </>
    );
  }
  return (
    <>
      <PageHeading
        title="Debate room"
        description="Make the strongest case, challenge assumptions, and keep the discussion tied to evidence."
      />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <section className="rounded-2xl border border-black/8 bg-white p-6 sm:p-8">
          {error ? (
            <p className="text-sm font-bold text-red-600">{error}</p>
          ) : null}
          <div className="flex items-center gap-3 text-sm font-bold text-black/45">
            <Flame className="h-4 w-4 text-lilac" />
            Active debate ·{" "}
            {(
              poll?.options.reduce((sum, option) => sum + option.votes, 0) ?? 0
            ).toLocaleString()}{" "}
            participants
          </div>
          <div className="mt-4 flex items-start justify-between gap-5">
            <h2 className="font-display text-3xl font-extrabold leading-tight">
              {debate?.framingQuestion || "Loading debate..."}
            </h2>
            {debate?.canEdit ? (
              <button
                onClick={() => setEditingFraming(true)}
                className="shrink-0 rounded-full border border-black/10 px-4 py-2 text-xs font-extrabold text-lilac"
              >
                Edit framing
              </button>
            ) : null}
          </div>
          <p className="mt-3 leading-7 text-black/55">
            {debate?.context ||
              "Choose a position, explain your reasoning, and respond to the argument rather than the person."}
          </p>
          {debate?.groundRules ? (
            <p className="mt-4 rounded-xl bg-butter/55 p-4 text-sm leading-6 text-black/58">
              <b>Ground rules:</b> {debate.groundRules}
            </p>
          ) : null}
          <div className="mt-6 flex gap-2">
            {stanceOptions.map((item) => (
              <button
                key={item.value}
                onClick={() => setStance(item.value)}
                className={`rounded-full px-5 py-2.5 text-sm font-extrabold ${stance === item.value ? "bg-ink text-white" : "border border-black/10"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-8 space-y-5">
            {poll?.comments.length ? (
              poll.comments.map((comment, index) => (
                <article
                  key={comment.id}
                  className="border-t border-black/8 pt-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-extrabold">
                      {comment.author_name}{" "}
                      <span className="ml-2 font-normal text-black/35">
                        · response {index + 1}
                      </span>
                    </p>
                    <span className="rounded-full bg-black/5 px-3 py-1 text-xs font-bold">
                      {comment.stance}
                    </span>
                  </div>
                  <p className="mt-3 leading-7 text-black/65">{comment.body}</p>
                </article>
              ))
            ) : (
              <p className="border-t border-black/8 pt-6 text-sm text-black/40">
                No responses yet. Start the debate.
              </p>
            )}
          </div>
          {submitError ? (
            <p className="mt-4 text-xs font-bold text-red-600">{submitError}</p>
          ) : null}
          <form
            onSubmit={reply}
            className="mt-7 flex gap-3 border-t border-black/8 pt-6"
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Add a reasoned response..."
              className="min-w-0 flex-1 rounded-full border border-black/10 px-5 py-3 outline-none focus:border-lilac"
            />
            <button
              aria-label="Post response"
              className="grid h-12 w-12 place-items-center rounded-full bg-lilac text-white"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
        <aside>
          <h3 className="font-display text-lg font-extrabold">
            Debate balance
          </h3>
          <div className="mt-5 space-y-5">
            {[
              [debate?.supportLabel || "Support", 54],
              ["Unsure", 17],
              [debate?.opposeLabel || "Oppose", 29],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="flex justify-between text-sm font-bold">
                  <span>{label}</span>
                  <span>{value}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-black/8">
                  <div
                    className="h-full rounded-full bg-lilac"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-2xl bg-butter p-5">
            <Sparkles className="h-5 w-5 text-lilac" />
            <p className="mt-3 text-sm font-extrabold">AI common ground</p>
            <p className="mt-2 text-sm leading-6 text-black/55">
              Both sides favor phased pilots and clear access rules for
              residents with disabilities.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

export function InsightsScreen() {
  const { data, error } = useProductData();
  const metrics = data?.insights;
  return (
    <>
      <PageHeading
        title="Opinion insights"
        description="Signals distilled from your polls, communities, and verified audience segments."
      />
      {error ? (
        <p className="mb-5 text-sm font-bold text-red-600">{error}</p>
      ) : null}
      <div className="grid gap-6 border-b border-black/8 pb-8 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={Users}
          label="Participants"
          value={(metrics?.votes ?? 0).toLocaleString()}
          detail="Recorded verified votes"
        />
        <Stat
          icon={BarChart3}
          label="Responses"
          value={(metrics?.comments ?? 0).toLocaleString()}
          detail={`Across ${metrics?.polls ?? 0} active polls`}
        />
        <Stat
          icon={TrendingUp}
          label="Polls"
          value={(metrics?.polls ?? 0).toLocaleString()}
          detail="Live and accepting responses"
        />
        <Stat
          icon={ShieldCheck}
          label="Communities"
          value={(metrics?.communities ?? 0).toLocaleString()}
          detail="Available member groups"
        />
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
        <section className="rounded-2xl border border-black/8 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-extrabold">
                Sentiment movement
              </h2>
              <p className="mt-1 text-sm text-black/42">
                Weekly positive response share
              </p>
            </div>
            <ArrowUpRight className="text-lilac" />
          </div>
          <div className="mt-10 flex h-64 items-end gap-3">
            {[38, 43, 41, 52, 49, 61, 58, 66, 63, 72, 69, 76].map(
              (value, index) => (
                <div key={index} className="flex h-full flex-1 items-end">
                  <div
                    title={`${value}%`}
                    className="w-full rounded-t-md bg-lilac transition hover:bg-lilac/80"
                    style={{ height: `${value}%` }}
                  />
                </div>
              ),
            )}
          </div>
          <div className="mt-3 flex justify-between text-xs font-bold text-black/30">
            <span>Week 1</span>
            <span>Week 6</span>
            <span>Week 12</span>
          </div>
        </section>
        <aside className="relative overflow-hidden rounded-2xl bg-ink p-7 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(240,74,35,.42),transparent_19rem),radial-gradient(circle_at_12%_88%,rgba(255,178,63,.18),transparent_22rem)]" />
          <div className="relative">
          <Sparkles className="h-6 w-6 text-peach" />
          <h2 className="mt-5 font-display text-2xl font-extrabold">
            What changed
          </h2>
          <div className="mt-6 space-y-6">
            {[
              "Support for local climate adaptation rose fastest among participants under 35.",
              "Cost remains the strongest objection across every region.",
              "Verified-community responses show less polarization than open polls.",
            ].map((text, index) => (
              <div key={text} className="flex items-start gap-3">
                <span className="font-mono text-sm font-bold leading-6 text-peach">
                  0{index + 1}
                </span>
                <p className="text-sm leading-6 text-white/68">{text}</p>
              </div>
            ))}
          </div>
          </div>
        </aside>
      </div>
    </>
  );
}

export function CommunitiesScreen() {
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data, error, refresh } = useProductData();
  const shown = (data?.communities || []).filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );
  async function toggle(item: Community) {
    try {
      await productAction({
        action: "toggle_membership",
        communityId: item.id,
      });
      setErrorMessage("");
      await refresh();
    } catch (reason) {
      setErrorMessage(
        reason instanceof Error
          ? reason.message
          : "Unable to update membership.",
      );
    }
  }
  return (
    <>
      <PageHeading
        title="Communities"
        description="Join focused groups where verified members shape polls and decisions together."
        action={
          <label className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-4">
            <Search className="h-4 w-4 text-black/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find a community"
              className="w-44 bg-transparent py-3 text-sm outline-none"
            />
          </label>
        }
      />
      {error || errorMessage ? (
        <p className="mb-5 text-sm font-bold text-red-600">
          {error || errorMessage}
        </p>
      ) : null}
      <div className="grid gap-px overflow-hidden rounded-2xl border border-black/8 bg-black/8 md:grid-cols-2">
        {shown.map((item, index) => (
          <article key={item.id} className="bg-white p-7">
            <div className="flex items-start justify-between gap-5">
              <span
                className="grid h-12 w-12 place-items-center rounded-xl bg-butter text-lilac"
              >
                <Users className="h-5 w-5" />
              </span>
              <button
                onClick={() => toggle(item)}
                className={`rounded-full px-4 py-2 text-xs font-extrabold ${item.joined ? "border border-black/10" : "bg-lilac text-white"}`}
              >
                {item.joined ? "Joined" : "Join"}
              </button>
            </div>
            <h2 className="mt-6 font-display text-2xl font-extrabold">
              {item.name}
            </h2>
            <p className="mt-2 text-sm leading-6 text-black/52">
              {item.description}
            </p>
            <p className="mt-5 flex items-center gap-2 text-xs font-bold text-black/40">
              <Users className="h-4 w-4" />
              {Number(item.members).toLocaleString()} members
            </p>
          </article>
        ))}
      </div>
    </>
  );
}

export function CreatePollScreen() {
  const [options, setOptions] = useState(["", ""]);
  const [created, setCreated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) return;
    const fields = new FormData(form);
    setLoading(true);
    try {
      await productAction({
        action: "create_poll",
        question: fields.get("question"),
        options,
        topic: fields.get("topic"),
        duration: fields.get("duration"),
        verifiedOnly: fields.get("verifiedOnly") === "on",
        showResults: fields.get("showResults") === "on",
      });
      setCreated(true);
      setError("");
    } catch (reason) {
      setError(
        reason instanceof Error ? reason.message : "Unable to publish poll.",
      );
    } finally {
      setLoading(false);
    }
  }
  if (created)
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lilac text-white">
          <Check className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-extrabold">
          Your poll is ready
        </h1>
        <p className="mt-3 text-black/50">
          It has been published to your feed and is open for verified responses.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <a
            href="/feed"
            className="rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white"
          >
            View in feed
          </a>
          <button
            onClick={() => {
              setCreated(false);
              setOptions(["", ""]);
            }}
            className="rounded-full border border-black/10 px-6 py-3 text-sm font-extrabold"
          >
            Create another
          </button>
        </div>
      </div>
    );
  return (
    <>
      <PageHeading
        title="Create a poll"
        description="Ask one clear question, define the response choices, and choose who can participate."
      />
      {error ? (
        <p className="mb-5 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </p>
      ) : null}
      <form
        onSubmit={submit}
        className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"
      >
        <section className="rounded-2xl border border-black/8 bg-white p-6 sm:p-8">
          <label className="text-sm font-extrabold" htmlFor="question">
            Poll question
          </label>
          <textarea
            id="question"
            name="question"
            required
            minLength={10}
            rows={3}
            maxLength={180}
            placeholder="What should your community decide?"
            className="mt-2 w-full resize-none rounded-xl border border-black/10 p-4 text-lg font-bold outline-none focus:border-lilac"
          />
          <div className="mt-7">
            <p className="text-sm font-extrabold">Response options</p>
            <div className="mt-3 space-y-3">
              {options.map((value, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-black/5 text-xs font-bold">
                    {index + 1}
                  </span>
                  <input
                    required
                    value={value}
                    onChange={(e) =>
                      setOptions((items) =>
                        items.map((item, position) =>
                          position === index ? e.target.value : item,
                        ),
                      )
                    }
                    placeholder={`Option ${index + 1}`}
                    className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-lilac"
                  />
                </div>
              ))}
            </div>
            {options.length < 5 ? (
              <button
                type="button"
                onClick={() => setOptions((items) => [...items, ""])}
                className="mt-4 flex items-center gap-2 text-sm font-extrabold text-lilac"
              >
                <Plus className="h-4 w-4" />
                Add option
              </button>
            ) : null}
          </div>
          <div className="mt-8 grid gap-5 border-t border-black/8 pt-7 sm:grid-cols-2">
            <label className="text-sm font-extrabold">
              Topic
              <select
                name="topic"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-normal"
              >
                <option>Public policy</option>
                <option>Technology</option>
                <option>Community</option>
                <option>Work</option>
              </select>
            </label>
            <label className="text-sm font-extrabold">
              Poll duration
              <select
                name="duration"
                className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 font-normal"
              >
                <option>7 days</option>
                <option>24 hours</option>
                <option>30 days</option>
              </select>
            </label>
          </div>
        </section>
        <aside className="space-y-5">
          <div className="rounded-2xl bg-ink p-6 text-white">
            <h2 className="font-display text-xl font-extrabold">
              Publishing controls
            </h2>
            <label className="mt-6 flex items-start gap-3 text-sm">
              <input
                name="verifiedOnly"
                type="checkbox"
                defaultChecked
                className="mt-1 accent-lilac"
              />
              <span>
                <b className="block">Verified responses only</b>
                <span className="mt-1 block text-white/50">
                  Reduce duplicate and automated votes.
                </span>
              </span>
            </label>
            <label className="mt-5 flex items-start gap-3 text-sm">
              <input
                name="showResults"
                type="checkbox"
                defaultChecked
                className="mt-1 accent-lilac"
              />
              <span>
                <b className="block">Show live results</b>
                <span className="mt-1 block text-white/50">
                  Participants see movement after voting.
                </span>
              </span>
            </label>
          </div>
          <button
            disabled={loading}
            className="w-full rounded-full bg-lilac px-6 py-4 text-sm font-extrabold text-white shadow-float disabled:cursor-wait disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish poll"}
          </button>
          <p className="text-center text-xs leading-5 text-black/40">
            You can close voting early or export results at any time.
          </p>
        </aside>
      </form>
    </>
  );
}
