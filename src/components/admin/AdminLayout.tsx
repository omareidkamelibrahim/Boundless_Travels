"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Menu, ChevronLeft, ChevronRight, LogOut, Bell, Search,
  Shield, User, Globe, Home, ChevronDown, Plus, Zap, Clock,
  CheckCircle2, AlertCircle, Calendar, Command, LayoutDashboard,
  TrendingUp, Users as UsersIcon, DollarSign, ArrowUpRight,
} from "lucide-react";
import {
  Sheet, SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/stores/use-auth";
import { useUI } from "@/stores/use-ui";
import { cn, initials } from "@/lib/utils";
import { toast } from "sonner";
import { NAV_GROUPS, ALL_NAV_ITEMS } from "@/components/admin/nav-config";

interface AdminLayoutProps {
  children: React.ReactNode;
  activeModule: string;
}

const QUICK_ADD_ITEMS = [
  { id: "trips", label: "New Trip", icon: Plus },
  { id: "users", label: "New User", icon: User },
  { id: "bookings", label: "New Booking", icon: Calendar },
  { id: "blog", label: "New Blog Post", icon: Plus },
  { id: "coupons", label: "New Coupon", icon: Plus },
];

/**
 * Enterprise Admin Layout — completely separate from the public website.
 *
 * - Powerful sticky top navbar with:
 *   - Collapsible sidebar toggle
 *   - Rich breadcrumb (Home / Admin / Module)
 *   - Global search (command-palette style)
 *   - Quick-add dropdown (Create Trip, User, Booking, Blog, Coupon)
 *   - System status indicator (live, all systems operational)
 *   - Live clock (updates every second)
 *   - Notifications bell with dropdown preview
 *   - View Website button (Globe, Boundless gradient)
 *   - User avatar dropdown
 * - Collapsible left sidebar with grouped navigation (50+ items)
 * - "Back to Website" button in sidebar above Logout
 */
export function AdminLayout({ children, activeModule }: AdminLayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { setCommandOpen } = useUI();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [now, setNow] = useState<string>("");

  // Live clock — updates every second, SSR-safe (renders empty on server)
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleNavigate = (moduleId: string) => {
    router.push(`/admin?section=${moduleId === "dashboard" ? "" : moduleId}`);
    setMobileNavOpen(false);
  };

  const goToWebsite = () => router.push("/");

  const moduleLabel = ALL_NAV_ITEMS.find((i) => i.id === activeModule)?.label ?? activeModule;

  // Auth gate
  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="grid size-16 place-items-center rounded-full bg-gradient-bluesky-soft">
            <Shield className="size-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Admin Access Required</h1>
            <p className="mt-1 text-sm text-slate-400">Sign in to access the admin panel.</p>
          </div>
          <Button onClick={goToWebsite} className="gap-2 rounded-xl bg-gradient-bluesky px-6 py-3 font-bold">
            <Home className="size-4" /> Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  const sidebarProps = {
    activeModule,
    onNavigate: handleNavigate,
    collapsed: sidebarCollapsed,
    userName: user.name,
    userEmail: user.email,
    onLogout: () => { logout(); toast.success("Signed out"); router.push("/"); },
    onGoToWebsite: goToWebsite,
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* ===== Powerful Sticky Top Navbar (h-16) ===== */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-3 border-b border-white/10 bg-slate-950/95 px-4 backdrop-blur-xl">
        {/* ===== Left section ===== */}
        <div className="flex items-center gap-3">
          {/* Mobile menu */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="grid size-9 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </button>
          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden size-9 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white lg:grid"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
          </button>

          {/* Logo + brand (hidden when sidebar is expanded — it shows in sidebar) */}
          <div className={cn("flex items-center gap-2", !sidebarCollapsed && "lg:hidden")}>
            <div className="grid size-8 place-items-center rounded-lg bg-gradient-bluesky shadow-glow-bluesky">
              <Shield className="size-4 text-white" />
            </div>
            <span className="hidden text-sm font-bold text-white sm:inline">Admin</span>
          </div>

          {/* Rich breadcrumb: Home / Admin / Module */}
          <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
            <button
              onClick={goToWebsite}
              className="flex items-center gap-1 rounded-md px-1.5 py-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <Home className="size-3.5" />
              <span className="hidden md:inline">Home</span>
            </button>
            <ChevronRight className="size-3 text-slate-600" />
            <button
              onClick={() => handleNavigate("dashboard")}
              className="rounded-md px-1.5 py-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              Admin
            </button>
            <ChevronRight className="size-3 text-slate-600" />
            <span className="rounded-md bg-white/5 px-2 py-1 font-semibold capitalize text-white">
              {moduleLabel}
            </span>
          </nav>
        </div>

        {/* ===== Right section ===== */}
        <div className="flex items-center gap-1.5">
          {/* Global search — click to open command palette */}
          <button
            onClick={() => setCommandOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-400 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-slate-200 sm:flex"
          >
            <Search className="size-3.5" />
            <span className="text-xs">Search...</span>
            <kbd className="ml-4 hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[0.6rem] font-mono text-slate-500 lg:inline">
              ⌘K
            </kbd>
          </button>

          {/* Mobile search icon */}
          <button
            onClick={() => setCommandOpen(true)}
            className="grid size-9 place-items-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white sm:hidden"
            aria-label="Search"
          >
            <Search className="size-4.5" />
          </button>

          {/* Quick-add dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-1.5 rounded-lg bg-gradient-bluesky px-3 py-2 text-xs font-bold text-white shadow-glow-bluesky transition-transform hover:scale-105"
                aria-label="Quick add"
              >
                <Plus className="size-3.5" />
                <span className="hidden md:inline">Quick Add</span>
                <ChevronDown className="hidden size-3 opacity-60 md:inline" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 rounded-xl p-1">
              <DropdownMenuLabel className="text-xs text-muted-foreground">Create New</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {QUICK_ADD_ITEMS.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => { handleNavigate(item.id); toast.info(`Create ${item.label} (coming soon)`); }}
                  className="gap-2.5 rounded-lg py-2"
                >
                  <div className="grid size-7 place-items-center rounded-lg bg-gradient-bluesky-soft text-primary">
                    <item.icon className="size-3.5" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Website — Globe, Boundless gradient, always visible */}
          <button
            onClick={goToWebsite}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-transparent hover:bg-gradient-bluesky hover:text-white"
            aria-label="View Website"
          >
            <Globe className="size-3.5" />
            <span className="hidden lg:inline">View Website</span>
          </button>

          {/* System status */}
          <div className="hidden items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1.5 xl:flex" title="All systems operational">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[0.65rem] font-semibold text-emerald-400">Operational</span>
          </div>

          {/* Live clock */}
          <div className="hidden items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 xl:flex">
            <Clock className="size-3.5 text-slate-400" />
            <span className="font-mono text-[0.65rem] tabular-nums text-slate-300">{now || "--:--:--"}</span>
          </div>

          {/* Notifications with dropdown preview */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative grid size-9 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-white/10 hover:text-white" aria-label="Notifications">
                <Bell className="size-4.5" />
                <span className="absolute -right-0.5 -top-0.5 grid min-w-[1.1rem] place-items-center rounded-full bg-rose-500 px-1 text-[0.6rem] font-bold text-white">3</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl p-0">
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
                <span className="text-sm font-bold text-foreground">Notifications</span>
                <Badge className="bg-rose-500 text-white">3 new</Badge>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {[
                  { icon: CheckCircle2, color: "text-emerald-500", title: "New booking confirmed", body: "BS-7K3D9X · Maldives · $3,034", time: "2m ago" },
                  { icon: AlertCircle, color: "text-amber-500", title: "Payment pending", body: "BS-Q4R7ST · Cairo Pyramids · $1,764", time: "1h ago" },
                  { icon: User, color: "text-primary", title: "New user registered", body: "sophie@email.com joined as customer", time: "3h ago" },
                ].map((n, i) => (
                  <DropdownMenuItem key={i} className="flex-col items-start gap-0.5 border-b border-border/40 px-4 py-3 last:border-b-0">
                    <div className="flex w-full items-center gap-2">
                      <n.icon className={cn("size-4 shrink-0", n.color)} />
                      <p className="flex-1 text-xs font-bold text-foreground">{n.title}</p>
                      <span className="text-[0.6rem] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="ml-6 text-[0.7rem] text-muted-foreground">{n.body}</p>
                  </DropdownMenuItem>
                ))}
              </div>
              <button
                onClick={() => handleNavigate("notifications")}
                className="w-full border-t border-border/60 px-4 py-2.5 text-center text-xs font-semibold text-primary hover:bg-accent"
              >
                View all notifications
              </button>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 transition-colors hover:bg-white/10">
                <Avatar className="size-8 ring-2 ring-white/20">
                  <AvatarFallback className="bg-gradient-bluesky text-xs font-bold text-white">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden flex-col items-start leading-tight sm:flex">
                  <span className="text-xs font-bold text-white">{user.name?.split(" ")[0] ?? "Admin"}</span>
                  <span className="text-[0.6rem] capitalize text-slate-400">{user.email === "admin@bluesky.travel" ? "Super Admin" : "Admin"}</span>
                </div>
                <ChevronDown className="hidden size-3 text-slate-500 sm:inline" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl p-1">
              {/* User header */}
              <div className="flex items-center gap-3 rounded-lg bg-gradient-bluesky-soft p-3 ring-1 ring-primary/10">
                <Avatar className="size-10 ring-2 ring-white/40">
                  <AvatarFallback className="bg-gradient-bluesky text-sm font-bold text-white">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">{user.name ?? "Admin"}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem onClick={() => router.push("/account")} className="gap-2.5 rounded-lg py-2">
                <User className="size-4 text-primary" /> My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={goToWebsite} className="gap-2.5 rounded-lg py-2">
                <Globe className="size-4 text-primary" /> View Website
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleNavigate("settings")} className="gap-2.5 rounded-lg py-2">
                <Shield className="size-4 text-primary" /> System Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem
                onClick={() => { logout(); toast.success("Signed out"); router.push("/"); }}
                className="gap-2.5 rounded-lg py-2 text-destructive"
              >
                <LogOut className="size-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "sticky top-16 hidden h-[calc(100vh-4rem)] bg-slate-950 lg:block",
            sidebarCollapsed ? "w-16" : "w-60",
          )}
        >
          <AdminSidebar {...sidebarProps} />
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetContent side="left" className="w-64 border-r-0 bg-slate-950 p-0 text-slate-300">
            <AdminSidebar {...sidebarProps} collapsed={false} />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="min-h-[calc(100vh-4rem)] flex-1">
          {/* Sub-header: quick stats bar + page title */}
          <div className="sticky top-16 z-20 border-b border-border/60 bg-card/95 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold capitalize text-foreground">{moduleLabel}</h2>
                {/* Quick KPI pills */}
                <div className="hidden items-center gap-2 sm:flex">
                  <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 dark:bg-emerald-950/30">
                    <DollarSign className="size-3 text-emerald-600" />
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">$632K</span>
                    <span className="text-[0.6rem] text-muted-foreground">Revenue</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-sky-50 px-2.5 py-1 dark:bg-sky-950/30">
                    <Calendar className="size-3 text-sky-600" />
                    <span className="text-xs font-bold text-sky-700 dark:text-sky-400">912</span>
                    <span className="text-[0.6rem] text-muted-foreground">Bookings</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 dark:bg-amber-950/30">
                    <UsersIcon className="size-3 text-amber-600" />
                    <span className="text-xs font-bold text-amber-700 dark:text-amber-400">48K</span>
                    <span className="text-[0.6rem] text-muted-foreground">Users</span>
                  </div>
                </div>
              </div>
              {/* Right: contextual actions */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1 rounded-lg border border-border/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  <TrendingUp className="size-3" />
                  <span className="hidden sm:inline">+12.5%</span>
                </button>
                <button
                  onClick={() => setCommandOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Search className="size-3" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
              </div>
            </div>
          </div>
          {/* Page content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ===== SIDEBAR =====
function AdminSidebar({
  activeModule, onNavigate, collapsed, userName, userEmail, onLogout, onGoToWebsite,
}: {
  activeModule: string;
  onNavigate: (id: string) => void;
  collapsed: boolean;
  userName?: string;
  userEmail: string;
  onLogout: () => void;
  onGoToWebsite: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-4">
        <Image src="/logo-boundless.jpeg" alt="Boundless" width={32} height={32} className="shrink-0 rounded-lg" />
        {!collapsed && (
          <div className="leading-none">
            <p className="text-sm font-bold text-white">Boundless Admin</p>
            <p className="text-[0.6rem] uppercase tracking-wider text-slate-400">Control Panel</p>
          </div>
        )}
      </div>

      {/* User card */}
      {!collapsed && userName && (
        <div className="mx-3 mb-3 flex items-center gap-2.5 rounded-xl bg-white/5 p-3">
          <Avatar className="size-8 shrink-0">
            <AvatarFallback className="bg-gradient-bluesky text-xs font-bold text-white">
              {initials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-white">{userName ?? "Admin"}</p>
            <p className="truncate text-[0.65rem] text-slate-400">{userEmail}</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-3">
            {!collapsed && (
              <p className="mb-1 px-3 text-[0.6rem] font-bold uppercase tracking-wider text-slate-500">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      collapsed && "justify-center px-0",
                      isActive
                        ? "bg-gradient-bluesky text-white shadow-glow-bluesky"
                        : "text-slate-400 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: Back to Website + Logout */}
      <div className="space-y-1 border-t border-white/10 p-3">
        {/* Back to Website */}
        <button
          onClick={onGoToWebsite}
          title={collapsed ? "Back to Website" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gradient-bluesky",
            collapsed && "justify-center px-0",
          )}
        >
          <Globe className="size-4 shrink-0" />
          {!collapsed && "Back to Website"}
        </button>
        {/* Logout */}
        <button
          onClick={onLogout}
          title={collapsed ? "Logout" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white",
            collapsed && "justify-center px-0",
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}
