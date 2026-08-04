"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingFilterProps {
  options: { id: number; label: string }[];
  selected: number;
  onSelect: (value: number) => void;
  className?: string;
  ariaLabel?: string;
}

/**
 * Rating threshold selector — segmented control with star icons.
 *
 * - Three pill buttons (4+, 4.5+, 5).
 * - Selecting the active option again clears it.
 * - Each option shows stars + the threshold label.
 */
export function RatingFilter({
  options,
  selected,
  onSelect,
  className,
  ariaLabel = "Minimum rating",
}: RatingFilterProps) {
  return (
    <div className={cn("grid grid-cols-3 gap-1.5", className)} role="radiogroup" aria-label={ariaLabel}>
      {options.map((opt) => {
        const isActive = selected === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onSelect(isActive ? 0 : opt.id)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 transition-all",
              isActive
                ? "border-primary bg-primary/8 text-primary shadow-sm"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            <Star className={cn("size-4", isActive ? "fill-amber-400 text-amber-400" : "fill-muted-foreground/20 text-muted-foreground/40")} />
            <span className={cn("text-xs font-bold", isActive ? "text-foreground" : "text-muted-foreground")}>
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
