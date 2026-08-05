"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { FilterFooter } from "@/components/filters/FilterFooter";
import type { FilterState } from "@/components/filters/filter-config";
import type { Country, City } from "@/types";

// Re-export for callers that want to render the filter list directly.
export { FilterAccordion } from "@/components/filters/FilterAccordion";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Active filter-group count (shown in the header badge). */
  activeCount: number;
  /** Total selected items count (shown in the Apply button). */
  selectedCount: number;
  resultCount: number;
  onReset: () => void;
  onApply: () => void;
  /** The accordion filter list — passed in by the parent so this stays UI-only. */
  children: React.ReactNode;
  className?: string;
}

/**
 * Modern centered filter dialog — Booking.com / Airbnb style.
 *
 * Animation: Framer Motion fade + scale(0.95 → 1), 200ms.
 * Overlay: rgba(0,0,0,0.45) + backdrop-blur(4px) — NO blue tint, NO saturation change.
 *
 * Responsive widths (per spec):
 *   - Desktop (xl+): 760px
 *   - Laptop (lg):  700px
 *   - Tablet (sm):  90% of viewport
 *   - Mobile:       100% (full width, full height-ish, capped at 85vh)
 *
 * Layout:
 *   - Sticky header: Filters title + active count badge + Reset All + Close (X)
 *   - Scrollable middle: accordion filter sections (rendered by parent via children)
 *   - Sticky footer: Reset + Apply Filters (N)
 */
export function FilterDialog({
  open,
  onOpenChange,
  activeCount,
  selectedCount,
  resultCount,
  onReset,
  onApply,
  children,
  className,
}: FilterDialogProps) {
  const hasActiveFilters = activeCount > 0;

  const handleApply = () => {
    onApply();
    onOpenChange(false);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            {/* ===== Overlay — rgba(0,0,0,0.45) + backdrop-blur 4px, no blue tint ===== */}
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed inset-0 z-50"
                style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
              />
            </DialogPrimitive.Overlay>

            {/* ===== Centered dialog content ===== */}
            <DialogPrimitive.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "fixed left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-card shadow-2xl",
                  // Responsive widths per spec
                  "w-full max-w-[100vw] sm:max-w-[90vw] lg:max-w-[700px] xl:max-w-[760px]",
                  // Max height so sticky footer stays visible
                  "max-h-[85vh]",
                  className,
                )}
              >
                {/* sr-only title for accessibility (Radix requires a Title) */}
                <DialogPrimitive.Title className="sr-only">Filter trips</DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">
                  Filter trips by destination, budget, duration, trip type, transportation, hotel stars, meals, visa, rating, and offers.
                </DialogPrimitive.Description>

                {/* ===== Sticky header ===== */}
                <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-card px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-9 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15">
                      <SlidersHorizontal className="size-4" />
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <h3 className="text-base font-bold text-foreground">Filters</h3>
                      {activeCount > 0 && (
                        <span className="grid min-w-[1.4rem] place-items-center rounded-full bg-primary px-1.5 text-[0.65rem] font-bold text-primary-foreground">
                          {activeCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={onReset}
                        className="flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
                      >
                        <RotateCcw className="size-3" />
                        Reset All
                      </button>
                    )}
                    <DialogPrimitive.Close
                      aria-label="Close filters"
                      className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <X className="size-4" />
                    </DialogPrimitive.Close>
                  </div>
                </header>

                {/* ===== Scrollable filter content (accordions) ===== */}
                <div className="flex-1 overflow-y-auto px-6 py-2">
                  {children}
                </div>

                {/* ===== Sticky footer ===== */}
                <FilterFooter
                  selectedCount={selectedCount}
                  hasActiveFilters={hasActiveFilters}
                  resultCount={resultCount}
                  onReset={onReset}
                  onApply={handleApply}
                />
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
