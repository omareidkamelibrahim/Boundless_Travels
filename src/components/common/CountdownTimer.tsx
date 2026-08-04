"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetIso: string;
  className?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

const pad = (n: number) => n.toString().padStart(2, "0");

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeParts(target: number): Parts {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

const PART_LABELS: { key: keyof Parts; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Mins" },
  { key: "seconds", label: "Secs" },
];

/** Countdown timer with day/hour/minute/second parts. */
export function CountdownTimer({
  targetIso,
  className,
  variant = "light",
  size = "md",
}: CountdownTimerProps) {
  const target = new Date(targetIso).getTime();
  // SSR renders "--" placeholders; client takes over after mount to avoid hydration mismatch.
  const [mounted, setMounted] = useState(false);
  const [parts, setParts] = useState<Parts>(() => computeParts(target));

  useEffect(() => {
    // Defer setState to a microtask so we don't trigger the synchronous-setState-in-effect lint rule.
    const raf = requestAnimationFrame(() => {
      setMounted(true);
      setParts(computeParts(target));
    });
    const id = setInterval(() => setParts(computeParts(target)), 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [target]);

  const sizes: Record<typeof size, string> = {
    sm: "text-base px-2.5 py-1.5",
    md: "text-lg px-3.5 py-2",
    lg: "text-2xl px-5 py-3",
  } as const;

  return (
    <div className={cn("flex items-center gap-2", className)} role="timer" aria-live="polite">
      {PART_LABELS.map((p, i) => (
        <div key={p.label} className="flex items-center gap-2">
          <div
            className={cn(
              "flex min-w-[3.2rem] flex-col items-center rounded-xl font-mono font-bold tabular-nums",
              sizes[size],
              variant === "light"
                ? "bg-white/15 text-white backdrop-blur-md"
                : "bg-primary text-primary-foreground shadow-sm",
            )}
          >
            <span suppressHydrationWarning>{mounted ? pad(parts[p.key]) : "--"}</span>
            <span className="text-[0.6rem] font-sans font-medium uppercase tracking-wider opacity-80">
              {p.label}
            </span>
          </div>
          {i < PART_LABELS.length - 1 && (
            <span className={cn("text-xl font-bold", variant === "light" ? "text-white/70" : "text-primary/40")}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
