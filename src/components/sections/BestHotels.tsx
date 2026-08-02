"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/common/SectionTitle";
import { HotelCard } from "@/components/cards/HotelCard";
import { Reveal } from "@/components/common/Reveal";
import { getBestHotels } from "@/services";

export function BestHotels() {
  const hotels = getBestHotels(4);
  return (
    <section id="hotels" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Stay in style"
          title={
            <>
              Best <span className="text-gradient-bluesky">hotels</span> worldwide
            </>
          }
          description="Five-star stays, curated for the most discerning travelers."
          action={
            <Button variant="outline" className="rounded-xl">
              Browse all
              <ArrowRight className="size-4" />
            </Button>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hotels.map((h, i) => (
            <Reveal key={h.id} delay={i * 0.05} as="div">
              <HotelCard hotel={h} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
