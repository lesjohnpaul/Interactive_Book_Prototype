"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logIn, signUp, answeredCount } from "@/lib/store";
import { TOTAL_QUESTIONS } from "@/lib/questions";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const result =
      mode === "signup" ? signUp(name, email, password) : logIn(email, password);
    if (typeof result === "string") {
      setError(result);
      return;
    }
    if (result.bookGeneratedAt) {
      router.push("/book");
    } else if (answeredCount(result) >= TOTAL_QUESTIONS) {
      router.push("/generate");
    } else {
      router.push("/questionnaire");
    }
  }

  const field =
    "w-full rounded-xl border border-ink/15 bg-cloud px-4 py-3 text-lg outline-none transition-all duration-300 ease-[var(--ease-lux)] placeholder:text-ink-faint/50 focus:border-gold focus:ring-2 focus:ring-gold/35";

  return (
    <main className="flex min-h-dvh flex-col px-6 sm:px-12">
      <header className="flex items-center justify-between pt-6">
        <Link
          href="/"
          className="font-display text-2xl font-medium tracking-[0.08em]"
        >
          SOURCE
        </Link>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-14">
        <p className="rise font-display inline-block w-fit rounded-full border border-sienna/40 px-3.5 py-1 text-[11px] font-medium tracking-[0.25em] text-sienna uppercase">
          {mode === "signup" ? "Begin a new book" : "Welcome back"}
        </p>
        <h1 className="rise rise-1 font-display mt-5 mb-9 text-4xl leading-tight font-medium tracking-[-0.01em]">
          {mode === "signup"
            ? "Every book starts with a name."
            : "Ready for the next page?"}
        </h1>

        <form onSubmit={submit} className="rise rise-2 space-y-5">
          {mode === "signup" && (
            <label className="block">
              <span className="font-display mb-1.5 block text-sm font-medium text-ink-soft">
                Your name, as it goes on the cover
              </span>
              <input
                className={field}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Maria Santos"
                autoComplete="name"
              />
            </label>
          )}
          <label className="block">
            <span className="font-display mb-1.5 block text-sm font-medium text-ink-soft">
              Email
            </span>
            <input
              className={field}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>
          <label className="block">
            <span className="font-display mb-1.5 block text-sm font-medium text-ink-soft">
              Password
            </span>
            <input
              className={field}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-sienna/40 bg-sienna-wash px-4 py-3 text-sm font-medium text-sienna-deep"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="sticker sticker-press font-display w-full rounded-full bg-sienna py-4 text-xl font-medium text-cloud"
          >
            {mode === "signup" ? "Begin my book" : "Sign in"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signup" ? "signin" : "signup");
            setError("");
          }}
          className="mt-7 cursor-pointer text-sm font-medium text-ink-faint underline decoration-sienna/60 underline-offset-4 transition-colors duration-300 hover:text-sienna"
        >
          {mode === "signup"
            ? "Already have an account? Sign in"
            : "New here? Create an account"}
        </button>

        <p className="rise rise-4 mt-10 rounded-xl bg-paper-deep px-5 py-4 text-xs leading-relaxed font-medium text-ink-faint">
          Prototype note: accounts and answers are stored locally in this
          browser only. Want a preview? Sign in as{" "}
          <span className="text-ink">mara@example.com</span> / password{" "}
          <span className="text-ink">demo</span> to open a finished book right
          away.
        </p>
      </div>
    </main>
  );
}
