"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

const COLORS = [
  "var(--color-sienna)",
  "var(--color-gold)",
  "var(--color-moss)",
  "var(--color-sky-deep)",
  "var(--color-grape)",
  "var(--color-sky)",
];

const STAR_CLIP =
  "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";

type ConfettiStyle = CSSProperties & { [key: `--${string}`]: string };

type Piece = {
  left: number;
  size: number;
  color: string;
  shape: "square" | "circle" | "star";
  delay: number;
  duration: number;
  drift: number;
  spin: number;
};

function makePieces(count: number): Piece[] {
  const shapes: Piece["shape"][] = ["square", "circle", "star"];
  return Array.from({ length: count }, (_, i) => ({
    left: Math.random() * 100,
    size: 8 + Math.random() * 8,
    color: COLORS[i % COLORS.length],
    shape: shapes[i % shapes.length],
    delay: Math.random() * 0.6,
    duration: 1.7 + Math.random() * 1.1,
    drift: (Math.random() - 0.5) * 160,
    spin: 360 + Math.random() * 540,
  }));
}

/**
 * Dependency-free celebratory confetti burst.
 * Pure CSS keyframe animation (see .confetti-piece in globals.css),
 * decorative only (aria-hidden), auto-removes itself after ~2.5s,
 * and is fully disabled under prefers-reduced-motion.
 */
export default function Confetti({ count = 60 }: { count?: number }) {
  const [done, setDone] = useState(false);
  const pieces = useMemo(() => makePieces(count), [count]);

  useEffect(() => {
    const t = window.setTimeout(() => setDone(true), 2600);
    return () => window.clearTimeout(t);
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {pieces.map((p, i) => {
        const style: ConfettiStyle = {
          left: `${p.left}%`,
          width: `${p.size}px`,
          height: `${p.size}px`,
          backgroundColor: p.color,
          borderRadius: p.shape === "circle" ? "9999px" : "2px",
          clipPath: p.shape === "star" ? STAR_CLIP : undefined,
          "--confetti-delay": `${p.delay}s`,
          "--confetti-duration": `${p.duration}s`,
          "--confetti-drift": `${p.drift}px`,
          "--confetti-spin": `${p.spin}deg`,
        };
        return <span key={i} className="confetti-piece" style={style} />;
      })}
    </div>
  );
}
