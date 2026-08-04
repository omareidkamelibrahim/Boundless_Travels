"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Reveal } from "@/components/common/Reveal";
import { StarRating } from "@/components/common/StarRating";
import { formatPrice, formatTripDuration, discountPct } from "@/lib/utils";
import { getFeaturedTrips } from "@/services";
import { useUI } from "@/stores/use-ui";
import { useWishlist } from "@/stores/use-wishlist";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { countryName } from "@/data";

export function PopularTourPackages() {
  const trips = getFeaturedTrips(6);
  const openBooking = useUI((s) => s.openBooking);
  const setTripDetailId = useUI((s) => s.setTripDetailId);
  const { toggle, has } = useWishlist();

  return (
    <section id="packages" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 size-80 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 size-80 rounded-full bg-accent/8 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Most popular"
          title={<>Popular <span className="text-gradient-bluesky">tour packages</span></>}
          description="Handpicked journeys loved by thousands of travelers worldwide."
          action={
            <Button variant="outline" className="rounded-xl">
              View All Packages
              <ArrowRight className="size-4" />
            </Button>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {trips.map((trip, i) => {
            const pct = discountPct(trip.price, trip.oldPrice);
            const isWishlisted = has(trip.id);
            return (
              <Reveal key={trip.id} delay={i * 0.05} as="div">
                <motion.article
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  onClick={() => setTripDetailId(trip.id)}
                  className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium transition-shadow hover:shadow-premium-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={trip.imageUrl}
                      alt={trip.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    {pct > 0 && (
                      <span className="inline-flex items-center rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white">
                        -{pct}%
                      </span>
                    )}
                    {trip.featured && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950">
                        ★ Featured
                      </span>
                    )}
                  </div>

                  <button
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(e) => { e.stopPropagation(); toggle({ trip }); }}
                    className={cn(
                      "absolute right-3 top-3 grid size-9 place-items-center rounded-full backdrop-blur-md transition-all",
                      isWishlisted ? "bg-rose-500/90 text-white" : "bg-white/70 text-foreground hover:bg-white",
                    )}
                  >
                    <Heart className={cn("size-4", isWishlisted && "fill-current")} />
                  </button>

                  <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                      📍 {countryName(trip.countryId)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
                      🕐 {formatTripDuration(trip.durationDays)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground group-hover:text-primary">
                    {trip.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{trip.summary}</p>
                  <StarRating rating={trip.rating} showValue reviewCount={trip.reviewCount} />

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5">
                    {trip.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-muted/60 px-2 py-0.5 text-[0.65rem] font-medium text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-3">
                    <div className="flex flex-col">
                      <span className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">From</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-foreground">{formatPrice(trip.price, trip.currency)}</span>
                        {trip.oldPrice && (
                          <span className="text-sm text-muted-foreground line-through">{formatPrice(trip.oldPrice, trip.currency)}</span>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); openBooking(trip.id); }}
                      className="bg-gradient-bluesky shadow-glow-bluesky"
                    >
                      Book Now
                      <ArrowRight className="size-3.5" />
                    </Button>
                  </div>
                </div>
                </motion.article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
