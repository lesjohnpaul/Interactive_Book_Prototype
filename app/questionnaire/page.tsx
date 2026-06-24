"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  PARTS,
  QUESTIONS,
  TOTAL_QUESTIONS,
  questionsForPart,
  type Question,
} from "@/lib/questions";
import {
  currentUser,
  firstUnansweredIndex,
  saveAnswer,
  type User,
} from "@/lib/store";
import VoiceButton from "@/components/VoiceButton";
import Confetti from "@/components/Confetti";
import { asset } from "@/lib/asset";

type SaveState = "idle" | "writing" | "saved";

type Celebration =
  | { kind: "part"; partNumber: number; nextIndex: number }
  | { kind: "finale" };

/** Palette token → static Tailwind classes (so v4 can see them). */
const PART_BG: Record<string, string> = {
  sienna: "bg-sienna",
  "sky-deep": "bg-sky-deep",
  grape: "bg-grape",
  moss: "bg-moss",
};

const PART_DONE_LINE: Record<number, string> = {
  1: "Three parts to go. Your book is a quarter written.",
  2: "Halfway there. Your book is half written.",
  3: "One part left. Your book is three-quarters written.",
};

type Segment = { color: string; fill: number; complete: boolean; numeral: string };

export default function QuestionnairePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [via, setVia] = useState<"text" | "voice">("text");
  const [direction, setDirection] = useState<"fwd" | "back">("fwd");
  const [showIntro, setShowIntro] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [helperOpen, setHelperOpen] = useState(true);
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const introSeen = useRef<Set<number>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<number | null>(null);
  const savedChipRef = useRef<number | null>(null);

  useEffect(() => {
    const u = currentUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    const start = firstUnansweredIndex(u);
    setUser(u);
    setIndex(start);
    setText(u.answers[QUESTIONS[start].id]?.text ?? "");
    setVia(u.answers[QUESTIONS[start].id]?.via ?? "text");
    const part = QUESTIONS[start].part;
    if (QUESTIONS.findIndex((q) => q.part === part) === start) {
      setShowIntro(true);
      introSeen.current.add(part);
    }
  }, [router]);

  // Clear any pending timers on unmount.
  useEffect(() => {
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
      if (savedChipRef.current) window.clearTimeout(savedChipRef.current);
    };
  }, []);

  if (!user) return null;

  const question = QUESTIONS[index];
  const part = PARTS[question.part - 1];
  const numberInPart =
    index - QUESTIONS.findIndex((q) => q.part === question.part) + 1;

  /** Treats the in-flight textarea text as the answer for the current question. */
  function isAnswered(q: Question): boolean {
    if (q.id === question.id) return !!text.trim();
    return !!user!.answers[q.id]?.text.trim();
  }

  const segments: Segment[] = PARTS.map((p) => {
    const qs = questionsForPart(p.number);
    const answered = qs.filter(isAnswered).length;
    return {
      color: p.color,
      fill: answered / qs.length,
      complete: answered === qs.length,
      numeral: p.numeral,
    };
  });

  /** Writes the answer through to localStorage right away. */
  function persistNow(value: string, mode: "text" | "voice", questionId: string) {
    if (!user) return;
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    const answer = {
      text: value,
      via: mode,
      answeredAt: new Date().toISOString(),
    };
    saveAnswer(user.email, questionId, answer);
    if (value.trim()) {
      user.answers[questionId] = answer;
    } else {
      delete user.answers[questionId];
    }
    setSaveState("saved");
    if (savedChipRef.current) window.clearTimeout(savedChipRef.current);
    savedChipRef.current = window.setTimeout(() => setSaveState("idle"), 1600);
  }

  /** Debounced persistence (~400ms) so we don't hit localStorage per keystroke. */
  function persistSoon(value: string, mode: "text" | "voice") {
    setSaveState("writing");
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    const questionId = question.id;
    debounceRef.current = window.setTimeout(() => {
      debounceRef.current = null;
      persistNow(value, mode, questionId);
    }, 400);
  }

  /** Flushes any pending debounce before navigating away from this question. */
  function flushPending() {
    if (debounceRef.current) {
      persistNow(text, via, question.id);
    }
  }

  function insertExample() {
    const next = text.trim()
      ? text.trimEnd() + "\n" + question.example
      : question.example;
    setText(next);
    setVia("text");
    persistNow(next, "text", question.id);
    textareaRef.current?.focus();
  }

  function insertStarter(starter: string) {
    const next = text.trim() ? text.trimEnd() + " " + starter : starter;
    setText(next);
    setVia("text");
    persistNow(next, "text", question.id);
    textareaRef.current?.focus();
  }

  function doGo(next: number, dir: "fwd" | "back") {
    setDirection(dir);
    setIndex(next);
    setSaveState("idle");
    const a = user!.answers[QUESTIONS[next].id];
    setText(a?.text ?? "");
    setVia(a?.via ?? "text");
    const nextPart = QUESTIONS[next].part;
    const isFirstOfPart = QUESTIONS.findIndex((q) => q.part === nextPart) === next;
    if (dir === "fwd" && isFirstOfPart && !introSeen.current.has(nextPart)) {
      setShowIntro(true);
      introSeen.current.add(nextPart);
    }
  }

  function goTo(next: number, dir: "fwd" | "back") {
    if (next < 0) return;
    flushPending();
    if (next >= TOTAL_QUESTIONS) {
      setCelebration({ kind: "finale" });
      return;
    }
    if (
      dir === "fwd" &&
      QUESTIONS[next].part !== question.part &&
      questionsForPart(question.part).every(isAnswered)
    ) {
      setCelebration({ kind: "part", partNumber: question.part, nextIndex: next });
      return;
    }
    doGo(next, dir);
  }

  /* ── Grand finale: the last page is turned ──────────────── */
  if (celebration?.kind === "finale") {
    const totalAnswered = QUESTIONS.filter(isAnswered).length;
    return (
      <main className="flex min-h-dvh flex-col px-6 sm:px-12">
        <Confetti count={130} />
        <TopBar index={TOTAL_QUESTIONS - 1} segments={segments} saveState="idle" />
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center py-16 text-center">
          <p
            className="pop-in sticker font-display floaty flex h-24 w-24 items-center justify-center rounded-full bg-gold text-5xl"
            aria-hidden
          >
            ✶
          </p>
          <h1 className="rise rise-1 font-display mt-8 text-4xl leading-snug font-semibold sm:text-5xl">
            Every page of you, saved.
          </h1>
          <p className="rise rise-2 mt-5 max-w-[42ch] text-lg leading-relaxed font-medium text-ink-soft">
            {totalAnswered === TOTAL_QUESTIONS
              ? "All 24 questions, answered in your own words. There's only one thing left to do: turn them into a book."
              : `${totalAnswered} beautiful ${totalAnswered === 1 ? "answer" : "answers"}, saved in your own words. There's only one thing left to do: turn them into a book.`}
          </p>
          <button
            onClick={() => router.push("/generate")}
            className="rise rise-3 sticker sticker-press font-display mt-12 min-h-11 rounded-full bg-sienna px-10 py-4 text-xl font-semibold text-cloud"
          >
            Make my book <span aria-hidden>✶</span>
          </button>
        </div>
      </main>
    );
  }

  /* ── Part-complete celebration ──────────────────────────── */
  if (celebration?.kind === "part") {
    const donePart = PARTS[celebration.partNumber - 1];
    const nextIndex = celebration.nextIndex;
    return (
      <main className="flex min-h-dvh flex-col px-6 sm:px-12">
        <Confetti count={70} />
        <TopBar index={index} segments={segments} saveState="idle" />
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center py-16 text-center">
          <div className="pop-in sticker rotate-2 rounded-3xl bg-cloud p-3">
            <img
              src={asset(donePart.image)}
              alt={`Illustration for Part ${donePart.numeral}: ${donePart.title}`}
              className="h-40 w-60 rounded-2xl border border-ink/10 object-cover sm:h-48 sm:w-72"
            />
            <p className="font-display mt-2 px-1 pb-1 text-sm font-semibold text-ink-soft">
              Part {donePart.numeral}: {donePart.title}
            </p>
          </div>
          <h1 className="rise rise-1 font-display mt-8 text-4xl leading-snug font-semibold">
            Part {donePart.numeral}, complete.
          </h1>
          <p className="rise rise-2 mt-4 max-w-[40ch] text-lg leading-relaxed font-medium text-ink-soft">
            {PART_DONE_LINE[celebration.partNumber] ??
              "Another part of your story, safely in the book."}
          </p>
          <button
            onClick={() => {
              setCelebration(null);
              doGo(nextIndex, "fwd");
            }}
            className="rise rise-3 sticker sticker-press font-display mt-10 min-h-11 rounded-full bg-moss px-8 py-4 text-xl font-semibold text-cloud"
          >
            Keep going →
          </button>
        </div>
      </main>
    );
  }

  /* ── Part interstitial ──────────────────────────────────── */
  if (showIntro) {
    return (
      <main className="flex min-h-dvh flex-col px-6 sm:px-12">
        <TopBar index={index} segments={segments} saveState="idle" />
        <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center py-16 text-center">
          <div className="rise floaty relative">
            <div className="sticker overflow-hidden rounded-3xl bg-cloud">
              <img
                src={asset(part.image)}
                alt={`Illustration for Part ${part.numeral}: ${part.title}`}
                className="h-44 w-64 object-cover sm:h-52 sm:w-80"
              />
            </div>
            <p
              className={`font-display sticker absolute -top-5 -left-5 flex h-16 w-16 items-center justify-center rounded-full text-3xl font-semibold text-cloud ${PART_BG[part.color]}`}
            >
              {part.numeral}
            </p>
          </div>
          <h1 className="rise rise-1 font-display mt-8 text-4xl font-semibold">
            {part.title}
          </h1>
          <p className="rise rise-2 mt-5 max-w-[44ch] text-lg leading-relaxed font-medium text-ink-soft">
            {part.intro}
          </p>
          <button
            onClick={() => setShowIntro(false)}
            className={`rise rise-3 sticker sticker-press font-display mt-10 min-h-11 rounded-full px-8 py-4 text-xl font-semibold text-cloud ${PART_BG[part.color]}`}
          >
            Begin Part {part.numeral}
          </button>
        </div>
      </main>
    );
  }

  /* ── Question screen ────────────────────────────────────── */
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const encouragement =
    words === 0
      ? "Even one sentence counts ✦"
      : words < 15
        ? "A lovely start. Keep going"
        : words < 40
          ? "Your chapter is taking shape"
          : "The author is wide awake ✦";

  return (
    <main className="relative flex min-h-dvh flex-col px-6 sm:px-12">
      {/* Soft part-illustration backdrop, fading into the paper. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 overflow-hidden sm:h-80"
      >
        <img
          src={asset(part.image)}
          alt=""
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-linear-to-b from-paper/40 via-paper/75 to-paper" />
      </div>

      <TopBar index={index} segments={segments} saveState={saveState} />

      <div
        key={question.id}
        className={`mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center py-12 ${
          direction === "fwd" ? "page-in" : "page-in-back"
        }`}
      >
        <p
          className={`font-display inline-block w-fit rotate-[-1.5deg] rounded-full px-4 py-1.5 text-sm font-semibold text-cloud ${PART_BG[part.color]}`}
        >
          Part {part.numeral}: {part.title} · question {numberInPart}
        </p>
        <h1 className="font-display mt-5 text-3xl leading-snug font-semibold sm:text-4xl">
          {question.prompt}
        </h1>
        <p className="mt-3 font-medium text-ink-faint">{question.hint}</p>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setVia("text");
            persistSoon(e.target.value, "text");
          }}
          rows={6}
          placeholder="Write as much or as little as you like…"
          aria-label={question.prompt}
          className="prose-book mt-7 w-full resize-none rounded-2xl border border-ink/15 bg-cloud px-5 py-4 outline-none transition-all duration-300 ease-[var(--ease-lux)] placeholder:text-ink-faint/50 focus:border-gold focus:ring-2 focus:ring-gold/35"
        />

        <p aria-live="polite" className="mt-2 text-sm font-bold text-ink-faint">
          {words > 0 && (
            <span>
              {words} {words === 1 ? "word" : "words"} ·{" "}
            </span>
          )}
          {encouragement}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <VoiceButton
            onTranscript={(t) => {
              const next = (text ? text.trimEnd() + " " : "") + t;
              setText(next);
              setVia("voice");
              persistNow(next, "voice", question.id);
            }}
          />
          {via === "voice" && text && (
            <span className="font-display rounded-full bg-grape px-3 py-1 text-xs font-semibold text-cloud">
              spoken aloud
            </span>
          )}
        </div>

        {/* ── Assistive helper card ──────────────────────────── */}
        <section className="sticker mt-7 rounded-3xl bg-cloud">
          <button
            type="button"
            onClick={() => setHelperOpen((o) => !o)}
            aria-expanded={helperOpen}
            className="font-display flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 rounded-3xl px-5 py-3.5 text-left text-lg font-semibold transition-colors duration-200 hover:text-sienna focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-dashed focus-visible:outline-grape"
          >
            <span>
              Need a nudge? <span aria-hidden>✦</span>
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              className={`shrink-0 transition-transform duration-200 ${helperOpen ? "rotate-180" : ""}`}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {helperOpen && (
            <div className="px-5 pb-5">
              <p className="leading-relaxed font-medium text-ink-soft">
                {question.tip}
              </p>

              <div className="mt-4 rounded-2xl border border-dashed border-ink/25 bg-paper px-4 py-3.5">
                <p className="font-display text-sm font-semibold text-ink-faint">
                  For example:
                </p>
                <blockquote className="mt-1.5 leading-relaxed font-medium text-ink-soft italic">
                  “{question.example}”
                </blockquote>
                <button
                  type="button"
                  onClick={insertExample}
                  className="sticker sticker-press font-display mt-3.5 min-h-11 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink"
                >
                  Use this example <span aria-hidden>✎</span>
                </button>
              </div>

              <p className="font-display mt-4 text-sm font-semibold text-ink-faint">
                Or begin with a few words…
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {question.starters.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => insertStarter(s)}
                    className="min-h-11 cursor-pointer rounded-full border border-ink/20 bg-paper-deep px-4 py-2 text-sm font-bold text-ink transition-colors duration-300 hover:border-gold hover:bg-gold/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={() => goTo(index - 1, "back")}
            disabled={index === 0}
            className="font-display min-h-11 cursor-pointer font-semibold text-ink-faint transition-colors duration-200 hover:text-sienna focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-grape disabled:invisible"
          >
            ← Back
          </button>
          <div className="flex items-center gap-5">
            {!text.trim() && (
              <button
                onClick={() => goTo(index + 1, "fwd")}
                className="min-h-11 cursor-pointer text-sm font-bold text-ink-faint underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-sienna focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-dashed focus-visible:outline-grape"
              >
                Skip for now
              </button>
            )}
            <button
              onClick={() => goTo(index + 1, "fwd")}
              disabled={!text.trim()}
              className="sticker sticker-press font-display min-h-11 rounded-full bg-moss px-7 py-3.5 text-lg font-semibold text-cloud disabled:cursor-not-allowed disabled:opacity-30"
            >
              {index === TOTAL_QUESTIONS - 1 ? "Finish my book" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function TopBar({
  index,
  segments,
  saveState,
}: {
  index: number;
  segments: Segment[];
  saveState: SaveState;
}) {
  return (
    <header className="pt-6">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-semibold tracking-wide">
          SOURCE
        </Link>
        <div className="flex min-h-7 items-center gap-4 text-sm">
          <span aria-live="polite" className="flex items-center">
            {saveState === "writing" && (
              <span className="animate-pulse text-xs font-bold text-ink-faint">
                writing it down…
              </span>
            )}
            {saveState === "saved" && (
              <span className="pop-in font-display rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
                saved ✓
              </span>
            )}
          </span>
          <Link
            href="/"
            className="font-bold text-ink-faint underline decoration-2 underline-offset-4 transition-colors duration-200 hover:text-sienna"
          >
            Save &amp; exit
          </Link>
        </div>
      </div>

      {/* Four part segments, each filling independently. */}
      <div
        className="mt-4 flex items-center gap-1.5"
        role="progressbar"
        aria-valuenow={index + 1}
        aria-valuemin={1}
        aria-valuemax={TOTAL_QUESTIONS}
        aria-label={`Question ${index + 1} of ${TOTAL_QUESTIONS}`}
      >
        {segments.map((seg) => (
          <div key={seg.numeral} className="flex flex-1 items-center gap-1">
            <div className="h-3 flex-1 overflow-hidden rounded-full border border-ink/20 bg-cloud">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ease-out ${PART_BG[seg.color]}`}
                style={{ width: `${seg.fill * 100}%` }}
              />
            </div>
            <span
              aria-hidden
              className={`text-sm leading-none ${
                seg.complete ? "star-pop text-gold" : "text-ink/20"
              }`}
            >
              ✶
            </span>
          </div>
        ))}
      </div>
    </header>
  );
}
