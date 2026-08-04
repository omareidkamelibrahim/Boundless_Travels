"use client";

import { create } from "zustand";

type AuthView = "login" | "register" | "forgot" | "otp" | "reset";
export type DashboardSection =
  | "bookings"
  | "wishlist"
  | "profile"
  | "notifications"
  | "invoices"
  | "payments"
  | "settings";

interface UIState {
  // Auth modal
  authOpen: boolean;
  authView: AuthView;
  openAuth: (view?: AuthView) => void;
  closeAuth: () => void;
  setAuthView: (view: AuthView) => void;

  // Wishlist drawer
  wishlistOpen: boolean;
  setWishlistOpen: (open: boolean) => void;

  // Cart drawer
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  // Booking flow modal
  bookingOpen: boolean;
  bookingTripId?: string;
  openBooking: (tripId?: string) => void;
  closeBooking: () => void;

  // Trip detail modal
  tripDetailId?: string;
  setTripDetailId: (id?: string) => void;

  // Search command palette
  commandOpen: boolean;
  setCommandOpen: (open: boolean) => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // Active nav anchor
  activeSection?: string;
  setActiveSection: (section?: string) => void;

  // User dashboard
  dashboardOpen: boolean;
  dashboardSection: DashboardSection;
  openDashboard: (section?: DashboardSection) => void;
  closeDashboard: () => void;
  setDashboardSection: (section: DashboardSection) => void;

  // Admin dashboard
  adminOpen: boolean;
  openAdmin: () => void;
  closeAdmin: () => void;

  // Legal modal (FAQ, Privacy, Terms, etc.)
  legalOpen: boolean;
  legalSection: "faq" | "privacy" | "terms" | "refund" | "cookie";
  openLegal: (section?: "faq" | "privacy" | "terms" | "refund" | "cookie") => void;
  closeLegal: () => void;
  setLegalSection: (section: "faq" | "privacy" | "terms" | "refund" | "cookie") => void;

  // Blog article modal
  blogId?: string;
  setBlogId: (id?: string) => void;
  closeBlog: () => void;

  // Hotel detail modal
  hotelId?: string;
  setHotelId: (id?: string) => void;

  // Reviews modal
  reviewsOpen: boolean;
  reviewTripTitle?: string;
  openReviews: (tripTitle?: string) => void;
  closeReviews: () => void;

  // Support ticket modal
  supportOpen: boolean;
  openSupport: () => void;
  closeSupport: () => void;

  // Checkout modal
  checkoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
}

export const useUI = create<UIState>((set) => ({
  authOpen: false,
  authView: "login",
  openAuth: (view = "login") => set({ authOpen: true, authView: view }),
  closeAuth: () => set({ authOpen: false }),
  setAuthView: (view) => set({ authView: view }),

  wishlistOpen: false,
  setWishlistOpen: (open) => set({ wishlistOpen: open }),

  cartOpen: false,
  setCartOpen: (open) => set({ cartOpen: open }),

  bookingOpen: false,
  openBooking: (tripId) => set({ bookingOpen: true, bookingTripId: tripId }),
  closeBooking: () => set({ bookingOpen: false, bookingTripId: undefined }),

  tripDetailId: undefined,
  setTripDetailId: (id) => set({ tripDetailId: id }),

  commandOpen: false,
  setCommandOpen: (open) => set({ commandOpen: open }),

  mobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

  activeSection: undefined,
  setActiveSection: (section) => set({ activeSection: section }),

  dashboardOpen: false,
  dashboardSection: "bookings",
  openDashboard: (section = "bookings") => set({ dashboardOpen: true, dashboardSection: section }),
  closeDashboard: () => set({ dashboardOpen: false }),
  setDashboardSection: (section) => set({ dashboardSection: section }),

  adminOpen: false,
  openAdmin: () => set({ adminOpen: true }),
  closeAdmin: () => set({ adminOpen: false }),

  legalOpen: false,
  legalSection: "faq",
  openLegal: (section = "faq") => set({ legalOpen: true, legalSection: section }),
  closeLegal: () => set({ legalOpen: false }),
  setLegalSection: (section) => set({ legalSection: section }),

  blogId: undefined,
  setBlogId: (id) => set({ blogId: id }),
  closeBlog: () => set({ blogId: undefined }),

  hotelId: undefined,
  setHotelId: (id) => set({ hotelId: id }),

  reviewsOpen: false,
  reviewTripTitle: undefined,
  openReviews: (tripTitle) => set({ reviewsOpen: true, reviewTripTitle: tripTitle }),
  closeReviews: () => set({ reviewsOpen: false, reviewTripTitle: undefined }),

  supportOpen: false,
  openSupport: () => set({ supportOpen: true }),
  closeSupport: () => set({ supportOpen: false }),

  checkoutOpen: false,
  openCheckout: () => set({ checkoutOpen: true, cartOpen: false }),
  closeCheckout: () => set({ checkoutOpen: false }),
}));
