"use client";

import { useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthModal } from "@/components/modals/AuthModal";
import { TripDetailModal } from "@/components/modals/TripDetailModal";
import { BookingFlowModal } from "@/components/modals/BookingFlowModal";
import { WishlistDrawer } from "@/components/drawers/WishlistDrawer";
import { CartDrawer } from "@/components/drawers/CartDrawer";
import { CommandPalette } from "@/components/common/CommandPalette";
import { useUI } from "@/stores/use-ui";

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * Wraps the app with everything global: scroll restoration, keyboard shortcuts,
 * and the persistent overlays (Navbar, Footer, modals, drawers, command palette).
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
      <WishlistDrawer />
      <CartDrawer />
      <CommandPalette />
    </>
  );
}
