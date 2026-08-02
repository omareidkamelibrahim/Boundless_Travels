"use client";

import { useEffect, useState } from "react";

/**
 * Tracks the active in-page section based on scroll position.
 * Pass an array of section IDs to observe.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    const handler = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      let current: string | undefined;
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        if (scrollPos >= top) current = id;
      }
      setActive(current);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [ids.join(",")]);

  return active;
}
