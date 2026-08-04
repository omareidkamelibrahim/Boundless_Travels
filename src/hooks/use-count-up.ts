"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Count-up animation that triggers when the element scrolls into view.
 * Respects prefers-reduced-motion.
 *
 * SSR-safe: always renders 0 on the server, then resolves prefers-reduced-motion
 * in a useEffect (client-only) to avoid hydration mismatches.
 *
 * For reduced-motion users, we still need to apply the target value on the client
 * — but we do it inside a microtask via requestAnimationFrame so it isn't a
 * synchronous setState within the effect body.
 */
export function useCountUp(target: number, durationMs = 1600, startOnView = true) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      // Defer to next frame so we don't call setState synchronously inside the effect body.
      const raf = requestAnimationFrame(() => setValue(target));
      return () => cancelAnimationFrame(raf);
    }

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
  }, [target, durationMs, startOnView]);

  return { value, ref };
}
