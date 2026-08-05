"use client";

import { Slider } from "@/components/ui/slider";
import { cn, formatPrice } from "@/lib/utils";

interface RangeSliderFilterProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min: number;
  max: number;
  step?: number;
  /** Currency symbol for the value display. */
  currency?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Dual-thumb range slider with formatted value display above.
 *
 * - Uses shadcn Slider with two thumbs.
 * - Shows "$min — $max+" formatted values.
 * - "max+" suffix when the upper thumb is at the maximum.
 */
export function RangeSliderFilter({
  value,
  onChange,
  min,
  max,
  step = 50,
  currency = "USD",
  className,
  ariaLabel = "Price range",
}: RangeSliderFilterProps) {
  const [lo, hi] = value;
  const isMaxed = hi >= max;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Value display */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Min</span>
          <span className="text-sm font-bold text-foreground tabular-nums">{formatPrice(lo, currency)}</span>
        </div>
        <div className="h-px flex-1 bg-border" />
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Max</span>
          <span className="text-sm font-bold text-foreground tabular-nums">
            {formatPrice(hi, currency)}
            {isMaxed ? "+" : ""}
          </span>
        </div>
      </div>
      {/* Slider */}
      <Slider
        value={value}
        onValueChange={(v) => onChange([v[0], v[1]] as [number, number])}
        min={min}
        max={max}
        step={step}
        aria-label={ariaLabel}
        className="w-full"
      />
    </div>
  );
}
