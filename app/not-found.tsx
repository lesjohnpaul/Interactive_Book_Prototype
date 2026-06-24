import Link from "next/link";

export default function NotFound() {
  return (
    <main className="night flex min-h-dvh flex-col items-center justify-center px-6 text-center text-starlight">
      <p className="font-display text-[clamp(5rem,18vw,9rem)] leading-none font-medium text-gold/25">
        404
      </p>
      <h1 className="font-display mt-4 max-w-[24ch] text-3xl leading-snug font-medium sm:text-4xl">
        This page isn&rsquo;t in the book.
      </h1>
      <p className="mt-5 max-w-[40ch] text-lg text-starlight/70">
        The chapter you&rsquo;re looking for was never written, or it lives at
        a different address.
      </p>
      <Link
        href="/"
        className="sticker-press font-display mt-10 inline-block rounded-full bg-gold px-8 py-3.5 text-lg font-medium text-night"
      >
        Back to the beginning
      </Link>
    </main>
  );
}
