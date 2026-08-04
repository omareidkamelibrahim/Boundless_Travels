"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterAccordionProps {
  id: string;
  title: string;
  icon?: React.ElementType;
  /** Active item count shown as a small badge on the right (next to chevron). */
  activeCount?: number;
  /** Default open state on first mount. */
  defaultOpen?: boolean;
  /** Persist open state across sessions (per-section localStorage key). */
  persistKey?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Accordion-style collapsible filter group — single page scroll only.
 *
 * - Animates max-height + opacity (smooth Booking.com / Airbnb feel).
 * - No nested scrollbars: children render inline at full natural height and
 *   push siblings down — only the page itself scrolls.
 * - Optional active-count badge.
 * - Optional per-section persisted open state (localStorage).
 * - Fully keyboard accessible: header is a real <button>, ARIA-expanded toggled.
 */
export function FilterAccordion({
  id,
  title,
  icon: Icon,
  activeCount = 0,
  defaultOpen = true,
  persistKey,
  children,
  className,
}: FilterAccordionProps) {
  const storageKey = persistKey ? `bluesky-filter-open:${persistKey}` : null;
  const [open, setOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return defaultOpen;
    if (!storageKey) return defaultOpen;
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored === null) return defaultOpen;
      return stored === "true";
    } catch {
      return defaultOpen;
    }
  });

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev;
      if (storageKey && typeof window !== "undefined") {
        try {
          window.localStorage.setItem(storageKey, String(next));
        } catch {
          /* ignore quota / privacy errors */
        }
      }
      return next;
    });
  }, [storageKey]);

  const headerId = `${id}-header`;
  const contentId = `${id}-content`;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl transition-colors",
        "border-b border-border/60 last:border-b-0",
        className,
      )}
      aria-labelledby={headerId}
    >
      <button
        id={headerId}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={contentId}
        className={cn(
          "flex w-full items-center gap-2.5 py-3 text-left transition-colors",
          "hover:bg-accent/40 focus-visible:bg-accent/40 focus-visible:outline-none",
        )}
      >
        {Icon && (
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/8 text-primary">
            <Icon className="size-3.5" />
          </span>
        )}
        <span className="flex-1 text-sm font-bold text-foreground">{title}</span>
        {activeCount > 0 && (
          <span className="grid min-w-[1.25rem] place-items-center rounded-full bg-primary px-1 text-[0.6rem] font-bold text-primary-foreground">
            {activeCount}
          </span>
        )}
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
