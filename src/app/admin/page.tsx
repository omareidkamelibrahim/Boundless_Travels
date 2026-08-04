"use client";

import { useSearchParams } from "next/navigation";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  DollarSign, CalendarCheck, Users, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownRight, Eye, Edit3, Trash2, Copy, Archive,
  CheckCircle2, XCircle, FileText, Star,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, formatPrice, formatDate, initials } from "@/lib/utils";
import { toast } from "sonner";
import {
  adminBookings, adminUsers, adminTrips, revenueData, bookingsByCountry,
  topDestinations, adminKPIs,
} from "@/data/admin";

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

export default function AdminPage() {
  const searchParams = useSearchParams();
  const activeModule = searchParams.get("section") || "dashboard";
  return (
    <AdminLayout activeModule={activeModule}>
      {activeModule === "dashboard" && <DashboardModule />}
      {activeModule === "analytics" && <AnalyticsModule />}
      {activeModule === "bookings" && <BookingsModule />}
      {activeModule === "users" && <UsersModule />}
      {activeModule === "trips" && <TripsModule />}
      {activeModule === "customers" && <CustomersModule />}
      {!["dashboard", "analytics", "bookings", "users", "trips", "customers"].includes(activeModule) && (
        <GenericModule moduleId={activeModule} />
      )}
    </AdminLayout>
  );
}

// ===== DASHBOARD =====
function DashboardModule() {
  const k = adminKPIs;
  return (
    <div className="space-y-6">
      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: DollarSign, label: "Total Revenue", value: formatPrice(k.totalRevenue), change: `+${k.monthlyGrowth}%`, isPositive: true },
          { icon: CalendarCheck, label: "Total Bookings", value: k.totalBookings.toLocaleString(), change: "+8.3%", isPositive: true },
          { icon: Users, label: "Customers", value: k.totalCustomers.toLocaleString(), change: "+12.1%", isPositive: true },
          { icon: TrendingUp, label: "Conversion Rate", value: `${k.conversionRate}%`, change: "-0.4%", isPositive: false },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  <p className="mt-1.5 text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className="grid size-10 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15">
                  <Icon className="size-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                {stat.isPositive ? <ArrowUpRight className="size-3.5 text-emerald-500" /> : <ArrowDownRight className="size-3.5 text-rose-500" />}
                <span className={cn("font-semibold", stat.isPositive ? "text-emerald-600" : "text-rose-500")}>{stat.change}</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="text-sm font-bold text-foreground">Revenue Trend</h3><p className="text-xs text-muted-foreground">Last 12 months</p></div>
            <Badge className="bg-emerald-100 text-emerald-700">+{k.monthlyGrowth}%</Badge>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0F6FFF" stopOpacity={0.3} /><stop offset="100%" stopColor="#0F6FFF" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} formatter={(v: number) => [formatPrice(v), "Revenue"]} />
              <Area type="monotone" dataKey="revenue" stroke="#0F6FFF" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
          <div className="mb-4 flex items-center justify-between">
            <div><h3 className="text-sm font-bold text-foreground">Bookings by Month</h3><p className="text-xs text-muted-foreground">Last 12 months</p></div>
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
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-foreground">{d.name}</p><p className="text-xs text-muted-foreground">{d.visitors.toLocaleString()} visitors</p></div>
                <span className="text-sm font-bold text-foreground">{formatPrice(d.revenue)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
          <h3 className="mb-4 text-sm font-bold text-foreground">Bookings by Country</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={bookingsByCountry} dataKey="bookings" nameKey="country" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={2}>
                {bookingsByCountry.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent bookings table */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-premium">
        <div className="flex items-center justify-between p-5 pb-3"><h3 className="text-sm font-bold text-foreground">Recent Bookings</h3></div>
        <DataTable
          data={adminBookings.slice(0, 5)}
          columns={[
            { key: "reference", label: "Reference", render: (b) => <span className="font-mono text-xs font-bold">{b.reference}</span> },
            { key: "customer", label: "Customer", render: (b) => (
              <div className="flex items-center gap-2">
                <Avatar className="size-6"><AvatarFallback className="bg-gradient-bluesky text-[0.55rem] font-bold text-white">{initials(b.customer)}</AvatarFallback></Avatar>
                <span className="text-xs font-medium">{b.customer}</span>
              </div>
            ) },
            { key: "tripTitle", label: "Trip" },
            { key: "amount", label: "Amount", render: (b) => <span className="font-bold">{formatPrice(b.amount, b.currency)}</span> },
            { key: "status", label: "Status", render: (b) => <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", STATUS_STYLES[b.status])}>{b.status}</span> },
          ]}
          title=""
          pageSize={5}
        />
      </div>
    </div>
  );
}

// ===== ANALYTICS =====
function AnalyticsModule() {
  const k = adminKPIs;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { icon: DollarSign, label: "Avg Order Value", value: formatPrice(k.avgOrderValue), change: "+5.2%", isPositive: true },
          { icon: TrendingUp, label: "Conversion Rate", value: `${k.conversionRate}%`, change: "-0.4%", isPositive: false },
          { icon: TrendingDown, label: "Cancellation Rate", value: `${k.cancelledRate}%`, change: "-1.2%", isPositive: true },
          { icon: TrendingDown, label: "Refund Rate", value: `${k.refundRate}%`, change: "-0.8%", isPositive: true },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p><p className="mt-1.5 text-2xl font-bold text-foreground">{stat.value}</p></div>
                <div className="grid size-10 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15"><Icon className="size-5" /></div>
              </div>
              <div className="mt-3 flex items-center gap-1.5 text-xs">
                {stat.isPositive ? <ArrowUpRight className="size-3.5 text-emerald-500" /> : <ArrowDownRight className="size-3.5 text-rose-500" />}
                <span className={cn("font-semibold", stat.isPositive ? "text-emerald-600" : "text-rose-500")}>{stat.change}</span>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </div>
          );
        })}
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

