"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Search, MapPin, Calendar, Users, ChevronDown, Star,
  Plane, ShieldCheck, Sparkles, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { useUI } from "@/stores/use-ui";
import { getCountries, getCategories, getPlatformStats } from "@/services";
import { StatsCounter } from "@/components/common/StatsCounter";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";

const TABS = [
  { id: "trips", label: "Trips", icon: Plane },
  { id: "hotels", label: "Hotels", icon: MapPin },
  { id: "flights", label: "Flights", icon: Plane },
  { id: "visa", label: "Visa", icon: ShieldCheck },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function Hero() {
  const [tab, setTab] = useState<TabId>("trips");
  const [destination, setDestination] = useState<string>();
  const [category, setCategory] = useState<string>();
  const [travelers, setTravelers] = useState(2);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const setCommandOpen = useUI((s) => s.setCommandOpen);
  const countries = getCountries();
  const categories = getCategories();
  const stats = getPlatformStats();

  const handleSearch = () => setCommandOpen(true);

  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100svh-5rem)] flex-col"
    >
      {/* Cinematic full-bleed background */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="https://picsum.photos/seed/boundless-hero-cinematic/1920/1280"
          alt="Discover the world with BOUNDLESS"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-slate-950/30 to-slate-950/80" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-accent/15 mix-blend-overlay" />
      </div>

      {/* Floating blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 top-32 size-72 rounded-full bg-accent/20 blur-3xl animate-float-y" />
        <div className="absolute right-0 top-1/3 size-96 rounded-full bg-primary/20 blur-3xl animate-float-y [animation-delay:1.5s]" />
      </div>

      {/* Centered content */}
      <div className="container mx-auto flex w-full max-w-[1440px] flex-1 flex-col items-center justify-center px-4 pb-16 pt-12 text-center sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md ring-1 ring-white/20"
        >
          <Sparkles className="size-3.5 text-accent" />
          <span>Ranked #1 Travel Platform 2026</span>
          <span className="mx-1 h-3 w-px bg-white/30" />
          <Star className="size-3.5 fill-amber-400 text-amber-400" />
          <span>4.9 / 5</span>
        </motion.div>

        {/* Headline — editorial style, centered */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 max-w-4xl text-balance text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
        >
          Discover the world
          <br />
          <span className="bg-gradient-to-r from-accent via-white to-secondary bg-clip-text text-transparent">
            with BOUNDLESS
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
        >
          From the timeless pyramids of Egypt to overwater villas in the Maldives —
          book handcrafted trips, luxury hotels, flights and visa services in one
          beautiful place.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3"
        >
          <Button
            size="lg"
            onClick={() => {
              document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" });
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
            <Plane className="size-4 fill-current" />
            Watch Story
          </Button>
        </motion.div>

        {/* Search widget — glass card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-10 w-full max-w-3xl"
        >
          <div className="glass-card rounded-2xl p-2 shadow-premium-lg sm:rounded-3xl">
            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto px-1 pb-1 pt-1 no-scrollbar">
              {TABS.map((t) => {
                const Icon = t.icon;
                const isActive = tab === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`relative inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
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
              <SearchField icon={MapPin} label="Destination">
                <Select value={destination} onValueChange={setDestination}>
                  <SelectTrigger className="h-9 border-0 bg-transparent px-0 text-sm shadow-none focus:ring-0">
                    <SelectValue placeholder="Where to?" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SearchField>

              <SearchField icon={Plane} label="Trip Type">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-9 border-0 bg-transparent px-0 text-sm shadow-none focus:ring-0">
                    <SelectValue placeholder="Adventure, Beach..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SearchField>

              <SearchField icon={Calendar} label="Dates">
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex h-9 w-full items-center text-sm text-muted-foreground hover:text-foreground">
                      {dateRange?.from ? (
                        dateRange.to ? (
                          <span className="truncate">{format(dateRange.from, "MMM d")} - {format(dateRange.to, "MMM d")}</span>
                        ) : (
                          <span className="truncate">{format(dateRange.from, "MMM d, yyyy")}</span>
                        )
                      ) : <span>Add dates</span>}
                      <ChevronDown className="ml-auto size-3.5 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarPicker mode="range" selected={dateRange} onSelect={setDateRange} numberOfMonths={1} disabled={{ before: new Date() }} />
                  </PopoverContent>
                </Popover>
              </SearchField>

              <SearchField icon={Users} label="Travelers">
                <Select value={String(travelers)} onValueChange={(v) => setTravelers(Number(v))}>
                  <SelectTrigger className="h-9 border-0 bg-transparent px-0 text-sm shadow-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "traveler" : "travelers"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </SearchField>

              <Button onClick={handleSearch} size="lg" className="h-auto bg-gradient-bluesky px-5 py-3 text-base font-bold shadow-glow-bluesky sm:col-span-2 lg:col-span-1">
                <Search className="size-5" />
                Search
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quick links */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-1">
          <span className="text-xs font-medium text-white/60">Trending:</span>
          {["Maldives", "Cappadocia", "Nile Cruise", "Santorini", "Safari Kenya"].map((q) => (
            <button key={q} onClick={() => setCommandOpen(true)}
              className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/15 backdrop-blur-md transition-colors hover:bg-white/20">
              {q}
            </button>
          ))}
        </div>

        {/* Floating stats — centered below search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 hidden max-w-xl grid-cols-3 gap-4 border-t border-white/15 pt-6 lg:grid"
        >
          <StatsCounter value={stats.destinations} label="Destinations" suffix="+" />
          <StatsCounter value={stats.happyTravelers} label="Happy Travelers" suffix="+" />
          <StatsCounter value={stats.averageRating} label="Average Rating" suffix="★" decimals={1} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <span className="text-[0.65rem] font-medium uppercase tracking-wider text-white/60">Scroll</span>
        <div className="flex h-8 w-5 items-start justify-center rounded-full border-2 border-white/30 p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="size-1 rounded-full bg-white/70"
          />
        </div>
      </motion.div>
    </section>
  );
}

function SearchField({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-background/60 px-3 py-2 ring-1 ring-border/60 backdrop-blur-md transition-shadow hover:ring-primary/30 focus-within:ring-primary/40">
      <Icon className="size-4 shrink-0 text-primary" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
