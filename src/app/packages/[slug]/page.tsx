"use client";

import { use } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Clock, Star, Users, Calendar, CheckCircle2, XCircle,
  Car, BedDouble, UtensilsCrossed, Shield, Heart, Share2, ArrowRight,
  ChevronDown, HelpCircle,
} from "lucide-react";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AppProviders } from "@/components/providers/AppProviders";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { StarRating } from "@/components/common/StarRating";
import { useUI } from "@/stores/use-ui";
import { useWishlist } from "@/stores/use-wishlist";
import { useBooking } from "@/stores/use-booking";
import { getTripBySlug, getTripReviews, findCountry, findCity, findCategory, getRelatedTrips } from "@/services";
import { cn, formatPrice, formatTripDuration, discountPct, formatDate, initials } from "@/lib/utils";
import { toast } from "sonner";
import { TripCard } from "@/components/cards/TripCard";

const FAQ = [
  { q: "What is the cancellation policy?", a: "Free cancellation up to 7 days before departure. 50% refund between 7-3 days. No refund within 72 hours of departure." },
  { q: "Are flights included in the price?", a: "International flights are not included. Domestic transportation during the trip is included as specified." },
  { q: "Can I customize this trip?", a: "Yes! Our travel experts can customize any itinerary. Click 'Book Now' and a specialist will contact you within 24 hours." },
  { q: "What is the group size?", a: "Group sizes vary by trip but typically range from 6 to 16 travelers. Private departures available on request." },
  { q: "Do I need travel insurance?", a: "Yes, travel insurance is required for all international trips. We recommend comprehensive coverage of at least $50,000." },
];

const POLICIES = [
  { title: "Booking Policy", body: "A 25% deposit secures your booking. The balance is due 14 days before departure." },
  { title: "Cancellation", body: "Free cancellation up to 7 days before. 50% refund 3-7 days before. No refund within 72 hours." },
  { title: "Travel Insurance", body: "Travel insurance is mandatory for international trips. We recommend coverage of at least $50,000." },
  { title: "Payment Methods", body: "We accept Visa, Mastercard, PayPal, Apple Pay, and bank transfers in USD, EUR, or EGP." },
];

export default function TripDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const trip = getTripBySlug(slug);

  if (!trip) {
    return (
      <AppProviders>
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-24 text-center">
          <div className="grid size-16 place-items-center rounded-full bg-muted">
            <HelpCircle className="size-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Trip not found</h1>
            <p className="mt-1 text-sm text-muted-foreground">This trip doesn't exist or has been removed.</p>
          </div>
          <a href="/packages" className="rounded-xl bg-gradient-bluesky px-6 py-3 text-sm font-bold text-white shadow-glow-bluesky">
            Browse All Packages
          </a>
        </div>
      </AppProviders>
    );
  }

  return (
    <AppProviders>
      <TripDetailsContent slug={slug} />
    </AppProviders>
  );
}

