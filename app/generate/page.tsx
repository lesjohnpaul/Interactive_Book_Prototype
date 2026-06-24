"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { answeredCount, currentUser, updateUser } from "@/lib/store";
import Confetti from "@/components/Confetti";

const STAGES = [
  "Reading your answers, slowly…",
  "Finding the threads that repeat…",
  "Writing Chapter I: Where You Began…",
  "Writing Chapter II: The Shape of Your Days…",
  "Writing Chapter III: What You Carry…",
  "Naming your final chapter…",
  "Binding your book…",
];

export default function GeneratePage() {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const user = currentUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    if (answeredCount(user) < 1) {
      router.replace("/questionnaire");
      return;
    }
    setName(user.name.split(/\s+/)[0]);

    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      if (i < STAGES.length) {
        setStage(i);
      } else {
        window.clearInterval(timer);
        updateUser(user.email, { bookGeneratedAt: new Date().toISOString() });
        setReady(true);
      }
    }, 1100);
    return () => window.clearInterval(timer);
  }, [router]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      {!ready ? (
        <>
          <p className="floaty font-display sticker flex h-24 w-24 items-center justify-center rounded-full bg-gold text-5xl" aria-hidden>
            ✶
          </p>
          <h1 className="font-display mt-8 max-w-[20ch] text-3xl leading-snug font-semibold sm:text-4xl">
            Your book is being written.
          </h1>

          {/* Finished stages stack up as little checked lines. */}
          <ul className="mt-8 w-full max-w-md space-y-2 text-left" aria-live="polite">
            {STAGES.slice(0, stage + 1).map((s, i) => (
              <li
                key={s}
                className={
                  i === stage
                    ? "rise flex items-center gap-3 text-base font-semibold text-ink"
                    : "flex items-center gap-3 text-sm font-medium text-ink-faint"
                }
              >
                {i < stage ? (
                  <span
                    aria-hidden
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-moss text-[10px] font-bold text-cloud"
                  >
                    ✓
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className="flex h-5 w-5 shrink-0 animate-pulse items-center justify-center text-base leading-none text-sienna"
                  >
                    ✶
                  </span>
                )}
                <span className={i < stage ? "line-through decoration-2 decoration-ink/25" : ""}>
                  {s}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-10 h-4 w-64 rounded-full border border-ink/20 bg-cloud">
            <div
              className="h-full origin-left rounded-full bg-sienna transition-transform duration-1000 ease-out"
              style={{ transform: `scaleX(${(stage + 1) / STAGES.length})` }}
            />
          </div>
        </>
      ) : (
        <>
          <Confetti count={120} />
          <p className="rise floaty font-display sticker flex h-24 w-24 items-center justify-center rounded-full bg-sienna text-5xl text-cloud" aria-hidden>
            ✶
          </p>
          <h1 className="rise rise-1 font-display mt-8 max-w-[22ch] text-4xl leading-snug font-semibold sm:text-5xl">
            The Story of {name} is ready.
          </h1>
          <p className="rise rise-2 mt-5 max-w-[40ch] text-lg font-medium text-ink-soft">
            Four chapters, made entirely from your own words.
          </p>
          <button
            onClick={() => router.push("/book")}
            className="rise rise-3 sticker sticker-press font-display mt-12 rounded-full bg-moss px-10 py-4 text-xl font-semibold text-cloud"
          >
            Open the cover
          </button>
        </>
      )}
    </main>
  );
}
