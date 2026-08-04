"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Clock, Star, ArrowRight, Users } from "lucide-react";
import Image from "next/image";
import type { Trip } from "@/types";
import { cn, formatPrice, formatTripDuration, discountPct } from "@/lib/utils";
import { StarRating } from "@/components/common/StarRating";
import { DiscountBadge } from "@/components/common/DiscountBadge";
import { useWishlist } from "@/stores/use-wishlist";
import { useUI } from "@/stores/use-ui";
import { countryName, cityName } from "@/data";

interface TripCardProps {
  trip: Trip;
  className?: string;
  onBook?: (trip: Trip) => void;
  onView?: (trip: Trip) => void;
}

export function TripCard({ trip, className, onBook, onView }: TripCardProps) {
  const { toggle, has } = useWishlist();
  const isWishlisted = has(trip.id);
  const openBooking = useUI((s) => s.openBooking);
  const setTripDetailId = useUI((s) => s.setTripDetailId);

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBook) onBook(trip);
    else openBooking(trip.id);
  };
  const handleView = () => {
    if (onView) onView(trip);
    else setTripDetailId(trip.id);
  };

  const pct = discountPct(trip.price, trip.oldPrice);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      onClick={handleView}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium transition-shadow hover:shadow-premium-lg",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={trip.imageUrl}
          alt={trip.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          {pct > 0 && <DiscountBadge pct={pct} />}
          {trip.featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/95 px-2.5 py-1 text-xs font-bold text-amber-950 shadow-sm">
              <Star className="size-3 fill-amber-950" /> Featured
            </span>
          )}
        </div>

        <button
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.stopPropagation();
            toggle({ trip });
          }}
          className={cn(
            "absolute right-3 top-3 grid size-9 place-items-center rounded-full backdrop-blur-md transition-all",
            isWishlisted
              ? "bg-rose-500/90 text-white shadow-glow-bluesky"
              : "bg-white/70 text-foreground hover:bg-white",
          )}
        >
          <Heart className={cn("size-4", isWishlisted && "fill-current")} />
        </button>

        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            <MapPin className="size-3" />
            {countryName(trip.countryId)}
            {trip.cityId && <span className="text-white/70">· {cityName(trip.cityId)}</span>}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            <Clock className="size-3" />
            {formatTripDuration(trip.durationDays)}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground group-hover:text-primary">
            {trip.title}
          </h3>
        </div>
        <p className="line-clamp-2 text-sm text-muted-foreground">{trip.summary}</p>

        <div className="mt-1 flex items-center gap-2">
          <StarRating rating={trip.rating} showValue reviewCount={trip.reviewCount} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          <div className="flex flex-col">
            <span className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
              From
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground">
                {formatPrice(trip.price, trip.currency)}
              </span>
              {trip.oldPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(trip.oldPrice, trip.currency)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleBook}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-bluesky transition-transform hover:scale-[1.03] active:scale-95"
          >
            Book Now
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Users className="size-3.5" /> Max {trip.maxTravelers} travelers
          </span>
          {trip.visaRequired && <span className="font-medium text-amber-600">Visa required</span>}
        </div>
      </div>
    </motion.article>
  );
}
