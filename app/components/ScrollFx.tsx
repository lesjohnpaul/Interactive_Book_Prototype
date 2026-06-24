"use client";

import { useEffect } from "react";

/**
 * Powers the landing page reveal effects: adds `fx` to <html> on
 * mount so the CSS hidden states never apply when JavaScript is
 * unavailable, then reveals `[data-reveal]` elements as they enter
 * the viewport. Bails out when the user prefers reduced motion.
 * The scroll progress bar is pure CSS (animation-timeline: scroll).
 */
export default function ScrollFx() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("fx");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    document
      .querySelectorAll<HTMLElement>("[data-reveal]")
      .forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, []);

  return null;
}