function TripDetailsContent({ slug }: { slug: string }) {
  const trip = getTripBySlug(slug)!;
  const reviews = getTripReviews(trip.id);
  const country = findCountry(trip.countryId);
  const city = findCity(trip.cityId);
  const category = findCategory(trip.categoryId);
  const relatedTrips = getRelatedTrips(trip, 3);

  const { toggle, has } = useWishlist();
  const openBooking = useBooking((s) => s.open);
  const isWishlisted = has(trip.id);
  const [activeImage, setActiveImage] = useState(0);
  const [travelers, setTravelers] = useState(2);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();

  const pct = discountPct(trip.price, trip.oldPrice);
  const gallery = [trip.imageUrl, ...trip.galleryUrls];

  const subtotal = trip.price * travelers;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + serviceFee;

  return (
    <div>
      {/* Gallery */}
      <div className="container mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Packages", href: "/packages" },
            { label: country?.name ?? "Trip" },
            { label: trip.title },
          ]}
        />

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          {/* Main image */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-premium-lg">
            <Image
              src={gallery[activeImage]}
              alt={trip.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute left-3 top-3 flex gap-2">
              {pct > 0 && <Badge className="bg-rose-500 text-white">-{pct}%</Badge>}
              {trip.featured && <Badge className="bg-amber-400 text-amber-950">★ Featured</Badge>}
            </div>
            {/* Thumbnails */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <div className="flex gap-1.5 rounded-full bg-black/40 px-2 py-1.5 backdrop-blur-md">
                {gallery.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn("h-1.5 rounded-full transition-all", i === activeImage ? "w-6 bg-white" : "w-1.5 bg-white/50")}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Thumbnails grid */}
          <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
            {gallery.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "relative aspect-square overflow-hidden rounded-xl ring-2 transition-all",
                  i === activeImage ? "ring-primary" : "ring-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Image src={img} alt="" fill sizes="120px" className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="container mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Left: content */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><MapPin className="size-3.5 text-primary" />{country?.name}{city && ` · ${city.name}`}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><Clock className="size-3.5 text-primary" />{formatTripDuration(trip.durationDays)}</span>
                {category && <><span>·</span><span className="inline-flex items-center gap-1"><Star className="size-3.5 text-primary" />{category.name}</span></>}
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{trip.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{trip.summary}</p>
              <div className="mt-3 flex items-center gap-3">
                <StarRating rating={trip.rating} size={16} showValue reviewCount={trip.reviewCount} />
                {trip.visaRequired && <Badge variant="outline" className="text-amber-600">Visa required</Badge>}
              </div>
            </div>

            {/* Quick info */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <QuickInfo icon={Users} label="Max Travelers" value={String(trip.maxTravelers)} />
              <QuickInfo icon={Car} label="Transport" value={trip.transportation ?? "Private"} />
              <QuickInfo icon={BedDouble} label="Accommodation" value={trip.accommodation ?? "Hotel"} />
              <QuickInfo icon={UtensilsCrossed} label="Meals" value={trip.mealPlan ?? "Breakfast"} />
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="included">Included</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>{trip.description}</p>
                <div className="flex flex-wrap gap-2">
                  {trip.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="itinerary">
                <div className="relative space-y-4 pl-6">
                  <div className="absolute left-2.5 top-1 h-[calc(100%-1rem)] w-px bg-border" />
                  {trip.itinerary.map((d) => (
                    <div key={d.day} className="relative">
                      <div className="absolute -left-[18px] top-1 grid size-5 place-items-center rounded-full bg-gradient-bluesky ring-4 ring-background">
                        <span className="text-[0.55rem] font-bold text-white">{d.day}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Day {d.day}: {d.title}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{d.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="included" className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-foreground"><CheckCircle2 className="size-4 text-emerald-500" /> What's included</h4>
                  <ul className="space-y-1.5">
                    {trip.included.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground"><CheckCircle2 className="mt-0.5 size-3 shrink-0 text-emerald-500" />{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-sm font-bold text-foreground"><XCircle className="size-4 text-rose-500" /> Not included</h4>
                  <ul className="space-y-1.5">
                    {trip.excluded.map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground"><XCircle className="mt-0.5 size-3 shrink-0 text-rose-500" />{item}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-3">
                <button onClick={() => toast.success("Review form coming soon")} className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/10">
                  <Star className="size-4" /> Write a Review
                </button>
                {reviews.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="rounded-2xl border border-border/60 bg-card p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8"><AvatarFallback className="bg-gradient-bluesky text-xs font-bold text-white">{initials(r.authorName)}</AvatarFallback></Avatar>
                        <div className="flex-1"><p className="text-sm font-bold text-foreground">{r.authorName}</p><StarRating rating={r.rating} size={12} /></div>
                        <span className="text-xs text-muted-foreground">{formatDate(r.createdAt, { month: "short", year: "numeric" })}</span>
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{r.body}</p>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="faq">
                <Accordion type="single" collapsible>
                  {FAQ.map((f, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger className="text-sm font-semibold text-foreground">{f.q}</AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground">{f.a}</AccordionContent>
                  </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>

            {/* Policies */}
            <div>
              <h4 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-foreground"><Shield className="size-4 text-primary" /> Policies</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {POLICIES.map((p) => (
                  <div key={p.title} className="rounded-xl border border-border/60 bg-muted/30 p-3">
                    <p className="text-xs font-bold text-foreground">{p.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: booking sidebar */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">From</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-foreground">{formatPrice(trip.price, trip.currency)}</span>
                    {trip.oldPrice && <span className="text-sm text-muted-foreground line-through">{formatPrice(trip.oldPrice, trip.currency)}</span>}
                  </div>
                  {pct > 0 && <span className="text-xs font-semibold text-emerald-600">You save {formatPrice((trip.oldPrice ?? trip.price) - trip.price, trip.currency)}</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { toggle({ trip }); toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist"); }} className={cn("grid size-9 place-items-center rounded-xl border border-border/60 bg-card transition-colors", isWishlisted ? "text-rose-500" : "text-muted-foreground hover:text-foreground")}>
                    <Heart className={cn("size-4", isWishlisted && "fill-current")} />
                  </button>
                  <button onClick={() => toast.success("Link copied!")} className="grid size-9 place-items-center rounded-xl border border-border/60 bg-card text-muted-foreground hover:text-foreground">
                    <Share2 className="size-4" />
                  </button>
                </div>
              </div>

              {/* Date selection */}
              <div className="mt-5 space-y-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select Date</label>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {[7, 14, 21, 30, 45, 60].map((d) => {
                      const date = new Date(Date.now() + d * 86400000);
                      const iso = date.toISOString();
                      const isActive = selectedDate === iso;
                      return (
                        <button
                          key={d}
                          onClick={() => setSelectedDate(iso)}
                          className={cn("flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2 transition-all", isActive ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/40")}
                        >
                          <span className="text-[0.65rem] font-medium text-muted-foreground">{date.toLocaleDateString("en-US", { month: "short" })}</span>
                          <span className="text-sm font-bold text-foreground">{date.getDate()}</span>
                          <span className="text-[0.6rem] text-muted-foreground">{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Travelers */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Travelers</label>
                  <div className="mt-1.5 flex items-center justify-between rounded-xl border border-border/60 bg-card px-3 py-2">
                    <span className="text-sm font-medium text-foreground">{travelers} {travelers === 1 ? "traveler" : "travelers"}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setTravelers(Math.max(1, travelers - 1))} className="grid size-7 place-items-center rounded-lg bg-muted text-foreground hover:bg-accent">−</button>
                      <span className="w-6 text-center text-sm font-bold">{travelers}</span>
                      <button onClick={() => setTravelers(Math.min(trip.maxTravelers, travelers + 1))} className="grid size-7 place-items-center rounded-lg bg-muted text-foreground hover:bg-accent">+</button>
                    </div>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-1.5 rounded-xl border border-border/60 bg-card p-3 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>{formatPrice(trip.price, trip.currency)} × {travelers}</span><span>{formatPrice(subtotal, trip.currency)}</span></div>
                  <div className="flex justify-between text-muted-foreground"><span>Service fee (5%)</span><span>{formatPrice(serviceFee, trip.currency)}</span></div>
                  <div className="my-2 h-px bg-border" />
                  <div className="flex justify-between font-bold text-foreground"><span>Total</span><span>{formatPrice(total, trip.currency)}</span></div>
                </div>

                <Button onClick={() => openBooking(trip)} size="lg" className="w-full bg-gradient-bluesky shadow-glow-bluesky">
                  Book Now <ArrowRight className="size-4" />
                </Button>
                <p className="flex items-center justify-center gap-1.5 text-[0.65rem] text-muted-foreground">
                  <Shield className="size-3 text-emerald-500" /> Free cancellation up to 7 days before
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related trips */}
        {relatedTrips.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-5 text-xl font-bold text-foreground">Related Trips</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTrips.map((t) => (
                <TripCard key={t.id} trip={t} onBook={(trip) => openBooking(trip.id)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickInfo({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
        <Icon className="size-3 text-primary" /> {label}
      </div>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}

import { useState } from "react";
