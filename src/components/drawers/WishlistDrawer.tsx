"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Heart,
  X,
  Trash2,
  ArrowRight,
  MapPin,
  Star,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUI } from "@/stores/use-ui";
import { useWishlist } from "@/stores/use-wishlist";
import { useBooking } from "@/stores/use-booking";
import { findCountry, findCity } from "@/services";
import { formatPrice, formatTripDuration } from "@/lib/utils";
import { StarRating } from "@/components/common/StarRating";
import { cn } from "@/lib/utils";

export function WishlistDrawer() {
  const { wishlistOpen, setWishlistOpen } = useUI();
  const { items, remove, clear } = useWishlist();
  const openBooking = useBooking((s) => s.open);

  return (
    <Sheet open={wishlistOpen} onOpenChange={setWishlistOpen}>
      <SheetContent className="w-full border-l-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 bg-gradient-bluesky-soft p-5">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <div className="grid size-9 place-items-center rounded-xl bg-rose-500 text-white">
              <Heart className="size-4 fill-current" />
            </div>
            <div>
              <span className="block">Your Wishlist</span>
              <span className="text-xs font-normal text-muted-foreground">
                {items.length} saved {items.length === 1 ? "item" : "items"}
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex max-h-[calc(100vh-180px)] flex-col gap-3 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="grid size-20 place-items-center rounded-full bg-muted">
                <Heart className="size-9 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Your wishlist is empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Save trips and hotels you love to find them here later.
                </p>
              </div>
              <Button onClick={() => setWishlistOpen(false)} variant="outline" className="rounded-xl">
                Browse trips
              </Button>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const trip = item.trip;
                const hotel = item.hotel;
                const name = trip?.title ?? hotel?.name ?? "";
                const image = trip?.imageUrl ?? hotel?.imageUrl ?? "";
                const price = trip?.price ?? hotel?.pricePerNight ?? 0;
                const currency = trip?.currency ?? hotel?.currency ?? "USD";
                const country = trip ? findCountry(trip.countryId) : undefined;
                const city = trip ? findCity(trip.cityId) : (hotel ? findCity(hotel.cityId) : undefined);
                const rating = trip?.rating ?? hotel?.rating ?? 0;
                const reviewCount = trip?.reviewCount ?? hotel?.reviewCount ?? 0;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="group flex gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm transition-shadow hover:shadow-premium"
                  >
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                      <Image src={image} alt={name} fill sizes="80px" className="object-cover" />
                      <button
                        onClick={() => remove(item.id)}
                        aria-label="Remove"
                        className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/50 text-white opacity-0 transition-opacity backdrop-blur-md group-hover:opacity-100"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="line-clamp-2 text-sm font-bold text-foreground">{name}</h4>
                        <button
                          onClick={() => remove(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Remove"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3 text-primary" />
                        {country?.name}
                        {city && <span>· {city.name}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={rating} size={11} />
                        <span className="text-xs text-muted-foreground">({reviewCount.toLocaleString()})</span>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-sm font-bold text-foreground">
                          {formatPrice(price, currency)}
                          {hotel && <span className="text-xs font-normal text-muted-foreground">/night</span>}
                        </span>
                        {trip && (
                          <Button
                            size="sm"
                            onClick={() => {
                              setWishlistOpen(false);
                              openBooking(trip);
                            }}
                            className="bg-gradient-bluesky shadow-glow-bluesky"
                          >
                            Book
                            <ArrowRight className="size-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/60 bg-card p-4">
            <Button
              variant="ghost"
              onClick={clear}
              className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
              Clear wishlist
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
