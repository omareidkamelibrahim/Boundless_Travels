"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up animation that triggers when the element scrolls into view.
 * Respects prefers-reduced-motion.
 */
export function useCountUp(target: number, durationMs = 1600, startOnView = true) {
  // Lazy initial state — if reduced motion is preferred, start at target value
  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
  const [value, setValue] = useState(prefersReducedMotion ? target : 0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) return; // already at target

    const node = ref.current;
    if (!node) return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const startTime = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTime) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(target * eased);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!startOnView) {
      start();
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          obs.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [target, durationMs, startOnView, prefersReducedMotion]);

  return { value, ref };
}
