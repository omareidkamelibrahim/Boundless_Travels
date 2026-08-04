"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface HotelStarsFilterProps {
  options: { id: number; stars: number; label: string }[];
  selected: number[];
  onToggle: (value: number) => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Hotel stars filter — visual star rating rows (★★★★★, ★★★★☆, ★★★☆☆, ★★☆☆☆).
 *
 * - Each row shows 5 stars, with `stars` of them filled in amber
 *   and the rest outlined grey.
 * - Selected rows highlight with primary tint.
 */
export function HotelStarsFilter({
  options,
  selected,
  onToggle,
  className,
  ariaLabel = "Hotel stars",
}: HotelStarsFilterProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)} role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const isActive = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onToggle(opt.id)}
            aria-pressed={isActive}
            className={cn(
              "flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors",
              isActive ? "bg-primary/5" : "hover:bg-accent/60",
            )}
          >
            <span className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => {
                const filled = i < opt.stars;
                return (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5 transition-colors",
                      filled
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted/30 text-muted-foreground/40",
                    )}
                  />
                );
              })}
            </span>
            <span
              className={cn(
                "text-sm",
                isActive ? "font-semibold text-foreground" : "font-medium text-foreground/85",
              )}
            >
              {opt.label}
            </span>
            {isActive && (
              <span className="ml-auto size-2 rounded-full bg-primary" aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );
}
