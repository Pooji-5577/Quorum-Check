import { MarketingHeader, StandardFooter } from "@/components/SiteChrome";

type Section = {
  title: string;
  body?: string;
  bullets?: string[];
  panel?: boolean;
};

export function LegalPage({ eyebrow, title, intro, sections }: { eyebrow: string; title: string; intro: string[]; sections: Section[] }) {
  return (
    <>
      <MarketingHeader />
      <main className="bg-slate-50 px-6 py-16 text-slate-800 antialiased">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="mb-8 border-b border-slate-100 pb-8">
            <span className="text-sm font-semibold uppercase tracking-wide text-lilac">{eyebrow}</span>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">{title}</h1>
            <p className="mt-2 text-sm text-slate-500">Last updated: June 2026</p>
          </div>
          <section className="space-y-6 leading-relaxed text-slate-600">
            {intro.map((paragraph) => <p key={paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />)}
          </section>
          <hr className="my-8 border-slate-100" />
          <div className="space-y-10 leading-relaxed text-slate-600">
            {sections.map((section) => (
              <section key={section.title} className={section.panel ? "rounded-2xl border border-indigo-100 bg-indigo-50 p-6" : ""}>
                <h2 className={`${section.panel ? "text-lg text-indigo-900" : "text-xl text-slate-900"} mb-4 font-bold`}>{section.title}</h2>
                {section.body && <p className={section.bullets ? "mb-3" : ""}>{section.body}</p>}
                {section.bullets && <ul className="list-disc space-y-2 pl-6">{section.bullets.map((bullet) => <li key={bullet} dangerouslySetInnerHTML={{ __html: bullet }} />)}</ul>}
              </section>
            ))}
          </div>
        </div>
      </main>
      <StandardFooter />
    </>
  );
}
