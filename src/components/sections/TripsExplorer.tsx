"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, MapPin, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SectionTitle } from "@/components/common/SectionTitle";
import { TripCard } from "@/components/cards/TripCard";
import { Reveal } from "@/components/common/Reveal";
import { getDomesticTrips, getInternationalTrips, getCities } from "@/services";
import { useUI } from "@/stores/use-ui";
import { cn } from "@/lib/utils";
import type { TripType } from "@/types";

interface TripsExplorerProps {
  id: string;
  type: TripType;
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}

export function TripsExplorer({ id, type, eyebrow, title, description }: TripsExplorerProps) {
  const allTrips = useMemo(() => getDomesticTrips().concat(getInternationalTrips()).filter((t) => t.type === type), [type]);
  const cities = useMemo(() => getCities().filter((c) => allTrips.some((t) => t.cityId === c.id)), [allTrips]);

  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3500]);
  const [maxPriceBound] = useState(3500);
  const [minRating, setMinRating] = useState(0);
  const [maxDuration, setMaxDuration] = useState(14);
  const [showFilters, setShowFilters] = useState(false);

  const openBooking = useUI((s) => s.openBooking);

  const filtered = useMemo(() => {
    return allTrips.filter((t) => {
      if (selectedCities.length && !selectedCities.includes(t.cityId ?? "")) return false;
      if (t.price < priceRange[0] || t.price > priceRange[1]) return false;
      if (t.rating < minRating) return false;
      if (t.durationDays > maxDuration) return false;
      return true;
    });
  }, [allTrips, selectedCities, priceRange, minRating, maxDuration]);

  const toggleCity = (cityId: string) =>
    setSelectedCities((prev) => (prev.includes(cityId) ? prev.filter((c) => c !== cityId) : [...prev, cityId]));

  const reset = () => {
    setSelectedCities([]);
    setPriceRange([0, maxPriceBound]);
    setMinRating(0);
    setMaxDuration(14);
  };

  const activeCount =
    selectedCities.length +
    (priceRange[0] !== 0 || priceRange[1] !== maxPriceBound ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (maxDuration < 14 ? 1 : 0);

  return (
    <section id={id} className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow={eyebrow} title={title} description={description} />

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* Filters sidebar */}
          <aside className="lg:col-span-3">
            <div className="lg:sticky lg:top-28">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-base font-bold text-foreground">
                  <SlidersHorizontal className="size-4 text-primary" />
                  Filters
                  {activeCount > 0 && (
                    <Badge className="ml-1 bg-primary text-primary-foreground">{activeCount}</Badge>
                  )}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden"
                    aria-label="Toggle filters"
                  >
                    <SlidersHorizontal className="size-4" />
                  </button>
                  {activeCount > 0 && (
                    <button onClick={reset} className="text-xs font-medium text-primary hover:underline">
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className={cn("mt-4 space-y-5 rounded-2xl border border-border/60 bg-card p-5 shadow-premium", !showFilters && "hidden lg:block")}>
                {/* City */}
                <div>
                  <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <MapPin className="size-3.5" /> City
                  </h4>
                  <div className="max-h-48 space-y-2 overflow-y-auto pr-1">
                    {cities.map((c) => (
                      <div key={c.id} className="flex items-center gap-2">
                        <Checkbox
                          id={`city-${c.id}`}
                          checked={selectedCities.includes(c.id)}
                          onCheckedChange={() => toggleCity(c.id)}
                        />
                        <Label htmlFor={`city-${c.id}`} className="text-sm font-medium text-foreground">
                          {c.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Price Range
                  </h4>
                  <div className="px-1">
                    <Slider
                      value={priceRange}
                      onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
                      min={0}
                      max={maxPriceBound}
                      step={50}
                      className="my-2"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}{priceRange[1] === maxPriceBound ? "+" : ""}</span>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Max Duration
                  </h4>
                  <div className="px-1">
                    <Slider
                      value={[maxDuration]}
                      onValueChange={(v) => setMaxDuration(v[0])}
                      min={2}
                      max={14}
                      step={1}
                      className="my-2"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>2 days</span>
                      <span>{maxDuration} days</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h4 className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    <Star className="size-3.5" /> Min Rating
                  </h4>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[0, 3, 4, 4.5].map((r) => (
                      <button
                        key={r}
                        onClick={() => setMinRating(r)}
                        className={cn(
                          "rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors",
                          minRating === r
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {r === 0 ? "Any" : `${r}+`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results grid */}
          <div className="lg:col-span-9">
            <div className="mb-5 flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{filtered.length}</span> trips found
              </p>
              <div className="flex items-center gap-2">
                {selectedCities.map((cityId) => {
                  const c = cities.find((c) => c.id === cityId);
                  if (!c) return null;
                  return (
                    <Badge key={cityId} variant="secondary" className="gap-1">
                      {c.name}
                      <button onClick={() => toggleCity(cityId)} aria-label="Remove filter">
                        <X className="size-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {filtered.length > 0 ? (
                <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((trip, i) => (
                    <motion.div
                      key={trip.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                    >
                      <TripCard trip={trip} onBook={(t) => openBooking(t.id)} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card py-20 text-center"
                >
                  <div className="grid size-16 place-items-center rounded-full bg-muted">
                    <SlidersHorizontal className="size-7 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">No trips match your filters</h4>
                    <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or expanding your search.</p>
                  </div>
                  <Button variant="outline" onClick={reset}>
                    Reset filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
