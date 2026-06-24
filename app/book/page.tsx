"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { currentUser, logOut, type User } from "@/lib/store";
import { generateBook, type Book, type Chapter, type Section } from "@/lib/generator";
import { asset } from "@/lib/asset";

export default function BookPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<"fwd" | "back">("fwd");

  useEffect(() => {
    const u = currentUser();
    if (!u) {
      router.replace("/login");
      return;
    }
    setUser(u);
    setBook(generateBook(u));
  }, [router]);

  // pages: 0 cover · 1 foreword · 2 contents · 3..n chapters · last closing
  const pageCount = book ? 3 + book.chapters.length + 1 : 0;

  const go = useCallback(
    (next: number) => {
      if (!book) return;
      if (next < 0 || next >= pageCount) return;
      setDirection(next > page ? "fwd" : "back");
      setPage(next);
      window.scrollTo({ top: 0 });
    },
    [book, page, pageCount]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") go(page + 1);
      if (e.key === "ArrowLeft") go(page - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, page]);

  if (!user || !book) return null;

  const anim = direction === "fwd" ? "page-in" : "page-in-back";

  return (
    <main className="flex min-h-dvh flex-col">
      {/* ── Reader chrome ─────────────────────────────────── */}
      <header className="no-print flex items-center justify-between px-6 pt-6 sm:px-12">
        <Link href="/" className="font-display text-2xl font-semibold tracking-wide">
          SOURCE
        </Link>
        <nav className="flex items-center gap-2 text-sm font-bold">
          <a
            href={asset("/storybook-mockup.html")}
            className="rounded-full px-3 py-2 text-ink-faint transition-colors duration-200 hover:bg-paper-deep hover:text-ink"
          >
            Illustrated mockup
          </a>
          <button
            onClick={() => window.print()}
            className="cursor-pointer rounded-full px-3 py-2 text-ink-faint transition-colors duration-200 hover:bg-paper-deep hover:text-ink"
          >
            Print
          </button>
          <Link
            href="/questionnaire"
            className="rounded-full px-3 py-2 text-ink-faint transition-colors duration-200 hover:bg-paper-deep hover:text-ink"
          >
            Edit answers
          </Link>
          <button
            onClick={() => {
              logOut();
              router.push("/");
            }}
            className="cursor-pointer rounded-full px-3 py-2 text-ink-faint transition-colors duration-200 hover:bg-paper-deep hover:text-ink"
          >
            Sign out
          </button>
        </nav>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 sm:py-16">
        {/* ── Cover ─────────────────────────────────────── */}
        <section className={`book-page ${page === 0 ? `current ${anim}` : ""}`}>
          <div className="sticker flex min-h-[60vh] flex-col items-center justify-center rounded-[2.5rem] bg-cloud px-8 py-14 text-center">
            <p className="font-display rotate-[-2deg] rounded-full bg-grape px-4 py-1.5 text-sm font-semibold text-cloud">
              SOURCE presents
            </p>
            <img
              src={asset("/illustrations/cover.webp")}
              alt="A hand-drawn open book on a desk, stars and paper boats drifting from its glowing pages"
              className="sticker mt-8 w-44 rotate-[-2deg] rounded-3xl sm:w-52"
            />
            <h1 className="font-display mt-8 text-[clamp(2.4rem,8vw,4.2rem)] leading-tight font-semibold">
              {book.title}
            </h1>
            <p className="mt-6 max-w-[34ch] text-lg font-medium text-ink-soft">{book.subtitle}</p>
            <p className="mt-12 flex gap-3 text-2xl" aria-hidden>
              <span className="text-gold">✶</span>
              <span className="text-sienna">✶</span>
              <span className="text-sky-deep">✶</span>
            </p>
            <p className="font-display mt-12 text-sm font-semibold tracking-wide text-ink-faint">
              First edition · {new Date(user.bookGeneratedAt ?? Date.now()).getFullYear()}
            </p>
          </div>
        </section>

        {/* ── Foreword ──────────────────────────────────── */}
        <section className={`book-page ${page === 1 ? `current ${anim}` : ""}`}>
          <PageHeading kicker="" title="Foreword" />
          <p className="mb-10 text-center text-sm text-ink-faint italic">{book.dedication}</p>
          <div className="prose-book">
            {book.foreword.map((p, i) => (
              <p key={i} className={i === 0 ? "dropcap" : ""}>
                {p}
              </p>
            ))}
          </div>
        </section>

        {/* ── Contents ──────────────────────────────────── */}
        <section className={`book-page ${page === 2 ? `current ${anim}` : ""}`}>
          <PageHeading kicker="" title="Contents" />
          <ol className="mx-auto max-w-md space-y-6">
            {book.chapters.map((c, i) => (
              <li key={c.numeral}>
                <button
                  onClick={() => go(3 + i)}
                  className="group flex w-full cursor-pointer items-baseline gap-4 text-left"
                >
                  <span className="font-display text-2xl text-sienna">{c.numeral}</span>
                  <span className="font-display flex-1 text-xl font-medium transition-colors duration-200 group-hover:text-sienna">
                    {c.title}
                  </span>
                  <span className="hairline hidden flex-1 border-b-2 border-dotted sm:block" />
                </button>
              </li>
            ))}
            <li className="flex items-baseline gap-4 pt-4">
              <span className="font-display text-2xl text-gold">✶</span>
              <button
                onClick={() => go(pageCount - 1)}
                className="font-display cursor-pointer text-xl font-medium transition-colors duration-200 hover:text-sienna"
              >
                Begin Again: a closing note
              </button>
            </li>
          </ol>
        </section>

        {/* ── Chapters ──────────────────────────────────── */}
        {book.chapters.map((chapter, i) => (
          <section
            key={chapter.numeral}
            className={`book-page ${page === 3 + i ? `current ${anim}` : ""}`}
          >
            <ChapterView chapter={chapter} />
          </section>
        ))}

        {/* ── Closing ───────────────────────────────────── */}
        <section className={`book-page ${page === pageCount - 1 ? `current ${anim}` : ""}`}>
          <PageHeading kicker="A closing note" title="Begin Again" />
          <div className="prose-book">
            {book.closing.map((p, i) => (
              <p key={i} className={i === 0 ? "dropcap" : ""}>
                {p}
              </p>
            ))}
          </div>
          <p className="mt-14 flex justify-center gap-3 text-2xl" aria-hidden>
            <span className="text-gold">✶</span>
            <span className="text-sienna">✶</span>
            <span className="text-grape">✶</span>
          </p>
          <div className="no-print mt-14 text-center">
            <Link
              href="/questionnaire"
              className="sticker sticker-press font-display inline-block rounded-full bg-gold px-7 py-3.5 text-lg font-semibold"
            >
              Change an answer, change the book
            </Link>
          </div>
        </section>
      </div>

      {/* ── Pagination ──────────────────────────────────── */}
      <footer className="no-print sticky bottom-0 border-t border-ink/15 bg-paper/90 px-6 py-3.5 backdrop-blur-md sm:px-12">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <button
            onClick={() => go(page - 1)}
            disabled={page === 0}
            className="font-display cursor-pointer rounded-full border border-ink/20 bg-cloud px-5 py-2 font-semibold transition-all duration-300 ease-[var(--ease-lux)] hover:border-gold hover:bg-gold/30 active:scale-[0.98] disabled:invisible"
          >
            ← Back
          </button>
          <span className="font-display text-sm font-semibold text-ink-faint">
            {pageLabel(page, pageCount, book.chapters)}
          </span>
          <button
            onClick={() => go(page + 1)}
            disabled={page === pageCount - 1}
            className="font-display cursor-pointer rounded-full bg-gold px-5 py-2 font-semibold transition-all duration-300 ease-[var(--ease-lux)] hover:brightness-105 active:scale-[0.98] disabled:invisible"
          >
            Next →
          </button>
        </div>
      </footer>
    </main>
  );
}