// ===== BOOKINGS =====
function BookingsModule() {
  return (
    <DataTable
      data={adminBookings}
      title="Bookings"
      subtitle="Manage all customer bookings — approve, reject, refund, assign agents"
      columns={[
        { key: "reference", label: "Reference", render: (b) => <span className="font-mono text-xs font-bold">{b.reference}</span> },
        { key: "customer", label: "Customer", render: (b) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-7"><AvatarFallback className="bg-gradient-bluesky text-[0.6rem] font-bold text-white">{initials(b.customer)}</AvatarFallback></Avatar>
            <div className="min-w-0"><p className="truncate text-xs font-medium">{b.customer}</p><p className="truncate text-[0.65rem] text-muted-foreground">{b.customerEmail}</p></div>
          </div>
        ) },
        { key: "tripTitle", label: "Trip", render: (b) => <span className="text-xs text-muted-foreground">{b.tripTitle}</span> },
        { key: "amount", label: "Amount", render: (b) => <span className="font-bold">{formatPrice(b.amount, b.currency)}</span> },
        { key: "status", label: "Status", render: (b) => <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", STATUS_STYLES[b.status])}>{b.status}</span> },
        { key: "paymentStatus", label: "Payment", render: (b) => <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", b.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" : b.paymentStatus === "unpaid" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700")}>{b.paymentStatus}</span> },
      ]}
      onView={(b) => toast.info(`Viewing ${b.reference}`)}
      onEdit={(b) => toast.info(`Editing ${b.reference}`)}
      onDelete={(b) => toast.success(`Deleted ${b.reference}`)}
      onDuplicate={(b) => toast.success(`Duplicated ${b.reference}`)}
      onArchive={(b) => toast.success(`Archived ${b.reference}`)}
      onAdd={() => toast.info("Create booking form (coming soon)")}
      extraActions={(b) => (
        <>
          {b.status === "pending" && (
            <button aria-label="Approve" onClick={() => toast.success(`Approved ${b.reference}`)} className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-emerald-50 hover:text-emerald-600">
              <CheckCircle2 className="size-3.5" />
            </button>
          )}
          {b.status !== "cancelled" && (
            <button aria-label="Cancel" onClick={() => toast.success(`Cancelled ${b.reference}`)} className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-rose-50 hover:text-rose-500">
              <XCircle className="size-3.5" />
            </button>
          )}
          <button aria-label="Invoice" onClick={() => toast.success(`Invoice generated for ${b.reference}`)} className="grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary">
            <FileText className="size-3.5" />
          </button>
        </>
      )}
    />
  );
}

// ===== USERS =====
function UsersModule() {
  return (
    <DataTable
      data={adminUsers}
      title="Users"
      subtitle="Manage user accounts, assign roles and permissions"
      columns={[
        { key: "name", label: "User", render: (u) => (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8"><AvatarFallback className="bg-gradient-bluesky text-[0.65rem] font-bold text-white">{initials(u.name)}</AvatarFallback></Avatar>
            <div className="min-w-0"><p className="truncate text-xs font-semibold">{u.name}</p><p className="truncate text-[0.65rem] text-muted-foreground">{u.email}</p></div>
          </div>
        ) },
        { key: "role", label: "Role", render: (u) => <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", u.role === "admin" ? "bg-primary text-primary-foreground" : u.role === "agent" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600")}>{u.role}</span> },
        { key: "status", label: "Status", render: (u) => <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", STATUS_STYLES[u.status])}>{u.status}</span> },
        { key: "totalBookings", label: "Bookings", render: (u) => <span className="font-semibold">{u.totalBookings}</span> },
        { key: "totalSpent", label: "Total Spent", render: (u) => <span className="font-bold">{u.totalSpent > 0 ? formatPrice(u.totalSpent) : "—"}</span> },
      ]}
      onView={(u) => toast.info(`Viewing ${u.name}`)}
      onEdit={(u) => toast.info(`Editing ${u.name}`)}
      onDelete={(u) => toast.success(`Deleted ${u.name}`)}
      onAdd={() => toast.info("Create user form (coming soon)")}
    />
  );
}

