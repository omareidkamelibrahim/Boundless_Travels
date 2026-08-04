"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/modals/AuthModal";
import { TripDetailModal } from "@/components/modals/TripDetailModal";
import { BookingFlowModal } from "@/components/modals/BookingFlowModal";
import { LegalModal } from "@/components/modals/LegalModal";
import { CheckoutModal } from "@/components/modals/CheckoutModal";
import { BlogArticleModal } from "@/components/modals/BlogArticleModal";
import { HotelDetailModal } from "@/components/modals/HotelDetailModal";
import { ReviewsModal } from "@/components/modals/ReviewsModal";
import { SupportTicketModal } from "@/components/modals/SupportTicketModal";
import { WishlistDrawer } from "@/components/drawers/WishlistDrawer";
import { CartDrawer } from "@/components/drawers/CartDrawer";
import { CommandPalette } from "@/components/common/CommandPalette";
import { useUI } from "@/stores/use-ui";

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Wraps the app with everything global: scroll restoration, keyboard shortcuts,
 * and all persistent overlays (Navbar, Footer, modals, drawers, command palette,
 * admin panel, legal, checkout, blog, hotel, reviews, support).
 *
 * NOTE: User Dashboard is now a full-page route at /account (not a modal).
 * Children = the page content (between navbar and footer).
 */
export function AppProviders({ children }: AppProvidersProps) {
  const setCommandOpen = useUI((s) => s.setCommandOpen);

  // Global keyboard shortcuts: Cmd/Ctrl+K opens search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCommandOpen]);

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <AuthModal />
      <TripDetailModal />
      <BookingFlowModal />
      <LegalModal />
      <CheckoutModal />
      <BlogArticleModal />
      <HotelDetailModal />
      <ReviewsModal />
      <SupportTicketModal />
      <WishlistDrawer />
      <CartDrawer />
      <CommandPalette />
    </>
  );
}
