"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/common/SectionTitle";
import { TripCard } from "@/components/cards/TripCard";
import { Reveal } from "@/components/common/Reveal";
import { getDomesticTrips, getInternationalTrips, getFeaturedTrips } from "@/services";
import { cn } from "@/lib/utils";
import { useUI } from "@/stores/use-ui";

const FILTERS = [
  { id: "featured", label: "Featured" },
  { id: "domestic", label: "Domestic" },
  { id: "international", label: "International" },
] as const;

type Filter = (typeof FILTERS)[number]["id"];

export function FeaturedTrips({ id = "featured-trips" }: { id?: string }) {
  const [filter, setFilter] = useState<Filter>("featured");
  const openBooking = useUI((s) => s.openBooking);

  const trips =
    filter === "featured"
      ? getFeaturedTrips(6)
      : filter === "domestic"
        ? getDomesticTrips(6)
        : getInternationalTrips(6);

  return (
    <section id={id} className="relative py-16 sm:py-20 lg:py-24">
      {/* Subtle backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-1/3 mx-auto h-96 max-w-5xl rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Curated picks"
          title={
            <>
              Featured <span className="text-gradient-bluesky">trips</span> you'll love
            </>
          }
          description="From weekend escapes to luxury honeymoons — explore our most-loved itineraries."
          action={
            <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={cn(
                    "relative rounded-lg px-3.5 py-1.5 text-sm font-semibold transition-colors",
                    filter === f.id
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {filter === f.id && (
                    <motion.span
                      layoutId="featured-filter"
                      className="absolute inset-0 -z-10 rounded-lg bg-gradient-bluesky shadow-glow-bluesky"
                    />
                  )}
                  {f.label}
                </button>
              ))}
            </div>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {trips.map((trip, i) => (
              <motion.div
                key={trip.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <TripCard trip={trip} onBook={(t) => openBooking(t.id)} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl px-6 py-4 text-base font-semibold"
            onClick={() => {
              const next = document.getElementById(filter === "domestic" ? "domestic-trips" : filter === "international" ? "international-trips" : "destinations");
              next?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <Sparkles className="size-4 text-primary" />
            See more trips
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
