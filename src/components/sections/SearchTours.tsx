"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Calendar, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { useUI } from "@/stores/use-ui";
import { getCountries, getCategories } from "@/services";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

export function SearchTours() {
  const setCommandOpen = useUI((s) => s.setCommandOpen);
  const countries = getCountries();
  const categories = getCategories();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [travelers, setTravelers] = useState(2);

  return (
    <section className="relative -mt-16 z-10 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-[1440px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="glass-card rounded-3xl p-4 shadow-premium-lg sm:p-5"
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {/* Destination */}
            <div className="flex items-center gap-2.5 rounded-xl bg-background/60 px-3 py-2.5 ring-1 ring-border/60 backdrop-blur-md transition-shadow hover:ring-primary/30">
              <MapPin className="size-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Destination</span>
                <Select>
                  <SelectTrigger className="h-5 border-0 bg-transparent p-0 text-sm shadow-none focus:ring-0">
                    <SelectValue placeholder="Where to?" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-center gap-2.5 rounded-xl bg-background/60 px-3 py-2.5 ring-1 ring-border/60 backdrop-blur-md transition-shadow hover:ring-primary/30">
              <Search className="size-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Category</span>
                <Select>
                  <SelectTrigger className="h-5 border-0 bg-transparent p-0 text-sm shadow-none focus:ring-0">
                    <SelectValue placeholder="Adventure, Beach..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-2.5 rounded-xl bg-background/60 px-3 py-2.5 ring-1 ring-border/60 backdrop-blur-md transition-shadow hover:ring-primary/30">
              <Calendar className="size-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Dates</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex h-5 w-full items-center text-sm text-muted-foreground hover:text-foreground">
                      {dateRange?.from ? (
                        dateRange.to ? <span className="truncate">{format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}</span> : <span className="truncate">{format(dateRange.from, "MMM d")}</span>
                      ) : <span>Add dates</span>}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={1} disabled={{ before: new Date() }} />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Travelers */}
            <div className="flex items-center gap-2.5 rounded-xl bg-background/60 px-3 py-2.5 ring-1 ring-border/60 backdrop-blur-md transition-shadow hover:ring-primary/30">
              <Users className="size-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">Travelers</span>
                <Select value={String(travelers)} onValueChange={(v) => setTravelers(Number(v))}>
                  <SelectTrigger className="h-5 border-0 bg-transparent p-0 text-sm shadow-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "traveler" : "travelers"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Search button */}
            <Button onClick={() => setCommandOpen(true)} className="h-full gap-2 rounded-xl bg-gradient-bluesky py-2.5 font-bold shadow-glow-bluesky">
              <Search className="size-4" /> Search
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
