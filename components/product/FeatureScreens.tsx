"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Award,
  BadgeCheck,
  BarChart3,
  Bell,
  Bot,
  Building2,
  CalendarClock,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Flag,
  Globe2,
  IdCard,
  Link2,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquareText,
  Palette,
  QrCode,
  Radio,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Target,
  Trash2,
  TrendingUp,
  Trophy,
  Upload,
  UserCheck,
  Users,
  Webhook,
  Zap,
} from "lucide-react";
import { PageHeading, Stat } from "./ProductShell";

const control =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-lilac focus:ring-4 focus:ring-lilac/10";
const panel = "rounded-2xl border border-black/8 bg-white p-6 shadow-sm";

function Notice({ text }: { text: string }) {
  return (
    <div
      role="status"
      className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800"
    >
      {text}
    </div>
  );
}
function Toggle({
  checked,
  onChange,
  label,
  detail,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between gap-5 border-b border-black/7 py-4 text-left last:border-0"
    >
      <span>
        <b className="block text-sm">{label}</b>
        <span className="mt-1 block text-xs leading-5 text-black/42">
          {detail}
        </span>
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-lilac" : "bg-black/15"}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${checked ? "left-6" : "left-1"}`}
        />
      </span>
    </button>
  );
}

const discoveryPolls = [
  {
    title: "Should public transit be free during extreme weather?",
    topic: "Local policy",
    location: "Chicago, IL",
    votes: "8.2k",
    org: "Civic Transit Lab",
    trending: true,
  },
  {
    title: "How should AI-generated campaign media be labeled?",
    topic: "Technology",
    location: "United States",
    votes: "14.7k",
    org: "Digital Trust Forum",
    trending: true,
  },
  {
    title: "What matters most in a four-day work week trial?",
    topic: "Future of work",
    location: "Remote",
    votes: "5.4k",
    org: "WorkForward",
    trending: false,
  },
  {
    title: "Which neighborhood cooling project should receive funding?",
    topic: "Climate",
    location: "Phoenix, AZ",
    votes: "3.1k",
    org: "Better Blocks",
    trending: false,
  },
];

