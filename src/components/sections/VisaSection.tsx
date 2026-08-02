"use client";

import { SectionTitle } from "@/components/common/SectionTitle";
import { VisaCard } from "@/components/cards/VisaCard";
import { Reveal } from "@/components/common/Reveal";
import { getVisas } from "@/services";
import { useUI } from "@/stores/use-ui";

export function VisaSection() {
  const visas = getVisas();
  const openBooking = useUI((s) => s.openBooking);

  return (
    <section id="visa" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Travel documents"
          align="center"
          title={
            <>
              Visa <span className="text-gradient-bluesky">services</span> made simple
            </>
          }
          description="Apply for tourist, business, and student visas with our streamlined process."
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visas.map((v, i) => (
            <Reveal key={v.id} delay={(i % 3) * 0.06} as="div">
              <VisaCard visa={v} onApply={() => openBooking()} className="h-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
