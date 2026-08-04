"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  LayoutDashboard, CalendarCheck, Users, Plane, DollarSign,
  TrendingUp, TrendingDown, Search, Trash2, Edit3,
  Eye, Download, ChevronLeft, ChevronRight, X, ArrowUpRight, ArrowDownRight,
  Activity, Globe, Star, Filter, Plus,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, formatPrice, formatDate, initials } from "@/lib/utils";
import { useUI } from "@/stores/use-ui";
import { useAuth } from "@/stores/use-auth";
import { toast } from "sonner";
import {
  adminBookings, adminUsers, adminTrips, revenueData, bookingsByCountry,
  topDestinations, adminKPIs, type AdminBooking, type AdminUser, type AdminTrip,
} from "@/data/admin";

type AdminSection = "overview" | "bookings" | "users" | "trips" | "analytics";

const NAV: { id: AdminSection; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: Activity },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "users", label: "Users", icon: Users },
  { id: "trips", label: "Trips", icon: Plane },
];

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-rose-100 text-rose-700",
  completed: "bg-sky-100 text-sky-700",
  refunded: "bg-slate-100 text-slate-700",
  active: "bg-emerald-100 text-emerald-700",
  inactive: "bg-slate-100 text-slate-600",
  suspended: "bg-rose-100 text-rose-700",
  draft: "bg-slate-100 text-slate-600",
  archived: "bg-slate-100 text-slate-500",
};

