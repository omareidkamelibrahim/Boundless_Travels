"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  ariaLabel?: string;
}

/**
 * Reusable compact search input for filter sections.
 *
 * - Leading magnifier icon (Lucide `Search`) in muted color.
 * - Trailing `X` clear button appears when there's text.
 * - Rounded-lg, soft focus ring in Boundless primary.
 * - Used by the Destination accordion + Country/City searchable checkbox lists.
 */
export function FilterSearch({
  value,
  onChange,
  placeholder = "Search...",
  className,
  ariaLabel = "Search",
}: FilterSearchProps) {
  const hasValue = value.trim().length > 0;
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="h-9 w-full rounded-lg border border-border bg-card pl-8 pr-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {hasValue && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 grid size-5 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}
