import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label="Quorum Check home">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white shadow-soft">
        <span className="h-5 w-5 rounded-full border-[6px] border-white border-r-lilac" />
      </span>
      <span className="font-mono text-xl font-bold">Quorum Check</span>
    </Link>
  );
}

export function MarketingHeader({ active = "" }: { active?: string }) {
  const nav = [
    ["Feed", "/#feed"],
    ["Sentiment Map", "/#map"],
    ["Debate", "/#debate"],
    ["Insights", "/#insights"],
    ["Communities", "/#communities"],
    ["Create Poll", "/#create"],
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/74 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-7">
        <Brand />
        <nav className="hidden items-center gap-2 rounded-full border border-black/5 bg-white/80 p-1 text-sm font-bold shadow-sm lg:flex">
          {nav.map(([label, href]) => (
            <Link key={href} className="rounded-full px-4 py-2 hover:bg-black/5" href={href}>
              {label}
            </Link>
          ))}
          <Link className={`rounded-full px-4 py-2 ${active === "contact" ? "bg-black/5" : "hover:bg-black/5"}`} href="/contact">
            Contact
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/contact" className="hidden rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-bold shadow-sm hover:border-black/20 sm:inline-flex">
            Contact
          </Link>
          <Link href="/signup" className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:-translate-y-0.5">
            Join Now
          </Link>
        </div>
      </div>
    </header>
  );
}

export function MinimalFooter() {
  return (
    <footer className="relative z-10 mx-auto max-w-7xl px-5 py-10 sm:px-7">
      <div className="flex flex-col justify-between gap-4 border-t border-black/8 pt-8 text-sm text-black/50 sm:flex-row">
        <p className="font-bold text-ink">Quorum Check</p>
        <p>Social polling, debate, sentiment maps, AI insights, and verified community decision-making.</p>
        <p>&copy; {new Date().getFullYear()} Quorum Check.</p>
      </div>
    </footer>
  );
}

export function StandardFooter() {
  return (
    <footer className="relative z-10 border-t border-slate-100 bg-white py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8 flex flex-col items-center justify-between gap-6 border-b border-slate-100 pb-8 md:flex-row">
          <div>
            <Link href="/" className="text-lg font-bold tracking-tight text-slate-900 hover:text-lilac">
              Quorum<span className="text-lilac">Check</span>
            </Link>
            <p className="mt-1 text-xs text-slate-400">Real-time, privacy-first public opinion polling.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm font-medium text-slate-500">
            <Link href="/#feed" className="hover:text-lilac">Features</Link>
            <Link href="/#create" className="hover:text-lilac">Create Poll</Link>
            <Link href="/contact" className="hover:text-lilac">Contact Support</Link>
            <Link href="/signup" className="font-semibold text-lilac hover:text-ink">Get Early Access</Link>
          </nav>
        </div>
        <div className="flex flex-col items-center justify-between gap-6 text-xs text-slate-400 md:flex-row">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <p>&copy; {new Date().getFullYear()} Quorum Check. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-lilac">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-lilac">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-lilac">Cookie Policy</Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://x.com/QuorumCheck" target="_blank" rel="noreferrer" className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-lilac">X</a>
            <a href="https://www.facebook.com/QuorumCheck" target="_blank" rel="noreferrer" className="rounded-lg p-2 text-slate-400 hover:bg-slate-50 hover:text-lilac">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
