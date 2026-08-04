"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Bell,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  Settings,
  CreditCard,
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
import { GradientAvatar } from "@/components/auth/GradientAvatar";
import { useUI } from "@/stores/use-ui";
import { useWishlist } from "@/stores/use-wishlist";
import { useCart } from "@/stores/use-cart";
import { useAuth } from "@/stores/use-auth";
import { useActiveSection } from "@/hooks/use-active-section";
import { toast } from "sonner";

const NAV_ITEMS: { label: string; href: string; section?: string; icon: React.ElementType }[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "About Us", href: "/about", icon: Info },
  { label: "Services", href: "/services", icon: PlaneTakeoff },
  { label: "Tour Packages", href: "/packages", icon: MapPinned },
  { label: "Gallery", href: "/gallery", icon: Hotel },
  { label: "Contact Us", href: "/contact", icon: Phone },
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
  const router = useRouter();

  const wishlistCount = useWishlist((s) => s.items.length);
  const cartCount = useCart((s) => s.count());
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);

  const active = useActiveSection([]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    router.push(href);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-2" : "py-3 sm:py-4",
      )}
    >
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
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

          {/* Desktop nav — text-only links to fit all 10 items at xl */}
          <nav className="hidden items-center gap-0 xl:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={cn(
                    "group relative inline-flex items-center rounded-lg px-2 py-2 text-[0.8rem] font-medium transition-colors text-foreground/80 hover:text-primary",
                  )}
                >
                  <span>{item.label}</span>
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
              <>
                {/* Notifications bell */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label="Notifications"
                      className="relative grid size-9 place-items-center rounded-xl text-foreground/80 transition-colors hover:bg-accent hover:text-primary"
                    >
                      <Bell className="size-4.5" />
                      <span className="absolute -right-0.5 -top-0.5 grid min-w-[1.1rem] place-items-center rounded-full bg-rose-500 px-1 text-[0.6rem] font-bold text-white shadow-sm">
                        2
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="flex items-center justify-between">
                      <span>Notifications</span>
                      <button
                        onClick={() => router.push("/account?section=notifications")}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View all
                      </button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/account?section=notifications")} className="flex-col items-start gap-0.5 py-2">
                      <p className="text-xs font-bold text-foreground">Trip confirmed!</p>
                      <p className="text-[0.7rem] text-muted-foreground">Your Maldives trip is confirmed for Mar 15.</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account?section=notifications")} className="flex-col items-start gap-0.5 py-2">
                      <p className="text-xs font-bold text-foreground">Payment due</p>
                      <p className="text-[0.7rem] text-muted-foreground">Complete payment for your Cairo trip.</p>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Gradient avatar with premium user menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div className="ml-0.5 shrink-0">
                      <GradientAvatar
                        name={user.name}
                        email={user.email}
                        imageUrl={user.avatarUrl}
                        size={40}
                        interactive
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-premium-lg">
                    {/* User header */}
                    <div className="flex items-center gap-3 rounded-xl bg-gradient-bluesky-soft p-3 ring-1 ring-primary/10">
                      <GradientAvatar
                        name={user.name}
                        email={user.email}
                        imageUrl={user.avatarUrl}
                        size={44}
                        showOnline={false}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-foreground">
                          {user.name ?? "Traveler"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem onClick={() => router.push("/account")} className="gap-3 rounded-lg py-2">
                      <User className="size-4 text-primary" /> My Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account?section=bookings")} className="gap-3 rounded-lg py-2">
                      <Plane className="size-4 text-primary" /> My Bookings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account?section=wishlist")} className="gap-3 rounded-lg py-2">
                      <Heart className="size-4 text-primary" /> Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account?section=notifications")} className="gap-3 rounded-lg py-2">
                      <Bell className="size-4 text-primary" /> Notifications
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account?section=payments")} className="gap-3 rounded-lg py-2">
                      <CreditCard className="size-4 text-primary" /> Payments
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/account?section=preferences")} className="gap-3 rounded-lg py-2">
                      <Settings className="size-4 text-primary" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        toast.success("Signed out");
                      }}
                      className="gap-3 rounded-lg py-2 text-destructive focus:text-destructive"
                    >
                      <LogOut className="size-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="ml-0.5 shrink-0">
                    <GradientAvatar
                      icon={UserPlus}
                      size={40}
                      interactive
                      pulse
                    />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-2xl p-2 shadow-premium-lg">
                  {/* Guest header */}
                  <div className="flex items-center gap-3 rounded-xl bg-gradient-bluesky-soft p-3 ring-1 ring-primary/10">
                    <GradientAvatar icon={UserPlus} size={44} showOnline={false} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-foreground">Welcome, Traveler</p>
                      <p className="text-xs text-muted-foreground">Sign in to continue your journey</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem onClick={() => openAuth("login")} className="gap-3 rounded-lg py-2.5">
                    <LogIn className="size-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Login</span>
                      <span className="text-[0.7rem] text-muted-foreground">Welcome back 👋</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => openAuth("register")} className="gap-3 rounded-lg py-2.5">
                    <UserPlus className="size-4 text-primary" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">Create Account</span>
                      <span className="text-[0.7rem] text-muted-foreground">Start exploring the world</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Call Now + Book Now CTAs */}
            <div className="hidden items-center gap-1.5 md:flex">
              <a
                href="tel:+202212345678"
                className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-white/50 px-2.5 py-1.5 text-xs font-semibold text-foreground backdrop-blur-md transition-colors hover:bg-accent"
                aria-label="Call Now"
              >
                <Phone className="size-3.5 text-primary" />
                <span className="hidden lg:inline">Call Now</span>
              </a>
              <button
                onClick={() => router.push("/packages")}
                className="rounded-xl bg-gradient-bluesky px-3 py-1.5 text-xs font-bold text-white shadow-glow-bluesky transition-transform hover:scale-105"
              >
                Book Now
              </button>
            </div>

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
            className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:hidden"
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
              {isAuthenticated && (
                <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border/60 pt-3">
                  <Button
                    onClick={() => {
                      router.push("/account?section=bookings");
                      setMobileMenuOpen(false);
                    }}
                    className="bg-gradient-bluesky shadow-glow-bluesky"
                  >
                    <LayoutDashboard className="size-4" />
                    Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      logout();
                      toast.success("Signed out");
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="size-4" />
                    Sign out
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
