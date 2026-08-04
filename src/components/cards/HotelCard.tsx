"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Wifi, Waves, Sparkles } from "lucide-react";
import Image from "next/image";
import type { Hotel } from "@/types";
import { cn, formatPrice, starCount } from "@/lib/utils";
import { StarRating } from "@/components/common/StarRating";
import { cityName } from "@/data";
import { useWishlist } from "@/stores/use-wishlist";
import { useUI } from "@/stores/use-ui";
import { Heart } from "lucide-react";

interface HotelCardProps {
  hotel: Hotel;
  className?: string;
  onView?: (hotel: Hotel) => void;
}

export function HotelCard({ hotel, className, onView }: HotelCardProps) {
  const { toggle, has } = useWishlist();
  const setHotelId = useUI((s) => s.setHotelId);
  const isWishlisted = has(hotel.id);
  const { full, empty } = starCount(hotel.stars);

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      onClick={() => { if (onView) onView(hotel); else setHotelId(hotel.id); }}
      className={cn(
        "group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium transition-shadow hover:shadow-premium-lg",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={hotel.imageUrl}
          alt={hotel.name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

        <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2.5 py-1 text-xs font-bold text-amber-500 backdrop-blur-md">
          {Array.from({ length: full }).map((_, i) => (
            <Star key={i} className="size-3 fill-amber-400 text-amber-400" />
          ))}
          {Array.from({ length: empty }).map((_, i) => (
            <Star key={`e-${i}`} className="size-3 text-amber-400/30" />
          ))}
        </div>

        <button
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.stopPropagation();
            toggle({ hotel });
          }}
          className={cn(
            "absolute right-3 top-3 grid size-9 place-items-center rounded-full backdrop-blur-md transition-all",
            isWishlisted ? "bg-rose-500/90 text-white" : "bg-white/70 hover:bg-white",
          )}
        >
          <Heart className={cn("size-4", isWishlisted && "fill-current")} />
        </button>

        <div className="absolute inset-x-3 bottom-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
          <MapPin className="size-3" /> {cityName(hotel.cityId)}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <h3 className="line-clamp-1 text-base font-bold text-foreground group-hover:text-primary">
          {hotel.name}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{hotel.description}</p>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          <span className="line-clamp-1">{hotel.facilities.slice(0, 3).join(" · ")}</span>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-3">
          <StarRating rating={hotel.rating} showValue reviewCount={hotel.reviewCount} />
          <div className="flex flex-col items-end">
            <span className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
              From / night
            </span>
            <span className="text-lg font-bold text-foreground">
              {formatPrice(hotel.pricePerNight, hotel.currency)}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