export function DiscoverScreen() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All topics");
  const [localOnly, setLocalOnly] = useState(false);
  const [followed, setFollowed] = useState<string[]>(["Civic Transit Lab"]);
  const results = useMemo(
    () =>
      discoveryPolls.filter(
        (poll) =>
          (!query ||
            `${poll.title} ${poll.org}`
              .toLowerCase()
              .includes(query.toLowerCase())) &&
          (topic === "All topics" || poll.topic === topic) &&
          (!localOnly || poll.location !== "United States"),
      ),
    [query, topic, localOnly],
  );
  return (
    <>
      <PageHeading
        title="Discover polls"
        description="Search by issue, location, or organization and tune what appears in your feed."
      />
      <div className="grid gap-7 lg:grid-cols-[270px_minmax(0,1fr)]">
        <aside className={panel}>
          <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
            <Filter className="h-4 w-4 text-lilac" />
            Filters
          </h2>
          <label className="mt-5 block text-xs font-bold uppercase text-black/40">
            Topic
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={`${control} mt-2 normal-case`}
            >
              <option>All topics</option>
              <option>Local policy</option>
              <option>Technology</option>
              <option>Future of work</option>
              <option>Climate</option>
            </select>
          </label>
          <div className="mt-5">
            <Toggle
              checked={localOnly}
              onChange={() => setLocalOnly((value) => !value)}
              label="Near me"
              detail="Prioritize polls using your selected region."
            />
          </div>
          <div className="mt-5 border-t border-black/8 pt-5">
            <p className="text-xs font-bold uppercase text-black/40">
              Feed ranking
            </p>
            {["Relevance", "Trending", "Newest"].map((item, index) => (
              <label
                key={item}
                className="mt-3 flex items-center gap-3 text-sm font-bold"
              >
                <input
                  type="radio"
                  name="ranking"
                  defaultChecked={index === 0}
                  className="accent-lilac"
                />
                {item}
              </label>
            ))}
          </div>
        </aside>
        <section>
          <label className="flex items-center gap-3 rounded-2xl border border-black/10 bg-white px-5">
            <Search className="h-5 w-5 text-black/35" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search polls or organizations"
              className="w-full py-4 outline-none"
            />
          </label>
          <div className="mt-5 divide-y divide-black/7 overflow-hidden rounded-2xl border border-black/8 bg-white">
            {results.map((poll) => {
              const isFollowed = followed.includes(poll.org);
              return (
                <article key={poll.title} className="p-6">
                  <div className="flex flex-col justify-between gap-5 sm:flex-row">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-black/40">
                        <span>{poll.topic}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {poll.location}
                        </span>
                        {poll.trending ? (
                          <span className="text-lilac">Trending</span>
                        ) : null}
                      </div>
                      <h2 className="mt-3 font-display text-xl font-extrabold">
                        {poll.title}
                      </h2>
                      <p className="mt-3 text-sm text-black/45">
                        {poll.votes} responses · by{" "}
                        <b className="text-ink">{poll.org}</b>
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setFollowed((items) =>
                          isFollowed
                            ? items.filter((item) => item !== poll.org)
                            : [...items, poll.org],
                        )
                      }
                      className={`h-fit shrink-0 rounded-full px-4 py-2 text-xs font-extrabold ${isFollowed ? "border border-black/10" : "bg-ink text-white"}`}
                    >
                      {isFollowed ? "Following" : "Follow"}
                    </button>
                  </div>
                </article>
              );
            })}
            {results.length === 0 ? (
              <p className="p-10 text-center text-sm text-black/40">
                No polls match these filters.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
}

export function VotingFormatsScreen() {
  const [tab, setTab] = useState("Multiple choice");
  const [choice, setChoice] = useState("");
  const [rating, setRating] = useState(0);
  const [ranking, setRanking] = useState([
    "Affordable housing",
    "Public transit",
    "Parks and recreation",
  ]);
  const [response, setResponse] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [liveCount, setLiveCount] = useState(1842);
  useEffect(() => {
    const timer = window.setInterval(
      () => setLiveCount((value) => value + Math.floor(Math.random() * 4)),
      2500,
    );
    return () => window.clearInterval(timer);
  }, []);
  function move(index: number, direction: -1 | 1) {
    setRanking((items) => {
      const target = index + direction;
      if (target < 0 || target >= items.length) return items;
      const copy = [...items];
      [copy[index], copy[target]] = [copy[target], copy[index]];
      return copy;
    });
  }
  return (
    <>
      <PageHeading
        title="Voting experience"
        description="Frontend demonstrations of every supported response format with instant results and live participation."
        action={
          <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            {liveCount.toLocaleString()} live
          </span>
        }
      />
      <div className="flex gap-2 overflow-x-auto pb-5">
        {pollFormats.map((item) => (
          <button
            key={item}
            onClick={() => {
              setTab(item);
              setSubmitted(false);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${tab === item ? "bg-ink text-white" : "border border-black/10"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section className={panel}>
          <p className="text-xs font-bold uppercase text-lilac">
            Community priorities
          </p>
          <h2 className="mt-3 font-display text-2xl font-extrabold">
            Which investment should the city prioritize next year?
          </h2>
          {tab === "Multiple choice" ? (
            <div className="mt-6 space-y-3">
              {ranking.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setChoice(item);
                    setSubmitted(true);
                  }}
                  className={`flex w-full justify-between rounded-xl border p-4 text-left text-sm font-bold ${choice === item ? "border-lilac bg-butter" : "border-black/10"}`}
                >
                  <span>{item}</span>
                  {choice === item ? (
                    <Check className="h-4 w-4 text-lilac" />
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
          {tab === "Scale / rating" ? (
            <div className="mt-7">
              <p className="text-sm text-black/48">
                Rate your confidence in the current plan.
              </p>
              <div className="mt-4 grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => {
                      setRating(value);
                      setSubmitted(true);
                    }}
                    className={`rounded-xl border py-5 font-display text-xl font-extrabold ${rating === value ? "border-lilac bg-lilac text-white" : "border-black/10"}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-black/35">
                <span>Not confident</span>
                <span>Very confident</span>
              </div>
            </div>
          ) : null}
          {tab === "Ranked choice" ? (
            <div className="mt-6 space-y-3">
              {ranking.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl border border-black/10 p-3"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-sm font-bold">{item}</span>
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${item} up`}
                    className="px-2 text-xs font-bold disabled:opacity-20"
                  >
                    Up
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === ranking.length - 1}
                    aria-label={`Move ${item} down`}
                    className="px-2 text-xs font-bold disabled:opacity-20"
                  >
                    Down
                  </button>
                </div>
              ))}
              <button
                onClick={() => setSubmitted(true)}
                className="mt-3 rounded-full bg-lilac px-5 py-3 text-sm font-bold text-white"
              >
                Submit ranking
              </button>
            </div>
          ) : null}
          {tab === "Open response" ? (
            <div className="mt-6">
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={5}
                placeholder="Explain your priority..."
                className={`${control} resize-none`}
              />
              <button
                onClick={() => response.trim() && setSubmitted(true)}
                className="mt-4 rounded-full bg-lilac px-5 py-3 text-sm font-bold text-white"
              >
                Submit response
              </button>
            </div>
          ) : null}
          {submitted ? (
            <div className="mt-6">
              <Notice text="Response recorded in this frontend demo. Instant results are now visible." />
            </div>
          ) : null}
        </section>
        <aside className={panel}>
          <h2 className="font-display text-xl font-extrabold">
            Instant results
          </h2>
          <p className="mt-1 text-xs text-black/40">
            Updates as simulated participation changes
          </p>
          <div className="mt-6 space-y-5">
            {[
              ["Affordable housing", 47],
              ["Public transit", 32],
              ["Parks and recreation", 21],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="flex justify-between text-xs font-bold">
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
          <div className="mt-7 border-t border-black/8 pt-5 text-xs leading-5 text-black/45">
            Anonymous response · Verified Geo eligible · Results shown after
            participation
          </div>
        </aside>
      </div>
    </>
  );
}

export function ProfileScreen() {
  const [saved, setSaved] = useState(false);
  const [level, setLevel] = useState(1);
  const [interests, setInterests] = useState(["Technology", "Local policy"]);
  function save(event: FormEvent) {
    event.preventDefault();
    setSaved(true);
  }
  return (
    <>
      <PageHeading
        title="Profile & verification"
        description="Manage your voter profile, interests, location, and verification level."
      />
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={save} className={`${panel} space-y-5`}>
          {saved ? <Notice text="Profile preferences saved." /> : null}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="text-sm font-bold">
              Display name
              <input
                defaultValue="Feature Test"
                className={`${control} mt-2`}
              />
            </label>
            <label className="text-sm font-bold">
              Role
              <input
                value="Voter"
                readOnly
                className={`${control} mt-2 bg-black/[0.03]`}
              />
            </label>
          </div>
          <label className="text-sm font-bold">
            Home location
            <div className="relative mt-2">
              <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-black/35" />
              <input
                defaultValue="Chicago, Illinois"
                className={`${control} pl-11`}
              />
            </div>
          </label>
          <div>
            <p className="text-sm font-bold">Interests</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Technology",
                "Local policy",
                "Climate",
                "Healthcare",
                "Education",
                "Future of work",
              ].map((item) => {
                const active = interests.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() =>
                      setInterests((items) =>
                        active
                          ? items.filter((value) => value !== item)
                          : [...items, item],
                      )
                    }
                    className={`rounded-full px-4 py-2 text-xs font-bold ${active ? "bg-ink text-white" : "border border-black/10"}`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
          <label className="text-sm font-bold">
            Short bio
            <textarea
              rows={4}
              defaultValue="Interested in local policy, responsible technology, and community decision-making."
              className={`${control} mt-2 resize-none`}
            />
          </label>
          <button className="rounded-full bg-lilac px-6 py-3 text-sm font-extrabold text-white">
            Save profile
          </button>
        </form>
        <aside className={panel}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-black/35">
                Verification level
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold">
                Level {level} of 3
              </h2>
            </div>
            <ShieldCheck className="h-8 w-8 text-lilac" />
          </div>
          <div className="mt-6 space-y-3">
            {[
              {
                icon: LockKeyhole,
                title: "Anonymous voter",
                text: "Email and private account",
                level: 1,
              },
              {
                icon: MapPin,
                title: "Verified Geo",
                text: "Confirm eligible region",
                level: 2,
              },
              {
                icon: IdCard,
                title: "Verified ID",
                text: "Identity confidence check",
                level: 3,
              },
            ].map(({ icon: Icon, title, text, level: itemLevel }) => (
              <button
                key={title}
                onClick={() => setLevel(itemLevel)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left ${level >= itemLevel ? "border-lilac/30 bg-butter" : "border-black/8"}`}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-full ${level >= itemLevel ? "bg-lilac text-white" : "bg-black/5 text-black/35"}`}
                >
                  {level >= itemLevel ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </span>
                <span>
                  <b className="block text-sm">{title}</b>
                  <span className="mt-1 block text-xs text-black/42">
                    {text}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-black/42">
            Verification status is visible as a level, never as personal
            identity data.
          </p>
        </aside>
      </div>
    </>
  );
}

const badgeCatalog = [
  {
    name: "First Voice",
    detail: "Cast your first vote",
    unlocked: true,
    icon: Star,
  },
  {
    name: "Civic Week",
    detail: "7-day participation streak",
    unlocked: true,
    icon: Zap,
  },
  {
    name: "Thoughtful",
    detail: "Post 10 helpful responses",
    unlocked: false,
    icon: MessageSquareText,
  },
  {
    name: "Community Builder",
    detail: "Join five communities",
    unlocked: false,
    icon: Users,
  },
];
export function RewardsScreen() {
  const [claimed, setClaimed] = useState(false);
  return (
    <>
      <PageHeading
        title="Rewards"
        description="Track participation points, streaks, badges, and civic achievements."
      />
      <div className="grid gap-6 border-b border-black/8 pb-8 sm:grid-cols-3">
        <Stat
          icon={Trophy}
          label="Points"
          value="1,280"
          detail="Top 18% this month"
        />
        <Stat
          icon={Zap}
          label="Current streak"
          value="7 days"
          detail="Personal best: 12 days"
        />
        <Stat
          icon={Award}
          label="Achievements"
          value="6/18"
          detail="Two nearly complete"
        />
      </div>
      <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          <h2 className="font-display text-xl font-extrabold">
            Badge collection
          </h2>
          <div className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-black/8 bg-black/8 sm:grid-cols-2">
            {badgeCatalog.map(({ name, detail, unlocked, icon: Icon }) => (
              <article
                key={name}
                className={`bg-white p-6 ${unlocked ? "" : "opacity-55"}`}
              >
                <span
                  className={`grid h-12 w-12 place-items-center rounded-xl ${unlocked ? "bg-lilac text-white" : "bg-black/5"}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-extrabold">
                  {name}
                </h3>
                <p className="mt-1 text-sm text-black/45">{detail}</p>
                <p className="mt-4 text-xs font-bold uppercase text-black/35">
                  {unlocked ? "Unlocked" : "In progress"}
                </p>
              </article>
            ))}
          </div>
        </section>
        <aside className={`${panel} h-fit`}>
          <p className="text-xs font-bold uppercase text-lilac">
            Weekly challenge
          </p>
          <h2 className="mt-3 font-display text-2xl font-extrabold">
            Make five informed votes
          </h2>
          <p className="mt-2 text-sm leading-6 text-black/48">
            Read the source context before responding to five polls.
          </p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-black/8">
            <div className="h-full w-4/5 rounded-full bg-lilac" />
          </div>
          <div className="mt-2 flex justify-between text-xs font-bold">
            <span>4 of 5</span>
            <span>+150 points</span>
          </div>
          <button
            disabled={!claimed}
            onClick={() => setClaimed(false)}
            className="mt-6 w-full rounded-full bg-ink px-5 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-35"
          >
            {claimed ? "Claim reward" : "Complete one more vote"}
          </button>
        </aside>
      </div>
    </>
  );
}

export function NotificationsScreen() {
  const initial = [
    {
      id: 1,
      title: "Your poll reached 1,000 responses",
      detail: "View the latest geographic breakdown.",
      type: "Poll",
      unread: true,
    },
    {
      id: 2,
      title: "Responsible AI published a new poll",
      detail: "Vote on disclosure standards for generated media.",
      type: "Following",
      unread: true,
    },
    {
      id: 3,
      title: "Your response received 18 helpful votes",
      detail: "The debate remains active for three more days.",
      type: "Discussion",
      unread: false,
    },
  ];
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState("All");
  const visible =
    filter === "All" ? items : items.filter((item) => item.type === filter);
  return (
    <>
      <PageHeading
        title="Notifications"
        description="Poll activity, discussion replies, engagement milestones, and followed organizations."
        action={
          <button
            onClick={() =>
              setItems((current) =>
                current.map((item) => ({ ...item, unread: false })),
              )
            }
            className="rounded-full border border-black/10 px-5 py-3 text-sm font-bold"
          >
            Mark all read
          </button>
        }
      />
      <div className="flex gap-2 overflow-x-auto pb-4">
        {["All", "Poll", "Following", "Discussion"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-full px-4 py-2 text-sm font-bold ${filter === item ? "bg-ink text-white" : "border border-black/10"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <section className="divide-y divide-black/7 overflow-hidden rounded-2xl border border-black/8 bg-white">
        {visible.map((item) => (
          <button
            key={item.id}
            onClick={() =>
              setItems((current) =>
                current.map((entry) =>
                  entry.id === item.id ? { ...entry, unread: false } : entry,
                ),
              )
            }
            className="flex w-full items-start gap-4 p-6 text-left hover:bg-black/[0.02]"
          >
            <span
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.unread ? "bg-lilac" : "bg-black/15"}`}
            />
            <span className="flex-1">
              <b className="block">{item.title}</b>
              <span className="mt-1 block text-sm text-black/45">
                {item.detail}
              </span>
              <span className="mt-3 block text-xs font-bold uppercase text-black/30">
                {item.type} · 2h ago
              </span>
            </span>
            <ChevronRight className="h-4 w-4 text-black/25" />
          </button>
        ))}
      </section>
    </>
  );
}

export function PrivacyCenterScreen() {
  const [settings, setSettings] = useState({
    anonymous: true,
    geo: false,
    personalization: true,
    notifications: true,
    fingerprint: true,
  });
  const [notice, setNotice] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const flip = (key: keyof typeof settings) =>
    setSettings((value) => ({ ...value, [key]: !value[key] }));
  return (
    <>
      <PageHeading
        title="Privacy center"
        description="Control voting identity, personalization, security, and GDPR data rights."
      />
      {notice ? (
        <div className="mb-6">
          <Notice text={notice} />
        </div>
      ) : null}
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className={panel}>
          <h2 className="font-display text-xl font-extrabold">
            Privacy controls
          </h2>
          <div className="mt-4">
            <Toggle
              checked={settings.anonymous}
              onChange={() => flip("anonymous")}
              label="Anonymous voting"
              detail="Keep your public profile separate from poll responses."
            />
            <Toggle
              checked={settings.geo}
              onChange={() => flip("geo")}
              label="Use verified location"
              detail="Allow eligible local polls without exposing precise coordinates."
            />
            <Toggle
              checked={settings.personalization}
              onChange={() => flip("personalization")}
              label="Personalized discovery"
              detail="Rank polls using followed topics and organizations."
            />
            <Toggle
              checked={settings.notifications}
              onChange={() => flip("notifications")}
              label="Engagement notifications"
              detail="Notify you about replies and poll milestones."
            />
            <Toggle
              checked={settings.fingerprint}
              onChange={() => flip("fingerprint")}
              label="Device integrity protection"
              detail="Use privacy-preserving signals to reduce bot activity."
            />
          </div>
        </section>
        <aside className="space-y-5">
          <div className={panel}>
            <ShieldCheck className="h-6 w-6 text-lilac" />
            <h2 className="mt-4 font-display text-xl font-extrabold">
              Trust architecture
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-black/52">
              <li>Bot and rate-limit controls</li>
              <li>CAPTCHA challenge support</li>
              <li>No sale of personal information</li>
              <li>Separate identity and response records</li>
            </ul>
          </div>
          <div className={panel}>
            <h2 className="font-display text-xl font-extrabold">
              Your data rights
            </h2>
            <button
              onClick={() =>
                setNotice(
                  "Your account archive is being prepared for download.",
                )
              }
              className="mt-5 flex w-full items-center gap-3 rounded-xl border border-black/10 p-4 text-sm font-bold"
            >
              <Download className="h-4 w-4" />
              Download my data
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="mt-3 flex w-full items-center gap-3 rounded-xl border border-red-200 p-4 text-sm font-bold text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              Delete account
            </button>
          </div>
        </aside>
      </div>
      {confirmDelete ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-5">
          <div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-soft">
            <CircleAlert className="h-7 w-7 text-red-600" />
            <h2 className="mt-4 font-display text-2xl font-extrabold">
              Delete your account?
            </h2>
            <p className="mt-2 text-sm leading-6 text-black/50">
              This frontend demo shows the GDPR deletion confirmation. A
              production backend must complete the irreversible removal.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 rounded-full border border-black/10 py-3 text-sm font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setConfirmDelete(false);
                  setNotice("Deletion request recorded in the frontend demo.");
                }}
                className="flex-1 rounded-full bg-red-600 py-3 text-sm font-bold text-white"
              >
                Confirm deletion
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const pollFormats = [
  "Multiple choice",
  "Scale / rating",
  "Ranked choice",
  "Open response",
];
export function CreatorStudioScreen() {
  const [step, setStep] = useState(1);
  const [format, setFormat] = useState(pollFormats[0]);
  const [draftSaved, setDraftSaved] = useState(false);
  const [published, setPublished] = useState(false);
  const [channels, setChannels] = useState(["Shareable link"]);
  const [previewRating, setPreviewRating] = useState(0);
  const steps = ["Question", "Audience", "Schedule", "Distribution"];
  if (published)
    return (
      <div className="mx-auto max-w-2xl py-14 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lilac text-white">
          <Check className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-extrabold">
          Poll configured
        </h1>
        <p className="mt-3 text-black/50">
          The frontend preview includes your question, audience rules, schedule,
          expiration, and distribution channels.
        </p>
        <button
          onClick={() => {
            setPublished(false);
            setStep(1);
          }}
          className="mt-7 rounded-full bg-ink px-6 py-3 text-sm font-extrabold text-white"
        >
          Create another poll
        </button>
      </div>
    );
  return (
    <>
      <PageHeading
        title="Creator studio"
        description="Build, target, schedule, and distribute a poll through a guided workflow."
        action={
          <button
            onClick={() => setDraftSaved(true)}
            className="flex items-center gap-2 rounded-full border border-black/10 px-5 py-3 text-sm font-bold"
          >
            <FileText className="h-4 w-4" />
            Save draft
          </button>
        }
      />
      {draftSaved ? (
        <div className="mb-5">
          <Notice text="Draft saved in this browser session." />
        </div>
      ) : null}
      <div className="grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)_300px]">
        <aside className="space-y-2">
          {steps.map((label, index) => (
            <button
              key={label}
              onClick={() => setStep(index + 1)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold ${step === index + 1 ? "bg-ink text-white" : "hover:bg-black/5"}`}
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-full text-xs ${step > index + 1 ? "bg-lilac text-white" : "bg-white/10"}`}
              >
                {step > index + 1 ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  index + 1
                )}
              </span>
              {label}
            </button>
          ))}
        </aside>
        <section className={panel}>
          {step === 1 ? (
            <div>
              <h2 className="font-display text-2xl font-extrabold">
                Question format
              </h2>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {pollFormats.map((item) => (
                  <button
                    key={item}
                    onClick={() => setFormat(item)}
                    className={`rounded-xl border p-4 text-left text-sm font-bold ${format === item ? "border-lilac bg-butter" : "border-black/8"}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <label className="mt-6 block text-sm font-bold">
                Question
                <textarea
                  className={`${control} mt-2 resize-none text-lg font-bold`}
                  rows={3}
                  defaultValue="How should our city improve neighborhood access to public services?"
                />
              </label>
              {format === "Multiple choice" || format === "Ranked choice" ? (
                <div className="mt-5 space-y-2">
                  {[
                    "Extend evening hours",
                    "Add mobile service units",
                    "Improve digital access",
                  ].map((value, index) => (
                    <input
                      key={value}
                      defaultValue={value}
                      aria-label={`Option ${index + 1}`}
                      className={control}
                    />
                  ))}
                </div>
              ) : null}
              {format === "Scale / rating" ? (
                <div className="mt-5 grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      onClick={() => setPreviewRating(value)}
                      className={`rounded-xl border py-4 font-bold ${previewRating === value ? "border-lilac bg-lilac text-white" : "border-black/10"}`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              ) : null}
              {format === "Open response" ? (
                <textarea
                  rows={4}
                  placeholder="Participant response field"
                  className={`${control} mt-5 resize-none`}
                  disabled
                />
              ) : null}
            </div>
          ) : null}
          {step === 2 ? (
            <div>
              <h2 className="font-display text-2xl font-extrabold">
                Audience targeting
              </h2>
              <p className="mt-2 text-sm text-black/45">
                Combine targeting rules to define eligibility.
              </p>
              <div className="mt-6 space-y-5">
                <label className="text-sm font-bold">
                  Location targeting
                  <div className="relative mt-2">
                    <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-black/35" />
                    <input
                      defaultValue="Chicago metro area"
                      className={`${control} pl-11`}
                    />
                  </div>
                </label>
                <label className="text-sm font-bold">
                  Age groups
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["18-24", "25-34", "35-44", "45-64", "65+"].map((item) => (
                      <label
                        key={item}
                        className="flex items-center gap-2 rounded-full border border-black/10 px-3 py-2 text-xs"
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          className="accent-lilac"
                        />
                        {item}
                      </label>
                    ))}
                  </div>
                </label>
                <label className="text-sm font-bold">
                  Interest targeting
                  <input
                    defaultValue="Local policy, public services, civic planning"
                    className={`${control} mt-2`}
                  />
                </label>
                <Toggle
                  checked={true}
                  onChange={() => undefined}
                  label="Verified Geo required"
                  detail="Only responses from eligible locations count in verified results."
                />
              </div>
            </div>
          ) : null}
          {step === 3 ? (
            <div>
              <h2 className="font-display text-2xl font-extrabold">
                Schedule & expiration
              </h2>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-bold">
                  Publish date
                  <input type="datetime-local" className={`${control} mt-2`} />
                </label>
                <label className="text-sm font-bold">
                  Expiration
                  <input type="datetime-local" className={`${control} mt-2`} />
                </label>
              </div>
              <div className="mt-6">
                <Toggle
                  checked={true}
                  onChange={() => undefined}
                  label="Live result updates"
                  detail="Show real-time charts and participation metrics after voting."
                />
                <Toggle
                  checked={false}
                  onChange={() => undefined}
                  label="Approval required"
                  detail="Send this poll to the organization approval workflow first."
                />
              </div>
            </div>
          ) : null}
          {step === 4 ? (
            <div>
              <h2 className="font-display text-2xl font-extrabold">
                Distribution tools
              </h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  { name: "Shareable link", icon: Link2 },
                  { name: "QR code", icon: QrCode },
                  { name: "Website embed", icon: Webhook },
                  { name: "Email", icon: Mail },
                  { name: "SMS", icon: Smartphone },
                ].map(({ name, icon: Icon }) => {
                  const active = channels.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() =>
                        setChannels((items) =>
                          active
                            ? items.filter((item) => item !== name)
                            : [...items, name],
                        )
                      }
                      className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-bold ${active ? "border-lilac bg-butter" : "border-black/8"}`}
                    >
                      <Icon className="h-5 w-5" />
                      {name}
                      {active ? (
                        <Check className="ml-auto h-4 w-4 text-lilac" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 rounded-xl bg-black/[0.03] p-4 font-mono text-xs text-black/55">
                quorumcheck.com/p/community-services-2035
              </div>
            </div>
          ) : null}
          <div className="mt-8 flex justify-between border-t border-black/8 pt-6">
            <button
              disabled={step === 1}
              onClick={() => setStep((value) => Math.max(1, value - 1))}
              className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-bold disabled:opacity-30"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                onClick={() => setStep((value) => Math.min(4, value + 1))}
                className="rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-white"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={() => setPublished(true)}
                className="rounded-full bg-lilac px-6 py-2.5 text-sm font-bold text-white"
              >
                Publish preview
              </button>
            )}
          </div>
        </section>
        <aside className={`${panel} h-fit`}>
          <p className="text-xs font-bold uppercase text-black/35">
            Live preview
          </p>
          <h3 className="mt-4 font-display text-xl font-extrabold">
            How should our city improve neighborhood access to public services?
          </h3>
          <p className="mt-3 text-xs font-bold text-lilac">{format}</p>
          <div className="mt-5 space-y-2">
            {[
              "Extend evening hours",
              "Add mobile service units",
              "Improve digital access",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-black/10 px-4 py-3 text-sm font-bold"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-5 text-black/40">
            Verified Geo · Chicago metro · Scheduled distribution
          </p>
        </aside>
      </div>
    </>
  );
}

export function CreatorAnalyticsScreen() {
  const [range, setRange] = useState("30 days");
  const [notice, setNotice] = useState("");
  const exportData = (format: string) =>
    setNotice(`${format} export prepared in the frontend demo.`);
  return (
    <>
      <PageHeading
        title="Creator analytics"
        description="Response tracking, audience demographics, geographic insights, and live participation."
        action={
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold"
          >
            <option>24 hours</option>
            <option>7 days</option>
            <option>30 days</option>
            <option>90 days</option>
          </select>
        }
      />
      {notice ? (
        <div className="mb-6">
          <Notice text={notice} />
        </div>
      ) : null}
      <div className="grid gap-6 border-b border-black/8 pb-8 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          icon={Users}
          label="Responses"
          value="18,420"
          detail={`Across ${range}`}
        />
        <Stat
          icon={Radio}
          label="Live now"
          value="342"
          detail="Active participants"
        />
        <Stat
          icon={TrendingUp}
          label="Completion"
          value="78%"
          detail="+6.2 points"
        />
        <Stat
          icon={MapPin}
          label="Regions"
          value="28"
          detail="Verified coverage"
        />
      </div>
      <div className="mt-8 grid gap-7 lg:grid-cols-[1.2fr_.8fr]">
        <section className={panel}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-extrabold">
                Real-time response curve
              </h2>
              <p className="mt-1 text-sm text-black/42">
                Responses per interval
              </p>
            </div>
            <span className="flex items-center gap-2 text-xs font-bold text-emerald-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Live
            </span>
          </div>
          <div className="mt-8 flex h-56 items-end gap-2">
            {[
              18, 24, 21, 33, 41, 37, 52, 48, 61, 69, 64, 79, 74, 88, 81, 92,
            ].map((value, index) => (
              <div key={index} className="flex h-full flex-1 items-end">
                <div
                  className="w-full rounded-t bg-ink hover:bg-lilac"
                  style={{ height: `${value}%` }}
                />
              </div>
            ))}
          </div>
        </section>
        <aside className={panel}>
          <h2 className="font-display text-xl font-extrabold">
            Export reports
          </h2>
          <p className="mt-2 text-sm leading-6 text-black/45">
            Download response-level data or a presentation-ready summary.
          </p>
          <button
            onClick={() => exportData("CSV")}
            className="mt-6 flex w-full items-center gap-3 rounded-xl border border-black/10 p-4 text-sm font-bold"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
          <button
            onClick={() => exportData("PDF")}
            className="mt-3 flex w-full items-center gap-3 rounded-xl border border-black/10 p-4 text-sm font-bold"
          >
            <FileText className="h-4 w-4" />
            Export PDF
          </button>
        </aside>
      </div>
      <div className="mt-7 grid gap-7 lg:grid-cols-2">
        <section className={panel}>
          <h2 className="font-display text-xl font-extrabold">
            Demographic insights
          </h2>
          <div className="mt-5 space-y-4">
            {[
              ["18-24", 34],
              ["25-34", 28],
              ["35-44", 19],
              ["45-64", 14],
              ["65+", 5],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="flex justify-between text-xs font-bold">
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
        </section>
        <section className={panel}>
          <h2 className="font-display text-xl font-extrabold">
            Geographic insights
          </h2>
          <div className="mt-5 divide-y divide-black/7">
            {[
              ["Cook County", 6842],
              ["DuPage County", 3190],
              ["Lake County", 2404],
              ["Will County", 1881],
            ].map(([name, value], index) => (
              <div
                key={name as string}
                className="flex items-center justify-between py-3"
              >
                <span className="flex items-center gap-3 text-sm font-bold">
                  <span className="font-mono text-xs text-lilac">
                    0{index + 1}
                  </span>
                  {name}
                </span>
                <span className="text-sm text-black/45">
                  {Number(value).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export function OrganizationScreen() {
  const [color, setColor] = useState("#f04a23");
  const [verified, setVerified] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logoSelected, setLogoSelected] = useState(false);
  const [members, setMembers] = useState([
    "Maya Chen",
    "Noah Williams",
    "Priya Shah",
  ]);
  return (
    <>
      <PageHeading
        title="Organization"
        description="Manage creator identity, verification, team access, and branded poll presentation."
      />
      {saved ? (
        <div className="mb-6">
          <Notice text="Organization profile saved." />
        </div>
      ) : null}
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className={`${panel} space-y-5`}>
          <div className="flex items-center gap-4">
            <span
              className="grid h-16 w-16 place-items-center rounded-2xl text-white"
              style={{ backgroundColor: color }}
            >
              <Building2 className="h-7 w-7" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-extrabold">
                Civic Research Collective
              </h2>
              <p className="mt-1 text-sm text-black/42">Creator organization</p>
            </div>
            {verified ? (
              <BadgeCheck className="ml-auto h-6 w-6 text-lilac" />
            ) : null}
          </div>
          <label className="block text-sm font-bold">
            Organization description
            <textarea
              defaultValue="Independent civic research and public consultation."
              rows={3}
              className={`${control} mt-2 resize-none`}
            />
          </label>
          <div>
            <p className="text-sm font-bold">Brand color</p>
            <div className="mt-3 flex gap-3">
              {["#f04a23", "#111114", "#1677ff", "#0f8a5f", "#7c3aed"].map(
                (value) => (
                  <button
                    key={value}
                    onClick={() => setColor(value)}
                    aria-label={`Use color ${value}`}
                    className={`h-10 w-10 rounded-full border-4 ${color === value ? "border-black" : "border-white"}`}
                    style={{ backgroundColor: value }}
                  />
                ),
              )}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold">Logo upload</p>
            <button
              onClick={() => setLogoSelected(true)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-black/20 py-8 text-sm font-bold text-black/45"
            >
              <Upload className="h-4 w-4" />
              {logoSelected
                ? "Logo selected for preview"
                : "Upload organization logo"}
            </button>
          </div>
          <button
            onClick={() => setSaved(true)}
            className="rounded-full bg-lilac px-6 py-3 text-sm font-extrabold text-white"
          >
            Save branding
          </button>
        </section>
        <aside className="space-y-6">
          <div className={panel}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-extrabold">
                Verification
              </h2>
              <UserCheck className="h-5 w-5 text-lilac" />
            </div>
            <p className="mt-2 text-sm leading-6 text-black/45">
              Verified organizations receive a badge on polls and profiles.
            </p>
            <button
              onClick={() => setVerified(true)}
              disabled={verified}
              className="mt-5 w-full rounded-full bg-ink px-5 py-3 text-sm font-bold text-white disabled:bg-emerald-600"
            >
              {verified ? "Verified in demo" : "Start verification"}
            </button>
          </div>
          <div className={panel}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-extrabold">Team</h2>
              <button
                onClick={() =>
                  setMembers((items) => [
                    ...items,
                    `New member ${items.length + 1}`,
                  ])
                }
                className="text-xs font-bold text-lilac"
              >
                Invite
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {members.map((name, index) => (
                <div
                  key={`${name}-${index}`}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-bold">{name}</span>
                  <span className="text-xs text-black/35">
                    {index === 0 ? "Owner" : "Editor"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

const moderationSeed = [
  {
    id: 1,
    title: "Claim about municipal water quality",
    reason: "Misinformation",
    reporter: "Automated integrity scan",
    risk: "High",
  },
  {
    id: 2,
    title: "Repeated promotional poll campaign",
    reason: "Spam",
    reporter: "12 community reports",
    risk: "Medium",
  },
  {
    id: 3,
    title: "Comment targeting a protected group",
    reason: "Hate speech",
    reporter: "4 member reports",
    risk: "High",
  },
  {
    id: 4,
    title: "New organization public poll",
    reason: "Approval workflow",
    reporter: "Creator submission",
    risk: "Low",
  },
];
export function ModerationScreen() {
  const [queue, setQueue] = useState(moderationSeed);
  const [filter, setFilter] = useState("All");
  const [history, setHistory] = useState<string[]>([]);
  const visible =
    filter === "All" ? queue : queue.filter((item) => item.reason === filter);
  function resolve(id: number, action: string) {
    const item = queue.find((entry) => entry.id === id);
    if (!item) return;
    setQueue((items) => items.filter((entry) => entry.id !== id));
    setHistory((items) => [`${action}: ${item.title}`, ...items]);
  }
  return (
    <>
      <PageHeading
        title="Moderation queue"
        description="Review flagged content, spam, hate speech, misinformation, and poll approval requests."
        action={
          <span className="rounded-full bg-red-50 px-4 py-2 text-sm font-extrabold text-red-700">
            {queue.length} open items
          </span>
        }
      />
      <div className="flex gap-2 overflow-x-auto pb-4">
        {[
          "All",
          "Misinformation",
          "Spam",
          "Hate speech",
          "Approval workflow",
        ].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${filter === item ? "bg-ink text-white" : "border border-black/10"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="divide-y divide-black/7 overflow-hidden rounded-2xl border border-black/8 bg-white">
          {visible.map((item) => (
            <article key={item.id} className="p-6">
              <div className="flex flex-col justify-between gap-5 sm:flex-row">
                <div>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span
                      className={`rounded-full px-3 py-1 ${item.risk === "High" ? "bg-red-50 text-red-700" : item.risk === "Medium" ? "bg-amber-50 text-amber-700" : "bg-black/5"}`}
                    >
                      {item.risk} risk
                    </span>
                    <span className="text-black/40">{item.reason}</span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-extrabold">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-sm text-black/42">{item.reporter}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => resolve(item.id, "Approved")}
                    className="h-fit rounded-full border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => resolve(item.id, "Removed")}
                    className="h-fit rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
          {visible.length === 0 ? (
            <p className="p-10 text-center text-sm text-black/40">
              Queue is clear for this filter.
            </p>
          ) : null}
        </section>
        <aside className={panel}>
          <h2 className="font-display text-xl font-extrabold">
            Recent decisions
          </h2>
          <div className="mt-5 space-y-4">
            {history.length ? (
              history.map((item) => (
                <p
                  key={item}
                  className="border-b border-black/7 pb-4 text-sm font-bold"
                >
                  {item}
                </p>
              ))
            ) : (
              <p className="text-sm leading-6 text-black/42">
                Moderation decisions from this session will appear here.
              </p>
            )}
          </div>
          <button
            onClick={() =>
              setHistory((items) => ["Moderation report exported", ...items])
            }
            className="mt-6 flex items-center gap-2 text-sm font-bold text-lilac"
          >
            <FileText className="h-4 w-4" />
            Download moderation report
          </button>
        </aside>
      </div>
    </>
  );
}

export function PlatformAdminScreen() {
  const [tab, setTab] = useState("Overview");
  const [verification, setVerification] = useState([
    "Civic Transit Lab",
    "Public Health Alliance",
    "FutureWork Institute",
  ]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [managedPoll, setManagedPoll] = useState("");
  return (
    <>
      <PageHeading
        title="Platform administration"
        description="Manage users, polls, verification, system health, discovery controls, and security policies."
      />
      <div className="flex gap-2 overflow-x-auto border-b border-black/8 pb-4">
        {["Overview", "Users", "Polls", "Verification", "Security"].map(
          (item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${tab === item ? "bg-ink text-white" : "hover:bg-black/5"}`}
            >
              {item}
            </button>
          ),
        )}
      </div>
      {tab === "Overview" ? (
        <div className="mt-7">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Stat
              icon={Users}
              label="Users"
              value="128.4k"
              detail="+8.2% this month"
            />
            <Stat
              icon={BarChart3}
              label="Live polls"
              value="1,842"
              detail="342 currently active"
            />
            <Stat
              icon={Flag}
              label="Open reports"
              value="27"
              detail="Median response: 18m"
            />
            <Stat
              icon={Activity}
              label="System health"
              value="99.98%"
              detail="All services operational"
            />
          </div>
          <div className="mt-8 grid gap-7 lg:grid-cols-[1.2fr_.8fr]">
            <section className={panel}>
              <h2 className="font-display text-xl font-extrabold">
                Live participation
              </h2>
              <div className="mt-8 flex h-52 items-end gap-2">
                {[32, 45, 39, 51, 58, 48, 66, 72, 63, 78, 84, 74, 91, 88].map(
                  (value, index) => (
                    <div key={index} className="flex h-full flex-1 items-end">
                      <div
                        className="w-full rounded-t bg-ink"
                        style={{ height: `${value}%` }}
                      />
                    </div>
                  ),
                )}
              </div>
            </section>
            <aside className={panel}>
              <h2 className="font-display text-xl font-extrabold">
                Discovery engine
              </h2>
              <div className="mt-4">
                <Toggle
                  checked={true}
                  onChange={() => undefined}
                  label="Trending algorithm"
                  detail="Weight velocity, verified participation, and quality."
                />
                <Toggle
                  checked={true}
                  onChange={() => undefined}
                  label="Local prioritization"
                  detail="Boost eligible regional polls."
                />
                <Toggle
                  checked={true}
                  onChange={() => undefined}
                  label="Personalized ranking"
                  detail="Use interests and followed organizations."
                />
              </div>
            </aside>
          </div>
        </div>
      ) : null}
      {tab === "Users" ? (
        <section className={`${panel} mt-7`}>
          <h2 className="font-display text-xl font-extrabold">
            User management
          </h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-black/8 text-xs uppercase text-black/35">
                <tr>
                  <th className="pb-3">User</th>
                  <th className="pb-3">Role</th>
                  <th className="pb-3">Verification</th>
                  <th className="pb-3">Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {[
                  ["Maya Chen", "Voter", "Verified ID"],
                  ["Noah Williams", "Creator", "Verified Geo"],
                  ["Priya Shah", "Voter", "Anonymous"],
                ].map(([name, role, level]) => (
                  <tr key={name} className="border-b border-black/7">
                    <td className="py-4 font-bold">{name}</td>
                    <td>{role}</td>
                    <td>{level}</td>
                    <td>{blocked.includes(name) ? "Suspended" : "Active"}</td>
                    <td className="text-right">
                      <button
                        onClick={() =>
                          setBlocked((items) =>
                            items.includes(name)
                              ? items.filter((item) => item !== name)
                              : [...items, name],
                          )
                        }
                        className="text-xs font-bold text-lilac"
                      >
                        {blocked.includes(name) ? "Restore" : "Suspend"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
      {tab === "Polls" ? (
        <section className={`${panel} mt-7`}>
          <h2 className="font-display text-xl font-extrabold">
            Poll management
          </h2>
          {managedPoll ? (
            <div className="mt-4">
              <Notice text={`Management panel opened for “${managedPoll}”.`} />
            </div>
          ) : null}
          <div className="mt-5 divide-y divide-black/7">
            {[
              "AI media disclosure standards",
              "Neighborhood public service access",
              "Regional transit investment",
            ].map((title, index) => (
              <div
                key={title}
                className="flex items-center justify-between gap-5 py-4"
              >
                <div>
                  <b className="text-sm">{title}</b>
                  <p className="mt-1 text-xs text-black/40">
                    {["Active", "Scheduled", "Under review"][index]} ·{" "}
                    {(8420 - index * 1730).toLocaleString()} responses
                  </p>
                </div>
                <button
                  onClick={() => setManagedPoll(title)}
                  className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold"
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {tab === "Verification" ? (
        <section className={`${panel} mt-7`}>
          <h2 className="font-display text-xl font-extrabold">
            Verification management
          </h2>
          <div className="mt-5 divide-y divide-black/7">
            {verification.map((name, index) => (
              <div
                key={name}
                className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center"
              >
                <div>
                  <b>{name}</b>
                  <p className="mt-1 text-xs text-black/40">
                    {index === 1
                      ? "Creator verification"
                      : "Organization verification"}{" "}
                    · documents received
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setVerification((items) =>
                        items.filter((item) => item !== name),
                      )
                    }
                    className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold"
                  >
                    Request info
                  </button>
                  <button
                    onClick={() =>
                      setVerification((items) =>
                        items.filter((item) => item !== name),
                      )
                    }
                    className="rounded-full bg-lilac px-4 py-2 text-xs font-bold text-white"
                  >
                    Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
      {tab === "Security" ? (
        <section className="mt-7 grid gap-7 lg:grid-cols-2">
          <div className={panel}>
            <h2 className="font-display text-xl font-extrabold">
              Abuse prevention
            </h2>
            <div className="mt-4">
              <Toggle
                checked={true}
                onChange={() => undefined}
                label="Bot protection"
                detail="Behavior and velocity signals."
              />
              <Toggle
                checked={true}
                onChange={() => undefined}
                label="Rate limiting"
                detail="Account, device, and network thresholds."
              />
              <Toggle
                checked={true}
                onChange={() => undefined}
                label="Device fingerprinting"
                detail="Privacy-preserving duplicate detection."
              />
              <Toggle
                checked={true}
                onChange={() => undefined}
                label="Adaptive CAPTCHA"
                detail="Challenge suspicious participation."
              />
            </div>
          </div>
          <div className={panel}>
            <h2 className="font-display text-xl font-extrabold">
              Compliance operations
            </h2>
            <div className="mt-5 space-y-4">
              {[
                "GDPR deletion queue · 4 requests",
                "Data export queue · 11 requests",
                "Privacy audit · completed today",
                "Personal data sales · disabled",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-black/[0.03] p-4 text-sm font-bold"
                >
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

export function IntegrationsScreen() {
  const [connected, setConnected] = useState<string[]>(["Supabase"]);
  const [configuring, setConfiguring] = useState<string | null>(null);
  const integrations = [
    {
      name: "Stripe",
      icon: Zap,
      detail: "Subscriptions, billing, and identity verification.",
      capabilities: ["Subscription payments", "Identity verification"],
    },
    {
      name: "Zoho CRM",
      icon: Building2,
      detail: "Creator accounts and sales pipeline tracking.",
      capabilities: ["Creator management", "Sales pipeline"],
    },
    {
      name: "Supabase",
      icon: Webhook,
      detail: "Authentication, database, and realtime synchronization.",
      capabilities: ["Authentication", "Database", "Realtime"],
    },
  ];
  return (
    <>
      <PageHeading
        title="Integrations"
        description="Configure the external services planned for payments, identity, CRM, authentication, and realtime data."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {integrations.map(({ name, icon: Icon, detail, capabilities }) => {
          const active = connected.includes(name);
          return (
            <article key={name} className={panel}>
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${active ? "bg-emerald-50 text-emerald-700" : "bg-black/5 text-black/45"}`}
                >
                  {active ? "Connected" : "Not connected"}
                </span>
              </div>
              <h2 className="mt-6 font-display text-2xl font-extrabold">
                {name}
              </h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-black/48">
                {detail}
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                {capabilities.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-lilac" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setConfiguring(name)}
                className={`mt-7 w-full rounded-full px-5 py-3 text-sm font-bold ${active ? "border border-black/10" : "bg-lilac text-white"}`}
              >
                {active ? "Manage" : "Configure"}
              </button>
            </article>
          );
        })}
      </div>
      {configuring ? (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-5">
          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-extrabold">
                Configure {configuring}
              </h2>
              <button
                onClick={() => setConfiguring(null)}
                className="text-sm font-bold text-black/40"
              >
                Close
              </button>
            </div>
            <p className="mt-2 text-sm leading-6 text-black/48">
              Frontend configuration preview. Secrets and OAuth handshakes
              belong in the production backend.
            </p>
            <label className="mt-6 block text-sm font-bold">
              Environment
              <select className={`${control} mt-2`}>
                <option>Test / Sandbox</option>
                <option>Production</option>
              </select>
            </label>
            <label className="mt-4 block text-sm font-bold">
              Connection label
              <input
                placeholder={`${configuring} workspace`}
                className={`${control} mt-2`}
              />
            </label>
            <button
              onClick={() => {
                setConnected((items) =>
                  items.includes(configuring) ? items : [...items, configuring],
                );
                setConfiguring(null);
              }}
              className="mt-6 w-full rounded-full bg-lilac py-3 text-sm font-extrabold text-white"
            >
              Save frontend configuration
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
