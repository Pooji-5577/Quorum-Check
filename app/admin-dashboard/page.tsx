import { MarketingHeader, StandardFooter } from "@/components/SiteChrome";

type Contact = {
  id: number;
  name: string;
  email: string;
  inquiry_type: string;
  subject: string;
  message: string;
  newsletter: number;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date | string;
};

const MOCK_CONTACTS: Contact[] = [
  { id: 1, name: "Alex Rivera", email: "alex@example.com", inquiry_type: "general", subject: "Platform feedback", message: "Love the concept! When is the public beta?", newsletter: 1, ip_address: null, user_agent: null, created_at: new Date().toISOString() },
  { id: 2, name: "Priya Sharma", email: "priya@org.co", inquiry_type: "enterprise", subject: "Enterprise plan inquiry", message: "We're a 500-person org looking at verified polling for internal decisions.", newsletter: 0, ip_address: null, user_agent: null, created_at: new Date(Date.now() - 86400000).toISOString() },
];

export const metadata = { title: "Admin Dashboard · Quorum Check" };

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const search = params.search?.trim() || "";
  const type = params.type || "all";
  const status = params.status || "all";
  const error = "";

  let contacts = MOCK_CONTACTS;
  if (search) contacts = contacts.filter((c) => `${c.name} ${c.email} ${c.subject} ${c.message}`.toLowerCase().includes(search.toLowerCase()));
  if (type !== "all") contacts = contacts.filter((c) => c.inquiry_type === type);
  void status;

  return (
    <>
      <MarketingHeader />
      <main className="min-h-screen bg-slate-50 px-6 py-12 text-slate-800 antialiased">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-lilac">Core Management Dashboard</span>
              <h1 className="mt-1 text-2xl font-extrabold text-slate-900">Inbound Contact Submissions</h1>
              <p className="mt-1 text-sm text-slate-500">Showing {contacts.length} recent customer records captured through live portals.</p>
            </div>
          </div>
          <form className="grid grid-cols-1 items-end gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-4">
            <FilterInput label="Search Records" name="search" defaultValue={search} />
            <Select label="Inquiry Type" name="type" defaultValue={type} options={["all", "general", "verified", "ai", "privacy", "enterprise", "partnership"]} />
            <Select label="Workflow Status" name="status" defaultValue={status} options={["all", "new", "replied", "archived"]} />
            <button type="submit" className="rounded-xl bg-lilac px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-ink">Apply Filters</button>
          </form>
          {error && <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-900">{error}</div>}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead><tr className="border-b border-slate-200 bg-slate-50 font-semibold tracking-wide text-slate-700"><th className="p-4">Submission Meta</th><th className="p-4">Sender Details</th><th className="p-4">Inquiry Category</th><th className="p-4">Subject & Excerpt</th><th className="p-4 text-center">Newsletter</th></tr></thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {contacts.length === 0 ? <tr><td colSpan={5} className="p-12 text-center font-medium text-slate-400">No database entries found.</td></tr> : contacts.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-slate-50/70">
                      <td className="whitespace-nowrap p-4"><div className="font-mono text-xs text-slate-400">ID: #{row.id}</div><div className="mt-1 text-xs text-slate-500">{new Date(row.created_at).toLocaleString()}</div></td>
                      <td className="p-4"><div className="font-semibold text-slate-900">{row.name}</div><div className="mt-0.5 font-mono text-xs text-lilac">{row.email}</div></td>
                      <td className="whitespace-nowrap p-4"><span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-semibold capitalize text-slate-700">{row.inquiry_type}</span></td>
                      <td className="max-w-xs p-4"><div className="truncate font-medium text-slate-800">{row.subject}</div><div className="mt-1 truncate text-xs text-slate-400">{row.message}</div></td>
                      <td className="whitespace-nowrap p-4 text-center">{row.newsletter ? <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600">Subscribed</span> : <span className="text-slate-300">-</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <StandardFooter />
    </>
  );
}

function FilterInput({ label, name, defaultValue }: { label: string; name: string; defaultValue: string }) {
  return <div><label htmlFor={name} className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label><input id={name} name={name} defaultValue={defaultValue} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lilac" /></div>;
}

function Select({ label, name, defaultValue, options }: { label: string; name: string; defaultValue: string; options: string[] }) {
  return <div><label htmlFor={name} className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</label><select id={name} name={name} defaultValue={defaultValue} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lilac">{options.map((option) => <option key={option} value={option}>{option === "all" ? "All" : option}</option>)}</select></div>;
}
