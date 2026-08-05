"use client";

import { motion } from "framer-motion";
import { Plane, Hotel, PlaneTakeoff, Stamp, Bus, Package, ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Reveal } from "@/components/common/Reveal";

const SERVICES = [
  { icon: Plane, title: "Tour Packages", desc: "Curated domestic and international trips for every type of traveler.", href: "#packages" },
  { icon: Hotel, title: "Hotel Booking", desc: "5,000+ handpicked hotels and resorts at the best guaranteed prices.", href: "#packages" },
  { icon: PlaneTakeoff, title: "Flight Booking", desc: "Compare hundreds of airlines and book flights in seconds.", href: "#packages" },
  { icon: Stamp, title: "Visa Services", desc: "Hassle-free visa applications with expert guidance and fast processing.", href: "#packages" },
  { icon: Bus, title: "Transportation", desc: "Private transfers, car rentals, and ground transportation worldwide.", href: "#packages" },
  { icon: Package, title: "Travel Insurance", desc: "Comprehensive coverage for peace of mind on every journey.", href: "#packages" },
];

export function FeaturedServices() {
  return (
    <section id="services" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="What we offer"
          align="center"
          title={<>Featured <span className="text-gradient-bluesky">services</span></>}
          description="Everything you need for the perfect trip — all in one place."
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.title} delay={i * 0.06} as="div">
                <motion.div
                  whileHover={{ y: -6 }}
                  className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-premium"
                >
                  {/* Hover gradient */}
                  <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />

                  <div className="relative grid size-12 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15 transition-transform group-hover:scale-110">
                    <Icon className="size-6" />
                  </div>
                  <div className="relative">
                    <h3 className="text-base font-bold text-foreground">{s.title}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                  <button
                    onClick={() => document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" })}
                    className="relative mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
                  >
                    Learn More
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
                  </button>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
