"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, CalendarCheck, Heart, Users, Stamp,
  CreditCard, FileText, Bell, ShieldCheck, Settings, LifeBuoy, LogOut,
  Menu, X, Camera, Plane, Mail, Phone, MapPin, Globe, AlertTriangle,
  Check, Loader2, Home, ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { AppProviders } from "@/components/providers/AppProviders";
import { GradientAvatar } from "@/components/auth/GradientAvatar";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/stores/use-auth";
import { useUI } from "@/stores/use-ui";
import { useWishlist } from "@/stores/use-wishlist";
import { useCart } from "@/stores/use-cart";
import { cn, formatPrice, formatDate, initials } from "@/lib/utils";
import { toast } from "sonner";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { demoBookings, demoInvoices, demoPaymentMethods } from "@/data/dashboard";
import type { Trip } from "@/types";

type AccountSection =
  | "dashboard" | "bookings" | "wishlist" | "travelers" | "visa"
  | "payments" | "invoices" | "notifications" | "security" | "preferences"
  | "support";

const NAV_ITEMS: { id: AccountSection; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "My Bookings", icon: CalendarCheck },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "travelers", label: "Saved Travelers", icon: Users },
  { id: "visa", label: "Visa Applications", icon: Stamp },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
  { id: "preferences", label: "Preferences", icon: Settings },
  { id: "support", label: "Support", icon: LifeBuoy },
];

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-rose-100 text-rose-700",
  completed: "bg-sky-100 text-sky-700",
  refunded: "bg-slate-100 text-slate-700",
};

export default function AccountPage() {
  return (
    <AppProviders>
      <AccountContent />
    </AppProviders>
  );
}

function AccountContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [section, setSection] = useState<AccountSection>("dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 pt-24 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-gradient-bluesky-soft ring-1 ring-primary/15">
          <LayoutDashboard className="size-8 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Sign in to view your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Access your dashboard, bookings, and settings.</p>
        </div>
        <SignInButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb + View Website bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card px-5 py-3 shadow-premium">
          <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
            <button onClick={() => router.push("/")} className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary">
              <Home className="size-3.5" />
              <span className="hidden sm:inline">Home</span>
            </button>
            <ChevronRight className="size-3 text-muted-foreground/50" />
            <span className="font-semibold capitalize text-foreground">{section}</span>
          </nav>
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-bluesky px-3 py-2 text-xs font-bold text-white shadow-glow-bluesky transition-transform hover:scale-105"
            aria-label="View Website"
          >
            <Globe className="size-3.5" />
            <span className="hidden sm:inline">View Website</span>
          </button>
        </div>

        {/* Mobile header with hamburger */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-border/60 bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-sm"
          >
            <Menu className="size-4 text-primary" />
            Menu
          </button>
          <h1 className="text-lg font-bold capitalize text-foreground">{section}</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
              <AccountSidebar
                section={section}
                onSectionChange={setSection}
                userName={user.name}
                userEmail={user.email}
                onLogout={logout}
                onGoToWebsite={() => router.push("/")}
              />
            </div>
          </aside>

          {/* Mobile drawer */}
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetContent side="left" className="w-72 p-0">
              <SheetHeader className="sr-only">
                <SheetTitle>Account Navigation</SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <AccountSidebar
                  section={section}
                  onSectionChange={(s) => { setSection(s); setMobileNavOpen(false); }}
                  userName={user.name}
                  userEmail={user.email}
                  onLogout={logout}
                  onGoToWebsite={() => { setMobileNavOpen(false); router.push("/"); }}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Content */}
          <div className="min-h-[60vh]">
            <AnimatePresence mode="wait">
              <motion.div
                key={section}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {section === "dashboard" && <DashboardSection onNavigate={setSection} />}
                {section === "bookings" && <BookingsSection />}
                {section === "wishlist" && <WishlistSection />}
                {section === "travelers" && <TravelersSection />}
                {section === "visa" && <VisaSection />}
                {section === "payments" && <PaymentsSection />}
                {section === "invoices" && <InvoicesSection />}
                {section === "notifications" && <NotificationsSection />}
                {section === "security" && <SecuritySection />}
                {section === "preferences" && <PreferencesSection />}
                {section === "support" && <SupportSection />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignInButton() {
  const openAuth = useUI((s) => s.openAuth);
  return (
    <Button onClick={() => openAuth("login")} className="rounded-xl bg-gradient-bluesky px-6 py-3 font-bold shadow-glow-bluesky">
      Sign In
    </Button>
  );
}

// ===== SIDEBAR =====
function AccountSidebar({
  section, onSectionChange, userName, userEmail, onLogout, onGoToWebsite,
}: {
  section: AccountSection;
  onSectionChange: (s: AccountSection) => void;
  userName?: string;
  userEmail: string;
  onLogout: () => void;
  onGoToWebsite: () => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {/* User header */}
      <div className="mb-4 flex items-center gap-3 rounded-xl bg-gradient-bluesky-soft p-3 ring-1 ring-primary/10">
        <GradientAvatar name={userName} email={userEmail} size={40} showOnline={false} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{userName ?? "Traveler"}</p>
          <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = section === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gradient-bluesky text-primary-foreground shadow-glow-bluesky"
                  : "text-foreground/80 hover:bg-accent hover:text-primary",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Back to Website + Logout */}
      <div className="mt-4 space-y-1 border-t border-border/60 pt-3">
        <button
          onClick={onGoToWebsite}
          className="flex w-full items-center gap-3 rounded-xl bg-gradient-bluesky-soft px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-gradient-bluesky hover:text-white"
        >
          <Globe className="size-4" />
          Back to Website
        </button>
        <button
          onClick={() => { onLogout(); toast.success("Signed out"); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50"
        >
          <LogOut className="size-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

// ===== DASHBOARD SECTION =====
function DashboardSection({ onNavigate }: { onNavigate: (s: AccountSection) => void }) {
  const { user } = useAuth();
  const wishlistItems = useWishlist((s) => s.items);
  const cartCount = useCart((s) => s.count());
  const totalSpent = demoBookings.filter((b) => b.paymentStatus === "paid").reduce((s, b) => s + b.totalAmount, 0);
  const unreadCount = 2;

  const stats = [
    { label: "Total Bookings", value: demoBookings.length, icon: CalendarCheck, color: "text-primary" },
    { label: "Wishlist Items", value: wishlistItems.length, icon: Heart, color: "text-rose-500" },
    { label: "Total Spent", value: formatPrice(totalSpent), icon: CreditCard, color: "text-emerald-600" },
    { label: "Unread Notifications", value: unreadCount, icon: Bell, color: "text-amber-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-bluesky p-6 text-white shadow-premium-lg">
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex items-center gap-4">
          <GradientAvatar name={user?.name} email={user?.email} size={56} showOnline={false} />
          <div>
            <h1 className="text-xl font-bold">Welcome back, {user?.name?.split(" ")[0] ?? "Traveler"}! 👋</h1>
            <p className="text-sm text-white/85">Manage your trips, payments, and preferences.</p>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  <p className="mt-1.5 text-xl font-bold text-foreground">{stat.value}</p>
                </div>
                <Icon className={cn("size-5", stat.color)} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "My Bookings", desc: "View and manage your trips", icon: CalendarCheck, section: "bookings" as AccountSection },
          { label: "Wishlist", desc: "Your saved trips and hotels", icon: Heart, section: "wishlist" as AccountSection },
          { label: "Payments", desc: "Manage payment methods", icon: CreditCard, section: "payments" as AccountSection },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => onNavigate(action.section)}
              className="group flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-5 text-left shadow-premium transition-shadow hover:shadow-premium-lg"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{action.label}</p>
                <p className="text-xs text-muted-foreground">{action.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Recent bookings preview */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-premium">
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 className="text-sm font-bold text-foreground">Recent Bookings</h2>
          <button onClick={() => onNavigate("bookings")} className="text-xs font-semibold text-primary hover:underline">
            View all
          </button>
        </div>
        <div className="space-y-2 px-5 pb-5">
          {demoBookings.slice(0, 3).map((b) => (
            <div key={b.id} className="flex items-center gap-3 rounded-xl border border-border/40 p-3">
              <div className="relative size-10 shrink-0 overflow-hidden rounded-lg">
                <Image src={b.tripImage} alt={b.tripTitle} fill sizes="40px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{b.tripTitle}</p>
                <p className="text-xs text-muted-foreground">{b.reference} · {formatDate(b.startDate)}</p>
              </div>
              <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", STATUS_STYLES[b.status])}>
                {b.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== BOOKINGS SECTION =====
function BookingsSection() {
  return (
    <div className="space-y-4">
      <SectionHeader title="My Bookings" subtitle="View and manage all your trip bookings" />
      <div className="space-y-3">
        {demoBookings.map((b) => (
          <div key={b.id} className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-premium sm:flex-row sm:items-center">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:size-20 sm:shrink-0">
              <Image src={b.tripImage} alt={b.tripTitle} fill sizes="80px" className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="line-clamp-1 text-sm font-bold text-foreground">{b.tripTitle}</h3>
                  <p className="text-xs text-muted-foreground">{b.countryName} · {b.reference}</p>
                </div>
                <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", STATUS_STYLES[b.status])}>
                  {b.status}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>{formatDate(b.startDate, { month: "short", day: "numeric" })}</span>
                <span>·</span>
                <span>{b.adults + b.children + b.infants} travelers</span>
                <span>·</span>
                <span className="font-bold text-foreground">{formatPrice(b.totalAmount, b.currency)}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {b.status === "pending" && b.paymentStatus === "unpaid" && (
                  <Button size="sm" className="rounded-xl bg-gradient-bluesky">Pay Now</Button>
                )}
                {b.status === "completed" && (
                  <Button size="sm" variant="outline" className="rounded-xl">Leave Review</Button>
                )}
                <Button size="sm" variant="ghost" className="rounded-xl">View Details</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== WISHLIST SECTION =====
function WishlistSection() {
  const items = useWishlist((s) => s.items);
  return (
    <div className="space-y-4">
      <SectionHeader title="Wishlist" subtitle={`${items.length} saved items`} />
      {items.length === 0 ? (
        <EmptyState icon={Heart} title="Your wishlist is empty" description="Save trips and hotels you love to find them here." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const trip = item.trip; const hotel = item.hotel;
            const name = trip?.title ?? hotel?.name ?? "";
            const image = trip?.imageUrl ?? hotel?.imageUrl ?? "";
            const price = trip?.price ?? hotel?.pricePerNight ?? 0;
            return (
              <div key={item.id} className="flex gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-premium">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                  <Image src={image} alt={name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="line-clamp-2 text-sm font-bold text-foreground">{name}</h4>
                  <p className="mt-1 text-sm font-bold text-primary">{formatPrice(price)}</p>
                  <Button size="sm" className="mt-2 rounded-xl bg-gradient-bluesky">Book Now</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ===== TRAVELERS SECTION =====
function TravelersSection() {
  const travelers = [
    { id: 1, name: "John Doe", type: "Adult", passport: "A12345678", dob: "1990-05-12" },
    { id: 2, name: "Jane Doe", type: "Adult", passport: "B87654321", dob: "1992-08-23" },
    { id: 3, name: "Jimmy Doe", type: "Child", passport: "C11223344", dob: "2015-03-15" },
  ];
  return (
    <div className="space-y-4">
      <SectionHeader title="Saved Travelers" subtitle="Store traveler details for faster booking" />
      <Button className="rounded-xl bg-gradient-bluesky">Add Traveler</Button>
      <div className="space-y-3">
        {travelers.map((t) => (
          <div key={t.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-bluesky-soft text-primary">
              <Users className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.type} · Passport: {t.passport} · DOB: {t.dob}</p>
            </div>
            <Button size="sm" variant="outline" className="rounded-xl">Edit</Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== VISA SECTION =====
function VisaSection() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Visa Applications" subtitle="Track your visa applications" />
      <div className="space-y-3">
        {[
          { country: "United Arab Emirates", type: "Tourist", status: "approved", date: "2026-07-15" },
          { country: "Turkey", type: "Tourist", status: "processing", date: "2026-08-01" },
        ].map((v, i) => (
          <div key={i} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
            <div className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-bluesky-soft text-primary">
              <Stamp className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-foreground">{v.country} — {v.type} Visa</p>
              <p className="text-xs text-muted-foreground">Applied: {v.date}</p>
            </div>
            <span className={cn("rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", v.status === "approved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>
              {v.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== PAYMENTS SECTION =====
function PaymentsSection() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Payment Methods" subtitle="Manage your saved cards" />
      <Button className="rounded-xl bg-gradient-bluesky">Add Payment Method</Button>
      <div className="grid gap-4 sm:grid-cols-2">
        {demoPaymentMethods.map((pm) => (
          <div key={pm.id} className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
            {pm.isDefault && <Badge className="absolute right-4 top-4 bg-primary text-primary-foreground">Default</Badge>}
            <div className="mb-4 text-2xl font-bold text-foreground">{pm.brand}</div>
            <p className="font-mono text-lg tracking-widest text-foreground">•••• {pm.last4}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <div>
                <p className="font-medium uppercase">{pm.holder}</p>
                <p>Expires {String(pm.expMonth).padStart(2, "0")}/{String(pm.expYear).slice(-2)}</p>
              </div>
              <button className="text-rose-500 hover:text-rose-600">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== INVOICES SECTION =====
function InvoicesSection() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Invoices" subtitle={`${demoInvoices.length} invoices`} />
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left font-semibold">Invoice #</th>
                <th className="px-4 py-3 text-left font-semibold">Date</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
                <th className="px-4 py-3 text-right font-semibold">Download</th>
              </tr>
            </thead>
            <tbody>
              {demoInvoices.map((inv) => (
                <tr key={inv.id} className="border-b border-border/40 hover:bg-accent/30">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-foreground">{inv.number}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(inv.issuedAt)}</td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">{formatPrice(inv.amount, inv.currency)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" className="rounded-lg" onClick={() => toast.success("Downloading PDF...")}>PDF</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===== NOTIFICATIONS SECTION =====
function NotificationsSection() {
  const notifications = [
    { id: 1, title: "Trip confirmed!", body: "Your Maldives trip is confirmed for Mar 15.", type: "success", date: "2 days ago", unread: true },
    { id: 2, title: "Payment due", body: "Complete payment for your Cairo Pyramids trip.", type: "warning", date: "1 day ago", unread: true },
    { id: 3, title: "20% off weekend deals", body: "Flash sale on weekend getaways. Use code WEEKEND20.", type: "info", date: "3 days ago", unread: false },
    { id: 4, title: "Trip completed", body: "Hope you loved Cappadocia! Leave a review.", type: "info", date: "1 week ago", unread: false },
  ];
  return (
    <div className="space-y-4">
      <SectionHeader title="Notifications" subtitle="Stay updated on your trips and offers" />
      <div className="space-y-2">
        {notifications.map((n) => (
          <div key={n.id} className={cn("flex items-start gap-3 rounded-2xl border p-4", n.unread ? "border-primary/30 bg-primary/5" : "border-border/60 bg-card")}>
            <div className={cn("grid size-9 shrink-0 place-items-center rounded-full", n.type === "success" ? "bg-emerald-100 text-emerald-600" : n.type === "warning" ? "bg-amber-100 text-amber-600" : "bg-sky-100 text-sky-600")}>
              {n.type === "success" ? <Check className="size-4" /> : <Bell className="size-4" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-foreground">{n.title}</p>
                {n.unread && <span className="size-2 shrink-0 rounded-full bg-primary" />}
              </div>
              <p className="text-xs text-muted-foreground">{n.body}</p>
              <p className="mt-1 text-[0.65rem] text-muted-foreground/70">{n.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== SECURITY SECTION =====
function SecuritySection() {
  return (
    <div className="space-y-4">
      <SectionHeader title="Security" subtitle="Manage your account security" />
      <div className="space-y-3">
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-5 text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground">Two-Factor Authentication</p>
              <p className="text-xs text-muted-foreground">Require a code on every new device</p>
            </div>
          </div>
          <Switch />
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
          <div className="flex items-center gap-3">
            <Mail className="size-5 text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground">Email Verification</p>
              <p className="text-xs text-emerald-600">Verified ✓</p>
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700">Verified</Badge>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
          <div className="flex items-center gap-3">
            <Phone className="size-5 text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground">Phone Verification</p>
              <p className="text-xs text-muted-foreground">Not verified yet</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="rounded-xl">Verify</Button>
        </div>
        <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-primary" />
            <div>
              <p className="text-sm font-bold text-foreground">Change Password</p>
              <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="rounded-xl">Change</Button>
        </div>
      </div>
    </div>
  );
}

// ===== PREFERENCES SECTION =====
function PreferencesSection() {
  const [prefs, setPrefs] = useState({
    emailMarketing: true, smsAlerts: false, pushNotifs: true, weeklyDigest: true,
    language: "English", currency: "USD",
  });
  return (
    <div className="space-y-4">
      <SectionHeader title="Preferences" subtitle="Customize your experience" />
      <div className="space-y-3">
        {[
          { key: "emailMarketing" as const, label: "Email Marketing", desc: "Receive deals and travel inspiration" },
          { key: "smsAlerts" as const, label: "SMS Alerts", desc: "Booking updates by text" },
          { key: "pushNotifs" as const, label: "Push Notifications", desc: "Real-time browser updates" },
          { key: "weeklyDigest" as const, label: "Weekly Digest", desc: "Summary every Monday" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 shadow-premium">
            <div>
              <p className="text-sm font-bold text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
            <Switch checked={prefs[item.key]} onCheckedChange={(v) => setPrefs({ ...prefs, [item.key]: v })} />
          </div>
        ))}
      </div>
      <Button className="rounded-xl bg-gradient-bluesky" onClick={() => toast.success("Preferences saved")}>
        Save Preferences
      </Button>
    </div>
  );
}

// ===== SUPPORT SECTION =====
function SupportSection() {
  const openSupport = useUI((s) => s.openSupport);
  return (
    <div className="space-y-4">
      <SectionHeader title="Support" subtitle="Get help from our team" />
      <div className="grid gap-4 sm:grid-cols-2">
        <button onClick={openSupport} className="flex flex-col items-start gap-3 rounded-2xl border border-border/60 bg-card p-5 text-left shadow-premium transition-shadow hover:shadow-premium-lg">
          <div className="grid size-10 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15">
            <LifeBuoy className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Create Support Ticket</p>
            <p className="text-xs text-muted-foreground">Get help with any issue</p>
          </div>
        </button>
        <a href="#contact" className="flex flex-col items-start gap-3 rounded-2xl border border-border/60 bg-card p-5 shadow-premium transition-shadow hover:shadow-premium-lg">
          <div className="grid size-10 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15">
            <Mail className="size-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">Contact Us</p>
            <p className="text-xs text-muted-foreground">Email: hello@bluesky.travel</p>
          </div>
        </a>
      </div>
    </div>
  );
}

// ===== SHARED COMPONENTS =====
function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

function EmptyState({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-muted">
        <Icon className="size-7 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
