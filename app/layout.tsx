import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Newsreader, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display-face",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-body-face",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "SOURCE · A book written from your life",
  description:
    "Answer 50-80 gentle questions, typed or spoken, and receive a personal book where your own memories become the examples, reflections, and case studies in every chapter.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${bricolage.variable} ${newsreader.variable} paper-grain min-h-dvh`}
      >
        {children}
      </body>
    </html>
  );
}
