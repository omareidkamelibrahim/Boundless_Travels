"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Heart, Phone, Menu, X, Globe, ChevronDown,
  Plane, Hotel, PlaneTakeoff, Stamp, Bus, Shield,
  MapPin, Users, Star,
  Bell, User, LogOut, Settings, CreditCard, LogIn, UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GradientAvatar } from "@/components/auth/GradientAvatar";
import { useUI } from "@/stores/use-ui";
import { useWishlist } from "@/stores/use-wishlist";
import { useAuth } from "@/stores/use-auth";
import { toast } from "sonner";

// Simple nav items (no mega menu)
const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Destinations", href: "/packages" },
  { label: "Tour Packages", href: "/packages" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

// Mega menu items for "Services"
const SERVICES_MEGA = [
  { icon: Plane, title: "Tour Packages", desc: "Curated domestic & international trips", href: "/packages" },
  { icon: Hotel, title: "Hotel Booking", desc: "5,000+ hotels at best prices", href: "/packages" },
  { icon: PlaneTakeoff, title: "Flight Booking", desc: "Compare hundreds of airlines", href: "/packages" },
  { icon: Stamp, title: "Visa Services", desc: "Fast processing for 50+ countries", href: "/services" },
  { icon: Bus, title: "Transportation", desc: "Private transfers & car rentals", href: "/services" },
  { icon: Shield, title: "Travel Insurance", desc: "Comprehensive trip protection", href: "/services" },
];

// Mega menu items for "Destinations"
const DESTINATIONS_MEGA = [
  { icon: MapPin, title: "Egypt", desc: "Pyramids, Nile, Red Sea", href: "/packages?country=egypt" },
  { icon: MapPin, title: "UAE", desc: "Dubai & Abu Dhabi luxury", href: "/packages?country=uae" },
  { icon: MapPin, title: "Turkey", desc: "Istanbul, Cappadocia, Antalya", href: "/packages?country=turkey" },
  { icon: MapPin, title: "Maldives", desc: "Overwater villas & diving", href: "/packages?country=maldives" },
  { icon: MapPin, title: "Greece", desc: "Santorini, Athens, islands", href: "/packages?country=greece" },
  { icon: MapPin, title: "Thailand", desc: "Bangkok, Phuket, temples", href: "/packages?country=thailand" },
];

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇪🇬" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const { setCommandOpen, openAuth, setWishlistOpen, mobileMenuOpen: storeMenuOpen, setMobileMenuOpen } = useUI();
  const wishlistCount = useWishlist((s) => s.items.length);
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  const handleNav = (href: string) => {
    router.push(href);
    setMobileMenuOpen(false);
  };

  const isHome = pathname === "/";
  const transparentHeader = isHome && !scrolled;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        transparentHeader
          ? "bg-transparent"
          : "glass shadow-premium",
      )}
    >
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className={cn("flex items-center justify-between gap-2 transition-all duration-300", scrolled ? "h-14" : "h-16 sm:h-18")}>
          {/* ===== LEFT: Logo ===== */}
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image src="/logo-boundless.jpeg" alt="BOUNDLESS" width={scrolled ? 32 : 36} height={scrolled ? 32 : 36} className="rounded-lg transition-all duration-300" />
            <div className="flex flex-col leading-none">
              <span className={cn("text-base font-extrabold tracking-tight transition-colors", transparentHeader ? "text-white" : "text-foreground")}>BOUNDLESS</span>
              <span className="text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-primary">Your Travel Guide</span>
            </div>
          </Link>

          {/* ===== CENTER: Navigation ===== */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation"
            onMouseLeave={() => setHoveredItem(null)}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const hasMega = item.label === "Services" || item.label === "Destinations";
              return (
                <div key={item.label} className="relative" onMouseEnter={() => setHoveredItem(hasMega ? item.label : null)}>
                  <button
                    onClick={() => handleNav(item.href)}
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      transparentHeader
                        ? isActive ? "text-white" : "text-white/80 hover:text-white"
                        : isActive ? "text-primary" : "text-foreground/80 hover:text-primary",
                    )}
                  >
                    {item.label}
                    {hasMega && <ChevronDown className={cn("size-3 transition-transform", hoveredItem === item.label && "rotate-180")} />}
                  </button>
                  {/* Active indicator */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className={cn("absolute -bottom-0.5 left-3 right-3 h-0.5 rounded-full", transparentHeader ? "bg-white" : "bg-primary")}
                    />
                  )}
                  {/* Mega menu */}
                  <AnimatePresence>
                    {hoveredItem === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-1/2 top-full mt-1 w-[480px] -translate-x-1/2"
                      >
                        <div className="rounded-2xl border border-border/60 bg-card p-3 shadow-premium-lg">
                          <div className="grid grid-cols-2 gap-1">
                            {(item.label === "Services" ? SERVICES_MEGA : DESTINATIONS_MEGA).map((mega) => {
                              const Icon = mega.icon;
                              return (
                                <button
                                  key={mega.title}
                                  onClick={() => handleNav(mega.href)}
                                  className="flex items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-accent"
                                >
                                  <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15">
                                    <Icon className="size-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-bold text-foreground">{mega.title}</p>
                                    <p className="text-xs text-muted-foreground">{mega.desc}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* ===== RIGHT: Actions ===== */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button onClick={() => setCommandOpen(true)} aria-label="Search"
              className={cn("grid size-8 place-items-center rounded-lg transition-colors", transparentHeader ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-foreground/80 hover:bg-accent hover:text-primary")}>
              <Search className="size-4" />
            </button>

            {/* Language */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button aria-label="Language" className={cn("hidden items-center gap-1 rounded-lg px-2 py-1.5 transition-colors sm:flex", transparentHeader ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-foreground/80 hover:bg-accent hover:text-primary")}>
                  <Globe className="size-4" />
                  <span className="text-sm">{lang.flag}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                {LANGUAGES.map((l) => (
                  <DropdownMenuItem key={l.code} onClick={() => setLang(l)} className={cn(lang.code === l.code && "bg-accent/50")}>
                    <span className="text-base">{l.flag}</span> {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist */}
            <button onClick={() => setWishlistOpen(true)} aria-label="Wishlist"
              className={cn("relative grid size-8 place-items-center rounded-lg transition-colors", transparentHeader ? "text-white/80 hover:bg-white/10 hover:text-white" : "text-foreground/80 hover:bg-accent hover:text-primary")}>
              <Heart className="size-4" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-[1rem] place-items-center rounded-full bg-rose-500 px-1 text-[0.55rem] font-bold text-white">{wishlistCount}</span>
              )}
            </button>

            {/* User Account */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="ml-0.5 shrink-0 cursor-pointer">
                    <GradientAvatar name={user.name} email={user.email} imageUrl={user.avatarUrl} size={32} interactive />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl p-1">
                  <div className="flex items-center gap-3 rounded-lg bg-gradient-bluesky-soft p-3 ring-1 ring-primary/10">
                    <GradientAvatar name={user.name} email={user.email} imageUrl={user.avatarUrl} size={36} showOnline={false} />
                    <div className="min-w-0"><p className="truncate text-sm font-bold">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div>
                  </div>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={() => router.push("/account")} className="gap-2 rounded-lg"><User className="size-4 text-primary" /> Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/account?section=bookings")} className="gap-2 rounded-lg"><Plane className="size-4 text-primary" /> Bookings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/account?section=wishlist")} className="gap-2 rounded-lg"><Heart className="size-4 text-primary" /> Wishlist</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/account?section=settings")} className="gap-2 rounded-lg"><Settings className="size-4 text-primary" /> Settings</DropdownMenuItem>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={() => { logout(); toast.success("Signed out"); }} className="gap-2 rounded-lg text-destructive"><LogOut className="size-4" /> Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="ml-0.5 shrink-0 cursor-pointer">
                    <GradientAvatar icon={UserPlus} size={32} interactive pulse />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl p-1">
                  <div className="flex items-center gap-3 rounded-xl bg-gradient-bluesky-soft p-3 ring-1 ring-primary/10">
                    <GradientAvatar icon={UserPlus} size={36} showOnline={false} />
                    <div><p className="text-sm font-bold">Welcome, Traveler</p><p className="text-xs text-muted-foreground">Sign in to continue</p></div>
                  </div>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={() => openAuth("login")} className="gap-2 rounded-lg"><LogIn className="size-4 text-primary" /> Login</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openAuth("register")} className="gap-2 rounded-lg"><UserPlus className="size-4 text-primary" /> Create Account</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Call Now */}
            <a href="tel:+202212345678" aria-label="Call Now"
              className={cn("hidden items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition-colors md:flex",
                transparentHeader ? "border-white/30 text-white hover:bg-white/10" : "border-border/60 text-foreground hover:bg-accent")}>
              <Phone className="size-3.5 text-primary" />
              <span className="hidden lg:inline">Call Now</span>
            </a>

            {/* Book Now */}
            <button onClick={() => router.push("/packages")}
              className="rounded-xl bg-gradient-bluesky px-3 py-1.5 text-xs font-bold text-white shadow-glow-bluesky transition-transform hover:scale-105">
              Book Now
            </button>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(!storeMenuOpen)} aria-label="Menu"
              className={cn("grid size-8 place-items-center rounded-lg transition-colors lg:hidden",
                transparentHeader ? "text-white hover:bg-white/10" : "text-foreground hover:bg-accent")}>
              {storeMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {storeMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:hidden"
          >
            <div className="mt-1 grid gap-1 rounded-2xl glass p-3 shadow-premium-lg">
              {NAV_ITEMS.map((item) => (
                <button key={item.label} onClick={() => handleNav(item.href)}
                  className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    pathname === item.href ? "bg-primary/10 text-primary" : "text-foreground/85 hover:bg-accent")}>
                  {item.label}
                </button>
              ))}
              <div className="mt-2 border-t border-border/60 pt-2">
                <a href="tel:+202212345678" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground"><Phone className="size-4 text-primary" /> Call Now</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
