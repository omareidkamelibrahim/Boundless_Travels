"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X, Heart, Share2, Star, MapPin, Check, Wifi, Waves, Sparkles,
  Car, Dumbbell, Utensils, Coffee, Wine, Briefcase, Plane, ArrowRight,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUI } from "@/stores/use-ui";
import { useWishlist } from "@/stores/use-wishlist";
import { useBooking } from "@/stores/use-booking";
import { getHotel, getCity } from "@/services";
import { StarRating } from "@/components/common/StarRating";
import { cn, formatPrice, initials } from "@/lib/utils";
import { toast } from "sonner";

const FACILITY_ICONS: Record<string, React.ElementType> = {
  Pool: Waves, Spa: Sparkles, Gym: Dumbbell, Restaurant: Utensils,
  Bar: Wine, "Free WiFi": Wifi, Parking: Car, "Business Center": Briefcase,
  "Beach Access": Waves, "Kids Club": Sparkles, Coffee: Coffee,
};

export function HotelDetailModal() {
  const { hotelId, setHotelId } = useUI();
  const { toggle, has } = useWishlist();
  const openBooking = useBooking((s) => s.open);
  const [activeImage, setActiveImage] = useState(0);

  const hotel = hotelId ? getHotel(hotelId) : undefined;
  if (!hotel) return null;

  const city = getCity(hotel.cityId);
  const gallery = [hotel.imageUrl, ...hotel.galleryUrls];
  const isWishlisted = has(hotel.id);

  return (
    <DialogPrimitive.Root open={!!hotelId} onOpenChange={(o) => !o && setHotelId(undefined)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[4px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-card shadow-2xl",
            "w-[calc(100vw-1rem)] max-w-4xl max-h-[90vh]",
          )}
        >
          <DialogTitle className="sr-only">{hotel.name}</DialogTitle>
          <DialogDescription className="sr-only">{hotel.description}</DialogDescription>

          <div className="grid max-h-[90vh] grid-cols-1 overflow-y-auto lg:grid-cols-[1.5fr_1fr]">
            {/* Left: gallery + content */}
            <div className="flex flex-col">
              {/* Gallery */}
              <div className="relative aspect-[16/10] overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div key={activeImage} initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                    <Image src={gallery[activeImage]} alt={hotel.name} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
                  </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                <div className="absolute left-3 top-3 flex items-center gap-1.5">
                  {Array.from({ length: hotel.stars }).map((_, i) => <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />)}
                </div>

                <button onClick={() => setHotelId(undefined)} aria-label="Close" className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60">
                  <X className="size-5" />
                </button>

                {/* Thumbnails */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1.5 backdrop-blur-md">
                    {gallery.map((_, i) => (
                      <button key={i} onClick={() => setActiveImage(i)} className={cn("h-1.5 rounded-full transition-all", i === activeImage ? "w-6 bg-white" : "w-1.5 bg-white/50")} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="size-3.5 text-primary" />
                  {city?.name}
                  {hotel.address && <span>· {hotel.address}</span>}
                </div>
                <h2 className="mt-1.5 text-xl font-bold text-foreground sm:text-2xl">{hotel.name}</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">{hotel.description}</p>

                <Tabs defaultValue="facilities" className="mt-5">
                  <TabsList className="grid w-full grid-cols-3 bg-muted/60">
                    <TabsTrigger value="facilities">Facilities</TabsTrigger>
                    <TabsTrigger value="rooms">Rooms</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>

                  <TabsContent value="facilities" className="mt-3">
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {hotel.facilities.map((f) => {
                        const Icon = FACILITY_ICONS[f] || Check;
                        return (
                          <div key={f} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card p-2.5">
                            <Icon className="size-4 text-primary" />
                            <span className="text-xs font-medium text-foreground">{f}</span>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  <TabsContent value="rooms" className="mt-3 space-y-2">
                    {hotel.roomTypes.map((r, i) => (
                      <div key={r} className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-3">
                        <div className="flex items-center gap-2">
                          <div className="grid size-9 place-items-center rounded-lg bg-gradient-bluesky-soft text-primary">
                            <Sparkles className="size-4" />
                          </div>
                          <span className="text-sm font-semibold text-foreground">{r}</span>
                        </div>
                        <span className="text-sm font-bold text-foreground">{formatPrice(hotel.pricePerNight * (i + 1))}<span className="text-xs font-normal text-muted-foreground">/night</span></span>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-3">
                    <div className="space-y-2">
                      {[1, 2].map((i) => (
                        <div key={i} className="rounded-xl border border-border/60 bg-card p-3">
                          <div className="flex items-center gap-2">
                            <div className="grid size-7 place-items-center rounded-full bg-gradient-bluesky text-[0.6rem] font-bold text-white">
                              {i === 1 ? "SJ" : "MC"}
                            </div>
                            <span className="text-xs font-bold text-foreground">{i === 1 ? "Sarah Johnson" : "Michael Chen"}</span>
                            <StarRating rating={5} size={11} />
                          </div>
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            {i === 1 ? "Exceptional service, stunning views, and impeccable attention to detail. The staff went above and beyond." : "Best hotel experience I've ever had. The overwater villa was paradise. Will definitely return!"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Right: booking sidebar */}
            <div className="border-t border-border/60 bg-muted/30 lg:border-l lg:border-t-0">
              <div className="sticky top-0 p-5 sm:p-6">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <StarRating rating={hotel.rating} size={14} showValue reviewCount={hotel.reviewCount} />
                    <p className="mt-2 text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">From</p>
                    <p className="text-2xl font-bold text-foreground">{formatPrice(hotel.pricePerNight)}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { toggle({ hotel }); toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist!"); }} className={cn("grid size-9 place-items-center rounded-xl border border-border/60 bg-card transition-colors", isWishlisted ? "text-rose-500" : "text-muted-foreground hover:text-foreground")}>
                      <Heart className={cn("size-4", isWishlisted && "fill-current")} />
                    </button>
                    <button onClick={() => toast.success("Link copied!")} className="grid size-9 place-items-center rounded-xl border border-border/60 bg-card text-muted-foreground hover:text-foreground">
                      <Share2 className="size-4" />
                    </button>
                  </div>
                </div>

                {/* Quick info */}
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground"><Check className="size-4 text-emerald-500" />Free cancellation up to 7 days</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Check className="size-4 text-emerald-500" />Pay at hotel option available</div>
                  <div className="flex items-center gap-2 text-muted-foreground"><Check className="size-4 text-emerald-500" />Breakfast included</div>
                </div>

                <Button onClick={() => { setHotelId(undefined); setTimeout(() => toast.success("Hotel added to cart!"), 200); }} className="mt-5 h-12 w-full gap-2 rounded-xl bg-gradient-bluesky font-bold shadow-glow-bluesky">
                  Book Now
                  <ArrowRight className="size-4" />
                </Button>
                <p className="mt-2 text-center text-[0.65rem] text-muted-foreground">No prepayment needed · Secure booking</p>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
