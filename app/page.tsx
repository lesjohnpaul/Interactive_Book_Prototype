import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ScrollFx from "./components/ScrollFx";

function CtaButton({ children, href }: { children: React.ReactNode; href: string }) {
  return (
    <Link
      href={href}
      className="group sticker-press font-display inline-flex items-center gap-3 rounded-full bg-gold py-2.5 pr-2.5 pl-7 text-lg font-semibold text-night shadow-[0_0_36px_-8px_oklch(80%_0.11_90/0.6)]"
    >
      {children}
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-night/10 transition-transform duration-500 ease-[var(--ease-lux)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105">
        <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
      </span>
    </Link>
  );
}

const pains = [
  {
    title: "Strangers' case studies",
    body: "You skim stories about people you'll never meet, searching for yourself between the lines.",
  },
  {
    title: "Advice with no address",
    body: "One-size frameworks don't know your hometown, your kitchen table, or the thing you almost did at twenty-five.",
  },
  {
    title: "Blank pages, full effort",
    body: "Journals hand you the hard part and wish you luck. Most stay beautiful, empty, and on the shelf.",
  },
];

const steps = [
  {
    n: "I",
    title: "Answer in your own words",
    body: "Type, or just talk. 50-80 gentle questions about where you began, who shaped you, and what you carry. Pause whenever you like; your progress keeps.",
    span: "md:col-span-7",
    wash: "bg-[radial-gradient(ellipse_120%_90%_at_0%_0%,oklch(80%_0.11_90/0.14),transparent_60%)]",
  },
  {
    n: "II",
    title: "Your words are woven in",
    body: "Your answers become the substance of every chapter: the examples, the reflections, the case studies. Not a quiz result. A book.",
    span: "md:col-span-5",
    wash: "bg-[radial-gradient(ellipse_120%_90%_at_100%_0%,oklch(46%_0.115_300/0.22),transparent_60%)]",
  },
  {
    n: "III",
    title: "Read the book of you",
    body: "A chaptered, printable book that reads like it was written by someone who knows you well. Because, in every way that matters, it was.",
    span: "md:col-span-12",
    wash: "",
  },
];

const testimonials = [
  {
    quote:
      "I cried at chapter three. It was just my own life, but written down it finally looked like it mattered.",
    name: "Maria, 34",
    role: "first-round reader",
  },
  {
    quote:
      "The first book I couldn't put down, because it was me. I answered most of the questions out loud on my commute.",
    name: "Jon, 41",
    role: "voice-input tester",
  },
  {
    quote:
      "I printed a copy for my mother. She read the chapter about her twice, then asked who told us all of that. I did.",
    name: "Aisha, 27",
    role: "printed her copy",
  },
];

const marqueeWords = [
  "your childhood",
  "your people",
  "your turning points",
  "your quiet victories",
  "your next chapter",
];

export default function Landing() {
  return (
    <main className="night min-h-dvh text-starlight">
      <a
        href="#content"
        className="sr-only z-50 rounded-full bg-gold px-5 py-2.5 font-medium text-night focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Skip to content
      </a>
      <ScrollFx />
      <div className="scroll-progress no-print" aria-hidden />

      {/* ── Floating pill nav ─────────────────────────────── */}
      <header className="no-print sticky top-4 z-40 flex justify-center px-4">
        <nav className="flex items-center gap-1 rounded-full border border-starlight/15 bg-night-deep/70 py-1.5 pr-1.5 pl-5 shadow-[0_12px_40px_-12px_oklch(10%_0.03_285/0.9)] backdrop-blur-xl">
          <Link
            href="/"
            className="font-display mr-3 text-lg font-bold tracking-[0.04em]"
          >
            SOURCE
          </Link>
          <Link
            href="/admin"
            className="rounded-full px-3.5 py-2 text-sm font-medium text-starlight/60 transition-colors duration-300 hover:bg-starlight/10 hover:text-starlight"
          >
            Admin
          </Link>
          <Link
            href="/login"
            className="rounded-full bg-gold px-4.5 py-2 text-sm font-medium text-night transition-transform duration-300 ease-[var(--ease-lux)] hover:scale-[1.03] active:scale-[0.98]"
          >
            Sign in
          </Link>
        </nav>
      </header>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section id="content" className="relative px-6 pt-16 pb-20 sm:px-12 sm:pt-24">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h1 className="rise font-display max-w-[12ch] text-[clamp(3.25rem,7.5vw,6.25rem)] leading-[0.98] font-bold tracking-[-0.03em]">
              Your own life becomes <span className="text-gold">the book</span>.
            </h1>
            <p className="rise rise-2 mt-8 max-w-[42ch] font-body text-lg leading-relaxed text-starlight/75 sm:text-xl">
              Answer 50-80 gentle questions, typed or spoken. Your memories
              become the examples in every chapter.
            </p>
            <div className="rise rise-3 mt-10">
              <CtaButton href="/login">Begin your book</CtaButton>
            </div>
          </div>
          <div className="rise rise-2">
            <div className="bezel floaty">
              <div>
                <Image
                  src="/hero-book.webp"
                  alt="An open book on a desk at night; golden light rises from its pages and forms a constellation of life moments: a childhood house, two embracing figures, a bicycle, a bird"
                  width={1168}
                  height={880}
                  priority
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee: what fills the pages ─────────────────── */}
      <div className="marquee no-print border-y border-gold/20 bg-night-deep/50 py-4" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex shrink-0 items-center">
              {marqueeWords.map((w) => (
                <span
                  key={`${copy}-${w}`}
                  className="font-display flex items-baseline gap-8 px-8 text-sm font-semibold tracking-[0.18em] text-starlight/60 uppercase"
                >
                  {w}
                  <span className="text-base text-gold/70">*</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── The problem ───────────────────────────────────── */}
      <section className="px-6 py-28 sm:px-12 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.15fr]">
          <div data-reveal="tilt-left" className="relative mx-auto w-full max-w-md">
            <div className="bezel">
              <div>
                <Image
                  src="/problem-shelf.webp"
                  alt="A dark shelf of identical featureless books, with one single warm golden book glowing among them"
                  width={1024}
                  height={1024}
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
          <div>
            <h2
              data-reveal
              className="font-display max-w-[20ch] text-4xl leading-[1.05] font-bold tracking-[-0.02em] sm:text-[3.25rem]"
            >
              Why books about finding yourself rarely do
            </h2>
            <p
              data-reveal
              style={{ "--reveal-delay": "0.12s" } as React.CSSProperties}
              className="mt-5 max-w-[48ch] font-body text-lg leading-relaxed text-starlight/70"
            >
              They were written for everyone, which means no one in them is you.
            </p>
            <ul className="mt-11 divide-y divide-starlight/10">
              {pains.map((p, i) => (
                <li
                  key={p.title}
                  data-reveal
                  style={{ "--reveal-delay": `${0.16 + i * 0.1}s` } as React.CSSProperties}
                  className="py-6 first:pt-0 last:pb-0"
                >
                  <h3 className="font-display text-xl font-semibold tracking-[-0.01em]">
                    {p.title}
                  </h3>
                  <p className="mt-1.5 font-body leading-relaxed text-starlight/70">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── The solution ──────────────────────────────────── */}
      <section className="relative px-6 py-28 sm:px-12 sm:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2
              data-reveal
              className="font-display max-w-[16ch] text-4xl leading-[1.05] font-bold tracking-[-0.02em] sm:text-[3.25rem]"
            >
              You answer. Your life becomes the chapters.
            </h2>
            <p
              data-reveal
              style={{ "--reveal-delay": "0.16s" } as React.CSSProperties}
              className="mt-7 max-w-[48ch] font-body text-lg leading-relaxed text-starlight/75"
            >
              SOURCE weaves your own words through every chapter, as the
              examples, the reflections, the case studies. Nothing generic is
              left on the page. What you read back is the pattern of your own
              life, finally drawn in one place.
            </p>
            <p
              data-reveal
              style={{ "--reveal-delay": "0.24s" } as React.CSSProperties}
              className="font-display mt-7 text-sm font-semibold tracking-wide text-gold"
            >
              Not a storytelling app. Not a quiz. A real book, about you.
            </p>
          </div>
          <div data-reveal="swing" style={{ "--reveal-delay": "0.12s" } as React.CSSProperties}>
            <div className="bezel">
              <div>
                <Image
                  src="/constellation.webp"
                  alt="A constellation map across an indigo night sky where each star is a tiny golden vignette of a personal memory, joined by fine gold lines"
                  width={1344}
                  height={752}
                  className="h-auto w-full"
                />
              </div>
            </div>
            <p className="mt-5 text-center font-body text-sm text-starlight/55 italic">
              Your memories, joined like constellations.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works: asymmetric bento ────────────────── */}
      <section className="px-6 py-28 sm:px-12 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <h2
            data-reveal
            className="font-display mb-4 max-w-[16ch] text-4xl leading-[1.05] font-bold tracking-[-0.02em] sm:text-[3.25rem]"
          >
            How your book takes shape
          </h2>
          <p
            data-reveal
            style={{ "--reveal-delay": "0.1s" } as React.CSSProperties}
            className="mb-16 max-w-[44ch] font-body text-lg text-starlight/70"
          >
            Three steps between your memory and your bookshelf.
          </p>
          <ol className="grid gap-6 md:grid-cols-12">
            {steps.map((s, i) => (
              <li
                key={s.n}
                data-reveal="pop"
                style={{ "--reveal-delay": `${i * 0.12}s` } as React.CSSProperties}
                className={`card-night p-9 ${s.span} ${s.wash} ${
                  s.n === "III" ? "md:flex md:items-center md:gap-10" : ""
                }`}
              >
                <span
                  className="font-body block text-3xl text-gold/70 italic md:shrink-0 md:text-4xl"
                  aria-hidden
                >
                  {s.n}.
                </span>
                <div>
                  <h3 className="font-display mt-4 mb-3 text-2xl font-bold tracking-[-0.01em] md:mt-0">
                    {s.title}
                  </h3>
                  <p className="max-w-[52ch] font-body leading-relaxed text-starlight/70">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Sample page: the paper artifact ───────────────── */}
      <section className="relative px-6 py-28 sm:px-12 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <h2
            data-reveal
            className="font-display mb-3 text-center text-4xl leading-[1.05] font-bold tracking-[-0.02em] sm:text-[3.25rem]"
          >
            Read a page from a real one
          </h2>
          <p
            data-reveal
            style={{ "--reveal-delay": "0.1s" } as React.CSSProperties}
            className="mb-14 text-center font-body text-starlight/70"
          >
            Built from one reader&rsquo;s answers. The quoted words are hers.
          </p>

          <div data-reveal="swing" style={{ "--reveal-delay": "0.15s" } as React.CSSProperties}>
            <div className="bezel">
              <div className="bg-cloud text-ink">
                <Image
                  src="/harbor-dawn.webp"
                  alt="A narrow house by a quiet harbor at dawn, one window glowing warm, fishing nets on the porch, calm misty sea"
                  width={1024}
                  height={688}
                  className="h-auto w-full"
                />
                <div className="px-8 py-11 sm:px-14">
                  <p className="font-body mb-1 text-center text-sm tracking-[0.08em] text-grape italic">
                    Chapter One
                  </p>
                  <h3 className="font-body mb-8 text-center text-4xl font-semibold">
                    Where You Began
                  </h3>
                  <p className="dropcap prose-book">
                    Every story is rooted somewhere, and yours begins in a narrow
                    house by the harbor, where mornings smelled of salt and frying
                    garlic rice, and the jeepneys coughed up the hill before sunrise.
                  </p>
                  <blockquote className="mt-8 rounded-xl border-l-4 border-gold bg-paper px-6 py-5">
                    <p className="font-body text-lg leading-relaxed text-ink-soft italic">
                      &ldquo;My grandmother taught me to mend fishing nets on the
                      porch. She never finished a song; she circled the same three
                      bars.&rdquo;
                    </p>
                    <cite className="mt-2 block font-body text-xs font-medium tracking-wide text-ink-faint not-italic">
                      In her own words, from her answers
                    </cite>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials: featured + stacked ──────────────── */}
      <section className="px-6 py-28 sm:px-12 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <h2
            data-reveal
            className="font-display mb-3 max-w-[16ch] text-4xl leading-[1.05] font-bold tracking-[-0.02em] sm:text-[3.25rem]"
          >
            First readers, first words
          </h2>
          <p
            data-reveal
            style={{ "--reveal-delay": "0.1s" } as React.CSSProperties}
            className="mb-16 max-w-[48ch] font-body text-lg text-starlight/70"
          >
            Real reactions from the people testing this prototype with us.
          </p>
          <div className="grid gap-6 md:grid-cols-12">
            <figure
              data-reveal="tilt-left"
              className="card-night flex flex-col justify-between p-10 md:col-span-7"
            >
              <blockquote>
                <p className="font-display text-2xl leading-snug font-semibold tracking-[-0.01em] text-starlight/95 sm:text-3xl">
                  &ldquo;{testimonials[0].quote}&rdquo;
                </p>
              </blockquote>
              <figcaption className="mt-8 text-sm font-medium">
                {testimonials[0].name}
                <span className="block font-normal text-starlight/55">
                  {testimonials[0].role}
                </span>
              </figcaption>
            </figure>
            <div className="flex flex-col gap-6 md:col-span-5">
              {testimonials.slice(1).map((t, i) => (
                <figure
                  key={t.name}
                  data-reveal="tilt-right"
                  style={{ "--reveal-delay": `${0.1 + i * 0.1}s` } as React.CSSProperties}
                  className="card-night flex flex-1 flex-col justify-between p-8"
                >
                  <blockquote>
                    <p className="font-body leading-relaxed text-starlight/85 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </blockquote>
                  <figcaption className="mt-6 text-sm font-medium">
                    {t.name}
                    <span className="block font-normal text-starlight/55">{t.role}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Closing invitation ────────────────────────────── */}
      <section className="relative px-6 py-32 text-center sm:px-12 sm:py-40">
        <p
          data-reveal
          className="font-display mx-auto max-w-[18ch] text-5xl leading-[1.02] font-bold tracking-[-0.025em] sm:text-6xl"
        >
          Your life is already worth a book.
        </p>
        <p
          data-reveal
          style={{ "--reveal-delay": "0.1s" } as React.CSSProperties}
          className="mx-auto mt-5 max-w-[40ch] font-body text-lg text-starlight/70"
        >
          Let&rsquo;s write it down, one gentle question at a time.
        </p>
        <div
          data-reveal="pop"
          style={{ "--reveal-delay": "0.18s" } as React.CSSProperties}
          className="mt-11"
        >
          <CtaButton href="/login">Begin your book</CtaButton>
          <p className="mt-6 text-sm font-medium text-starlight/50">
            Free while we test. Save your progress and return anytime.
          </p>
        </div>
      </section>

      <footer className="border-t border-starlight/10 px-6 py-10 sm:px-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center text-sm text-starlight/50 sm:flex-row sm:justify-between sm:text-left">
          <p>
            SOURCE is an early prototype for user-experience research. Your
            answers stay in your browser.
          </p>
          <p className="flex gap-6">
            <Link href="/privacy" className="transition-colors duration-300 hover:text-starlight">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors duration-300 hover:text-starlight">
              Terms
            </Link>
          </p>
        </div>
      </footer>
    </main>
  );
}