// ===== TRIPS =====
function TripsModule() {
  const tripsWithId = adminTrips.map((t) => ({ ...t, id: t.id }));
  return (
    <DataTable
      data={tripsWithId}
      title="Trips"
      subtitle="Create, edit, duplicate, archive trips — manage prices, itinerary, images"
      columns={[
        { key: "title", label: "Trip", render: (t) => (
          <div>
            <p className="text-xs font-bold text-foreground">{t.title}</p>
            <p className="text-[0.65rem] text-muted-foreground">{t.country} · {t.durationDays} days</p>
          </div>
        ) },
        { key: "type", label: "Type", render: (t) => <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[0.6rem] font-bold capitalize text-sky-700">{t.type}</span> },
        { key: "price", label: "Price", render: (t) => <span className="font-bold">{formatPrice(t.price)}</span> },
        { key: "bookings", label: "Bookings", render: (t) => <span className="font-semibold">{t.bookings}</span> },
        { key: "rating", label: "Rating", render: (t) => <span className="flex items-center gap-1"><Star className="size-3 fill-amber-400 text-amber-400" /><span className="font-semibold">{t.rating}</span></span> },
        { key: "status", label: "Status", render: (t) => <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", STATUS_STYLES[t.status])}>{t.status}</span> },
        { key: "featured", label: "Featured", render: (t) => t.featured ? <Badge className="bg-amber-100 text-amber-700">★</Badge> : <span className="text-muted-foreground/40">—</span> },
      ]}
      onView={(t) => toast.info(`Viewing ${t.title}`)}
      onEdit={(t) => toast.info(`Editing ${t.title}`)}
      onDelete={(t) => toast.success(`Deleted ${t.title}`)}
      onDuplicate={(t) => toast.success(`Duplicated ${t.title}`)}
      onArchive={(t) => toast.success(`Archived ${t.title}`)}
      onPublish={(t) => toast.success(`Published ${t.title}`)}
      onRestore={(t) => toast.success(`Restored ${t.title}`)}
      onAdd={() => toast.info("Create trip form (coming soon)")}
      onImport={() => toast.info("Import trips from Excel")}
    />
  );
}

// ===== CUSTOMERS =====
function CustomersModule() {
  const customers = adminUsers.filter((u) => u.role === "customer").map((u) => ({ ...u, id: u.id }));
  return (
    <DataTable
      data={customers}
      title="Customers"
      subtitle="View and manage customer accounts"
      columns={[
        { key: "name", label: "Name", render: (u) => (
          <div className="flex items-center gap-2.5">
            <Avatar className="size-8"><AvatarFallback className="bg-gradient-bluesky text-[0.65rem] font-bold text-white">{initials(u.name)}</AvatarFallback></Avatar>
            <div className="min-w-0"><p className="truncate text-xs font-semibold">{u.name}</p><p className="truncate text-[0.65rem] text-muted-foreground">{u.email}</p></div>
          </div>
        ) },
        { key: "status", label: "Status", render: (u) => <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", STATUS_STYLES[u.status])}>{u.status}</span> },
        { key: "totalBookings", label: "Bookings", render: (u) => <span className="font-semibold">{u.totalBookings}</span> },
        { key: "totalSpent", label: "Total Spent", render: (u) => <span className="font-bold">{formatPrice(u.totalSpent)}</span> },
        { key: "joinedAt", label: "Joined", render: (u) => <span className="text-xs text-muted-foreground">{formatDate(u.joinedAt, { year: "numeric", month: "short" })}</span> },
      ]}
      onView={(u) => toast.info(`Viewing ${u.name}`)}
      onEdit={(u) => toast.info(`Editing ${u.name}`)}
      onDelete={(u) => toast.success(`Deleted ${u.name}`)}
      onAdd={() => toast.info("Add customer (coming soon)")}
    />
  );
}

// ===== GENERIC MODULE (for all other entities) =====
function GenericModule({ moduleId }: { moduleId: string }) {
  // Generate some dummy data for the generic module
  const dummyData = Array.from({ length: 10 }, (_, i) => ({
    id: `${moduleId}-${i + 1}`,
    name: `${moduleId.charAt(0).toUpperCase() + moduleId.slice(1).replace(/-/g, " ")} Item ${i + 1}`,
    status: i % 3 === 0 ? "active" : i % 3 === 1 ? "pending" : "inactive",
    created: new Date(Date.now() - i * 86400000).toISOString(),
    type: i % 2 === 0 ? "Type A" : "Type B",
  }));

  const title = moduleId.charAt(0).toUpperCase() + moduleId.slice(1).replace(/-/g, " ");

  return (
    <DataTable
      data={dummyData}
      title={title}
      subtitle={`Manage ${title.toLowerCase()} — full CRUD, publish/unpublish, bulk actions, import/export`}
      columns={[
        { key: "name", label: "Name", render: (r) => <span className="text-xs font-semibold">{r.name}</span> },
        { key: "type", label: "Type" },
        { key: "status", label: "Status", render: (r) => <span className={cn("inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold capitalize", STATUS_STYLES[r.status])}>{r.status}</span> },
        { key: "created", label: "Created", render: (r) => <span className="text-xs text-muted-foreground">{formatDate(r.created)}</span> },
      ]}
      onView={() => toast.info(`View ${title} (coming soon)`)}
      onEdit={() => toast.info(`Edit ${title} (coming soon)`)}
      onDelete={() => toast.success("Deleted")}
      onDuplicate={() => toast.success("Duplicated")}
      onArchive={() => toast.success("Archived")}
      onPublish={() => toast.success("Published")}
      onRestore={() => toast.success("Restored")}
      onAdd={() => toast.info(`Create ${title} form (coming soon)`)}
      onImport={() => toast.info(`Import ${title} from Excel`)}
    />
  );
}