function pageLabel(page: number, count: number, chapters: Chapter[]): string {
  if (page === 0) return "Cover";
  if (page === 1) return "Foreword";
  if (page === 2) return "Contents";
  if (page === count - 1) return "Closing";
  return `Chapter ${chapters[page - 3].numeral} of ${chapters[chapters.length - 1].numeral}`;
}

function PageHeading({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="mb-10 text-center">
      {kicker && (
        <p className="font-display mb-2 text-xs tracking-[0.35em] text-ink-faint uppercase">
          {kicker}
        </p>
      )}
      <h2 className="font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
      <p className="mt-5 text-xl text-gold" aria-hidden>✶</p>
    </div>
  );
}

const CHAPTER_ART: Record<string, { src: string; alt: string }> = {
  I: {
    src: "/illustrations/part-1.webp",
    alt: "Children flying a newspaper kite past a small red-roofed house at golden hour",
  },
  II: {
    src: "/illustrations/part-2.webp",
    alt: "A cozy morning kitchen with a steaming mug, a sunbeam, and a sleepy cat",
  },
  III: {
    src: "/illustrations/part-3.webp",
    alt: "A traveler walking twilight hills with a glowing satchel and lantern",
  },
  IV: {
    src: "/illustrations/part-4.webp",
    alt: "A winding path toward a sunrise, a hot air balloon drifting upward",
  },
};

