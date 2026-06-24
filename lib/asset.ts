// Prefix for static assets referenced via raw <img>/<a> tags. next/image and
// next/link apply basePath automatically, but hand-written string paths do not,
// so wrap those in asset(). Mirrors NEXT_PUBLIC_BASE_PATH from next.config.ts.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  // Only rewrite absolute, app-relative paths; leave full URLs/hashes untouched.
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
