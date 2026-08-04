"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  activeCount: number;
  onClick: () => void;
  /** When true, this button renders the mobile FAB. Pass `showFab={false}`
   *  on subsequent instances to avoid duplicate FABs when multiple
   *  TripsExplorer sections exist on the same page. */
  showFab?: boolean;
  className?: string;
}

/**
 * Floating Filters button — Booking.com / Airbnb style.
 *
 * - Desktop / Laptop / Tablet: appears top-right above the trip grid (inline).
 * - Mobile: becomes a floating action button (FAB) fixed at bottom-right.
 *   Pass `showFab={false}` on all but the first instance to prevent
 *   duplicate FABs when multiple TripsExplorer sections are on the page.
 * - Lucide `SlidersHorizontal` icon + "Filters" label + active count badge.
 */
export function FilterButton({ activeCount, onClick, showFab = true, className }: FilterButtonProps) {
  // SSR-safe: FAB hidden until mounted (client), then shown if showFab is true.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => setMounted(showFab));
  }, [showFab]);

  return (
    <>
      {/* Desktop / Tablet — inline top-right above the grid */}
      <Button
        onClick={onClick}
        aria-label="Open filters"
        className={cn(
          "hidden gap-2 rounded-xl bg-gradient-bluesky px-5 py-2.5 font-bold shadow-glow-bluesky transition-transform hover:scale-[1.02] sm:inline-flex",
          className,
        )}
      >
        <SlidersHorizontal className="size-4" />
        Filters
        {activeCount > 0 && (
          <span className="grid min-w-[1.4rem] place-items-center rounded-full bg-white/25 px-1.5 text-[0.65rem] font-bold tabular-nums">
            {activeCount}
          </span>
        )}
      </Button>

      {/* Mobile — FAB bottom-right, only rendered for the first instance */}
      {mounted && (
        <Button
          onClick={onClick}
          aria-label="Open filters"
          className={cn(
            "fixed bottom-6 right-6 z-30 size-14 gap-0 rounded-full bg-gradient-bluesky p-0 shadow-premium-lg transition-transform hover:scale-105 sm:hidden",
            className,
          )}
        >
          <span className="relative flex flex-col items-center justify-center">
            <SlidersHorizontal className="size-5" />
            {activeCount > 0 && (
              <span className="absolute -right-2 -top-2 grid min-w-[1.25rem] place-items-center rounded-full bg-rose-500 px-1 text-[0.6rem] font-bold text-white ring-2 ring-white">
                {activeCount}
              </span>
            )}
          </span>
        </Button>
      )}
    </>
  );
}
