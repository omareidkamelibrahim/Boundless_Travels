"use client";

import { RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterFooterProps {
  /** Total count of individually selected filter items. */
  selectedCount: number;
  /** Whether there are any active filter groups. */
  hasActiveFilters: boolean;
  resultCount: number;
  onReset: () => void;
  onApply: () => void;
  className?: string;
}

/**
 * Sticky footer of the filter dialog — two CTAs (Booking.com style).
 *
 * - "Reset" on the left: outline button, only enabled when filters are active.
 * - "Apply Filters (N)" on the right: primary BlueSky gradient button showing
 *   the total count of individually selected items.
 * - Soft upward shadow + backdrop blur to visually anchor the dialog bottom.
 */
export function FilterFooter({
  selectedCount,
  hasActiveFilters,
  resultCount,
  onReset,
  onApply,
  className,
}: FilterFooterProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-20 flex items-center gap-2 border-t border-border/60 bg-card/95 px-6 py-4 backdrop-blur-md",
        "shadow-[0_-8px_24px_-12px_rgba(15,111,255,0.18)]",
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        onClick={onReset}
        disabled={!hasActiveFilters}
        className="flex-1 rounded-xl border-border font-semibold text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="size-3.5" />
        Reset
      </Button>
      <Button
        type="button"
        onClick={onApply}
        className="flex-[1.4] rounded-xl bg-gradient-bluesky font-bold shadow-glow-bluesky"
      >
        <Check className="size-4" />
        Apply Filters
        <span className="ml-1 rounded-md bg-white/20 px-1.5 py-0.5 text-[0.65rem] font-bold tabular-nums">
          {selectedCount}
        </span>
      </Button>
    </div>
  );
}
