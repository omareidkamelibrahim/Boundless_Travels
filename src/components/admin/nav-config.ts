import {
  LayoutDashboard, TrendingUp, CalendarCheck, Users, Shield, KeyRound, UserCog,
  Plane, Compass, MapPin, Building2, Hotel, BedDouble, PlaneTakeoff, Plane as PlaneIcon,
  Stamp, FileCheck, Package, Bus, Tag, Ticket, Percent, Star, MessageSquare, Image as ImageIcon,
  Library, FileText, Tag as TagIcon, HelpCircle, Mail, Bell, Send, LifeBuoy,
  CreditCard, Receipt, RotateCcw, FileBarChart, History, ScrollText, Globe,
  Languages, DollarSign, Calculator, Settings, Building, Network, Database,
  PlaneTakeoff as AirportIcon, Route, Video, Layers, Layout, PanelBottom, FileCode, Search as SearchIcon,
  Mail as MailIcon, Download, Upload,
} from "lucide-react";

export interface NavGroup {
  label: string;
  items: { id: string; label: string; icon: React.ElementType }[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Main",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "analytics", label: "Analytics", icon: TrendingUp },
      { id: "bookings", label: "Bookings", icon: CalendarCheck },
    ],
  },
  {
    label: "People",
    items: [
      { id: "customers", label: "Customers", icon: Users },
      { id: "users", label: "Users", icon: UserCog },
      { id: "staff", label: "Staff", icon: UserCog },
      { id: "roles", label: "Roles & Permissions", icon: Shield },
    ],
  },
  {
    label: "Travel Catalog",
    items: [
      { id: "trips", label: "Trips", icon: Plane },
      { id: "trip-categories", label: "Categories", icon: Compass },
      { id: "destinations", label: "Destinations", icon: MapPin },
      { id: "countries", label: "Countries", icon: Globe },
      { id: "cities", label: "Cities", icon: Building2 },
      { id: "hotels", label: "Hotels", icon: Hotel },
      { id: "rooms", label: "Rooms", icon: BedDouble },
      { id: "packages", label: "Packages", icon: Package },
      { id: "itineraries", label: "Itineraries", icon: Route },
      { id: "flights", label: "Flights", icon: PlaneTakeoff },
      { id: "airlines", label: "Airlines", icon: PlaneIcon },
      { id: "airports", label: "Airports", icon: AirportIcon },
      { id: "visa", label: "Visa Services", icon: Stamp },
      { id: "visa-requests", label: "Visa Requests", icon: FileCheck },
      { id: "transportation", label: "Transportation", icon: Bus },
    ],
  },
  {
    label: "Media",
    items: [
      { id: "images", label: "Images", icon: ImageIcon },
      { id: "videos", label: "Videos", icon: Video },
      { id: "media", label: "Media Library", icon: Library },
    ],
  },
  {
    label: "Marketing",
    items: [
      { id: "offers", label: "Offers", icon: Tag },
      { id: "coupons", label: "Coupons", icon: Ticket },
      { id: "discounts", label: "Discounts", icon: Percent },
      { id: "promo-codes", label: "Promo Codes", icon: Percent },
      { id: "reviews", label: "Reviews", icon: Star },
      { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    ],
  },
  {
    label: "Content & CMS",
    items: [
      { id: "blog", label: "Blogs", icon: FileText },
      { id: "blog-categories", label: "Blog Categories", icon: TagIcon },
      { id: "blog-tags", label: "Tags", icon: TagIcon },
      { id: "cms-pages", label: "CMS Pages", icon: FileText },
      { id: "header-builder", label: "Header Builder", icon: Layout },
      { id: "footer-builder", label: "Footer Builder", icon: PanelBottom },
      { id: "home-sections", label: "Home Page Sections", icon: Layers },
      { id: "faq", label: "FAQ", icon: HelpCircle },
    ],
  },
  {
    label: "Communication",
    items: [
      { id: "newsletter", label: "Newsletter", icon: Mail },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "email-campaigns", label: "Email Campaigns", icon: Send },
      { id: "email-templates", label: "Email Templates", icon: MailIcon },
      { id: "support-tickets", label: "Support Tickets", icon: LifeBuoy },
    ],
  },
  {
    label: "Finance",
    items: [
      { id: "payments", label: "Payments", icon: CreditCard },
      { id: "invoices", label: "Invoices", icon: Receipt },
      { id: "refunds", label: "Refunds", icon: RotateCcw },
    ],
  },
  {
    label: "System",
    items: [
      { id: "reports", label: "Reports", icon: FileBarChart },
      { id: "activity-logs", label: "Activity Logs", icon: History },
      { id: "audit-logs", label: "Audit Logs", icon: ScrollText },
      { id: "seo", label: "SEO Manager", icon: SearchIcon },
      { id: "languages", label: "Languages", icon: Languages },
      { id: "currencies", label: "Currency", icon: DollarSign },
      { id: "taxes", label: "Taxes", icon: Calculator },
      { id: "settings", label: "System Settings", icon: Settings },
      { id: "company", label: "Company", icon: Building },
      { id: "branches", label: "Branches", icon: Network },
      { id: "backup", label: "Backup & Restore", icon: Database },
      { id: "system-logs", label: "System Logs", icon: ScrollText },
    ],
  },
];

export const ALL_NAV_ITEMS = NAV_GROUPS.flatMap((g) => g.items);

// Count total modules
export const TOTAL_MODULES = ALL_NAV_ITEMS.length;
