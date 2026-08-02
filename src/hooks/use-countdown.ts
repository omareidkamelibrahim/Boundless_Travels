"use client";

import { useEffect, useRef, useState } from "react";

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  isExpired: boolean;
}

function compute(target: number): CountdownParts {
  const now = Date.now();
  const totalMs = Math.max(0, target - now);
  const seconds = Math.floor(totalMs / 1000) % 60;
  const minutes = Math.floor(totalMs / (1000 * 60)) % 60;
  const hours = Math.floor(totalMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, totalMs, isExpired: totalMs <= 0 };
}

/** Live countdown to a target ISO timestamp. Updates every second. */
export function useCountdown(targetIso: string): CountdownParts {
  const target = new Date(targetIso).getTime();
  const [parts, setParts] = useState<CountdownParts>(() => compute(target));
  useEffect(() => {
    const id = setInterval(() => setParts(compute(target)), 1000);
    return () => clearInterval(id);
  }, [target]);
  return parts;
}