function ChapterView({ chapter }: { chapter: Chapter }) {
  let firstProse = true;
  const art = CHAPTER_ART[chapter.numeral];
  return (
    <article>
      {art && (
        <figure className="mb-10">
          <img
            src={asset(art.src)}
            alt={art.alt}
            className="sticker w-full rotate-[-0.6deg] rounded-[2rem] object-cover"
          />
        </figure>
      )}
      <div className="mb-10 text-center">
        <p className="font-display mb-2 text-xs tracking-[0.35em] text-ink-faint uppercase">
          Chapter {chapter.numeral}
        </p>
        <h2 className="font-display mx-auto max-w-[20ch] text-3xl leading-snug font-medium sm:text-4xl">
          {chapter.title}
        </h2>
        {chapter.epigraph && (
          <p className="mx-auto mt-5 max-w-[40ch] font-medium text-ink-faint italic">{chapter.epigraph}</p>
        )}
        <p className="mt-5 text-xl text-gold" aria-hidden>✶</p>
      </div>

      <div className="space-y-7">
        {chapter.sections.map((s: Section, i) => {
          if (s.kind === "prose") {
            const drop = firstProse;
            firstProse = false;
            return (
              <p key={i} className={`prose-book ${drop ? "dropcap" : ""}`}>
                {s.text}
              </p>
            );
          }
          if (s.kind === "quote") {
            return (
              <blockquote
                key={i}
                className="my-9 rounded-xl border-l-4 border-gold bg-cloud px-7 py-6 shadow-[0_8px_28px_-14px_oklch(27%_0.045_290/0.3)]"
              >
                <p className="text-xl leading-relaxed text-ink-soft italic">
                  “{s.text}”
                </p>
                <cite className="mt-3 block text-xs font-medium tracking-wide text-ink-faint not-italic">
                  {s.source}, in your own words
                </cite>
              </blockquote>
            );
          }
          if (s.kind === "reflection") {
            return (
              <div key={i} className="my-9 rounded-xl border-l-4 border-grape bg-paper-deep px-7 py-6">
                <p className="font-display mb-2 text-xs font-semibold tracking-[0.25em] text-grape uppercase">
                  A question to sit with
                </p>
                <p className="leading-relaxed font-medium text-ink-soft">{s.text}</p>
              </div>
            );
          }
          return (
            <p key={i} className="text-center text-xl text-gold" aria-hidden>
              ✶
            </p>
          );
        })}
      </div>
    </article>
  );
}
