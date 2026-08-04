"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  Plane, Heart, Search, Menu, User, ChevronDown, Globe, X,
  Home, Info, PlaneTakeoff, MapPinned, Hotel, Phone, Bell,
  LogOut, LogIn, UserPlus, Settings, CreditCard, ShoppingCart,
  Compass, Stamp, Bus, Tag, Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GradientAvatar } from "@/components/auth/GradientAvatar";
import { useUI } from "@/stores/use-ui";
import { useWishlist } from "@/stores/use-wishlist";
import { useCart } from "@/stores/use-cart";
import { useAuth } from "@/stores/use-auth";
import { toast } from "sonner";

// ===== Navigation config with mega-menu support =====
interface NavItem {
  label: string;
  href: string;
  mega?: { title: string; items: { label: string; href: string; icon: React.ElementType }[] }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  {
    label: "Services", href: "/services",
    mega: [
      { title: "Travel", items: [
        { label: "Tour Packages", href: "/packages", icon: Package },
        { label: "Hotel Booking", href: "/packages", icon: Hotel },
        { label: "Flight Booking", href: "/packages", icon: PlaneTakeoff },
      ]},
      { title: "Support", items: [
        { label: "Visa Services", href: "/services", icon: Stamp },
        { label: "Transportation", href: "/services", icon: Bus },
        { label: "Travel Insurance", href: "/services", icon: Shield },
      ]},
    ],
  },
  {
    label: "Tour Packages", href: "/packages",
    mega: [
      { title: "By Destination", items: [
        { label: "Egypt Tours", href: "/packages", icon: MapPinned },
        { label: "Maldives", href: "/packages", icon: Hotel },
        { label: "Turkey", href: "/packages", icon: Compass },
      ]},
      { title: "By Type", items: [
        { label: "Honeymoon", href: "/packages", icon: Heart },
        { label: "Family Trips", href: "/packages", icon: User },
        { label: "Adventure", href: "/packages", icon: Plane },
      ]},
    ],
  },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
];

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇪🇬" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

