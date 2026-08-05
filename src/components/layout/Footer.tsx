"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Send, Plane } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUI } from "@/stores/use-ui";
import { toast } from "sonner";
import { useState } from "react";

const FOOTER_LINKS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Tour Packages", href: "/packages" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Tour Packages", href: "/packages" },
      { label: "Hotel Booking", href: "/packages" },
      { label: "Flight Booking", href: "/packages" },
      { label: "Visa Services", href: "/services" },
      { label: "Transportation", href: "/services" },
      { label: "Travel Insurance", href: "/services" },
    ],
  },
  {
    title: "Destinations",
    links: [
      { label: "Egypt", href: "/packages" },
      { label: "UAE", href: "/packages" },
      { label: "Turkey", href: "/packages" },
      { label: "Maldives", href: "/packages" },
      { label: "Greece", href: "/packages" },
      { label: "Thailand", href: "/packages" },
    ],
  },
];

const SOCIALS = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
];

export function Footer() {
  const openLegal = useUI((s) => s.openLegal);
  const openSupport = useUI((s) => s.openSupport);
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Subscribed! Welcome aboard.");
    setEmail("");
  };

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -left-40 top-0 size-[28rem] rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute -right-40 bottom-0 size-[28rem] rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <div className="relative container mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Brand + Newsletter */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo-boundless.jpeg" alt="BOUNDLESS" width={36} height={36} className="rounded-lg" />
              <div className="flex flex-col leading-none">
                <span className="text-lg font-extrabold tracking-tight text-white">BOUNDLESS</span>
                <span className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-accent">Your Travel Guide</span>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              Your trusted partner for premium journeys across Egypt and the world.
              From pyramids to overwater villas, we craft unforgettable experiences.
            </p>

            {/* Contact info */}
            <div className="mt-5 space-y-2.5 text-sm">
              <a href="mailto:hello@boundless.travel" className="flex items-center gap-2.5 text-slate-400 transition-colors hover:text-accent">
                <Mail className="size-4" /> hello@boundless.travel
              </a>
              <a href="tel:+202212345678" className="flex items-center gap-2.5 text-slate-400 transition-colors hover:text-accent">
                <Phone className="size-4" /> +20 22 123 4567
              </a>
              <p className="flex items-center gap-2.5 text-slate-400">
                <MapPin className="size-4" /> 14 Tahrir Square, Cairo, Egypt
              </p>
            </div>

            {/* Social */}
            <div className="mt-5 flex items-center gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a key={s.label} href={s.href} aria-label={s.label}
                    className="grid size-9 place-items-center rounded-xl bg-white/5 text-slate-300 ring-1 ring-white/10 transition-all hover:bg-gradient-bluesky hover:text-white hover:shadow-glow-bluesky">
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
            {FOOTER_LINKS.map((col) => (
              <div key={col.title}>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-white">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <button
                        onClick={() => router.push(link.href)}
                        className="text-sm text-slate-400 transition-colors hover:text-accent"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-white">Newsletter</h4>
            <p className="mb-4 text-sm text-slate-400">
              Get exclusive offers and travel inspiration delivered to your inbox.
            </p>
            <form className="flex flex-col gap-2" onSubmit={handleSubscribe}>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/10 bg-white/5 text-white placeholder:text-slate-500 focus-visible:border-accent"
                aria-label="Email address"
              />
              <Button type="submit" className="bg-gradient-bluesky shadow-glow-bluesky">
                <Send className="size-4" />
                Subscribe
              </Button>
            </form>

            {/* Payment methods */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {["Visa", "Mastercard", "PayPal", "Apple Pay"].map((p) => (
                <span key={p} className="rounded-md bg-white/5 px-2 py-1 text-[0.65rem] font-semibold text-slate-300 ring-1 ring-white/10">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-400 sm:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span>© {new Date().getFullYear()} BOUNDLESS. All rights reserved.</span>
              <button onClick={() => openLegal("privacy")} className="hover:text-white transition-colors">Privacy</button>
              <button onClick={() => openLegal("terms")} className="hover:text-white transition-colors">Terms</button>
              <button onClick={() => openLegal("refund")} className="hover:text-white transition-colors">Refunds</button>
              <button onClick={() => openLegal("faq")} className="hover:text-white transition-colors">FAQ</button>
            </div>
            <div className="flex items-center gap-3">
              <p className="hidden sm:flex items-center gap-1.5">
                Crafted with <span className="text-rose-400">♥</span> in Cairo, Egypt
              </p>
              <button onClick={openSupport} className="rounded-lg bg-white/5 px-2.5 py-1 text-[0.65rem] font-semibold text-slate-400 ring-1 ring-white/10 transition-all hover:bg-gradient-bluesky hover:text-white">
                Support
              </button>
              <button onClick={() => router.push("/admin")} className="rounded-lg bg-white/5 px-2.5 py-1 text-[0.65rem] font-semibold text-slate-400 ring-1 ring-white/10 transition-all hover:bg-gradient-bluesky hover:text-white">
                Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
