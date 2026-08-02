"use client";

import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  targetIso: string;
  className?: string;
  variant?: "light" | "dark";
  size?: "sm" | "md" | "lg";
}

const pad = (n: number) => n.toString().padStart(2, "0");

/** Countdown timer with day/hour/minute/second parts. */
export function CountdownTimer({
  targetIso,
  className,
  variant = "light",
  size = "md",
}: CountdownTimerProps) {
  const target = new Date(targetIso).getTime();
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor(diff / 3_600_000) % 24;
  const minutes = Math.floor(diff / 60_000) % 60;
  const seconds = Math.floor(diff / 1000) % 60;

  const parts = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Mins", value: minutes },
    { label: "Secs", value: seconds },
  ];

  const sizes: Record<typeof size, string> = {
    sm: "text-base px-2.5 py-1.5",
    md: "text-lg px-3.5 py-2",
    lg: "text-2xl px-5 py-3",
  } as const;

  return (
    <div className={cn("flex items-center gap-2", className)} role="timer" aria-live="polite">
      {parts.map((p, i) => (
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
            <span>{pad(p.value)}</span>
            <span className="text-[0.6rem] font-sans font-medium uppercase tracking-wider opacity-80">
              {p.label}
            </span>
          </div>
          {i < parts.length - 1 && (
            <span className={cn("text-xl font-bold", variant === "light" ? "text-white/70" : "text-primary/40")}>
              :
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
