"use client";

import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";

interface StatsCounterProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
}

/** Animated counter that triggers on scroll into view. */
export function StatsCounter({
  value,
  label,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
}: StatsCounterProps) {
  const { value: animated, ref } = useCountUp(value);
  const display = decimals > 0 ? animated.toFixed(decimals) : Math.round(animated).toLocaleString();
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span ref={ref} className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {prefix}
        {display}
        {suffix}
      </span>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}