const CHART_COLORS = ["#0F6FFF", "#1D9BF0", "#33C3FF", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function AdminDashboardModal() {
  const { adminOpen, closeAdmin, openAuth } = useUI();
  const { isAuthenticated } = useAuth();
  const [section, setSection] = useState<AdminSection>("overview");
  const [search, setSearch] = useState("");

  const handleClose = () => closeAdmin();

  // If not authenticated, prompt login — deferred to useEffect so we don't
  // trigger setState on another component during render.
  useEffect(() => {
    if (adminOpen && !isAuthenticated) {
      toast.info("Please sign in as an admin to access the dashboard");
      closeAdmin();
      openAuth("login");
    }
  }, [adminOpen, isAuthenticated, closeAdmin, openAuth]);

  return (
    <DialogPrimitive.Root open={adminOpen} onOpenChange={(o) => !o && closeAdmin()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[4px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-card shadow-2xl",
            "w-[calc(100vw-1rem)] max-w-[1400px] h-[90vh]",
          )}
        >
          <DialogTitle className="sr-only">Admin Dashboard</DialogTitle>
          <DialogDescription className="sr-only">
            Manage bookings, users, trips, and view analytics.
          </DialogDescription>

          <div className="grid h-full grid-cols-1 sm:grid-cols-[220px_1fr]">
            {/* Sidebar */}
            <aside className="hidden flex-col border-r border-border/60 bg-slate-950 text-slate-300 sm:flex">
              <div className="flex items-center gap-2.5 p-5">
                <div className="grid size-9 place-items-center rounded-xl bg-gradient-bluesky shadow-glow-bluesky">
                  <LayoutDashboard className="size-5 text-white" />
                </div>
                <div className="leading-none">
                  <p className="text-sm font-bold text-white">BlueSky Admin</p>
                  <p className="text-[0.6rem] uppercase tracking-wider text-slate-400">Control Panel</p>
                </div>
              </div>
              <nav className="flex-1 space-y-0.5 px-3">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = section === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSection(item.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-gradient-bluesky text-white shadow-glow-bluesky"
                          : "text-slate-400 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Icon className="size-4" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
              <div className="border-t border-white/10 p-3">
                <button
                  onClick={handleClose}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <X className="size-4" /> Close
                </button>
              </div>
            </aside>

            {/* Mobile nav */}
            <div className="flex items-center gap-1 overflow-x-auto border-b border-border/60 bg-slate-950 px-2 py-2 no-scrollbar sm:hidden">
              {NAV.map((item) => {
                const Icon = item.icon;
                const isActive = section === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSection(item.id)}
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold",
                      isActive ? "bg-gradient-bluesky text-white" : "text-slate-400",
                    )}
                  >
                    <Icon className="size-3.5" />
                    {item.label}
                  </button>
                );
              })}
              <button onClick={handleClose} className="ml-auto shrink-0 rounded-lg p-1.5 text-slate-400">
                <X className="size-4" />
              </button>
            </div>

            {/* Main content */}
            <div className="flex flex-col overflow-hidden bg-background">
              {/* Top bar */}
              <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 px-5 py-3.5 sm:px-7">
                <div>
                  <h2 className="text-lg font-bold capitalize text-foreground">{section}</h2>
                  <p className="text-xs text-muted-foreground">
                    {section === "overview" && "Real-time platform metrics and KPIs"}
                    {section === "analytics" && "Revenue, bookings, and conversion analytics"}
                    {section === "bookings" && "Manage all customer bookings"}
                    {section === "users" && "Manage user accounts and roles"}
                    {section === "trips" && "Manage trip catalog and inventory"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative hidden sm:block">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="h-9 w-48 rounded-xl pl-9"
                    />
                  </div>
                  <Button size="sm" variant="outline" className="gap-1.5 rounded-xl">
                    <Download className="size-3.5" /> Export
                  </Button>
                </div>
              </header>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-7">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={section}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {section === "overview" && <OverviewSection />}
                    {section === "analytics" && <AnalyticsSection />}
                    {section === "bookings" && <BookingsSection search={search} />}
                    {section === "users" && <UsersSection search={search} />}
                    {section === "trips" && <TripsSection search={search} />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ===== KPI CARD =====
function KPICard({
  icon: Icon, label, value, change, isPositive, prefix, suffix, decimals,
}: {
  icon: React.ElementType; label: string; value: number;
  change?: string; isPositive?: boolean;
  prefix?: string; suffix?: string; decimals?: number;
}) {
  const display = decimals != null ? value.toFixed(decimals) : value.toLocaleString();
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1.5 text-2xl font-bold text-foreground">
            {prefix}{display}{suffix}
          </p>
        </div>
        <div className="grid size-10 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15">
          <Icon className="size-5" />
        </div>
      </div>
      {change && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {isPositive ? (
            <ArrowUpRight className="size-3.5 text-emerald-500" />
          ) : (
            <ArrowDownRight className="size-3.5 text-rose-500" />
          )}
          <span className={cn("font-semibold", isPositive ? "text-emerald-600" : "text-rose-500")}>
            {change}
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
}

// ===== OVERVIEW SECTION =====
function OverviewSection() {
  const k = adminKPIs;
  return (
    <div className="space-y-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard icon={DollarSign} label="Total Revenue" value={k.totalRevenue} prefix="$" change={`+${k.monthlyGrowth}%`} isPositive />
        <KPICard icon={CalendarCheck} label="Total Bookings" value={k.totalBookings} change="+8.3%" isPositive />
        <KPICard icon={Users} label="Customers" value={k.totalCustomers} change="+12.1%" isPositive />
        <KPICard icon={TrendingUp} label="Conversion Rate" value={k.conversionRate} suffix="%" decimals={1} change="-0.4%" isPositive={false} />
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue area chart */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Revenue Trend</h3>
              <p className="text-xs text-muted-foreground">Last 12 months</p>
            </div>
            <Badge className="bg-emerald-100 text-emerald-700">+{k.monthlyGrowth}%</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0F6FFF" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0F6FFF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }}
                formatter={(v: number) => [formatPrice(v), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#0F6FFF" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings bar chart */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">Bookings by Month</h3>
              <p className="text-xs text-muted-foreground">Last 12 months</p>
            </div>
            <Badge className="bg-sky-100 text-sky-700">{k.totalBookings} total</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Bar dataKey="bookings" fill="#1D9BF0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top destinations + bookings by country */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
          <h3 className="mb-4 text-sm font-bold text-foreground">Top Destinations</h3>
          <div className="space-y-3">
            {topDestinations.map((d, i) => (
              <div key={d.name} className="flex items-center gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.visitors.toLocaleString()} visitors</p>
                </div>
                <span className="text-sm font-bold text-foreground">{formatPrice(d.revenue)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
          <h3 className="mb-4 text-sm font-bold text-foreground">Bookings by Country</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={bookingsByCountry}
                dataKey="bookings"
                nameKey="country"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={45}
                paddingAngle={2}
              >
                {bookingsByCountry.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-premium">
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="text-sm font-bold text-foreground">Recent Bookings</h3>
          <Button size="sm" variant="ghost" className="text-xs">View all</Button>
        </div>
        <RecentBookingsTable bookings={adminBookings.slice(0, 5)} />
      </div>
    </div>
  );
}

// ===== ANALYTICS SECTION =====
function AnalyticsSection() {
  const k = adminKPIs;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KPICard icon={DollarSign} label="Avg Order Value" value={k.avgOrderValue} prefix="$" change="+5.2%" isPositive />
        <KPICard icon={TrendingUp} label="Conversion Rate" value={k.conversionRate} suffix="%" decimals={1} change="-0.4%" isPositive={false} />
        <KPICard icon={TrendingDown} label="Cancellation Rate" value={k.cancelledRate} suffix="%" decimals={1} change="-1.2%" isPositive />
        <KPICard icon={TrendingDown} label="Refund Rate" value={k.refundRate} suffix="%" decimals={1} change="-0.8%" isPositive />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
          <h3 className="mb-4 text-sm font-bold text-foreground">Revenue vs Bookings</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#0F6FFF" strokeWidth={2.5} dot={{ r: 3 }} name="Revenue" />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
          <h3 className="mb-4 text-sm font-bold text-foreground">Revenue by Country</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bookingsByCountry} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <YAxis type="category" dataKey="country" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={(v: number) => [formatPrice(v), "Revenue"]} />
              <Bar dataKey="revenue" fill="#33C3FF" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// ===== RECENT BOOKINGS TABLE (used in overview) =====
function RecentBookingsTable({ bookings }: { bookings: AdminBooking[] }) {
  return (
   div_table(bookings)
  );
  function div_table(items: AdminBooking[]) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-2.5 text-left font-semibold">Reference</th>
              <th className="px-5 py-2.5 text-left font-semibold">Customer</th>
              <th className="px-5 py-2.5 text-left font-semibold">Trip</th>
              <th className="px-5 py-2.5 text-right font-semibold">Amount</th>
              <th className="px-5 py-2.5 text-center font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b.id} className="border-b border-border/40 transition-colors hover:bg-accent/30">
                <td className="px-5 py-3 font-mono text-xs font-bold text-foreground">{b.reference}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-gradient-bluesky text-[0.6rem] font-bold text-white">
                        {initials(b.customer)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-foreground">{b.customer}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{b.tripTitle}</td>
                <td className="px-5 py-3 text-right font-bold text-foreground">{formatPrice(b.amount, b.currency)}</td>
                <td className="px-5 py-3 text-center">
                  <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", STATUS_STYLES[b.status])}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

// ===== BOOKINGS SECTION =====
function BookingsSection({ search }: { search: string }) {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return adminBookings;
    return adminBookings.filter((b) =>
      b.reference.toLowerCase().includes(q) ||
      b.customer.toLowerCase().includes(q) ||
      b.tripTitle.toLowerCase().includes(q) ||
      b.country.toLowerCase().includes(q)
    );
  }, [search]);
  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.min(page, totalPages);
  const items = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{filtered.length}</span> bookings</p>
        <Button size="sm" className="gap-1.5 rounded-xl bg-gradient-bluesky">
          <Plus className="size-3.5" /> Add Booking
        </Button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left font-semibold">Reference</th>
                <th className="px-4 py-3 text-left font-semibold">Customer</th>
                <th className="px-4 py-3 text-left font-semibold">Trip</th>
                <th className="px-4 py-3 text-right font-semibold">Amount</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
                <th className="px-4 py-3 text-center font-semibold">Payment</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-b border-border/40 transition-colors hover:bg-accent/30">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-foreground">{b.reference}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarFallback className="bg-gradient-bluesky text-[0.6rem] font-bold text-white">
                          {initials(b.customer)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-foreground">{b.customer}</p>
                        <p className="truncate text-[0.65rem] text-muted-foreground">{b.customerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{b.tripTitle}</td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">{formatPrice(b.amount, b.currency)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", STATUS_STYLES[b.status])}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", b.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : b.paymentStatus === "unpaid" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700")}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button aria-label="View" className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary"><Eye className="size-3.5" /></button>
                      <button aria-label="Edit" className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary"><Edit3 className="size-3.5" /></button>
                      <button aria-label="Delete" onClick={() => toast.success("Booking deleted (demo)")} className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-500"><Trash2 className="size-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border/60 px-4 py-3">
          <p className="text-xs text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="grid size-8 place-items-center rounded-lg border border-border/60 disabled:opacity-40 hover:bg-accent"><ChevronLeft className="size-4" /></button>
            <span className="px-3 text-xs font-semibold">{currentPage} / {totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="grid size-8 place-items-center rounded-lg border border-border/60 disabled:opacity-40 hover:bg-accent"><ChevronRight className="size-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== USERS SECTION =====
function UsersSection({ search }: { search: string }) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return adminUsers;
    return adminUsers.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{filtered.length}</span> users</p>
        <Button size="sm" className="gap-1.5 rounded-xl bg-gradient-bluesky">
          <Plus className="size-3.5" /> Add User
        </Button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-center font-semibold">Role</th>
                <th className="px-4 py-3 text-center font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Bookings</th>
                <th className="px-4 py-3 text-right font-semibold">Total Spent</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/40 transition-colors hover:bg-accent/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-gradient-bluesky text-[0.65rem] font-bold text-white">
                          {initials(u.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-foreground">{u.name}</p>
                        <p className="truncate text-[0.65rem] text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", u.role === "admin" ? "bg-primary text-primary-foreground" : u.role === "agent" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600")}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", STATUS_STYLES[u.status])}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground">{u.totalBookings}</td>
                  <td className="px-4 py-3 text-right font-bold text-foreground">{u.totalSpent > 0 ? formatPrice(u.totalSpent) : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button aria-label="View" className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary"><Eye className="size-3.5" /></button>
                      <button aria-label="Edit" className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary"><Edit3 className="size-3.5" /></button>
                      <button aria-label="Delete" onClick={() => toast.success("User deleted (demo)")} className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-500"><Trash2 className="size-3.5" /></button>
                    </div>
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

// ===== TRIPS SECTION =====
function TripsSection({ search }: { search: string }) {
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return adminTrips;
    return adminTrips.filter((t) => t.title.toLowerCase().includes(q) || t.country.toLowerCase().includes(q));
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground"><span className="font-bold text-foreground">{filtered.length}</span> trips</p>
        <Button size="sm" className="gap-1.5 rounded-xl bg-gradient-bluesky">
          <Plus className="size-3.5" /> Add Trip
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <div key={t.id} className="rounded-2xl border border-border/60 bg-card p-4 shadow-premium transition-shadow hover:shadow-premium-lg">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="line-clamp-2 text-sm font-bold text-foreground">{t.title}</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.country} · {t.durationDays} days</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button aria-label="Edit" className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary"><Edit3 className="size-3.5" /></button>
                <button aria-label="Delete" onClick={() => toast.success("Trip deleted (demo)")} className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-500"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-muted/40 py-1.5">
                <p className="text-[0.6rem] uppercase text-muted-foreground">Price</p>
                <p className="text-xs font-bold text-foreground">{formatPrice(t.price)}</p>
              </div>
              <div className="rounded-lg bg-muted/40 py-1.5">
                <p className="text-[0.6rem] uppercase text-muted-foreground">Bookings</p>
                <p className="text-xs font-bold text-foreground">{t.bookings}</p>
              </div>
              <div className="rounded-lg bg-muted/40 py-1.5">
                <p className="text-[0.6rem] uppercase text-muted-foreground">Rating</p>
                <p className="text-xs font-bold text-foreground">{t.rating}★</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", STATUS_STYLES[t.status])}>
                {t.status}
              </span>
              <div className="flex items-center gap-1.5">
                {t.featured && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[0.6rem] font-bold text-amber-700">Featured</span>}
                <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[0.6rem] font-bold capitalize text-sky-700">{t.type}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
