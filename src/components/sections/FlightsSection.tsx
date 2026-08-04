"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plane,
  ArrowRight,
  ArrowLeftRight,
  Calendar,
  Users,
  Search,
  Star,
  Clock,
  Briefcase,
  PlaneTakeoff,
  PlaneLanding,
} from "lucide-react";
import { cn, formatDuration, formatPrice, formatDate, formatTimeUtc } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Reveal } from "@/components/common/Reveal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getFlights, getCities } from "@/services";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import type { CabinClass } from "@/types";

type TripType = "roundtrip" | "oneway" | "multicity";

const TRIP_TYPES: { id: TripType; label: string }[] = [
  { id: "roundtrip", label: "Round Trip" },
  { id: "oneway", label: "One Way" },
  { id: "multicity", label: "Multi City" },
];

const CABIN_CLASSES: { id: CabinClass; label: string }[] = [
  { id: "economy", label: "Economy" },
  { id: "premium", label: "Premium" },
  { id: "business", label: "Business" },
  { id: "first", label: "First" },
];

export function FlightsSection() {
  const cities = getCities().map((c) => c.name).slice(0, 12);
  const [tripType, setTripType] = useState<TripType>("roundtrip");
  const [origin, setOrigin] = useState<string>("Cairo");
  const [destination, setDestination] = useState<string>("Dubai");
  const [cabin, setCabin] = useState<CabinClass>("economy");
  const [travelers, setTravelers] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [results, setResults] = useState(getFlights().slice(0, 4));

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setResults(
      getFlights().filter(
        (f) =>
          f.originCity === origin &&
          f.destinationCity === destination &&
          f.cabinClass === cabin,
      ),
    );
  };

  return (
    <section id="flights" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/3 size-80 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/3 size-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Fly anywhere"
          align="center"
          title={
            <>
              Find the perfect <span className="text-gradient-bluesky">flight</span>
            </>
          }
          description="Compare hundreds of airlines and book with confidence — best fares guaranteed."
        />

        <Reveal as="div">
          <div className="mx-auto mt-10 max-w-5xl rounded-3xl glass-card p-5 shadow-premium-lg sm:p-7">
            {/* Trip type toggle */}
            <div className="flex flex-wrap items-center gap-1.5">
              {TRIP_TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTripType(t.id)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                    tripType === t.id
                      ? "bg-primary text-primary-foreground shadow-glow-bluesky"
                      : "text-muted-foreground hover:bg-accent",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Search form */}
            <form onSubmit={handleSearch} className="mt-4 grid gap-3 lg:grid-cols-12">
              <div className="grid gap-3 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-[1fr_auto_1fr]">
                <FlightField icon={PlaneTakeoff} label="From">
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger className="h-9 border-0 bg-transparent px-0 shadow-none focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FlightField>

                <button
                  type="button"
                  onClick={handleSwap}
                  aria-label="Swap origin and destination"
                  className="mx-auto my-1 grid size-9 place-items-center self-end rounded-full border border-border/60 bg-card text-primary shadow-sm transition-transform hover:rotate-180 sm:mx-1"
                >
                  <ArrowLeftRight className="size-4" />
                </button>

                <FlightField icon={PlaneLanding} label="To">
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger className="h-9 border-0 bg-transparent px-0 shadow-none focus:ring-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FlightField>
              </div>

              <FlightField icon={Calendar} label="Dates" className="lg:col-span-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className="flex h-9 w-full items-center text-sm text-muted-foreground hover:text-foreground">
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <span className="truncate">
                            {format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}
                          </span>
                        ) : (
                          <span className="truncate">{format(dateRange.from, "MMM d, yyyy")}</span>
                        )
                      ) : (
                        <span>Add dates</span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={1}
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </FlightField>

              <FlightField icon={Users} label="Travelers & class" className="lg:col-span-2">
                <Select
                  value={`${travelers}-${cabin}`}
                  onValueChange={(v) => {
                    const [t, c] = v.split("-");
                    setTravelers(Number(t));
                    setCabin(c as CabinClass);
                  }}
                >
                  <SelectTrigger className="h-9 border-0 bg-transparent px-0 shadow-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CABIN_CLASSES.map((c) =>
                      [1, 2, 3, 4].map((n) => (
                        <SelectItem key={`${n}-${c.id}`} value={`${n}-${c.id}`}>
                          {n} {n === 1 ? "traveler" : "travelers"} · {c.label}
                        </SelectItem>
                      )),
                    )}
                  </SelectContent>
                </Select>
              </FlightField>

              <Button
                type="submit"
                size="lg"
                className="lg:col-span-12 bg-gradient-bluesky shadow-glow-bluesky"
              >
                <Search className="size-4" />
                Search Flights
              </Button>
            </form>
          </div>
        </Reveal>

        {/* Results */}
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {results.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="col-span-full rounded-2xl border border-dashed border-border bg-card py-16 text-center"
              >
                <Plane className="mx-auto size-8 text-muted-foreground" />
                <p className="mt-3 text-sm font-medium text-muted-foreground">
                  No flights found for {origin} → {destination}. Try another route.
                </p>
              </motion.div>
            ) : (
              results.map((flight, i) => (
                <motion.div
                  key={flight.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-premium transition-shadow hover:shadow-premium-lg sm:p-5"
                >
                  <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/20">
                    <Plane className="size-5 -rotate-45" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-bold text-foreground">{flight.airline}</p>
                        <p className="text-xs text-muted-foreground">{flight.flightNumber} · {flight.cabinClass}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          {formatPrice(flight.price, flight.currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">per traveler</p>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-bold text-foreground">{formatTimeUtc(flight.departureAt)}</span>
                      <span>{flight.originCity}</span>
                      <div className="flex-1 border-t border-dashed border-border" />
                      <Clock className="size-3" />
                      <span>{formatDuration(flight.durationMins)}</span>
                      <div className="flex-1 border-t border-dashed border-border" />
                      <span>{flight.destinationCity}</span>
                      <span className="font-bold text-foreground">{formatTimeUtc(flight.arrivalAt)}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {flight.stops === 0 ? (
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                          Non-stop
                        </Badge>
                      ) : (
                        <Badge variant="secondary">{flight.stops} stop{flight.stops > 1 ? "s" : ""}</Badge>
                      )}
                      <Badge variant="outline" className="gap-1">
                        <Briefcase className="size-3" />
                        {flight.baggage}
                      </Badge>
                      {flight.seatsLeft <= 6 && (
                        <span className="text-xs font-semibold text-amber-600">
                          Only {flight.seatsLeft} seats left
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function FlightField({
  icon: Icon,
  label,
  className,
  children,
}: {
  icon: React.ElementType;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-center gap-2.5 rounded-xl bg-background/60 px-3 py-2 ring-1 ring-border/60 backdrop-blur-md", className)}>
      <Icon className="size-4 shrink-0 text-primary" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
