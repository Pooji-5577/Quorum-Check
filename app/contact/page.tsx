import { ContactForm } from "@/components/forms";
import { MarketingHeader, MinimalFooter } from "@/components/SiteChrome";

export const metadata = {
  title: "Contact Quorum Check - Verified Polling and Public Opinion Support",
  description:
    "Contact Quorum Check about verified community polls, debate mode, AI insights, sentiment maps, organization dashboards, and anonymous accountable voting.",
};

export default function ContactPage() {
  return (
    <>
      <MarketingHeader active="contact" />
      <main className="relative z-10">
        <section className="mx-auto max-w-7xl px-5 pb-10 pt-10 sm:px-7 lg:pt-14">
          <div className="relative overflow-hidden rounded-[2rem] border border-black/8 bg-white/72 px-5 py-16 shadow-soft sm:px-10 lg:px-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_40%,rgba(255,244,232,.82),transparent_24rem),radial-gradient(circle_at_76%_24%,rgba(246,247,251,.84),transparent_26rem),radial-gradient(circle_at_72%_68%,rgba(240,74,35,.16),transparent_22rem)]" />
            <div className="pixel-field pixel-field--contact" />
            <div className="absolute inset-8 grid-mesh opacity-70" />
            <div className="relative grid gap-10 lg:grid-cols-[1fr_.8fr] lg:items-center">
              <div>
                <p className="font-mono text-sm font-bold uppercase tracking-[0.24em] text-lilac">Contact Quorum Check</p>
                <h1 className="mt-5 font-display text-5xl font-black leading-[0.98] sm:text-7xl">Let us build better public opinion together.</h1>
                <p className="mt-7 max-w-2xl text-lg leading-8 text-black/62">
                  Questions about verified polls, community insights, debate tools, organization dashboards, or anonymous accountable voting? Our team is ready to help.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <article className="glass rotate-[-1deg] rounded-3xl p-5"><p className="text-xs font-extrabold uppercase tracking-[0.22em] text-black/38">AI insight demo</p><p className="mt-3 text-lg font-extrabold">We can show how Quorum Check summarizes voting trends, key discussions, and regional sentiment.</p></article>
                <article className="glass rotate-[1deg] rounded-3xl p-5"><p className="text-xs font-extrabold uppercase tracking-[0.22em] text-black/38">Verified onboarding</p><p className="mt-3 text-lg font-extrabold">Colleges, businesses, local governments, and organizations can run official community polls.</p></article>
              </div>
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-20 sm:px-7 lg:grid-cols-[1.05fr_.95fr]">
          <div className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-soft sm:p-8">
            <div className="mb-7 border-b border-black/6 pb-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-lilac">Send a message</p>
              <h2 className="mt-2 text-3xl font-extrabold">Tell us what you want to build with polls.</h2>
            </div>
            <ContactForm />
          </div>
          <aside className="space-y-5">
            <div className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-soft">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-lilac">Support areas</p>
              <div className="mt-5 grid gap-3">
                {["Verified community onboarding", "Organization polling setup", "AI insight and debate demos", "Real-time sentiment map configuration", "Anonymous accountable voting", "Moderation, anti-spam, and bot protection"].map((area) => (
                  <div key={area} className="rounded-2xl border border-white/60 bg-white/60 p-4 text-sm font-extrabold shadow-sm backdrop-blur-xl">{area}</div>
                ))}
              </div>
            </div>
            <div className="glass rounded-[2rem] p-6">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-black/38">Live product preview</p>
              <h3 className="mt-3 text-2xl font-extrabold">Sentiment is shifting in verified campus polls.</h3>
              <div className="mt-5 space-y-3">
                <div><div className="mb-1 flex justify-between text-sm font-bold"><span>AI tutors in courses</span><span>61%</span></div><div className="h-2 rounded-full bg-black/5"><div className="h-2 w-[61%] rounded-full bg-lilac" /></div></div>
                <div><div className="mb-1 flex justify-between text-sm font-bold"><span>Anonymous feedback</span><span>84%</span></div><div className="h-2 rounded-full bg-black/5"><div className="h-2 w-[84%] rounded-full bg-[#2457ff]" /></div></div>
              </div>
            </div>
            <div className="rounded-[2rem] bg-ink p-6 text-white shadow-soft"><p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-white/42">Response promise</p><p className="mt-3 text-2xl font-extrabold">24-hour reply for product, community, and enterprise questions.</p></div>
          </aside>
        </section>
      </main>
      <MinimalFooter />
    </>
  );
}
