"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  CirclePlus,
  Compass,
  Gift,
  Grid3X3,
  LayoutDashboard,
  LogOut,
  Map,
  MessageSquareText,
  Newspaper,
  Settings,
  Shield,
  Sparkles,
  Users,
  Vote,
} from "lucide-react";
import { Brand } from "@/components/SiteChrome";
import type { SessionUser } from "@/lib/auth";

type NavItem = { label: string; href: string; icon: typeof BarChart3 };
type WorkspaceGroup = { title: string; links: string[][] };

const creatorNav: NavItem[] = [
  { label: "Dashboard", href: "/creator-studio", icon: LayoutDashboard },
  { label: "Create Poll", href: "/create-poll", icon: CirclePlus },
  { label: "Analytics", href: "/creator-analytics", icon: BarChart3 },
  { label: "Organization", href: "/organization", icon: Users },
  { label: "Moderation", href: "/moderation", icon: Shield },
  { label: "Integrations", href: "/integrations", icon: Settings },
];

const voterNav: NavItem[] = [
  { label: "Feed", href: "/feed", icon: Newspaper },
  { label: "Discover", href: "/discover", icon: Compass },
  { label: "Sentiment Map", href: "/sentiment-map", icon: Map },
  { label: "Debate", href: "/debate", icon: MessageSquareText },
  { label: "Insights", href: "/insights", icon: Sparkles },
  { label: "Communities", href: "/communities", icon: Users },
  { label: "Rewards", href: "/rewards", icon: Gift },
];

const creatorWorkspace: WorkspaceGroup[] = [
  {
    title: "Polls",
    links: [
      ["Creator studio", "/creator-studio"],
      ["Create poll", "/create-poll"],
      ["Creator analytics", "/creator-analytics"],
    ],
  },
  {
    title: "Organization",
    links: [
      ["Organization", "/organization"],
      ["Moderation", "/moderation"],
      ["Integrations", "/integrations"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Profile & verification", "/profile"],
      ["Notifications", "/notifications"],
      ["Privacy center", "/privacy-center"],
      ["Public website", "/"],
    ],
  },
];

const voterWorkspace: WorkspaceGroup[] = [
  {
    title: "Explore",
    links: [
      ["Feed", "/feed"],
      ["Discover", "/discover"],
      ["Sentiment map", "/sentiment-map"],
      ["Debate", "/debate"],
    ],
  },
  {
    title: "Activity",
    links: [
      ["Voting formats", "/voting-formats"],
      ["Communities", "/communities"],
      ["Rewards", "/rewards"],
      ["Insights", "/insights"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Profile & verification", "/profile"],
      ["Notifications", "/notifications"],
      ["Privacy center", "/privacy-center"],
      ["Public website", "/"],
    ],
  },
];

export default function ProductShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isCreator = user.role === "creator";
  const navigation = isCreator ? creatorNav : voterNav;
  const workspaceGroups = isCreator ? creatorWorkspace : voterWorkspace;
  const roleLabel = isCreator ? "Creator" : "Voter";
  const initials = user.name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative z-10 min-h-screen bg-white/55 text-ink">
      <header className="sticky top-0 z-50 border-b border-black/8 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1500px] items-center gap-6 px-5 sm:px-7">
          <Brand />
          <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex">
            {navigation.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition ${active ? "bg-ink text-white" : "text-black/55 hover:bg-black/5 hover:text-ink"}`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/notifications"
              aria-label="Notifications"
              title="Notifications"
              className={`grid h-10 w-10 place-items-center rounded-full border border-black/8 ${pathname === "/notifications" ? "bg-ink text-white" : "bg-white text-black/45 hover:text-ink"}`}
            >
              <Bell className="h-4 w-4" />
            </Link>
            <details className="group relative">
              <summary
                className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-full border border-black/8 bg-white text-black/45 hover:text-ink"
                aria-label="Open workspace navigation"
              >
                <Grid3X3 className="h-4 w-4" />
              </summary>
              <div className="absolute right-0 top-12 z-50 grid w-[min(620px,calc(100vw-2rem))] gap-6 rounded-2xl border border-black/8 bg-white p-6 shadow-soft sm:grid-cols-2">
                {workspaceGroups.map((group) => (
                  <div key={group.title}>
                    <p className="text-xs font-bold uppercase text-black/35">
                      {group.title}
                    </p>
                    <div className="mt-2 space-y-1">
                      {group.links.map(([label, href]) => (
                        <Link
                          key={href}
                          href={href}
                          className={`block rounded-lg px-3 py-2 text-sm font-bold ${pathname === href ? "bg-butter text-lilac" : "hover:bg-black/5"}`}
                        >
                          {label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-extrabold leading-4">{user.name}</p>
              <p className="mt-1 text-xs text-black/40">{roleLabel}</p>
            </div>
            <Link
              href="/profile"
              aria-label="Open profile"
              className="grid h-10 w-10 place-items-center rounded-full bg-ink text-xs font-extrabold text-white"
            >
              {initials}
            </Link>
            <Link
              href="/logout"
              aria-label="Log out"
              title="Log out"
              className="grid h-10 w-10 place-items-center rounded-full text-black/45 hover:bg-black/5 hover:text-ink"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto border-t border-black/5 px-4 py-2 xl:hidden">
          {navigation.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold ${pathname === href ? "bg-ink text-white" : "text-black/55"}`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-[1400px] px-5 py-8 sm:px-7 lg:py-10">
        {children}
      </main>
    </div>
  );
}

export function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 border-b border-black/8 pb-7 sm:flex-row sm:items-end">
      <div>
        <h1 className="font-display text-3xl font-extrabold sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-black/48 sm:text-base">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

export function Stat({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof BarChart3;
}) {
  return (
    <div className="border-l-2 border-lilac pl-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase text-black/40">
        <Icon className="h-4 w-4 text-lilac" />
        {label}
      </div>
      <p className="mt-2 font-display text-3xl font-extrabold">{value}</p>
      <p className="mt-1 text-xs text-black/42">{detail}</p>
    </div>
  );
}
