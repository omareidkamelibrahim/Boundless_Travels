// Admin dashboard demo data — would come from Prisma in production.
import { iso, futureIso, img } from "@/data";

export interface AdminBooking {
  id: string;
  reference: string;
  customer: string;
  customerEmail: string;
  tripTitle: string;
  country: string;
  amount: number;
  currency: string;
  status: "confirmed" | "pending" | "cancelled" | "completed" | "refunded";
  paymentStatus: "paid" | "unpaid" | "refunded" | "partial";
  date: string;
  travelers: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "customer" | "agent" | "admin";
  status: "active" | "inactive" | "suspended";
  totalBookings: number;
  totalSpent: number;
  joinedAt: string;
  avatarUrl?: string;
}

export interface AdminTrip {
  id: string;
  title: string;
  type: "domestic" | "international";
  country: string;
  price: number;
  durationDays: number;
  bookings: number;
  rating: number;
  status: "active" | "draft" | "archived";
  featured: boolean;
}

// Revenue by month (last 12 months)
export const revenueData = [
  { month: "Jan", revenue: 28500, bookings: 42 },
  { month: "Feb", revenue: 31200, bookings: 48 },
  { month: "Mar", revenue: 38900, bookings: 61 },
  { month: "Apr", revenue: 35600, bookings: 55 },
  { month: "May", revenue: 42300, bookings: 67 },
  { month: "Jun", revenue: 51800, bookings: 82 },
  { month: "Jul", revenue: 67200, bookings: 105 },
  { month: "Aug", revenue: 71500, bookings: 118 },
  { month: "Sep", revenue: 58300, bookings: 91 },
  { month: "Oct", revenue: 49100, bookings: 76 },
  { month: "Nov", revenue: 44800, bookings: 69 },
  { month: "Dec", revenue: 63500, bookings: 98 },
];

// Bookings by country
export const bookingsByCountry = [
  { country: "Egypt", bookings: 285, revenue: 89400 },
  { country: "UAE", bookings: 198, revenue: 234500 },
  { country: "Turkey", bookings: 167, revenue: 156200 },
  { country: "Maldives", bookings: 89, revenue: 245600 },
  { country: "Greece", bookings: 145, revenue: 178900 },
  { country: "Thailand", bookings: 112, revenue: 134500 },
  { country: "France", bookings: 87, revenue: 98700 },
  { country: "Italy", bookings: 76, revenue: 89200 },
];

// Top destinations
export const topDestinations = [
  { name: "Giza Pyramids", visitors: 8421, revenue: 245000 },
  { name: "Burj Khalifa", visitors: 12450, revenue: 389000 },
  { name: "Cappadocia", visitors: 5621, revenue: 167000 },
  { name: "Santorini", visitors: 9982, revenue: 298000 },
  { name: "Maldives", visitors: 7321, revenue: 412000 },
];

export const adminBookings: AdminBooking[] = [
  { id: "ab-1", reference: "BS-7K3D9X", customer: "Sarah Johnson", customerEmail: "sarah@email.com", tripTitle: "Maldives Overwater Villa — 6 Days", country: "Maldives", amount: 3034.5, currency: "USD", status: "confirmed", paymentStatus: "paid", date: iso(5), travelers: 2 },
  { id: "ab-2", reference: "BS-M8N2PQ", customer: "Michael Chen", customerEmail: "michael@email.com", tripTitle: "Cappadocia Honeymoon — 3 Days", country: "Turkey", amount: 980, currency: "USD", status: "completed", paymentStatus: "paid", date: iso(12), travelers: 2 },
  { id: "ab-3", reference: "BS-Q4R7ST", customer: "Emma Williams", customerEmail: "emma@email.com", tripTitle: "Pyramids & Nile Magic — 3 Days", country: "Egypt", amount: 1764, currency: "USD", status: "pending", paymentStatus: "unpaid", date: iso(1), travelers: 6 },
  { id: "ab-4", reference: "BS-V9W2XY", customer: "James Anderson", customerEmail: "james@email.com", tripTitle: "Maasai Mara Safari — 7 Days", country: "Kenya", amount: 3290, currency: "USD", status: "confirmed", paymentStatus: "paid", date: iso(3), travelers: 4 },
  { id: "ab-5", reference: "BS-A3B5CD", customer: "Olivia Martinez", customerEmail: "olivia@email.com", tripTitle: "Santorini Island Escape — 5 Days", country: "Greece", amount: 1680, currency: "USD", status: "cancelled", paymentStatus: "refunded", date: iso(8), travelers: 2 },
  { id: "ab-6", reference: "BS-E7F9GH", customer: "David Lee", customerEmail: "david@email.com", tripTitle: "Dubai Luxury Break — 4 Days", country: "UAE", amount: 1180, currency: "USD", status: "completed", paymentStatus: "paid", date: iso(15), travelers: 2 },
  { id: "ab-7", reference: "BS-I3J5KL", customer: "Rachel Brown", customerEmail: "rachel@email.com", tripTitle: "Red Sea Diving Escape — Sharm 4 Days", country: "Egypt", amount: 560, currency: "USD", status: "pending", paymentStatus: "partial", date: iso(2), travelers: 1 },
  { id: "ab-8", reference: "BS-M7N9OP", customer: "Thomas Wilson", customerEmail: "thomas@email.com", tripTitle: "Thailand Explorer — 9 Days", country: "Thailand", amount: 1490, currency: "USD", status: "confirmed", paymentStatus: "paid", date: iso(6), travelers: 4 },
  { id: "ab-9", reference: "BS-Q1R3ST", customer: "Sophie Martin", customerEmail: "sophie@email.com", tripTitle: "Nile Cruise — Luxor to Aswan, 5 Days", country: "Egypt", amount: 890, currency: "USD", status: "completed", paymentStatus: "paid", date: iso(20), travelers: 2 },
  { id: "ab-10", reference: "BS-U5V7WX", customer: "Daniel Cohen", customerEmail: "daniel@email.com", tripTitle: "Swiss Alps Grand Tour — 7 Days", country: "Switzerland", amount: 2480, currency: "USD", status: "pending", paymentStatus: "unpaid", date: iso(0.5), travelers: 2 },
  { id: "ab-11", reference: "BS-Y3Z5AB", customer: "Maria Garcia", customerEmail: "maria@email.com", tripTitle: "Family Beach Holiday — Hurghada 5 Days", country: "Egypt", amount: 640, currency: "USD", status: "refunded", paymentStatus: "refunded", date: iso(25), travelers: 6 },
  { id: "ab-12", reference: "BS-C7D9EF", customer: "Robert Hayes", customerEmail: "robert@email.com", tripTitle: "Maldives Overwater Villa — 6 Days", country: "Maldives", amount: 2890, currency: "USD", status: "confirmed", paymentStatus: "paid", date: iso(4), travelers: 2 },
];

