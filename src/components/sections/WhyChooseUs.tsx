"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Headset,
  Wallet,
  Award,
  Plane,
  Clock,
} from "lucide-react";
import { SectionTitle } from "@/components/common/SectionTitle";
import { StatsCounter } from "@/components/common/StatsCounter";
import { Reveal } from "@/components/common/Reveal";
import Image from "next/image";
import { getPlatformStats } from "@/services";

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "100% Secure Booking",
    description: "Bank-grade encryption and full refund protection on every booking you make with us.",
  },
  {
    icon: Headset,
    title: "24/7 Expert Support",
    description: "Real human travel experts available around the clock, anywhere in the world.",
  },
  {
    icon: Wallet,
    title: "Best Price Promise",
    description: "Found it cheaper elsewhere? We'll match the price and add an extra 5% discount.",
  },
  {
    icon: Award,
    title: "Award-Winning",
    description: "Voted Best Online Travel Agency three years in a row at the WTA awards.",
  },
];

export function WhyChooseUs() {
  const stats = getPlatformStats();
  return (
    <section id="about" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionTitle
                eyebrow="Why Boundless"
                title={
                  <>
                    We make every journey
                    <br />
                    <span className="text-gradient-bluesky">unforgettable</span>
                  </>
                }
                description="For over a decade we've helped travelers discover the world with confidence, comfort, and a touch of magic. Here's what sets us apart."
              />
            </Reveal>

            <div className="mt-10 grid grid-cols-2 gap-6">
              <StatsCounter value={stats.happyTravelers} label="Happy travelers" suffix="+" />
              <StatsCounter value={stats.expertGuides} label="Expert guides" suffix="+" />
              <StatsCounter value={stats.destinations} label="Destinations" suffix="+" />
              <StatsCounter value={stats.averageRating} label="Avg rating" suffix="★" decimals={1} />
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FEATURES.map((f, i) => {
                const Icon = f.icon;
                return (
                  <Reveal key={f.title} delay={i * 0.08} as="div" className="h-full">
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-premium"
                    >
                      <div className="absolute -right-8 -top-8 size-24 rounded-full bg-primary/5 transition-transform duration-500 group-hover:scale-150" />
                      <div className="relative grid size-12 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/20">
                        <Icon className="size-6" />
                      </div>
                      <h3 className="relative text-base font-bold text-foreground">{f.title}</h3>
                      <p className="relative text-sm leading-relaxed text-muted-foreground">
                        {f.description}
                      </p>
                    </motion.div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.2} as="div">
              <div className="mt-4 flex items-center gap-4 overflow-hidden rounded-2xl border border-border/60 bg-gradient-bluesky p-5 text-white shadow-glow-bluesky">
                <Plane className="size-8 -rotate-12" />
                <div className="flex-1">
                  <p className="text-sm font-bold">Need a custom itinerary?</p>
                  <p className="text-xs text-white/85">Our experts design your perfect trip in 24h.</p>
                </div>
                <button className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-primary transition-transform hover:scale-105">
                  Talk to an expert
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
