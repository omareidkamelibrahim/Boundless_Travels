"use client";

import { SectionTitle } from "@/components/common/SectionTitle";
import { CountryCard } from "@/components/cards/CountryCard";
import { Reveal } from "@/components/common/Reveal";
import { getCountries } from "@/services";

export function TopCountries() {
  const countries = getCountries().slice(0, 10);
  return (
    <section id="countries" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Explore by country"
          align="center"
          title={
            <>
              Top <span className="text-gradient-bluesky">countries</span> to visit
            </>
          }
          description="From ancient wonders to tropical escapes — pick your next adventure by country."
        />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
          {countries.map((c, i) => (
            <Reveal key={c.id} delay={(i % 5) * 0.05} as="div">
              <CountryCard country={c} className="h-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
