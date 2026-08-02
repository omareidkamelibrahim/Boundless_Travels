"use client";

import { create } from "zustand";
import type { BookingFlowState, BookingPassenger, Trip } from "@/types";
import { generateId } from "@/lib/utils";

interface BookingStoreState extends BookingFlowState {
  isOpen: boolean;
  open: (trip: Trip, initialDate?: string) => void;
  close: () => void;
  setStep: (step: 1 | 2 | 3 | 4 | 5) => void;
  setDate: (date: string) => void;
  setCounts: (counts: { adults: number; children: number; infants: number }) => void;
  setPassengers: (passengers: BookingPassenger[]) => void;
  setContact: (email: string, phone: string) => void;
  setPaymentMethod: (method: "card" | "paypal" | "bank") => void;
  setPromoCode: (code?: string) => void;
  reset: () => void;
  ensurePassengers: () => void;
}

const defaultState: Omit<BookingStoreState, "open" | "close" | "setStep" | "setDate" | "setCounts" | "setPassengers" | "setContact" | "setPaymentMethod" | "setPromoCode" | "reset" | "ensurePassengers" | "isOpen"> = {
  step: 1,
  trip: undefined,
  selectedDate: undefined,
  adults: 2,
  children: 0,
  infants: 0,
  passengers: [],
  contactEmail: "",
  contactPhone: "",
  paymentMethod: "card",
  promoCode: undefined,
};

export const useBooking = create<BookingStoreState>((set, get) => ({
  ...defaultState,
  isOpen: false,
  open: (trip, initialDate) =>
    set({
      ...defaultState,
      isOpen: true,
      trip,
      selectedDate: initialDate,
      passengers: [
        {
          id: generateId("pax"),
          type: "adult",
          fullName: "",
        },
        {
          id: generateId("pax"),
          type: "adult",
          fullName: "",
        },
      ],
    }),
  close: () => set({ isOpen: false }),
  setStep: (step) => set({ step }),
  setDate: (selectedDate) => set({ selectedDate }),
  setCounts: (counts) => {
    set(counts);
    get().ensurePassengers();
  },
  setPassengers: (passengers) => set({ passengers }),
  setContact: (contactEmail, contactPhone) => set({ contactEmail, contactPhone }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
  setPromoCode: (promoCode) => set({ promoCode }),
  reset: () => set({ ...defaultState, isOpen: false }),
  ensurePassengers: () => {
    const { adults, children, infants, passengers } = get();
    const total = adults + children + infants;
    const updated = [...passengers];
    // Trim
    if (updated.length > total) updated.length = total;
    // Grow
    while (updated.length < total) {
      const idx = updated.length;
      const type = idx < adults ? "adult" : idx < adults + children ? "child" : "infant";
      updated.push({ id: generateId("pax"), type, fullName: "" });
    }
    // Ensure type tags stay in sync
    for (let i = 0; i < updated.length; i++) {
      const correctType = i < adults ? "adult" : i < adults + children ? "child" : "infant";
      if (updated[i].type !== correctType) updated[i] = { ...updated[i], type: correctType };
    }
    set({ passengers: updated });
  },
}));
