"use client";

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
  question: string;
  createdAt: string;
  options: Array<{ id: number; label: string; votes: number }>;
  comments: Array<{
    id: number;
    author_name: string;
    stance: string;
    body: string;
    created_at: string;
  }>;
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
  insights: {
    polls: number;
    votes: number;
    comments: number;
    communities: number;
  };
};

function useProductData() {
  const [data, setData] = useState<ProductData | null>(null);
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/product", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to load product data.");
      setData(result);
      setError("");
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "Unable to load product data.",
      );
    }
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return { data, error, refresh };
}

async function productAction(body: Record<string, unknown>) {
  const response = await fetch("/api/product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok)
    throw new Error(result.error || "Unable to save that change.");
  return result;
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
          <span className="flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" />
            {poll.comments.length} responses
          </span>
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

export function FeedScreen() {
  const [scope, setScope] = useState("For you");
  const { data, error, refresh } = useProductData();
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
          <div className="flex gap-2 border-b border-black/8 px-5 py-4">
            {["For you", "Following", "Newest"].map((item) => (
              <button
                key={item}
                onClick={() => setScope(item)}
                className={`rounded-full px-4 py-2 text-sm font-bold ${scope === item ? "bg-ink text-white" : "text-black/45 hover:bg-black/5"}`}
              >
                {item}
              </button>
            ))}
          </div>
          {error ? (
            <p className="p-6 text-sm font-bold text-red-600">{error}</p>
          ) : null}
          {!data ? (
            <p className="p-8 text-sm text-black/40">Loading live polls...</p>
          ) : (
            data.polls.map((poll) => (
              <PollCard key={poll.id} poll={poll} onChanged={refresh} />
            ))
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
          <div className="rounded-2xl bg-ink p-6 text-white">
            <ShieldCheck className="h-6 w-6 text-peach" />
            <h3 className="mt-4 font-display text-xl font-extrabold">
              Verified voices
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Identity checks protect poll integrity without exposing your
              public profile.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

const regions = [
  { name: "West", score: 72, change: "+8%", topic: "Climate resilience" },
  { name: "Midwest", score: 58, change: "+3%", topic: "Manufacturing" },
  { name: "South", score: 47, change: "-2%", topic: "Healthcare access" },
  { name: "Northeast", score: 66, change: "+5%", topic: "Housing costs" },
];

export function SentimentScreen() {
  const [period, setPeriod] = useState("7 days");
  const [region, setRegion] = useState(regions[0]);
  return (
    <>
      <PageHeading
        title="Sentiment map"
        description="Explore how verified public opinion is moving across regions and topics."
        action={
          <div className="flex rounded-full border border-black/10 bg-white p-1">
            {["24 hours", "7 days", "30 days"].map((item) => (
              <button
                key={item}
                onClick={() => setPeriod(item)}
                className={`rounded-full px-4 py-2 text-xs font-bold ${period === item ? "bg-ink text-white" : "text-black/45"}`}
              >
                {item}
              </button>
            ))}
          </div>
        }
      />
      <div className="grid gap-7 lg:grid-cols-[1fr_360px]">
        <section className="relative min-h-[560px] overflow-hidden rounded-2xl border border-black/8 bg-[#eef0e9]">
          <div className="sentiment-map-bg absolute inset-0 opacity-90" />
          <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-extrabold shadow-sm backdrop-blur">
            National confidence · 61%
          </div>
          {regions.map((item, index) => (
            <button
              key={item.name}
              onClick={() => setRegion(item)}
              style={{
                left: `${[22, 48, 57, 74][index]}%`,
                top: `${[40, 39, 64, 33][index]}%`,
              }}
              className={`absolute grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white text-sm font-extrabold shadow-lg transition hover:scale-110 ${region.name === item.name ? "bg-lilac text-white" : "bg-ink text-white"}`}
            >
              {item.score}
            </button>
          ))}
        </section>
        <aside className="rounded-2xl border border-black/8 bg-white p-6">
          <p className="text-xs font-bold uppercase text-lilac">
            Selected region
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold">
            {region.name}
          </h2>
          <p className="mt-1 text-sm text-black/45">{period} movement</p>
          <div className="my-7 border-y border-black/8 py-6">
            <p className="font-display text-6xl font-extrabold">
              {region.score}
              <span className="text-2xl text-black/30">%</span>
            </p>
            <p
              className={`mt-2 text-sm font-extrabold ${region.change.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}
            >
              {region.change} from prior period
            </p>
          </div>
          <p className="text-xs font-bold uppercase text-black/35">
            Leading conversation
          </p>
          <p className="mt-2 text-lg font-extrabold">{region.topic}</p>
          <div className="mt-7 space-y-4">
            {["Support", "Undecided", "Oppose"].map((label, index) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-xs font-bold">
                  <span>{label}</span>
                  <span>
                    {[region.score, 18, 100 - region.score - 18][index]}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/7">
                  <div
                    className="h-full rounded-full bg-lilac"
                    style={{
                      width: `${[region.score, 18, 100 - region.score - 18][index]}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}

export function DebateScreen() {
  const [stance, setStance] = useState("Support");
  const [draft, setDraft] = useState("");
  const [submitError, setSubmitError] = useState("");
  const { data, error, refresh } = useProductData();
  const poll = data?.polls[0];
  async function reply(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim() || !poll) return;
    try {
      await productAction({
        action: "comment",
        pollId: poll.id,
        text: draft,
        stance,
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
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight">
            {poll?.question || "Loading debate..."}
          </h2>
          <p className="mt-3 leading-7 text-black/55">
            Choose a position, explain your reasoning, and respond to the
            argument rather than the person.
          </p>
          <div className="mt-6 flex gap-2">
            {["Support", "Unsure", "Oppose"].map((item) => (
              <button
                key={item}
                onClick={() => setStance(item)}
                className={`rounded-full px-5 py-2.5 text-sm font-extrabold ${stance === item ? "bg-ink text-white" : "border border-black/10"}`}
              >
                {item}
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
              ["Support", 54],
              ["Unsure", 17],
              ["Oppose", 29],
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
                    className="w-full rounded-t-md bg-ink transition hover:bg-lilac"
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
        <aside className="rounded-2xl bg-ink p-7 text-white">
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
              <div key={text} className="flex gap-3">
                <span className="font-mono text-xs font-bold text-peach">
                  0{index + 1}
                </span>
                <p className="text-sm leading-6 text-white/68">{text}</p>
              </div>
            ))}
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
                className={`grid h-12 w-12 place-items-center rounded-xl ${index % 2 ? "bg-ink text-white" : "bg-butter text-lilac"}`}
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
