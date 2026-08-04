"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Plane,
  Hotel,
  Stamp,
  Sparkles,
  ChevronDown,
  Play,
  Star,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useUI } from "@/stores/use-ui";
import { getCountries, getCategories } from "@/services";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { StatsCounter } from "@/components/common/StatsCounter";
import { getPlatformStats } from "@/services";

const TABS = [
  { id: "trips", label: "Trips", icon: Plane },
  { id: "hotels", label: "Hotels", icon: Hotel },
  { id: "flights", label: "Flights", icon: Plane },
  { id: "visa", label: "Visa", icon: Stamp },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Hero() {
  const [tab, setTab] = useState<TabId>("trips");
  const [destination, setDestination] = useState<string>();
  const [country, setCountry] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [travelers, setTravelers] = useState(2);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const openBooking = useUI((s) => s.openBooking);
  const setCommandOpen = useUI((s) => s.setCommandOpen);
  const countries = getCountries();
  const categories = getCategories();
  const stats = getPlatformStats();

  const handleSearch = () => {
    setCommandOpen(true);
  };

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://picsum.photos/seed/bluesky-hero-santorini/1920/1280"
          alt="Travel inspiration — discover the world"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/30 to-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-transparent to-accent/25 mix-blend-overlay" />
      </div>

      {/* Floating blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-32 size-72 rounded-full bg-accent/30 blur-3xl animate-float-y" />
        <div className="absolute right-0 top-1/3 size-96 rounded-full bg-primary/25 blur-3xl animate-float-y [animation-delay:1.5s]" />
      </div>

      <div className="container mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center px-4 pb-10 pt-32 sm:px-6 sm:pt-36 lg:px-8 lg:pt-40">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md ring-1 ring-white/30"
            >
              <Sparkles className="size-3.5 text-accent" />
              <span>Ranked #1 Travel Platform 2026</span>
              <span className="mx-1 h-3 w-px bg-white/30" />
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span>4.9 / 5</span>
            </motion.div>

            <h1 className="mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
              Discover the world
              <br />
              <span className="bg-gradient-to-r from-accent via-white to-secondary bg-clip-text text-transparent">
                with BlueSky Travel
              </span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
              From the timeless pyramids of Egypt to overwater villas in the Maldives —
              book handcrafted trips, luxury hotels, flights and visa services in one
              beautiful place.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                onClick={() => {
                  document.getElementById("featured-trips")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-white text-base font-bold text-primary shadow-premium-lg hover:bg-white/90 hover:scale-[1.02]"
              >
                <Search className="size-4.5" />
                Explore Trips
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
              >
                <Play className="size-4 fill-current" />
                Watch Story
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/15 pt-6">
              <StatsCounter value={stats.destinations} label="Destinations" suffix="+" />
              <StatsCounter value={stats.happyTravelers} label="Happy Travelers" suffix="+" />
              <StatsCounter value={stats.averageRating} label="Average Rating" suffix="★" decimals={1} />
            </div>
          </motion.div>

          {/* Right floating glass preview card */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:col-span-5 lg:block"
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative aspect-[4/5] overflow-hidden rounded-3xl border-4 border-white/40 shadow-premium-lg"
              >
                <Image
                  src="https://picsum.photos/seed/bluesky-maldives-villa/900/1200"
                  alt="Maldives overwater villa"
                  fill
                  sizes="(max-width: 1024px) 0vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4">
                  <div className="flex items-center gap-1.5">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-1 text-xs font-semibold text-white">4.9</span>
                  </div>
                  <h3 className="mt-1 text-lg font-bold text-white">Maldives Overwater Villa</h3>
                  <p className="text-xs text-white/80">6 days · from $2,890</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -left-8 top-1/4 w-fit rounded-2xl glass p-3 shadow-premium"
              >
                <div className="flex items-center gap-2">
                  <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/15">
                    <ShieldCheck className="size-4 text-emerald-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Secure Booking</span>
                    <span className="text-[0.65rem] text-muted-foreground">100% protection</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -right-6 bottom-1/4 w-fit rounded-2xl glass p-3 shadow-premium"
              >
                <div className="flex items-center gap-2">
                  <div className="grid size-9 place-items-center rounded-xl bg-gradient-bluesky text-white">
                    <Plane className="size-4 -rotate-45" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">48,250+</span>
                    <span className="text-[0.65rem] text-muted-foreground">Trips booked</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-12 w-full"
        >
          <div className="glass-card rounded-3xl p-2 shadow-premium-lg sm:p-3">
            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto px-1 pb-2 pt-1 no-scrollbar">
              {TABS.map((t) => {
                const Icon = t.icon;
                const isActive = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cn(
                      "relative inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="size-4" />
                    {t.label}
                    {isActive && (
                      <motion.span
                        layoutId="search-tab"
                        className="absolute inset-0 -z-10 rounded-xl bg-primary/10 ring-1 ring-primary/20"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 gap-2 p-1 sm:grid-cols-2 lg:grid-cols-5">
              {/* Destination */}
              <SearchField
                icon={MapPin}
                label="Destination"
              >
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger className="h-9 border-0 bg-transparent px-0 text-sm shadow-none focus:ring-0">
                    <SelectValue placeholder="Where to?" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SearchField>

              {/* Country / Trip Type */}
              <SearchField icon={Plane} label="Trip Type">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-9 border-0 bg-transparent px-0 text-sm shadow-none focus:ring-0">
                    <SelectValue placeholder="Adventure, Beach..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SearchField>

              {/* Date range */}
              <SearchField icon={Calendar} label="Dates">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex h-9 w-full items-center text-sm text-muted-foreground hover:text-foreground">
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
                      <ChevronDown className="ml-auto size-3.5 opacity-50" />
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
              </SearchField>

              {/* Travelers */}
              <SearchField icon={Users} label="Travelers">
                <Select
                  value={String(travelers)}
                  onValueChange={(v) => setTravelers(Number(v))}
                >
                  <SelectTrigger className="h-9 border-0 bg-transparent px-0 text-sm shadow-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? "traveler" : "travelers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SearchField>

              {/* Submit */}
              <Button
                onClick={handleSearch}
                size="lg"
                className="h-auto bg-gradient-bluesky px-5 py-3 text-base font-bold shadow-glow-bluesky sm:col-span-2 lg:col-span-1"
              >
                <Search className="size-5" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs font-medium text-white/70">Trending:</span>
            {["Maldives", "Cappadocia", "Nile Cruise", "Santorini", "Safari Kenya"].map((q) => (
              <button
                key={q}
                onClick={() => setCommandOpen(true)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/20"
              >
                {q}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SearchField({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-background/60 px-3 py-2 ring-1 ring-border/60 backdrop-blur-md transition-shadow hover:ring-primary/30 focus-within:ring-primary/40">
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
