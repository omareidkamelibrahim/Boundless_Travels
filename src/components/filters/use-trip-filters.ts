"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { Trip } from "@/types";
import {
  createDefaultFilters,
  countActiveFilters,
  countSelectedItems,
  DURATION_BUCKETS,
  type FilterState,
} from "@/components/filters/filter-config";

interface UseTripFiltersOptions {
  trips: Trip[];
  priceBound: number;
  pageSize: number;
}

interface UseTripFiltersResult {
  state: FilterState;
  defaultState: FilterState;
  activeCount: number;
  selectedCount: number;
  filtered: Trip[];
  paginatedTrips: Trip[];
  totalPages: number;
  currentPage: number;
  page: number;
  setPage: (page: number) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  reset: () => void;
  update: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  toggleArrayValue: <K extends "selectedCountries" | "selectedCities" | "durationBuckets" | "tripTypes" | "transportation" | "hotelStars" | "meals" | "visa" | "offers">(
    key: K,
    value: FilterState[K][number],
  ) => void;
  applyAndScroll: (sectionId: string) => void;
}

/**
 * Self-contained filter state + filtering pipeline for the trips explorer.
 *
 * - All filtering logic is memoized via useMemo so the grid only re-renders when state changes.
 * - Page resets to 1 on any filter change.
 * - A short `loading` flag drives the skeleton transition for premium feel.
 */
export function useTripFilters({ trips, priceBound, pageSize }: UseTripFiltersOptions): UseTripFiltersResult {
  const defaultState = useMemo(() => createDefaultFilters(priceBound), [priceBound]);
  const [state, setState] = useState<FilterState>(defaultState);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loadingTimer = useRef<number | undefined>(undefined);

  const triggerLoading = useCallback(() => {
    setLoading(true);
    if (loadingTimer.current) window.clearTimeout(loadingTimer.current);
    loadingTimer.current = window.setTimeout(() => setLoading(false), 280);
  }, []);

  const update = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setState((prev) => ({ ...prev, [key]: value }));
      setPage(1);
      triggerLoading();
    },
    [triggerLoading],
  );

  const toggleArrayValue = useCallback(
    <K extends "selectedCountries" | "selectedCities" | "durationBuckets" | "tripTypes" | "transportation" | "hotelStars" | "meals" | "visa" | "offers">(
      key: K,
      value: FilterState[K][number],
    ) => {
      setState((prev) => {
        const current = prev[key] as unknown as unknown[];
        const next = current.includes(value as unknown)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [key]: next } as FilterState;
      });
      setPage(1);
      triggerLoading();
    },
    [triggerLoading],
  );

  const reset = useCallback(() => {
    setState(defaultState);
    setPage(1);
    triggerLoading();
  }, [defaultState, triggerLoading]);

  const filtered = useMemo(() => {
    const q = state.query.trim().toLowerCase();
    return trips.filter((t) => {
      // Destination search (matches title, summary, country, city)
      if (q) {
        const haystack = `${t.title} ${t.summary} ${t.description}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      // Country
      if (state.selectedCountries.length && !state.selectedCountries.includes(t.countryId)) return false;
      // City
      if (state.selectedCities.length && !state.selectedCities.includes(t.cityId ?? "")) return false;
      // Date range — filter by trip end date being on/after the "from" date
      if (state.dateRange?.from) {
        const tripEnd = new Date(t.createdAt).getTime();
        if (tripEnd < state.dateRange.from.getTime()) return false;
      }
      // Price
      if (t.price < state.priceRange[0] || t.price > state.priceRange[1]) return false;
      // Duration buckets
      if (state.durationBuckets.length) {
        const nights = t.durationDays - 1;
        const matches = state.durationBuckets.some((bId) => {
          const bucket = DURATION_BUCKETS.find((b) => b.id === bId);
          if (!bucket) return false;
          return nights >= bucket.min && nights <= bucket.max;
        });
        if (!matches) return false;
      }
      // Trip types (tags). "Cruise" is a top-level option matching a Cruise transportation type.
      if (state.tripTypes.length) {
        const matches = state.tripTypes.some((sel) => {
          if (sel === "Cruise") return /cruise/i.test(t.transportation ?? "");
          return t.tags.includes(sel as Trip["tags"][number]);
        });
        if (!matches) return false;
      }
      // Transportation
      if (state.transportation.length) {
        const tType = t.transportation ?? "";
        const matches = state.transportation.some((sel) => {
          if (sel === "Flight Included") return /flight/i.test(tType);
          if (sel === "Bus") return /bus/i.test(tType);
          if (sel === "Cruise") return /cruise/i.test(tType);
          if (sel === "Train") return /train/i.test(tType);
          return false;
        });
        if (!matches) return false;
      }
      // Hotel stars — from accommodation field
      if (state.hotelStars.length) {
        const acc = t.accommodation ?? "";
        const matches = state.hotelStars.some((s) => new RegExp(`${s}★`).test(acc) || new RegExp(`${s} star`, "i").test(acc));
        if (!matches) return false;
      }
      // Meals
      if (state.meals.length) {
        const mp = t.mealPlan ?? "";
        if (!state.meals.some((m) => mp.toLowerCase().includes(m.toLowerCase()))) return false;
      }
      // Visa
      if (state.visa.length) {
        const isRequired = t.visaRequired;
        const visaMatches = state.visa.some((v) => {
          if (v === "Visa Required") return isRequired;
          if (v === "Visa Free") return !isRequired;
          return false;
        });
        if (!visaMatches) return false;
      }
      // Rating
      if (state.minRating > 0 && t.rating < state.minRating) return false;
      // Offers
      if (state.offers.length) {
        const matches = state.offers.some((o) => {
          if (o === "discount") return !!t.oldPrice && t.oldPrice > t.price;
          if (o === "featured") return t.featured;
          if (o === "flash_sale") return !!t.oldPrice && t.oldPrice > t.price * 1.2;
          if (o === "early_booking") return t.durationDays >= 7;
          if (o === "last_minute") return t.durationDays <= 3;
          return false;
        });
        if (!matches) return false;
      }
      return true;
    });
  }, [trips, state]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedTrips = useMemo(
    () => filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filtered, currentPage, pageSize],
  );

  const activeCount = useMemo(() => countActiveFilters(state, defaultState), [state, defaultState]);
  const selectedCount = useMemo(() => countSelectedItems(state), [state]);

  const applyAndScroll = useCallback((sectionId: string) => {
    setLoading(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return {
    state,
    defaultState,
    activeCount,
    selectedCount,
    filtered,
    paginatedTrips,
    totalPages,
    currentPage,
    page,
    setPage,
    loading,
    setLoading,
    reset,
    update,
    toggleArrayValue,
    applyAndScroll,
  };
}
