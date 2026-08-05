"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, ChevronUp, Inbox } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FilterSearch } from "@/components/filters/FilterSearch";
import { cn } from "@/lib/utils";

export interface CheckboxOption<T extends string | number> {
  id: T;
  label: string;
  /** Optional right-aligned meta text (e.g. count). */
  meta?: string;
}

interface CheckboxFilterProps<T extends string | number> {
  options: CheckboxOption<T>[];
  selected: T[];
  onToggle: (value: T) => void;
  /** Show the inline search input at the top of the list. */
  searchable?: boolean;
  /** Placeholder for the inline search input. */
  searchPlaceholder?: string;
  /** Aria label for the search input. */
  searchAriaLabel?: string;
  /** Number of items visible before "Show More" expands the rest. */
  maxVisible?: number;
  className?: string;
  /** Aria group label. */
  ariaLabel?: string;
}

/**
 * Searchable inline checkbox list — NO nested scrollbar, NO dropdown.
 *
 * - Optional inline search filters visible options (used by Country & City).
 * - "Show More" / "Show Less" expands / collapses the list inline
 *   (Booking.com-style). All items lay out at their natural height and the
 *   page itself scrolls — no internal scroll containers.
 * - Custom-styled shadcn Checkbox with hover state and Check overlay.
 */
export function CheckboxFilter<T extends string | number>({
  options,
  selected,
  onToggle,
  searchable = false,
  searchPlaceholder = "Search...",
  searchAriaLabel = "Search options",
  maxVisible,
  className,
  ariaLabel,
}: CheckboxFilterProps<T>) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(false);

  const visibleOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = searchable && q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;
    // When searching, always show all matches (no truncation)
    if (searchable && q) return filtered;
    if (maxVisible != null && maxVisible > 0 && !expanded && filtered.length > maxVisible) {
      return filtered.slice(0, maxVisible);
    }
    return filtered;
  }, [options, query, searchable, maxVisible, expanded]);

  const totalOptions = options.length;
  const shouldTruncate = maxVisible != null && maxVisible > 0 && totalOptions > maxVisible;
  const hiddenCount = shouldTruncate ? totalOptions - maxVisible : 0;

  return (
    <div className={cn("flex flex-col gap-2", className)} role="group" aria-label={ariaLabel}>
      {searchable && (
        <FilterSearch
          value={query}
          onChange={setQuery}
          placeholder={searchPlaceholder}
          ariaLabel={searchAriaLabel}
        />
      )}

      <div className="flex flex-col gap-0.5">
        {visibleOptions.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 py-4 text-center">
            <Inbox className="size-4 text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground">No matches</p>
          </div>
        ) : (
          visibleOptions.map((option) => {
            const isSelected = selected.includes(option.id);
            return (
              <Label
                key={String(option.id)}
                htmlFor={`cb-${String(option.id)}`}
                className={cn(
                  "group flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/60",
                  isSelected && "bg-primary/5",
                )}
              >
                <span className="relative grid size-4 place-items-center">
                  <Checkbox
                    id={`cb-${String(option.id)}`}
                    checked={isSelected}
                    onCheckedChange={() => onToggle(option.id)}
                    className={cn(
                      "size-4 rounded-[0.375rem] border-border transition-colors",
                      isSelected && "border-primary bg-primary text-primary-foreground",
                    )}
                  />
                  {isSelected && (
                    <Check className="pointer-events-none absolute size-3 text-primary-foreground" strokeWidth={3} />
                  )}
                </span>
                <span
                  className={cn(
                    "flex-1 text-sm",
                    isSelected ? "font-semibold text-foreground" : "font-medium text-foreground/85",
                  )}
                >
                  {option.label}
                </span>
                {option.meta && (
                  <span className="text-[0.7rem] font-medium text-muted-foreground">{option.meta}</span>
                )}
              </Label>
            );
          })
        )}
      </div>

      {shouldTruncate && !query && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex items-center gap-1 self-start rounded-md px-1 py-0.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80"
        >
          {expanded ? (
            <>
              <ChevronUp className="size-3.5" /> Show Less
            </>
          ) : (
            <>
              <ChevronDown className="size-3.5" /> Show More
              {hiddenCount > 0 && (
                <span className="ml-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.6rem] font-bold">
                  {hiddenCount}
                </span>
              )}
            </>
          )}
        </button>
      )}
    </div>
  );
}
