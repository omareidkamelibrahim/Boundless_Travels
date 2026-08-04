"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/common/SectionTitle";
import { OfferCard } from "@/components/cards/OfferCard";
import { Reveal } from "@/components/common/Reveal";
import { getActiveOffers } from "@/services";
import { useUI } from "@/stores/use-ui";

export function LimitedOffers() {
  const offers = getActiveOffers();
  const openBooking = useUI((s) => s.openBooking);

  return (
    <section id="offers" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute -left-32 top-1/2 size-96 -translate-y-1/2 rounded-full bg-amber-500/15 blur-3xl" />
        <div className="absolute -right-32 top-1/2 size-96 -translate-y-1/2 rounded-full bg-rose-500/15 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Limited time"
          title={
            <>
              Flash deals & <span className="text-gradient-bluesky">seasonal</span> discounts
            </>
          }
          description="Save big on handpicked trips. These offers expire when the timer hits zero."
          action={
            <Button variant="outline" className="rounded-xl">
              All offers
              <ArrowRight className="size-4" />
            </Button>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {offers.map((offer, i) => (
            <Reveal key={offer.id} delay={i * 0.08} as="div" className="h-full">
              <OfferCard offer={offer} onApply={() => offer.tripId && openBooking(offer.tripId)} className="h-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