export const adminUsers: AdminUser[] = [
  { id: "u-1", name: "Sarah Johnson", email: "sarah@email.com", role: "customer", status: "active", totalBookings: 8, totalSpent: 12450, joinedAt: iso(120) },
  { id: "u-2", name: "Michael Chen", email: "michael@email.com", role: "customer", status: "active", totalBookings: 5, totalSpent: 6800, joinedAt: iso(95) },
  { id: "u-3", name: "Emma Williams", email: "emma@email.com", role: "customer", status: "active", totalBookings: 3, totalSpent: 4200, joinedAt: iso(80) },
  { id: "u-4", name: "James Anderson", email: "james@email.com", role: "customer", status: "active", totalBookings: 12, totalSpent: 28900, joinedAt: iso(150) },
  { id: "u-5", name: "Olivia Martinez", email: "olivia@email.com", role: "customer", status: "inactive", totalBookings: 2, totalSpent: 1680, joinedAt: iso(60) },
  { id: "u-6", name: "David Lee", email: "david@email.com", role: "customer", status: "active", totalBookings: 7, totalSpent: 8260, joinedAt: iso(110) },
  { id: "u-7", name: "Yasmin El-Sayed", email: "yasmin@bluesky.travel", role: "admin", status: "active", totalBookings: 0, totalSpent: 0, joinedAt: iso(365) },
  { id: "u-8", name: "Karim Mostafa", email: "karim@bluesky.travel", role: "agent", status: "active", totalBookings: 0, totalSpent: 0, joinedAt: iso(200) },
  { id: "u-9", name: "Rachel Brown", email: "rachel@email.com", role: "customer", status: "suspended", totalBookings: 1, totalSpent: 560, joinedAt: iso(30) },
  { id: "u-10", name: "Thomas Wilson", email: "thomas@email.com", role: "customer", status: "active", totalBookings: 4, totalSpent: 5960, joinedAt: iso(70) },
];

export const adminTrips: AdminTrip[] = [
  { id: "t-1", title: "Pyramids & Nile Magic — 3 Days in Cairo", type: "domestic", country: "Egypt", price: 420, durationDays: 3, bookings: 245, rating: 4.8, status: "active", featured: true },
  { id: "t-2", title: "Nile Cruise — Luxor to Aswan, 5 Days", type: "domestic", country: "Egypt", price: 890, durationDays: 5, bookings: 156, rating: 4.9, status: "active", featured: true },
  { id: "t-3", title: "Dubai Luxury Break — 4 Days", type: "international", country: "UAE", price: 1180, durationDays: 4, bookings: 189, rating: 4.9, status: "active", featured: true },
  { id: "t-4", title: "Cappadocia Honeymoon — 3 Days", type: "international", country: "Turkey", price: 980, durationDays: 3, bookings: 134, rating: 4.9, status: "active", featured: true },
  { id: "t-5", title: "Maldives Overwater Villa — 6 Days", type: "international", country: "Maldives", price: 2890, durationDays: 6, bookings: 89, rating: 4.9, status: "active", featured: true },
  { id: "t-6", title: "Santorini Island Escape — 5 Days", type: "international", country: "Greece", price: 1680, durationDays: 5, bookings: 145, rating: 4.8, status: "active", featured: true },
  { id: "t-7", title: "Maasai Mara Safari — 7 Days Kenya", type: "international", country: "Kenya", price: 3290, durationDays: 7, bookings: 67, rating: 4.9, status: "active", featured: false },
  { id: "t-8", title: "Thailand Explorer — 9 Days", type: "international", country: "Thailand", price: 1490, durationDays: 9, bookings: 112, rating: 4.7, status: "active", featured: false },
  { id: "t-9", title: "Swiss Alps Grand Tour — 7 Days", type: "international", country: "Switzerland", price: 2480, durationDays: 7, bookings: 54, rating: 4.8, status: "active", featured: false },
  { id: "t-10", title: "Red Sea Diving Escape — Sharm 4 Days", type: "domestic", country: "Egypt", price: 560, durationDays: 4, bookings: 98, rating: 4.7, status: "active", featured: true },
];

// KPI summary
export const adminKPIs = {
  totalRevenue: revenueData.reduce((s, m) => s + m.revenue, 0),
  totalBookings: revenueData.reduce((s, m) => s + m.bookings, 0),
  totalCustomers: 48250,
  totalTrips: 12,
  activeBookings: adminBookings.filter((b) => b.status === "confirmed" || b.status === "pending").length,
  cancelledRate: 8.2,
  refundRate: 5.1,
  conversionRate: 3.8,
  avgOrderValue: 1450,
  monthlyGrowth: 12.5,
  newCustomers: 1240,
};
