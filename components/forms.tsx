"use client";

import { FormEvent, useState } from "react";

type Status = { kind: "success" | "error"; text: string } | null;

export function ContactForm() {
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setStatus({ kind: "success", text: "Thanks for reaching out! We'll get back to you soon." });
    form.reset();
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {status && <div className={`rounded-2xl border p-4 text-sm font-bold ${status.kind === "success" ? "border-lilac/20 bg-[#fff4e8] text-lilac" : "border-red-200 bg-red-50 text-red-700"}`}>{status.text}</div>}
      <div className="grid gap-5 md:grid-cols-2">
        <Field name="name" label="Full Name *" required />
        <Field name="email" label="Email Address *" type="email" required />
      </div>
      <div>
        <label htmlFor="inquiry_type" className="mb-2 block text-sm font-extrabold">Inquiry Type</label>
        <select id="inquiry_type" name="inquiry_type" className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-lilac focus:ring-4 focus:ring-lilac/10">
          <option value="general">General question</option>
          <option value="verified">Verified community polls</option>
          <option value="ai">AI insights demo</option>
          <option value="privacy">Anonymous voting and trust</option>
          <option value="enterprise">Organization dashboard</option>
          <option value="partnership">Partnership</option>
        </select>
      </div>
      <Field name="subject" label="Subject *" required />
      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-extrabold">Message *</label>
        <textarea id="message" name="message" rows={6} required className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-lilac focus:ring-4 focus:ring-lilac/10" />
      </div>
      <label className="flex items-center gap-3 text-sm font-bold text-black/58">
        <input type="checkbox" name="newsletter" value="1" className="h-4 w-4 rounded border-black/20 text-lilac" />
        Subscribe to product updates, launch notes, and public-opinion research.
      </label>
      <button disabled={loading} type="submit" className="w-full rounded-full bg-ink px-7 py-4 text-sm font-extrabold text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70">
        {loading ? "Sending..." : "Send Message"}
      </button>
      <p className="text-center text-xs text-black/42">By submitting, you agree to our privacy-first contact policy.</p>
    </form>
  );
}

function Field({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-extrabold">{label}</label>
      <input id={name} name={name} type={type} required={required} className="w-full rounded-2xl border border-black/10 bg-white px-4 py-4 outline-none transition focus:border-lilac focus:ring-4 focus:ring-lilac/10" />
    </div>
  );
}

export function SignupForm() {
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setStatus({ kind: "success", text: "You're on the list! We'll notify you when early access opens." });
    form.reset();
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4 text-left">
      {status && <div className={`rounded-xl border p-4 text-sm font-medium ${status.kind === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>{status.text}</div>}
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
        <input type="email" id="email" name="email" placeholder="you@example.com" required className="w-full rounded-xl border border-slate-300 px-4 py-3 transition focus:border-lilac focus:outline-none focus:ring-2 focus:ring-lilac" />
      </div>
      <div>
        <label htmlFor="plan" className="mb-2 block text-sm font-medium text-slate-700">Preferred Plan Tier</label>
        <select id="plan" name="plan" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 transition focus:border-lilac focus:outline-none focus:ring-2 focus:ring-lilac">
          <option value="free">Free Plan</option>
          <option value="pro">Pro Plan</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>
      <button disabled={loading} type="submit" className="block w-full rounded-xl bg-lilac py-3 text-center font-semibold text-white shadow-md transition hover:bg-ink hover:shadow-lg disabled:cursor-wait disabled:opacity-70">
        {loading ? "Joining..." : "Join Waitlist"}
      </button>
    </form>
  );
}
