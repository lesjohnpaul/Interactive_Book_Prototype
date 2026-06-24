import Link from "next/link";

export const metadata = {
  title: "Privacy · SOURCE",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-24">
      <Link href="/" className="font-display text-sm font-medium text-ink-faint transition-colors duration-300 hover:text-sienna">
        ← Back to SOURCE
      </Link>
      <h1 className="font-display mt-8 text-4xl font-medium tracking-[-0.01em]">Privacy</h1>
      <div className="prose-book mt-8 space-y-5">
        <p>
          SOURCE is a V1 prototype built to validate a user experience. It is
          intentionally conservative with your data.
        </p>
        <p>
          Your account details and questionnaire answers are stored in your own
          browser&rsquo;s local storage. They are not sent to a server, not
          shared with third parties, and not used to train anything. Clearing
          your browser data removes them completely.
        </p>
        <p>
          Voice input is transcribed on your device using your browser&rsquo;s
          speech recognition. Audio is not recorded or stored by SOURCE.
        </p>
        <p>
          If this prototype graduates to a hosted product, this policy will be
          rewritten before any data leaves your device, and you will be asked
          to agree to the new terms first.
        </p>
        <p>
          Questions? Reach the maker of this prototype directly. This is a
          test, and your feedback shapes what it becomes.
        </p>
      </div>
    </main>
  );
}