// Shield icon for mega menu
function Shield(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

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
  const logout = useAuth((s) => s.logout);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href === "/") window.scrollTo({ top: 0, behavior: "smooth" });
    router.push(href);
    setMobileMenuOpen(false);
    setHoveredNav(null);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "py-1.5" : "py-2.5 sm:py-3",
      )}
    >
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between gap-2 rounded-2xl px-3 py-2 transition-all duration-300 sm:px-4",
            scrolled
              ? "glass shadow-premium"
              : "bg-white/40 backdrop-blur-md ring-1 ring-white/40",
          )}
        >
          {/* ===== LEFT: Logo + Nav ===== */}
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" onClick={(e) => { e.preventDefault(); router.push("/"); }} className="flex items-center gap-2 shrink-0">
              <Image src="/logo-boundless.jpeg" alt="Boundless — Your Travel Guide" width={scrolled ? 32 : 36} height={scrolled ? 32 : 36} className="rounded-lg transition-all" />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-extrabold tracking-tight text-foreground sm:text-base">BOUNDLESS</span>
                <span className="hidden text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-primary sm:block">Your Travel Guide</span>
              </div>
            </Link>

            {/* Desktop Navigation with mega menu */}
            <nav className="hidden items-center lg:flex" aria-label="Main navigation" onMouseLeave={() => setHoveredNav(null)}>
              {NAV_ITEMS.map((item) => (
                <div key={item.label} className="relative" onMouseEnter={() => setHoveredNav(item.label)}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={cn(
                      "flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "text-primary"
                        : "text-foreground/75 hover:text-primary",
                    )}
                  >
                    {item.label}
                    {item.mega && <ChevronDown className={cn("size-3 opacity-50 transition-transform", hoveredNav === item.label && "rotate-180")} />}
                  </a>

                  {/* Active underline */}
                  {isActive(item.href) && (
                    <motion.span layoutId="nav-active" className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-gradient-bluesky" />
                  )}

                  {/* Mega menu */}
                  {item.mega && hoveredNav === item.label && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-1 w-[480px] rounded-2xl border border-border/60 bg-card p-4 shadow-premium-lg"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          {item.mega.map((col) => (
                            <div key={col.title}>
                              <p className="mb-2 px-2 text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">{col.title}</p>
                              <div className="space-y-0.5">
                                {col.items.map((sub) => {
                                  const Icon = sub.icon;
                                  return (
                                    <a
                                      key={sub.label}
                                      href={sub.href}
                                      onClick={(e) => handleNavClick(e, sub.href)}
                                      className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
                                    >
                                      <Icon className="size-4 text-primary" />
                                      {sub.label}
                                    </a>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* ===== CENTER: Search (desktop only) ===== */}
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden items-center gap-2 rounded-xl border border-border/40 bg-white/50 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur-md transition-colors hover:border-primary/30 hover:bg-white xl:flex"
            aria-label="Search"
          >
            <Search className="size-3.5" />
            <span className="text-xs">Search destinations...</span>
            <kbd className="ml-6 rounded border border-border/40 bg-muted/30 px-1.5 py-0.5 text-[0.6rem] font-mono">⌘K</kbd>
          </button>

          {/* ===== RIGHT: Actions ===== */}
          <div className="flex items-center gap-1">
            {/* Search icon (mobile/tablet) */}
            <button
              onClick={() => setCommandOpen(true)}
              aria-label="Search"
              className="grid size-8 place-items-center rounded-lg text-foreground/75 transition-colors hover:bg-accent hover:text-primary xl:hidden"
            >
              <Search className="size-4" />
            </button>

            {/* Language switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Switch language"
                  className="hidden items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-accent hover:text-primary lg:inline-flex"
                >
                  <Globe className="size-4" />
                  <span className="hidden xl:inline">{lang.flag}</span>
                  <ChevronDown className="size-3 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel>Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {LANGUAGES.map((l) => (
                  <DropdownMenuItem key={l.code} onClick={() => setLang(l)} className={cn(lang.code === l.code && "bg-accent/50")}>
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
              className="relative grid size-8 place-items-center rounded-lg text-foreground/75 transition-colors hover:bg-accent hover:text-primary"
            >
              <Heart className="size-4" />
              {wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-[1rem] place-items-center rounded-full bg-rose-500 px-1 text-[0.55rem] font-bold text-white">{wishlistCount}</span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              aria-label="Shopping cart"
              className="relative grid size-8 place-items-center rounded-lg text-foreground/75 transition-colors hover:bg-accent hover:text-primary"
            >
              <ShoppingCart className="size-4" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid min-w-[1rem] place-items-center rounded-full bg-primary px-1 text-[0.55rem] font-bold text-primary-foreground">{cartCount}</span>
              )}
            </button>

            {/* User Account */}
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button aria-label="Notifications" className="relative grid size-8 place-items-center rounded-lg text-foreground/75 transition-colors hover:bg-accent hover:text-primary">
                      <Bell className="size-4" />
                      <span className="absolute -right-0.5 -top-0.5 grid min-w-[1rem] place-items-center rounded-full bg-rose-500 px-1 text-[0.55rem] font-bold text-white">2</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 rounded-xl p-0">
                    <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                      <span className="text-sm font-bold">Notifications</span>
                      <button onClick={() => router.push("/account?section=notifications")} className="text-xs font-semibold text-primary hover:underline">View all</button>
                    </div>
                    <DropdownMenuItem onClick={() => router.push("/account?section=notifications")} className="flex-col items-start gap-0.5 border-b border-border/40 py-2.5">
                      <p className="text-xs font-bold text-foreground">Trip confirmed!</p>
                      <p className="text-[0.7rem] text-muted-foreground">Your Maldives trip is confirmed for Mar 15.</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account?section=notifications")} className="flex-col items-start gap-0.5 py-2.5">
                      <p className="text-xs font-bold text-foreground">Payment due</p>
                      <p className="text-[0.7rem] text-muted-foreground">Complete payment for your Cairo trip.</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Avatar */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="ml-0.5 shrink-0">
                      <GradientAvatar name={user.name} email={user.email} imageUrl={user.avatarUrl} size={32} interactive />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl p-1">
                    <div className="flex items-center gap-3 rounded-lg bg-gradient-bluesky-soft p-3 ring-1 ring-primary/10">
                      <GradientAvatar name={user.name} email={user.email} imageUrl={user.avatarUrl} size={36} showOnline={false} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">{user.name ?? "Traveler"}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem onClick={() => router.push("/account")} className="gap-2.5 rounded-lg py-2"><User className="size-4 text-primary" /> My Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account?section=bookings")} className="gap-2.5 rounded-lg py-2"><Plane className="size-4 text-primary" /> My Bookings</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account?section=wishlist")} className="gap-2.5 rounded-lg py-2"><Heart className="size-4 text-primary" /> Wishlist</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account?section=payments")} className="gap-2.5 rounded-lg py-2"><CreditCard className="size-4 text-primary" /> Payments</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account?section=preferences")} className="gap-2.5 rounded-lg py-2"><Settings className="size-4 text-primary" /> Settings</DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem onClick={() => { logout(); toast.success("Signed out"); }} className="gap-2.5 rounded-lg py-2 text-destructive"><LogOut className="size-4" /> Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="ml-0.5 shrink-0">
                    <GradientAvatar icon={UserPlus} size={32} interactive pulse />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl p-1">
                  <div className="flex items-center gap-3 rounded-lg bg-gradient-bluesky-soft p-3 ring-1 ring-primary/10">
                    <GradientAvatar icon={UserPlus} size={36} showOnline={false} />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground">Welcome, Traveler</p>
                      <p className="text-xs text-muted-foreground">Sign in to continue</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={() => openAuth("login")} className="gap-2.5 rounded-lg py-2"><LogIn className="size-4 text-primary" /> Login</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openAuth("register")} className="gap-2.5 rounded-lg py-2"><UserPlus className="size-4 text-primary" /> Create Account</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Call Now — outline button */}
            <a
              href="tel:+202212345678"
              className="hidden items-center gap-1.5 rounded-lg border border-border/60 bg-white/50 px-2.5 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md transition-colors hover:bg-accent lg:inline-flex"
              aria-label="Call Now"
            >
              <Phone className="size-3.5 text-primary" />
              <span className="hidden xl:inline">Call Now</span>
            </a>

            {/* Book Now — primary CTA */}
            <button
              onClick={() => router.push("/packages")}
              className="rounded-lg bg-gradient-bluesky px-3 py-1.5 text-xs font-bold text-white shadow-glow-bluesky transition-transform hover:scale-105"
            >
              Book Now
            </button>

            {/* Hamburger — tablet/mobile only */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="grid size-8 place-items-center rounded-lg text-foreground transition-colors hover:bg-accent lg:hidden"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 lg:hidden"
          >
            <div className="mt-2 grid gap-1 rounded-2xl glass p-3 shadow-premium-lg">
              {NAV_ITEMS.map((item) => (
                <a key={item.label} href={item.href} onClick={(e) => handleNavClick(e, item.href)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground/85 transition-colors hover:bg-accent hover:text-primary">
                  {item.label}
                </a>
              ))}
              <div className="mt-2 flex items-center gap-2 border-t border-border/60 pt-3">
                <a href="tel:+202212345678" className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border/60 py-2.5 text-xs font-semibold text-foreground">
                  <Phone className="size-3.5 text-primary" /> Call
                </a>
                {!isAuthenticated ? (
                  <Button variant="outline" onClick={() => { openAuth("login"); setMobileMenuOpen(false); }} className="flex-1">Login</Button>
                ) : (
                  <Button variant="outline" onClick={() => { logout(); toast.success("Signed out"); setMobileMenuOpen(false); }} className="flex-1"><LogOut className="size-4" /> Sign out</Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
