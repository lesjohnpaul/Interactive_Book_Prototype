import Link from "next/link";

export const metadata = {
  title: "Terms · SOURCE",
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <Link href="/" className="font-display text-sm font-medium text-ink-faint transition-colors duration-300 hover:text-sienna">
        ← Back to SOURCE
      </Link>
      <h1 className="font-display mt-8 text-4xl font-medium tracking-[-0.01em]">Terms of use</h1>
      <div className="prose-book mt-8 space-y-5">
        <p>
          SOURCE is an experimental prototype provided for testing and feedback,
          free of charge and without warranty of any kind.
        </p>
        <p>
          The book generated from your answers is yours. You may keep it, print
          it, and share it as you wish. SOURCE claims no rights over your words
          or your story.
        </p>
        <p>
          Because data lives in your browser, we cannot recover lost answers if
          your local storage is cleared. Export or print anything you want to
          keep.
        </p>
        <p>
          By using the prototype you accept that features may change, break, or
          disappear between visits while we learn what this product should be.
        </p>
      </div>
    </main>
  );
}
