"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { AppProviders } from "@/components/providers/AppProviders";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Reveal } from "@/components/common/Reveal";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const CONTACT_INFO = [
  { icon: Phone, label: "Phone", value: "+20 22 123 4567", href: "tel:+202212345678" },
  { icon: Mail, label: "Email", value: "hello@bluesky.travel", href: "mailto:hello@bluesky.travel" },
  { icon: MapPin, label: "Office", value: "14 Tahrir Square, Cairo, Egypt", href: "#" },
  { icon: Clock, label: "Business Hours", value: "9 AM - 9 PM Daily (Cairo Time)", href: "#" },
];

const BRANCHES = [
  { city: "Cairo", address: "14 Tahrir Square, Downtown Cairo", phone: "+20 22 123 4567" },
  { city: "Alexandria", address: "21 El-Geish Road, Miami", phone: "+20 3 555 1234" },
  { city: "Luxor", address: "Karnak Street, East Bank", phone: "+20 95 234 5678" },
  { city: "Dubai", address: "Sheikh Zayed Road, Business Bay", phone: "+971 4 555 1234" },
];

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll reply within 24 hours.");
  };

  return (
    <AppProviders>
      <div className="pt-20" />
      <section id="contact" className="relative py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Get in touch"
            align="center"
            title={<>Contact <span className="text-gradient-bluesky">us</span></>}
            description="Have a question or want a custom itinerary? Our travel experts are here for you 24/7."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            {/* Left: Contact info */}
            <div className="lg:col-span-5">
              <div className="space-y-3">
                {CONTACT_INFO.map((info, i) => {
                  const Icon = info.icon;
                  return (
                    <Reveal key={info.label} delay={i * 0.05} as="div">
                      <a
                        href={info.href}
                        className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-premium transition-shadow hover:shadow-premium-lg"
                      >
                        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{info.label}</p>
                          <p className="text-sm font-bold text-foreground">{info.value}</p>
                        </div>
                      </a>
                    </Reveal>
                  );
                })}
              </div>

              {/* Social links */}
              <Reveal delay={0.2} as="div">
                <div className="mt-4 flex items-center gap-2 rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
                  <span className="text-xs font-semibold text-muted-foreground">Follow us:</span>
                  {SOCIALS.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.label}
                        href={s.href}
                        aria-label={s.label}
                        className="grid size-8 place-items-center rounded-lg bg-muted text-muted-foreground transition-all hover:bg-gradient-bluesky hover:text-white"
                      >
                        <Icon className="size-4" />
                      </a>
                    );
                  })}
                </div>
              </Reveal>

              {/* Map */}
              <Reveal delay={0.3} as="div">
                <div className="mt-4 overflow-hidden rounded-2xl border border-border/60 shadow-premium">
                  <iframe
                    title="BlueSky Travel HQ"
                    className="h-48 w-full"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=31.2300%2C30.0400%2C31.2450%2C30.0490&layer=mapnik&marker=30.0444%2C31.2357"
                    loading="lazy"
                  />
                </div>
              </Reveal>
            </div>

            {/* Right: Contact form */}
            <div className="lg:col-span-7">
              <Reveal delay={0.1} as="div">
                <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-premium sm:p-8">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FloatingInput label="Full Name" required defaultValue="" />
                    <FloatingInput label="Phone" type="tel" required defaultValue="" />
                  </div>
                  <FloatingInput label="Email" type="email" required defaultValue="" />
                  <FloatingInput label="Subject" required defaultValue="" />
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your dream trip..."
                      className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2.5 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full gap-2 rounded-xl bg-gradient-bluesky font-bold shadow-glow-bluesky">
                    <Send className="size-4" />
                    Send Message
                  </Button>
                </form>
              </Reveal>
            </div>
          </div>

          {/* Branches */}
          <div className="mt-12">
            <h3 className="mb-5 text-lg font-bold text-foreground">Our Branches</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {BRANCHES.map((b, i) => (
                <Reveal key={b.city} delay={i * 0.05} as="div">
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
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
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AppProviders>
  );
}
