"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/common/Reveal";

export function ContactCTA() {
  return (
    <section className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Reveal as="div">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-premium-lg">
            <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
              {/* Left: CTA text */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                  <span className="size-1.5 rounded-full bg-primary" /> Ready to travel?
                </span>
                <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                  Start your next <span className="text-gradient-bluesky">adventure</span> today
                </h2>
                <p className="mt-4 text-base text-muted-foreground">
                  Our travel experts are ready to craft your perfect trip. Get a free consultation and personalized itinerary within 24 hours.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    size="lg"
                    onClick={() => document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" })}
                    className="gap-2 rounded-xl bg-gradient-bluesky px-6 py-3 text-base font-bold shadow-glow-bluesky"
                  >
                    Browse Packages
                    <ArrowRight className="size-4" />
                  </Button>
                  <a href="tel:+202212345678">
                    <Button size="lg" variant="outline" className="gap-2 rounded-xl px-6 py-3 text-base font-bold">
                      <Phone className="size-4 text-primary" />
                      +20 22 123 4567
                    </Button>
                  </a>
                </div>
              </div>

              {/* Right: contact info cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { icon: Phone, label: "Call Us", value: "+20 22 123 4567", href: "tel:+202212345678" },
                  { icon: Mail, label: "Email Us", value: "hello@bluesky.travel", href: "mailto:hello@bluesky.travel" },
                  { icon: MapPin, label: "Visit Us", value: "14 Tahrir Square, Cairo", href: "#contact" },
                  { icon: Send, label: "WhatsApp", value: "+20 100 123 4567", href: "#" },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      whileHover={{ y: -3 }}
                      className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-premium transition-shadow hover:shadow-premium-lg"
                    >
                      <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15">
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.label}</p>
                        <p className="truncate text-sm font-bold text-foreground">{item.value}</p>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
