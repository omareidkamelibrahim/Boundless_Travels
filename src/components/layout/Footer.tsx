"use client";

import Link from "next/link";
import {
  Plane,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Send,
  ShieldCheck,
  Award,
  Headset,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Destinations",
    links: [
      { label: "Egypt", href: "#" },
      { label: "United Arab Emirates", href: "#" },
      { label: "Turkey", href: "#" },
      { label: "Maldives", href: "#" },
      { label: "Greece", href: "#" },
      { label: "Thailand", href: "#" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Domestic Trips", href: "#domestic" },
      { label: "International Trips", href: "#international" },
      { label: "Hotels", href: "#hotels" },
      { label: "Flights", href: "#flights" },
      { label: "Visa Services", href: "#visa" },
      { label: "Travel Insurance", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Partners", href: "#" },
      { label: "Affiliates", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#contact" },
      { label: "Contact Us", href: "#contact" },
      { label: "Booking Policy", href: "#" },
      { label: "Cancellation", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
];

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

const TRUST = [
  { icon: ShieldCheck, label: "Secure Payments" },
  { icon: Award, label: "Award Winning" },
  { icon: Headset, label: "24/7 Support" },
];

export function Footer() {
  return (
    <footer id="contact" className="relative mt-24 overflow-hidden bg-slate-950 text-slate-300">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -left-40 top-0 size-[28rem] rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 size-[28rem] rounded-full bg-accent/30 blur-[120px]" />
      </div>

      {/* Trust strip */}
      <div className="relative border-b border-white/10">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {TRUST.map((t) => (
              <div key={t.label} className="flex items-center justify-center gap-2.5 py-5 text-sm font-medium text-white">
                <t.icon className="size-5 text-accent" />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="relative container mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="#home" className="flex items-center gap-2">
              <div className="relative grid size-10 place-items-center rounded-xl bg-gradient-bluesky shadow-glow-bluesky">
                <Plane className="size-5 -rotate-45 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-tight text-white">BlueSky</span>
                <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">
                  Travel
                </span>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              BlueSky Travel is your trusted partner for premium journeys across Egypt and the world.
              From pyramids to overwater villas, we craft unforgettable experiences with a 4.9★
              average rating from 48,000+ travelers.
            </p>

            <div className="mt-6 space-y-2.5 text-sm">
              <a href="mailto:hello@bluesky.travel" className="flex items-center gap-2.5 text-slate-400 transition-colors hover:text-accent">
                <Mail className="size-4" /> hello@bluesky.travel
              </a>
              <a href="tel:+202212345678" className="flex items-center gap-2.5 text-slate-400 transition-colors hover:text-accent">
                <Phone className="size-4" /> +20 22 123 4567
              </a>
              <p className="flex items-center gap-2.5 text-slate-400">
                <MapPin className="size-4" /> 14 Tahrir Square, Cairo, Egypt
              </p>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid size-9 place-items-center rounded-xl bg-white/5 text-slate-300 ring-1 ring-white/10 transition-all hover:bg-gradient-bluesky hover:text-white hover:shadow-glow-bluesky"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-5">
            {FOOTER_COLUMNS.map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-white">
                  {col.title}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-slate-400 transition-colors hover:text-accent"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-white">
              Travel Deals Newsletter
            </h4>
            <p className="mb-4 text-sm text-slate-400">
              Get exclusive offers, flash deals, and travel inspiration delivered to your inbox.
            </p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="your@email.com"
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:border-accent"
                aria-label="Email address"
              />
              <Button
                type="submit"
                className="bg-gradient-bluesky shadow-glow-bluesky"
              >
                <Send className="size-4" />
                Subscribe
              </Button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-white/5 px-2 py-1 text-[0.65rem] font-semibold text-slate-300 ring-1 ring-white/10">
                Visa
              </span>
              <span className="rounded-md bg-white/5 px-2 py-1 text-[0.65rem] font-semibold text-slate-300 ring-1 ring-white/10">
                Mastercard
              </span>
              <span className="rounded-md bg-white/5 px-2 py-1 text-[0.65rem] font-semibold text-slate-300 ring-1 ring-white/10">
                PayPal
              </span>
              <span className="rounded-md bg-white/5 px-2 py-1 text-[0.65rem] font-semibold text-slate-300 ring-1 ring-white/10">
                Apple Pay
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="container mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-400 sm:flex-row">
            <p>© {new Date().getFullYear()} BlueSky Travel. All rights reserved.</p>
            <p className="flex items-center gap-1.5">
              Crafted with
              <span className="text-rose-400">♥</span>
              in Cairo, Egypt
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
