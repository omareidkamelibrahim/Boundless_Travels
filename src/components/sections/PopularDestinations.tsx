"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/common/SectionTitle";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { Reveal } from "@/components/common/Reveal";
import { getPopularDestinations } from "@/services";
import { useUI } from "@/stores/use-ui";

export function PopularDestinations() {
  const destinations = getPopularDestinations(6);
  const setCommandOpen = useUI((s) => s.setCommandOpen);

  return (
    <section id="destinations" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Trending now"
          title={
            <>
              Popular <span className="text-gradient-bluesky">destinations</span>
            </>
          }
          description="Hand-picked places travelers can't stop talking about this season."
          action={
            <Button variant="outline" className="rounded-xl" onClick={() => setCommandOpen(true)}>
              View all
              <ArrowRight className="size-4" />
            </Button>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tall hero card */}
          <Reveal as="div" className="lg:row-span-2">
            <DestinationCard destination={destinations[0]} size="lg" className="h-full" />
          </Reveal>

          {destinations.slice(1, 5).map((d, i) => (
            <Reveal key={d.id} delay={i * 0.05} as="div">
              <DestinationCard destination={d} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
