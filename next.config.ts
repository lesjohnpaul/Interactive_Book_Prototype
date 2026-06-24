import type { NextConfig } from "next";

// When deploying to GitHub Pages (a "project" site), the app is served from a
// subpath like https://<user>.github.io/<repo>/. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH to "/<repo>" so framework-generated URLs (next/image,
// next/link, JS/CSS chunks) are prefixed correctly. Locally it is empty so the
// app runs from the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Emit a fully static site into out/ — no Node server needed (GitHub Pages).
  output: "export",
  // The default Image Optimization API requires a server; disable it for export.
  images: { unoptimized: true },
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  // Pages serves /book as /book/index.html; trailing slashes make routes resolve.
  trailingSlash: true,
};

export default nextConfig;
