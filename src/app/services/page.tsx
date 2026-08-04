"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Plane, Hotel, PlaneTakeoff, Stamp, Bus, Shield,
  ArrowRight, Check, Star,
} from "lucide-react";
import { AppProviders } from "@/components/providers/AppProviders";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Reveal } from "@/components/common/Reveal";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SERVICES = [
  {
    icon: Plane,
    title: "Tour Packages",
    desc: "Curated domestic and international trips for every type of traveler — from luxury honeymoons to family adventures.",
    features: ["150+ destinations", "Custom itineraries", "Expert local guides", "All-inclusive options"],
    image: "https://picsum.photos/seed/service-tours/600/400",
    href: "/packages",
    popular: true,
  },
  {
    icon: Hotel,
    title: "Hotel Booking",
    desc: "5,000+ handpicked hotels and resorts at the best guaranteed prices, from boutique stays to 5-star luxury.",
    features: ["Best price guarantee", "Instant confirmation", "Free cancellation", "5,000+ properties"],
    image: "https://picsum.photos/seed/service-hotels/600/400",
    href: "/packages",
  },
  {
    icon: PlaneTakeoff,
    title: "Flight Booking",
    desc: "Compare hundreds of airlines and book flights in seconds with our intelligent search engine.",
    features: ["Real-time pricing", "Multi-city search", "Best fare alerts", "24/7 support"],
    image: "https://picsum.photos/seed/service-flights/600/400",
    href: "/packages",
  },
  {
    icon: Stamp,
    title: "Visa Services",
    desc: "Hassle-free visa applications with expert guidance and fast processing for 50+ countries.",
    features: ["50+ countries", "Fast processing", "Document checklist", "Expert review"],
    image: "https://picsum.photos/seed/service-visa/600/400",
    href: "/services",
  },
  {
    icon: Bus,
    title: "Transportation",
    desc: "Private transfers, car rentals, and ground transportation worldwide — door to door, stress free.",
    features: ["Private transfers", "Airport pickups", "Multilingual drivers", "Competitive rates"],
    image: "https://picsum.photos/seed/service-transport/600/400",
    href: "/services",
  },
  {
    icon: Shield,
    title: "Travel Insurance",
    desc: "Comprehensive coverage for peace of mind on every journey — medical, cancellation, and baggage.",
    features: ["Medical coverage", "Trip cancellation", "Baggage protection", "24/7 assistance"],
    image: "https://picsum.photos/seed/service-insurance/600/400",
    href: "/services",
  },
];

export default function ServicesPage() {
  const router = useRouter();

  return (
    <AppProviders>
      <div className="pt-20" />

      {/* Hero banner */}
      <section className="relative overflow-hidden py-12 sm:py-16">
        <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-bluesky p-8 text-white shadow-premium-lg sm:p-12">
            <div className="pointer-events-none absolute inset-0 opacity-30">
              <div className="absolute -right-10 -top-10 size-72 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-10 -left-10 size-72 rounded-full bg-accent/30 blur-3xl" />
            </div>
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                <span className="size-1.5 rounded-full bg-white" /> Our Services
              </span>
              <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Everything you need for the perfect trip
              </h1>
              <p className="mt-3 max-w-2xl text-base text-white/85 sm:text-lg">
                From tour packages to visa services — we handle every detail so you can focus on making memories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section id="services" className="relative py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <Reveal key={s.title} delay={i * 0.06} as="div">
                  <motion.div
                    whileHover={{ y: -8 }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium transition-shadow hover:shadow-premium-lg"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/2] overflow-hidden">
                      <img
                        src={s.image}
                        alt={s.title}
                        className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute left-3 top-3 grid size-10 place-items-center rounded-xl bg-white/90 backdrop-blur-md">
                        <Icon className="size-5 text-primary" />
                      </div>
                      {s.popular && (
                        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-950">
                          <Star className="size-3 fill-amber-950" /> Popular
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col gap-3 p-5">
                      <h3 className="text-lg font-bold text-foreground">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>

                      {/* Features */}
                      <ul className="space-y-1.5">
                        {s.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Check className="size-3.5 shrink-0 text-emerald-500" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-auto w-fit gap-1.5 rounded-xl"
                        onClick={() => router.push(s.href)}
                      >
                        Learn More
                        <ArrowRight className="size-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <ContactCTA />
    </AppProviders>
  );
}
