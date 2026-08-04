"use client";

import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DateFilterProps {
  value: DateRange | undefined;
  onChange: (value: DateRange | undefined) => void;
  className?: string;
}

/**
 * Departure + return date picker using two popovers over shadcn Calendar.
 *
 * - Two compact triggers (Departure / Return) side by side.
 * - Disabled past dates.
 * - Clicking the same calendar again clears that side.
 */
export function DateFilter({ value, onChange, className }: DateFilterProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {/* Departure */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-auto justify-start gap-2 rounded-xl px-3 py-2.5 font-normal"
            aria-label="Departure date"
          >
            <CalendarIcon className="size-4 text-primary" />
            <div className="flex flex-1 flex-col items-start text-left">
              <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Departure</span>
              <span className={cn("text-xs font-semibold", value?.from ? "text-foreground" : "text-muted-foreground")}>
                {value?.from ? format(value.from, "MMM d, yyyy") : "Add date"}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarPicker
            mode="single"
            selected={value?.from}
            onSelect={(d) => onChange({ ...value, from: d ?? undefined })}
            disabled={{ before: new Date() }}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>

      {/* Return */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-auto justify-start gap-2 rounded-xl px-3 py-2.5 font-normal"
            aria-label="Return date"
          >
            <CalendarIcon className="size-4 text-primary" />
            <div className="flex flex-1 flex-col items-start text-left">
              <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Return</span>
              <span className={cn("text-xs font-semibold", value?.to ? "text-foreground" : "text-muted-foreground")}>
                {value?.to ? format(value.to, "MMM d, yyyy") : "Add date"}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <CalendarPicker
            mode="single"
            selected={value?.to}
            onSelect={(d) => onChange({ ...value, to: d ?? undefined })}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (date < today) return true;
              if (value?.from && date < value.from) return true;
              return false;
            }}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
