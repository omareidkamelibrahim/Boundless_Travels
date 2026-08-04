"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  X,
  Plane,
  Heart,
  User,
  Bell,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Info,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  Plus,
  Trash2,
  Star,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUI, type DashboardSection } from "@/stores/use-ui";
import { useAuth } from "@/stores/use-auth";
import { useWishlist } from "@/stores/use-wishlist";
import { useBooking } from "@/stores/use-booking";
import { demoBookings, demoInvoices, demoNotifications, demoPaymentMethods } from "@/data/dashboard";
import { cn, formatDate, formatPrice, initials } from "@/lib/utils";
import { StarRating } from "@/components/common/StarRating";
import { toast } from "sonner";

const NAV: { id: DashboardSection; label: string; icon: React.ElementType }[] = [
  { id: "bookings", label: "Bookings", icon: Plane },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

const STATUS_STYLE: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  confirmed: { label: "Confirmed", className: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  pending: { label: "Pending", className: "bg-amber-100 text-amber-700", icon: Clock },
  cancelled: { label: "Cancelled", className: "bg-rose-100 text-rose-700", icon: XCircle },
  completed: { label: "Completed", className: "bg-sky-100 text-sky-700", icon: CheckCircle2 },
};

const NOTIFICATION_STYLE: Record<string, { icon: React.ElementType; color: string }> = {
  success: { icon: CheckCircle2, color: "text-emerald-500" },
  warning: { icon: AlertCircle, color: "text-amber-500" },
  error: { icon: XCircle, color: "text-rose-500" },
  info: { icon: Info, color: "text-primary" },
};

export function UserDashboardModal() {
  const { dashboardOpen, closeDashboard, dashboardSection, setDashboardSection, openAuth, setTripDetailId, setWishlistOpen } = useUI();
  const { user, logout } = useAuth();
  const wishlistItems = useWishlist((s) => s.items);
  const openBooking = useBooking((s) => s.open);

  // Notifications state (mock — could be a separate store later)
  const [notifications, setNotifications] = useState(demoNotifications);

  // Profile form state
  const [profile, setProfile] = useState({
    name: user?.name ?? "John Doe",
    email: user?.email ?? "john@bluesky.travel",
    phone: "+1 555 123 4567",
    nationality: "United States",
    dob: "1990-05-12",
    address: "14 Tahrir Square, Cairo, Egypt",
  });

  const [settings, setSettings] = useState({
    emailMarketing: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyDigest: true,
    twoFactor: false,
    language: "English",
    currency: "USD",
  });

  const unreadCount = notifications.filter((n) => !n.readAt).length;
  const totalSpent = demoBookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const handleLogout = () => {
    logout();
    closeDashboard();
    toast.success("Signed out successfully");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully");
  };

  const handleSaveSettings = () => {
    toast.success("Settings saved");
  };

  return (
    <Dialog open={dashboardOpen} onOpenChange={(open) => !open && closeDashboard()}>
      <DialogContent className="max-w-6xl gap-0 overflow-hidden p-0 sm:rounded-3xl sm:max-w-6xl">
        <DialogTitle className="sr-only">User Dashboard</DialogTitle>

        <div className="grid max-h-[90vh] grid-cols-1 overflow-hidden sm:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="hidden flex-col border-r border-border/60 bg-muted/30 sm:flex">
            <div className="flex items-center gap-3 p-5">
              <Avatar className="size-11">
                <AvatarFallback className="bg-gradient-bluesky font-bold text-white">
                  {initials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-foreground">{profile.name}</p>
                <p className="truncate text-xs text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <div className="mx-5 mb-3 grid grid-cols-3 gap-2 rounded-2xl border border-border/60 bg-card p-3 text-center">
              <div>
                <p className="text-base font-bold text-primary">{demoBookings.length}</p>
                <p className="text-[0.6rem] text-muted-foreground">Bookings</p>
              </div>
              <div>
                <p className="text-base font-bold text-primary">{wishlistItems.length}</p>
                <p className="text-[0.6rem] text-muted-foreground">Wishlist</p>
              </div>
              <div>
                <p className="text-base font-bold text-primary">{unreadCount}</p>
                <p className="text-[0.6rem] text-muted-foreground">Unread</p>
              </div>
            </div>

            <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
              {NAV.map((item) => {
                const Icon = item.icon;
                const isActive = dashboardSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setDashboardSection(item.id)}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-glow-bluesky"
                        : "text-foreground/80 hover:bg-accent hover:text-primary",
                    )}
                  >
                    <Icon className="size-4" />
                    {item.label}
                    {item.id === "notifications" && unreadCount > 0 && (
                      <span
                        className={cn(
                          "ml-auto grid size-5 place-items-center rounded-full text-[0.6rem] font-bold",
                          isActive ? "bg-white/20 text-white" : "bg-rose-500 text-white",
                        )}
                      >
                        {unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="border-t border-border/60 p-3">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50"
              >
                <LogOut className="size-4" />
                Sign out
              </button>
            </div>
          </aside>

          {/* Mobile top tabs */}
          <div className="border-b border-border/60 bg-muted/30 p-2 sm:hidden">
            <Tabs value={dashboardSection} onValueChange={(v) => setDashboardSection(v as DashboardSection)}>
              <TabsList className="grid w-full grid-cols-4 bg-muted/60">
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Main content */}
          <div className="flex flex-col overflow-hidden">
            {/* Top bar */}
            <div className="flex items-center justify-between border-b border-border/60 bg-card px-5 py-4 sm:px-7">
              <div>
                <h2 className="text-lg font-bold capitalize text-foreground">
                  {dashboardSection === "notifications" ? "Notifications" : dashboardSection}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {dashboardSection === "bookings" && `Total spent: ${formatPrice(totalSpent)}`}
                  {dashboardSection === "wishlist" && `${wishlistItems.length} saved items`}
                  {dashboardSection === "profile" && "Manage your personal information"}
                  {dashboardSection === "notifications" && `${unreadCount} unread`}
                  {dashboardSection === "invoices" && `${demoInvoices.length} invoices`}
                  {dashboardSection === "payments" && "Manage your payment methods"}
                  {dashboardSection === "settings" && "Adjust your preferences"}
                </p>
              </div>
              <button
                onClick={closeDashboard}
                className="grid size-9 place-items-center rounded-xl border border-border/60 text-muted-foreground hover:text-foreground"
                aria-label="Close dashboard"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={dashboardSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* ===== BOOKINGS ===== */}
                  {dashboardSection === "bookings" && (
                    <div className="space-y-3">
                      {demoBookings.map((booking) => {
                        const status = STATUS_STYLE[booking.status];
                        const StatusIcon = status.icon;
                        return (
                          <div
                            key={booking.id}
                            className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-premium transition-shadow hover:shadow-premium-lg sm:flex-row sm:items-center"
                          >
                            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl sm:size-24 sm:shrink-0">
                              <Image src={booking.tripImage} alt={booking.tripTitle} fill sizes="96px" className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <h3 className="line-clamp-1 text-sm font-bold text-foreground">{booking.tripTitle}</h3>
                                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                                    <MapPin className="size-3 text-primary" />
                                    {booking.countryName}
                                    <span>·</span>
                                    <span className="font-mono">{booking.reference}</span>
                                  </p>
                                </div>
                                <Badge className={cn("shrink-0 gap-1", status.className)}>
                                  <StatusIcon className="size-3" />
                                  {status.label}
                                </Badge>
                              </div>
                              <div className="mt-2 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Calendar className="size-3 text-primary" />
                                  {formatDate(booking.startDate, { month: "short", day: "numeric" })}
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Users className="size-3 text-primary" />
                                  {booking.adults + booking.children + booking.infants} pax
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <CreditCard className="size-3 text-primary" />
                                  {booking.paymentStatus}
                                </div>
                                <div className="font-bold text-foreground">
                                  {formatPrice(booking.totalAmount, booking.currency)}
                                </div>
                              </div>
                              <div className="mt-3 flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    if (booking.tripId) {
                                      closeDashboard();
                                      setTripDetailId(booking.tripId);
                                    }
                                  }}
                                >
                                  View trip
                                </Button>
                                {booking.status === "pending" && booking.paymentStatus === "unpaid" && (
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      toast.success("Redirecting to payment...");
                                    }}
                                    className="bg-gradient-bluesky shadow-glow-bluesky"
                                  >
                                    Pay now
                                  </Button>
                                )}
                                {booking.status === "completed" && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => toast.success("Thanks for your review!")}
                                  >
                                    <Star className="size-3.5" />
                                    Leave review
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ===== WISHLIST ===== */}
                  {dashboardSection === "wishlist" && (
                    <div className="space-y-3">
                      {wishlistItems.length === 0 ? (
                        <EmptyState
                          icon={Heart}
                          title="Your wishlist is empty"
                          description="Save trips and hotels you love to find them here."
                          action={
                            <Button onClick={closeDashboard} className="bg-gradient-bluesky shadow-glow-bluesky">
                              Browse trips
                            </Button>
                          }
                        />
                      ) : (
                        wishlistItems.map((item) => {
                          const trip = item.trip;
                          const hotel = item.hotel;
                          const name = trip?.title ?? hotel?.name ?? "";
                          const image = trip?.imageUrl ?? hotel?.imageUrl ?? "";
                          const rating = trip?.rating ?? hotel?.rating ?? 0;
                          const price = trip?.price ?? hotel?.pricePerNight ?? 0;
                          return (
                            <div key={item.id} className="flex gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-premium">
                              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                                <Image src={image} alt={name} fill sizes="80px" className="object-cover" />
                              </div>
                              <div className="flex min-w-0 flex-1 flex-col gap-1">
                                <h4 className="line-clamp-1 text-sm font-bold text-foreground">{name}</h4>
                                <StarRating rating={rating} size={11} showValue />
                                <span className="text-sm font-bold text-primary">{formatPrice(price)}</span>
                                <div className="mt-auto flex items-center gap-2">
                                  {trip && (
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        closeDashboard();
                                        openBooking(trip);
                                      }}
                                      className="bg-gradient-bluesky shadow-glow-bluesky"
                                    >
                                      Book now
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setWishlistOpen(true);
                                      closeDashboard();
                                    }}
                                  >
                                    Open drawer
                                  </Button>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}

                  {/* ===== PROFILE ===== */}
                  {dashboardSection === "profile" && (
                    <form onSubmit={handleSaveProfile} className="space-y-5">
                      <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-gradient-bluesky-soft p-5">
                        <Avatar className="size-16 shrink-0">
                          <AvatarFallback className="bg-gradient-bluesky text-lg font-bold text-white">
                            {initials(profile.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-base font-bold text-foreground">{profile.name}</h3>
                          <p className="text-xs text-muted-foreground">Member since Jan 2024 · Gold tier</p>
                        </div>
                        <Button type="button" variant="outline" size="sm" className="shrink-0">
                          Change photo
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <ProfileField label="Full Name" icon={User}>
                          <Input
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          />
                        </ProfileField>
                        <ProfileField label="Email" icon={Mail}>
                          <Input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          />
                        </ProfileField>
                        <ProfileField label="Phone" icon={Phone}>
                          <Input
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          />
                        </ProfileField>
                        <ProfileField label="Nationality" icon={MapPin}>
                          <Input
                            value={profile.nationality}
                            onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
                          />
                        </ProfileField>
                        <ProfileField label="Date of Birth" icon={Calendar}>
                          <Input
                            type="date"
                            value={profile.dob}
                            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                          />
                        </ProfileField>
                        <ProfileField label="Address" icon={MapPin}>
                          <Input
                            value={profile.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          />
                        </ProfileField>
                      </div>

                      <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
                        <Button type="button" variant="outline">
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-gradient-bluesky shadow-glow-bluesky">
                          Save changes
                        </Button>
                      </div>
                    </form>
                  )}

                  {/* ===== NOTIFICATIONS ===== */}
                  {dashboardSection === "notifications" && (
                    <div className="space-y-2">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">{unreadCount} unread of {notifications.length} total</p>
                        <button
                          onClick={() => {
                            setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
                            toast.success("All marked as read");
                          }}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Mark all as read
                        </button>
                      </div>
                      {notifications.map((n) => {
                        const style = NOTIFICATION_STYLE[n.type];
                        const Icon = style.icon;
                        const isUnread = !n.readAt;
                        return (
                          <button
                            key={n.id}
                            onClick={() => {
                              if (!n.readAt) {
                                setNotifications((prev) =>
                                  prev.map((x) => (x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x)),
                                );
                              }
                            }}
                            className={cn(
                              "flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition-all hover:shadow-premium",
                              isUnread ? "border-primary/30 bg-primary/5" : "border-border/60 bg-card",
                            )}
                          >
                            <div className={cn("mt-0.5 grid size-9 shrink-0 place-items-center rounded-xl bg-muted", style.color)}>
                              <Icon className="size-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-bold text-foreground">{n.title}</p>
                                {isUnread && <span className="size-2 shrink-0 rounded-full bg-primary" />}
                              </div>
                              <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                              <p className="mt-1 text-[0.65rem] text-muted-foreground/70">
                                {formatDate(n.createdAt, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* ===== INVOICES ===== */}
                  {dashboardSection === "invoices" && (
                    <div className="space-y-3">
                      {demoInvoices.map((inv) => {
                        const booking = demoBookings.find((b) => b.id === inv.bookingId);
                        return (
                          <div
                            key={inv.id}
                            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-premium"
                          >
                            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/20">
                              <FileText className="size-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-sm font-bold text-foreground">{inv.number}</p>
                              <p className="line-clamp-1 text-xs text-muted-foreground">
                                {booking?.tripTitle ?? "Booking"} · {formatDate(inv.issuedAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-foreground">{formatPrice(inv.amount, inv.currency)}</p>
                              <p className="text-[0.65rem] text-muted-foreground">{inv.currency}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast.success("Downloading invoice...")}
                            >
                              <Download className="size-3.5" />
                              PDF
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* ===== PAYMENTS ===== */}
                  {dashboardSection === "payments" && (
                    <div className="space-y-4">
                      <div className="grid gap-3 sm:grid-cols-2">
                        {demoPaymentMethods.map((pm) => (
                          <div
                            key={pm.id}
                            className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 shadow-premium"
                          >
                            {pm.isDefault && (
                              <Badge className="absolute right-4 top-4 bg-primary text-primary-foreground">
                                Default
                              </Badge>
                            )}
                            <div className="mb-4 text-2xl font-bold text-foreground">{pm.brand}</div>
                            <p className="font-mono text-lg tracking-widest text-foreground">•••• {pm.last4}</p>
                            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                              <div>
                                <p className="font-medium uppercase">{pm.holder}</p>
                                <p>Expires {String(pm.expMonth).padStart(2, "0")}/{String(pm.expYear).slice(-2)}</p>
                              </div>
                              <button className="text-rose-500 hover:text-rose-600">
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/30 p-5 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                          <Plus className="size-6" />
                          <span className="text-sm font-semibold">Add payment method</span>
                        </button>
                      </div>

                      <div className="rounded-2xl border border-border/60 bg-gradient-bluesky-soft p-5">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
                          <CreditCard className="size-4 text-primary" />
                          Spending summary
                        </h4>
                        <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                          <div>
                            <p className="text-xl font-bold text-foreground">{formatPrice(totalSpent)}</p>
                            <p className="text-[0.65rem] text-muted-foreground">Total spent</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold text-foreground">{demoBookings.length}</p>
                            <p className="text-[0.65rem] text-muted-foreground">Trips booked</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold text-emerald-600">{formatPrice(totalSpent * 0.05)}</p>
                            <p className="text-[0.65rem] text-muted-foreground">Reward points</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ===== SETTINGS ===== */}
                  {dashboardSection === "settings" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-3 text-sm font-bold text-foreground">Notifications</h3>
                        <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card">
                          <SettingRow
                            label="Email marketing"
                            description="Receive deals, offers, and travel inspiration"
                            checked={settings.emailMarketing}
                            onChange={(v) => setSettings({ ...settings, emailMarketing: v })}
                          />
                          <SettingRow
                            label="SMS alerts"
                            description="Get booking updates by text message"
                            checked={settings.smsAlerts}
                            onChange={(v) => setSettings({ ...settings, smsAlerts: v })}
                          />
                          <SettingRow
                            label="Push notifications"
                            description="Real-time updates in your browser"
                            checked={settings.pushNotifications}
                            onChange={(v) => setSettings({ ...settings, pushNotifications: v })}
                          />
                          <SettingRow
                            label="Weekly digest"
                            description="A summary of your travel activity every Monday"
                            checked={settings.weeklyDigest}
                            onChange={(v) => setSettings({ ...settings, weeklyDigest: v })}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3 text-sm font-bold text-foreground">Security</h3>
                        <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card">
                          <SettingRow
                            label="Two-factor authentication"
                            description="Require a code on every new device"
                            checked={settings.twoFactor}
                            onChange={(v) => setSettings({ ...settings, twoFactor: v })}
                          />
                          <button
                            onClick={() => openAuth("forgot")}
                            className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-accent"
                          >
                            <div>
                              <p className="text-sm font-semibold text-foreground">Change password</p>
                              <p className="text-xs text-muted-foreground">Last changed 3 months ago</p>
                            </div>
                            <ChevronRight className="size-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3 text-sm font-bold text-foreground">Preferences</h3>
                        <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card">
                          <SettingRow
                            label="Language"
                            description={settings.language}
                            checked={false}
                            hideSwitch
                            onChange={() => {}}
                          />
                          <SettingRow
                            label="Currency"
                            description={settings.currency}
                            checked={false}
                            hideSwitch
                            onChange={() => {}}
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
                        <Button variant="outline" onClick={() => setSettings({
                          emailMarketing: true, smsAlerts: false, pushNotifications: true,
                          weeklyDigest: true, twoFactor: false, language: "English", currency: "USD",
                        })}>
                          Reset
                        </Button>
                        <Button onClick={handleSaveSettings} className="bg-gradient-bluesky shadow-glow-bluesky">
                          Save settings
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ProfileField({ label, icon: Icon, children }: { label: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
        <Icon className="size-3.5 text-primary" />
        {label}
      </Label>
      {children}
    </div>
  );
}

function SettingRow({
  label,
  description,
  checked,
  onChange,
  hideSwitch,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hideSwitch?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-4">
      <div>
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {!hideSwitch && <Switch checked={checked} onCheckedChange={onChange} />}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="grid size-20 place-items-center rounded-full bg-muted">
        <Icon className="size-9 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
