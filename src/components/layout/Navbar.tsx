"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plane,
  Heart,
  ShoppingCart,
  Search,
  Menu,
  User,
  ChevronDown,
  Globe,
  X,
  Home,
  MapPinned,
  Hotel,
  PlaneTakeoff,
  Stamp,
  Tag,
  Newspaper,
  Info,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUI } from "@/stores/use-ui";
import { useWishlist } from "@/stores/use-wishlist";
import { useCart } from "@/stores/use-cart";
import { useAuth } from "@/stores/use-auth";
import { useActiveSection } from "@/hooks/use-active-section";

const NAV_ITEMS: { label: string; href: string; section?: string; icon: React.ElementType }[] = [
  { label: "Home", href: "#home", section: "home", icon: Home },
  { label: "Domestic", href: "#domestic", section: "domestic-trips", icon: MapPinned },
  { label: "International", href: "#international", section: "international-trips", icon: Plane },
  { label: "Hotels", href: "#hotels", section: "hotels", icon: Hotel },
  { label: "Flights", href: "#flights", section: "flights", icon: PlaneTakeoff },
  { label: "Visa", href: "#visa", section: "visa", icon: Stamp },
  { label: "Offers", href: "#offers", section: "offers", icon: Tag },
  { label: "Blog", href: "#blog", section: "blog", icon: Newspaper },
  { label: "About", href: "#about", section: "about", icon: Info },
  { label: "Contact", href: "#contact", section: "contact", icon: Phone },
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

  const openAuth = useUI((s) => s.openAuth);
  const setWishlistOpen = useUI((s) => s.setWishlistOpen);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const setCommandOpen = useUI((s) => s.setCommandOpen);
  const mobileMenuOpen = useUI((s) => s.mobileMenuOpen);
  const setMobileMenuOpen = useUI((s) => s.setMobileMenuOpen);

  const wishlistCount = useWishlist((s) => s.items.length);
  const cartCount = useCart((s) => s.count());
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const user = useAuth((s) => s.user);

  const active = useActiveSection(NAV_ITEMS.map((i) => i.section!).filter(Boolean));

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const id = href.replace("#", "");
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-3 sm:py-4",
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between gap-3 rounded-2xl px-3 py-2 transition-all duration-300 sm:px-4",
            scrolled
              ? "glass shadow-premium"
              : "bg-white/35 backdrop-blur-md ring-1 ring-white/40",
          )}
        >
          {/* Logo */}
          <Link href="#home" onClick={(e) => handleNavClick(e, "#home")} className="flex items-center gap-2">
            <div className="relative grid size-9 place-items-center rounded-xl bg-gradient-bluesky shadow-glow-bluesky">
              <Plane className="size-5 -rotate-45 text-white" />
              <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-accent ring-2 ring-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-base font-extrabold tracking-tight text-foreground">
                BlueSky
              </span>
              <span className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-primary">
                Travel
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.section;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={cn(
                    "group relative inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary",
                  )}
                >
                  <Icon className="size-3.5 opacity-70" />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-bluesky"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setCommandOpen(true)}
              aria-label="Search"
              className="grid size-9 place-items-center rounded-xl text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
            >
              <Search className="size-4.5" />
            </button>

            {/* Language switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Switch language"
                  className="hidden items-center gap-1.5 rounded-xl px-2 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-primary sm:inline-flex"
                >
                  <Globe className="size-4" />
                  <span className="hidden lg:inline">{lang.flag}</span>
                  <ChevronDown className="size-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Choose language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {LANGUAGES.map((l) => (
                  <DropdownMenuItem
                    key={l.code}
                    onClick={() => setLang(l)}
                    className={cn(lang.code === l.code && "bg-accent/50")}
                  >
                    <span className="text-base">{l.flag}</span>
                    <span>{l.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Wishlist */}
            <button
              onClick={() => setWishlistOpen(true)}
              aria-label="Wishlist"
              className="relative grid size-9 place-items-center rounded-xl text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
            >
              <Heart className="size-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-[1.1rem] place-items-center rounded-full bg-rose-500 px-1 text-[0.6rem] font-bold text-white shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Shopping cart"
              className="relative grid size-9 place-items-center rounded-xl text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
            >
              <ShoppingCart className="size-4.5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-[1.1rem] place-items-center rounded-full bg-primary px-1 text-[0.6rem] font-bold text-primary-foreground shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 hidden items-center gap-2 rounded-xl border border-border/60 bg-white/70 px-2 py-1.5 text-sm font-medium backdrop-blur-md transition-colors hover:bg-white sm:inline-flex">
                    <div className="grid size-6 place-items-center rounded-full bg-gradient-bluesky text-[0.65rem] font-bold text-white">
                      {user.name?.[0] ?? user.email[0]}
                    </div>
                    <span className="max-w-[6rem] truncate">{user.name ?? user.email.split("@")[0]}</span>
                    <ChevronDown className="size-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{user.name ?? "Account"}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="size-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Plane className="size-4" /> My Bookings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Heart className="size-4" /> Wishlist
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <X className="size-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="ml-1 hidden items-center gap-1.5 sm:flex">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuth("login")}
                  className="font-semibold text-foreground/80 hover:text-primary"
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => openAuth("register")}
                  className="bg-gradient-bluesky font-semibold shadow-glow-bluesky"
                >
                  Register
                </Button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="grid size-9 place-items-center rounded-xl text-foreground transition-colors hover:bg-accent xl:hidden"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 xl:hidden"
          >
            <div className="mt-2 grid gap-1 rounded-2xl glass p-3 shadow-premium-lg">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-accent hover:text-primary"
                  >
                    <Icon className="size-4 text-primary" />
                    {item.label}
                  </a>
                );
              })}
              {!isAuthenticated && (
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border/60 pt-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      openAuth("login");
                      setMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      openAuth("register");
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-bluesky shadow-glow-bluesky"
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
