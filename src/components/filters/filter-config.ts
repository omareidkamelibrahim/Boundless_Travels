import type { DateRange } from "react-day-picker";
import type { TripCategoryName } from "@/types";

/** Duration buckets used by the Duration filter. */
export const DURATION_BUCKETS = [
  { id: "1-3", label: "1–3 Nights", min: 1, max: 3 },
  { id: "3-5", label: "3–5 Nights", min: 3, max: 5 },
  { id: "5-7", label: "5–7 Nights", min: 5, max: 7 },
  { id: "7-10", label: "7–10 Nights", min: 7, max: 10 },
  { id: "10+", label: "10+ Nights", min: 10, max: Infinity },
] as const;

/** Trip-type checkbox options — includes Cruise as a top-level option. */
export const TRIP_TYPE_OPTIONS: { id: TripCategoryName | "Cruise"; label: string }[] = [
  { id: "Adventure", label: "Adventure" },
  { id: "Luxury", label: "Luxury" },
  { id: "Beach", label: "Beach" },
  { id: "Family", label: "Family" },
  { id: "Honeymoon", label: "Honeymoon" },
  { id: "Safari", label: "Safari" },
  { id: "Religious", label: "Religious" },
  { id: "Cruise", label: "Cruise" },
  { id: "Weekend", label: "Weekend" },
];

/** Transportation checkbox options. */
export const TRANSPORTATION_OPTIONS = [
  { id: "Flight Included", label: "Flight Included" },
  { id: "Bus", label: "Bus" },
  { id: "Cruise", label: "Cruise" },
  { id: "Train", label: "Train" },
] as const;

/** Hotel stars options — full + half-filled star rendering. */
export const HOTEL_STARS_OPTIONS: { id: number; label: string; stars: number }[] = [
  { id: 5, label: "5★", stars: 5 },
  { id: 4, label: "4★", stars: 4 },
  { id: 3, label: "3★", stars: 3 },
  { id: 2, label: "2★", stars: 2 },
];

/** Meal plan options. */
export const MEAL_OPTIONS = [
  { id: "Breakfast", label: "Breakfast" },
  { id: "Half Board", label: "Half Board" },
  { id: "Full Board", label: "Full Board" },
  { id: "All Inclusive", label: "All Inclusive" },
] as const;

/** Visa options. */
export const VISA_OPTIONS = [
  { id: "Visa Required", label: "Visa Required" },
  { id: "Visa Free", label: "Visa Free" },
  { id: "Visa on Arrival", label: "Visa on Arrival" },
] as const;

/** Rating threshold options. */
export const RATING_OPTIONS = [
  { id: 4, label: "4+" },
  { id: 4.5, label: "4.5+" },
  { id: 5, label: "5" },
] as const;

/** Offers / promo options. */
export const OFFERS_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "discount", label: "Discount" },
  { id: "flash_sale", label: "Flash Sale" },
  { id: "early_booking", label: "Early Booking" },
  { id: "last_minute", label: "Last Minute" },
] as const;

/** All filter state for the trips explorer. */
export interface FilterState {
  query: string;
  selectedCountries: string[];
  selectedCities: string[];
  dateRange: DateRange | undefined;
  priceRange: [number, number];
  durationBuckets: string[];
  tripTypes: string[];
  transportation: string[];
  hotelStars: number[];
  meals: string[];
  visa: string[];
  minRating: number;
  offers: string[];
}

/** Build the default (empty) filter state — used for reset. */
export function createDefaultFilters(priceBound: number): FilterState {
  return {
    query: "",
    selectedCountries: [],
    selectedCities: [],
    dateRange: undefined,
    priceRange: [0, priceBound],
    durationBuckets: [],
    tripTypes: [],
    transportation: [],
    hotelStars: [],
    meals: [],
    visa: [],
    minRating: 0,
    offers: [],
  };
}

/**
 * Count the number of active (non-default) filter groups for the header badge.
 * Each filter group contributes at most 1 to the count.
 */
export function countActiveFilters(state: FilterState, defaultState: FilterState): number {
  let count = 0;
  if (state.query.trim()) count++;
  if (state.selectedCountries.length) count++;
  if (state.selectedCities.length) count++;
  if (state.dateRange?.from || state.dateRange?.to) count++;
  if (state.priceRange[0] !== defaultState.priceRange[0] || state.priceRange[1] !== defaultState.priceRange[1]) count++;
  if (state.durationBuckets.length) count++;
  if (state.tripTypes.length) count++;
  if (state.transportation.length) count++;
  if (state.hotelStars.length) count++;
  if (state.meals.length) count++;
  if (state.visa.length) count++;
  if (state.minRating !== defaultState.minRating) count++;
  if (state.offers.length) count++;
  return count;
}

/**
 * Total count of individual selected filter items — used for the
 * "Apply Filters (N)" badge at the bottom of the sidebar.
 */
export function countSelectedItems(state: FilterState): number {
  return (
    state.selectedCountries.length +
    state.selectedCities.length +
    state.durationBuckets.length +
    state.tripTypes.length +
    state.transportation.length +
    state.hotelStars.length +
    state.meals.length +
    state.visa.length +
    state.offers.length +
    (state.query.trim() ? 1 : 0) +
    (state.dateRange?.from || state.dateRange?.to ? 1 : 0) +
    (state.priceRange[0] !== 0 || state.priceRange[1] !== 3500 ? 1 : 0) +
    (state.minRating > 0 ? 1 : 0)
  );
}
