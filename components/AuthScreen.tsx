"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useId, useState } from "react";

type AuthMode = "signup" | "login";
type Notice = { kind: "info" | "error"; text: string } | null;

function AppleLogo() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 384 512"
      className="shrink-0 fill-current"
    >
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9ZM262.1 104.5C289.4 72.1 286.9 42.7 286.1 32c-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3Z" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      className="shrink-0"
    >
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.79-.07-1.55-.2-2.27H12v4.29h6.47a5.53 5.53 0 0 1-2.4 3.63v2.96h3.88c2.27-2.09 3.57-5.17 3.57-8.61Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-2.96c-1.08.72-2.45 1.14-4.07 1.14-3.13 0-5.78-2.11-6.73-4.95H1.26v3.05A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.31A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.58.38-2.31V6.64H1.26A12 12 0 0 0 0 12c0 1.94.46 3.78 1.26 5.36l4.01-3.05Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.74c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.16 15.23 0 12 0A12 12 0 0 0 1.26 6.64l4.01 3.05C6.22 6.85 8.87 4.74 12 4.74Z"
      />
    </svg>
  );
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path d="M2.7 12s3.4-5.3 9.3-5.3 9.3 5.3 9.3 5.3-3.4 5.3-9.3 5.3S2.7 12 2.7 12Z" />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  ) : (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5 fill-none stroke-current"
      strokeWidth="1.8"
    >
      <path d="m3 3 18 18M10.6 6.8c.45-.07.92-.1 1.4-.1 5.9 0 9.3 5.3 9.3 5.3a15 15 0 0 1-2.45 2.95M6.3 8.2A15.2 15.2 0 0 0 2.7 12s3.4 5.3 9.3 5.3c1.2 0 2.27-.22 3.23-.57M9.9 9.9a2.6 2.6 0 0 0 3.68 3.68" />
    </svg>
  );
}

