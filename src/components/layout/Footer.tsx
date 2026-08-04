"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useUI } from "@/stores/use-ui";

const FOOTER_LINKS: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Tour Packages", href: "/packages" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
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

  return (
    <footer className="border-t border-border/60 bg-slate-950 text-slate-400">
      <div className="container mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand + contact */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo-boundless.jpeg"
                alt="Boundless — Your Travel Guide"
                width={36}
                height={36}
                className="rounded-lg"
              />
              <span className="text-lg font-bold text-white">BOUNDLESS</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Your trusted partner for premium journeys across Egypt and the world.
            </p>
            <div className="mt-4 space-y-1.5 text-sm">
              <a href="mailto:hello@bluesky.travel" className="flex items-center gap-2 transition-colors hover:text-white">
                <Mail className="size-3.5" /> hello@bluesky.travel
              </a>
              <a href="tel:+202212345678" className="flex items-center gap-2 transition-colors hover:text-white">
                <Phone className="size-3.5" /> +20 22 123 4567
              </a>
              <p className="flex items-center gap-2">
                <MapPin className="size-3.5" /> 14 Tahrir Square, Cairo, Egypt
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Quick Links</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => router.push(link.href)}
                    className="text-sm transition-colors hover:text-white"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + social */}
          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Legal</h4>
            <ul className="space-y-2">
              <li><button onClick={() => openLegal("privacy")} className="text-sm transition-colors hover:text-white">Privacy Policy</button></li>
              <li><button onClick={() => openLegal("terms")} className="text-sm transition-colors hover:text-white">Terms of Service</button></li>
              <li><button onClick={() => openLegal("refund")} className="text-sm transition-colors hover:text-white">Refund Policy</button></li>
              <li><button onClick={() => openLegal("faq")} className="text-sm transition-colors hover:text-white">FAQ</button></li>
              <li><button onClick={openSupport} className="text-sm transition-colors hover:text-white">Support</button></li>
            </ul>
            <div className="mt-4 flex items-center gap-2">
              {SOCIALS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="grid size-8 place-items-center rounded-lg bg-white/5 transition-colors hover:bg-gradient-bluesky hover:text-white"
                  >
                    <Icon className="size-3.5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-2 text-xs sm:flex-row">
            <p>© {new Date().getFullYear()} Boundless Travel. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/admin")}
                className="text-slate-500 transition-colors hover:text-white"
              >
                Admin
              </button>
              <span className="text-slate-600">·</span>
              <p className="flex items-center gap-1">
                Crafted with <span className="text-rose-400">♥</span> in Cairo
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
