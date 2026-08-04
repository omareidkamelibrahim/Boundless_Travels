"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Trip, Hotel } from "@/types";

interface WishlistItem {
  id: string;
  trip?: Trip;
  hotel?: Hotel;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  add: (item: Omit<WishlistItem, "addedAt" | "id">) => void;
  remove: (id: string) => void;
  toggle: (item: Omit<WishlistItem, "addedAt" | "id">) => void;
  clear: () => void;
  has: (id: string) => boolean;
}

const strip = ({ trip, hotel }: Omit<WishlistItem, "addedAt" | "id">) => ({
  id: trip?.id ?? hotel?.id ?? "",
  trip,
  hotel,
});

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const { id } = strip(item);
          if (state.items.some((i) => i.id === id)) return state;
          return { items: [...state.items, { ...item, id, addedAt: new Date().toISOString() }] };
        }),
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      toggle: (item) =>
        set((state) => {
          const { id } = strip(item);
          const exists = state.items.some((i) => i.id === id);
          if (exists) return { items: state.items.filter((i) => i.id !== id) };
          return { items: [...state.items, { ...item, id, addedAt: new Date().toISOString() }] };
        }),
      clear: () => set({ items: [] }),
      has: (id) => get().items.some((i) => i.id === id),
    }),
    { name: "boundless-wishlist" },
  ),
);
