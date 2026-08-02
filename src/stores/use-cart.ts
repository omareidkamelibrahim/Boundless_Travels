"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Trip } from "@/types";

export interface CartItem {
  id: string;
  trip: Trip;
  adults: number;
  children: number;
  infants: number;
  date: string;
  unitPrice: number;
  addedAt: string;
}

interface CartState {
  items: CartItem[];
  add: (item: Omit<CartItem, "addedAt" | "id">) => void;
  remove: (id: string) => void;
  updateQty: (id: string, field: "adults" | "children" | "infants", value: number) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
}

const computeItemTotal = (item: CartItem): number =>
  item.unitPrice * item.adults + item.unitPrice * 0.7 * item.children + item.unitPrice * 0.1 * item.infants;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const id = `${item.trip.id}-${item.date}`;
          const existing = state.items.find((i) => i.id === id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id
                  ? {
                      ...i,
                      adults: i.adults + item.adults,
                      children: i.children + item.children,
                      infants: i.infants + item.infants,
                    }
                  : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, id, addedAt: new Date().toISOString() }] };
        }),
      remove: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQty: (id, field, value) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, [field]: Math.max(field === "adults" ? 1 : 0, value) } : i,
          ),
        })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + computeItemTotal(i), 0),
      count: () =>
        get().items.reduce((sum, i) => sum + i.adults + i.children + i.infants, 0),
    }),
    { name: "bluesky-cart" },
  ),
);

export { computeItemTotal };