export default function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [loading, setLoading] = useState(false);
  const noticeId = useId();
  const router = useRouter();

  function switchMode(nextMode: AuthMode) {
    setMode(nextMode);
    setNotice(null);
  }

  async function submitEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setLoading(true);
    setNotice(null);
    const data = new FormData(form);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          name: data.get("name"),
          email: data.get("email"),
          password: data.get("password"),
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        setNotice({
          kind: "error",
          text: result.error || "Authentication failed. Please try again.",
        });
        return;
      }
      const redirectTo = result.user?.role ? "/feed" : "/select-role";
      router.push(redirectTo);
      router.refresh();
    } catch {
      setNotice({
        kind: "error",
        text: "Unable to reach the authentication service. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  const action = mode === "signup" ? "Create account" : "Log in";

  return (
    <main className="relative z-10 mx-auto grid w-full max-w-7xl flex-grow items-center gap-10 px-5 py-10 sm:px-7 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[0.9fr_1.1fr] lg:py-14">
      <section className="relative hidden overflow-hidden rounded-[2.25rem] bg-ink p-10 text-white shadow-soft lg:flex lg:min-h-[690px] lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(240,74,35,.42),transparent_19rem),radial-gradient(circle_at_12%_88%,rgba(255,178,63,.18),transparent_22rem)]" />
        <div className="pixel-field pixel-field--auth" />
        <div className="relative max-w-md">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white/48">
            Your opinion, your space
          </p>
          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.02]">
            Join conversations that move people forward.
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/66">
            Vote in live polls, build trusted communities, and follow how public
            opinion changes in real time.
          </p>
        </div>
        <div className="relative grid gap-3">
          {[
            "Create and share polls in seconds",
            "Debate ideas without losing the signal",
            "Keep your identity private and your vote valid",
          ].map((item, index) => (
            <div
              key={item}
              className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white font-mono text-sm font-bold text-ink">
                0{index + 1}
              </span>
              <p className="font-bold text-white/88">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-xl py-4 lg:py-0">
        <div className="mb-8 text-center lg:text-left">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-lilac">
            Welcome to Quorum Check
          </p>
          <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight sm:text-5xl">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="mt-3 text-base leading-7 text-black/55">
            {mode === "signup"
              ? "Start voting, debating, and tracking the topics that matter to you."
              : "Log in to continue where you left off."}
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/75 bg-white/72 p-5 shadow-soft backdrop-blur-2xl sm:p-8">
          <div
            className="grid grid-cols-2 rounded-full bg-black/[0.055] p-1"
            role="tablist"
            aria-label="Authentication mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === "signup"}
              onClick={() => switchMode("signup")}
              className={`rounded-full px-5 py-3 text-sm font-extrabold transition ${mode === "signup" ? "bg-white text-ink shadow-sm" : "text-black/50 hover:text-ink"}`}
            >
              Create account
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "login"}
              onClick={() => switchMode("login")}
              className={`rounded-full px-5 py-3 text-sm font-extrabold transition ${mode === "login" ? "bg-white text-ink shadow-sm" : "text-black/50 hover:text-ink"}`}
            >
              Log in
            </button>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() =>
                setNotice({
                  kind: "info",
                  text: "Apple login selected. This frontend flow is ready for OAuth backend connection.",
                })
              }
              className="flex min-h-12 items-center justify-center gap-3 rounded-full bg-black px-5 py-3 text-sm font-bold text-white"
            >
              <AppleLogo />
              Continue with Apple
            </button>
            <button
              type="button"
              onClick={() =>
                setNotice({
                  kind: "info",
                  text: "Google login selected. This frontend flow is ready for OAuth backend connection.",
                })
              }
              className="flex min-h-12 items-center justify-center gap-3 rounded-full border border-black/20 bg-white px-5 py-3 text-sm font-bold"
            >
              <GoogleLogo />
              Continue with Google
            </button>
          </div>

          <form onSubmit={submitEmail} className="mt-7 space-y-4" noValidate>
            {mode === "signup" && (
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-extrabold"
                >
                  Full name
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-base outline-none transition placeholder:text-black/30 focus:border-lilac focus:ring-4 focus:ring-lilac/10"
                />
              </div>
            )}
            <div>
              <label
                htmlFor="auth-email"
                className="mb-2 block text-sm font-extrabold"
              >
                Email address
              </label>
              <input
                id="auth-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-base outline-none transition placeholder:text-black/30 focus:border-lilac focus:ring-4 focus:ring-lilac/10"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-4">
                <label htmlFor="password" className="text-sm font-extrabold">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  required
                  placeholder={
                    mode === "signup"
                      ? "At least 8 characters"
                      : "Enter your password"
                  }
                  className="w-full rounded-2xl border border-black/10 bg-white py-3.5 pl-4 pr-12 text-base outline-none transition placeholder:text-black/30 focus:border-lilac focus:ring-4 focus:ring-lilac/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute inset-y-0 right-0 grid w-12 place-items-center text-black/45 transition hover:text-ink"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <label className="flex items-start gap-3 text-sm leading-6 text-black/55">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 shrink-0 rounded border-black/20 accent-[#f04a23]"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-bold text-ink underline decoration-black/20 underline-offset-2"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-bold text-ink underline decoration-black/20 underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            )}

            {notice && (
              <div
                id={noticeId}
                role="status"
                className={`rounded-2xl border p-4 text-sm font-semibold leading-6 ${notice.kind === "error" ? "border-red-200 bg-red-50 text-red-700" : "border-lilac/15 bg-[#fff4e8] text-[#8e2b16]"}`}
              >
                {notice.text}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-full bg-lilac px-6 py-4 text-sm font-extrabold text-white shadow-float transition hover:-translate-y-0.5 hover:bg-[#d93e1b] focus:outline-none focus:ring-4 focus:ring-lilac/20 disabled:cursor-wait disabled:opacity-65"
            >
              {loading ? "Please wait..." : `${action} with email`}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-black/50">
            {mode === "signup"
              ? "Already have an account?"
              : "New to Quorum Check?"}{" "}
            <button
              type="button"
              onClick={() => switchMode(mode === "signup" ? "login" : "signup")}
              className="font-extrabold text-ink underline decoration-lilac/40 underline-offset-4"
            >
              {mode === "signup" ? "Log in" : "Create an account"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}
