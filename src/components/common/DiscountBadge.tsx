"use client";

import { cn } from "@/lib/utils";

interface DiscountBadgeProps {
  pct: number;
  className?: string;
}

/** Pill-shaped discount badge with gradient. */
export function DiscountBadge({ pct, className }: DiscountBadgeProps) {
  if (pct <= 0) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-gradient-bluesky px-2.5 py-1 text-xs font-bold text-white shadow-glow-bluesky",
        className,
      )}
    >
      -{pct}%
    </span>
  );
}
