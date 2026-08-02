"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Reveal } from "@/components/common/Reveal";
import { cn } from "@/lib/utils";

const BRANCHES = [
  { city: "Cairo", address: "14 Tahrir Square, Downtown Cairo", phone: "+20 22 123 4567", hours: "9 AM - 9 PM Daily" },
  { city: "Alexandria", address: "21 El-Geish Road, Miami", phone: "+20 3 555 1234", hours: "10 AM - 8 PM Daily" },
  { city: "Luxor", address: "Karnak Street, East Bank", phone: "+20 95 234 5678", hours: "9 AM - 7 PM Daily" },
  { city: "Dubai", address: "Sheikh Zayed Road, Business Bay", phone: "+971 4 555 1234", hours: "10 AM - 10 PM Daily" },
];

const SOCIALS = [
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
  { icon: Instagram, label: "Instagram" },
  { icon: Linkedin, label: "LinkedIn" },
];

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Get in touch"
          align="center"
          title={
            <>
              Let's plan your <span className="text-gradient-bluesky">next adventure</span>
            </>
          }
          description="Have a question or want a custom itinerary? Our travel experts are here for you 24/7."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {/* Form */}
          <Reveal as="div" className="lg:col-span-7">
            <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-premium sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-12 place-items-center rounded-2xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/20">
                  <MessageSquare className="size-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Send us a message</h3>
                  <p className="text-sm text-muted-foreground">We'll reply within 24 hours.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" required />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" type="tel" placeholder="+1 555 123 4567" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="Custom trip to Egypt" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us about your dream trip..."
                    required
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-bluesky shadow-glow-bluesky sm:w-auto"
                >
                  {submitted ? (
                    <>
                      <CheckCircle2 className="size-4" />
                      Message sent!
                    </>
                  ) : (
                    <>
                      <Send className="size-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </Reveal>

          {/* Map + info */}
          <div className="space-y-6 lg:col-span-5">
            <Reveal as="div">
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-premium">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10">
                  <iframe
                    title="BlueSky Travel HQ"
                    className="absolute inset-0 h-full w-full"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=31.2300%2C30.0400%2C31.2450%2C30.0490&layer=mapnik&marker=30.0444%2C31.2357"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-border/60 rounded-3xl" />
                </div>
                <div className="grid grid-cols-2 gap-3 p-5">
                  <ContactInfo icon={Phone} label="Phone" value="+20 22 123 4567" />
                  <ContactInfo icon={Mail} label="Email" value="hello@bluesky.travel" />
                  <ContactInfo icon={MapPin} label="Address" value="14 Tahrir Square, Cairo" />
                  <ContactInfo icon={Clock} label="Open" value="24/7 Online Support" />
                </div>
              </div>
            </Reveal>

            <Reveal as="div">
              <div className="flex items-center justify-between rounded-3xl border border-border/60 bg-card p-5 shadow-premium">
                <div>
                  <p className="text-sm font-bold text-foreground">Follow our journey</p>
                  <p className="text-xs text-muted-foreground">@bluesky.travel</p>
                </div>
                <div className="flex items-center gap-2">
                  {SOCIALS.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href="#"
                        aria-label={s.label}
                        className="grid size-9 place-items-center rounded-xl bg-muted text-muted-foreground transition-all hover:bg-gradient-bluesky hover:text-white hover:shadow-glow-bluesky"
                      >
                        <Icon className="size-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Branches */}
        <Reveal as="div">
          <div className="mt-10">
            <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-foreground">
              <Building2 className="size-5 text-primary" />
              Our branches
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {BRANCHES.map((b, i) => (
                <Reveal key={b.city} delay={i * 0.05} as="div">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="h-full rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
                  >
                    <h4 className="text-base font-bold text-foreground">{b.city}</h4>
                    <p className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="mt-0.5 size-3 shrink-0 text-primary" />
                      {b.address}
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="size-3 shrink-0 text-primary" />
                      {b.phone}
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3 shrink-0 text-primary" />
                      {b.hours}
                    </p>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactInfo({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-muted/40 p-3">
      <Icon className="size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}
