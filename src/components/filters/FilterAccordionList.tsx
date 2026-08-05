"use client";

import { useMemo } from "react";
import { FilterAccordion } from "@/components/filters/FilterAccordion";
import { CheckboxFilter } from "@/components/filters/CheckboxFilter";
import { RangeSliderFilter } from "@/components/filters/RangeSliderFilter";
import { DateFilter } from "@/components/filters/DateFilter";
import { RatingFilter } from "@/components/filters/RatingFilter";
import { HotelStarsFilter } from "@/components/filters/HotelStarsFilter";
import { FilterSearch } from "@/components/filters/FilterSearch";
import {
  DURATION_BUCKETS,
  TRIP_TYPE_OPTIONS,
  TRANSPORTATION_OPTIONS,
  HOTEL_STARS_OPTIONS,
  MEAL_OPTIONS,
  VISA_OPTIONS,
  RATING_OPTIONS,
  OFFERS_OPTIONS,
  type FilterState,
} from "@/components/filters/filter-config";
import type { Country, City } from "@/types";

// Icon set — kept inline so the file is self-contained.
import {
  Search as SearchIcon,
  MapPin as MapPinIcon,
  Building2 as BuildingIcon,
  Calendar as CalendarIcon,
  Wallet as WalletIcon,
  Clock as ClockIcon,
  Compass as CompassIcon,
  Bus as BusIcon,
  Star as StarIcon,
  Utensils as UtensilsIcon,
  Stamp as StampIcon,
  Tag as TagIcon,
} from "lucide-react";

interface FilterAccordionListProps {
  state: FilterState;
  defaultState: FilterState;
  countries: Country[];
  cities: City[];
  onChange: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onToggle: <K extends "selectedCountries" | "selectedCities" | "durationBuckets" | "tripTypes" | "transportation" | "hotelStars" | "meals" | "visa" | "offers">(
    key: K,
    value: FilterState[K][number],
  ) => void;
  className?: string;
}

/**
 * The 13 filter accordion sections in spec order.
 *
 * Rendered inside FilterDialog (modal) — no header / footer here, those live
 * in the dialog itself. This keeps the accordion list reusable and decoupled
 * from any specific container.
 *
 *   1. Destination Search   2. Country     3. City
 *   4. Travel Date          5. Budget      6. Duration
 *   7. Trip Type            8. Transportation  9. Hotel Stars
 *  10. Meals               11. Visa        12. Rating
 *  13. Offers
 *
 * - Single page scroll only — no nested scrollbars inside Country / City.
 * - Country & City use searchable checkbox lists with Show More / Show Less.
 * - Hotel Stars rendered as visual star rows (★★★★★, ★★★★☆, etc.).
 * - Each accordion section persists its open state to localStorage.
 */
export function FilterAccordionList({
  state,
  defaultState,
  countries,
  cities,
  onChange,
  onToggle,
  className,
}: FilterAccordionListProps) {
  // Build city options filtered by selected countries (for the City section).
  const cityOptions = useMemo(() => {
    const filtered = state.selectedCountries.length
      ? cities.filter((c) => state.selectedCountries.includes(c.countryId))
      : cities;
    return filtered.map((c) => ({ id: c.id, label: c.name }));
  }, [cities, state.selectedCountries]);

  const countryOptions = useMemo(
    () => countries.map((c) => ({ id: c.id, label: c.name })),
    [countries],
  );

  return (
    <div className={className}>
      {/* 1. Destination Search */}
      <FilterAccordion
        id="dest-search"
        title="Destination"
        icon={SearchIcon}
        defaultOpen
        persistKey="dest-search"
      >
        <FilterSearch
          value={state.query}
          onChange={(v) => onChange("query", v)}
          placeholder="Search destinations..."
          ariaLabel="Search destinations"
        />
      </FilterAccordion>

      {/* 2. Country — searchable checkbox list */}
      <FilterAccordion
        id="country"
        title="Country"
        icon={MapPinIcon}
        activeCount={state.selectedCountries.length}
        defaultOpen
        persistKey="country"
      >
        <CheckboxFilter
          options={countryOptions}
          selected={state.selectedCountries}
          onToggle={(v) => onToggle("selectedCountries", v)}
          searchable
          searchPlaceholder="Search country..."
          searchAriaLabel="Search countries"
          maxVisible={6}
          ariaLabel="Countries"
        />
      </FilterAccordion>

      {/* 3. City — searchable checkbox list */}
      <FilterAccordion
        id="city"
        title="City"
        icon={BuildingIcon}
        activeCount={state.selectedCities.length}
        defaultOpen
        persistKey="city"
      >
        <CheckboxFilter
          options={cityOptions}
          selected={state.selectedCities}
          onToggle={(v) => onToggle("selectedCities", v)}
          searchable
          searchPlaceholder="Search city..."
          searchAriaLabel="Search cities"
          maxVisible={6}
          ariaLabel="Cities"
        />
      </FilterAccordion>

      {/* 4. Travel Date */}
      <FilterAccordion
        id="travel-date"
        title="Travel Date"
        icon={CalendarIcon}
        defaultOpen={false}
        persistKey="travel-date"
      >
        <DateFilter value={state.dateRange} onChange={(v) => onChange("dateRange", v)} />
      </FilterAccordion>

      {/* 5. Budget — dual range slider */}
      <FilterAccordion
        id="budget"
        title="Budget"
        icon={WalletIcon}
        activeCount={
          state.priceRange[0] !== defaultState.priceRange[0] || state.priceRange[1] !== defaultState.priceRange[1] ? 1 : 0
        }
        defaultOpen
        persistKey="budget"
      >
        <RangeSliderFilter
          value={state.priceRange}
          onChange={(v) => onChange("priceRange", v)}
          min={0}
          max={defaultState.priceRange[1]}
          step={50}
          currency="USD"
          ariaLabel="Budget range"
        />
      </FilterAccordion>

      {/* 6. Duration */}
      <FilterAccordion
        id="duration"
        title="Duration"
        icon={ClockIcon}
        activeCount={state.durationBuckets.length}
        defaultOpen={false}
        persistKey="duration"
      >
        <CheckboxFilter
          options={DURATION_BUCKETS.map((b) => ({ id: b.id, label: b.label }))}
          selected={state.durationBuckets}
          onToggle={(v) => onToggle("durationBuckets", v)}
          ariaLabel="Trip duration"
        />
      </FilterAccordion>

      {/* 7. Trip Type */}
      <FilterAccordion
        id="trip-type"
        title="Trip Type"
        icon={CompassIcon}
        activeCount={state.tripTypes.length}
        defaultOpen={false}
        persistKey="trip-type"
      >
        <CheckboxFilter
          options={TRIP_TYPE_OPTIONS}
          selected={state.tripTypes}
          onToggle={(v) => onToggle("tripTypes", v)}
          ariaLabel="Trip type"
        />
      </FilterAccordion>

      {/* 8. Transportation */}
      <FilterAccordion
        id="transportation"
        title="Transportation"
        icon={BusIcon}
        activeCount={state.transportation.length}
        defaultOpen={false}
        persistKey="transportation"
      >
        <CheckboxFilter
          options={TRANSPORTATION_OPTIONS.map((t) => ({ id: t.id, label: t.label }))}
          selected={state.transportation}
          onToggle={(v) => onToggle("transportation", v)}
          ariaLabel="Transportation"
        />
      </FilterAccordion>

      {/* 9. Hotel Stars — visual star rows */}
      <FilterAccordion
        id="hotel-stars"
        title="Hotel Stars"
        icon={StarIcon}
        activeCount={state.hotelStars.length}
        defaultOpen={false}
        persistKey="hotel-stars"
      >
        <HotelStarsFilter
          options={HOTEL_STARS_OPTIONS}
          selected={state.hotelStars}
          onToggle={(v) => onToggle("hotelStars", v)}
          ariaLabel="Hotel stars"
        />
      </FilterAccordion>

      {/* 10. Meals */}
      <FilterAccordion
        id="meals"
        title="Meals"
        icon={UtensilsIcon}
        activeCount={state.meals.length}
        defaultOpen={false}
        persistKey="meals"
      >
        <CheckboxFilter
          options={MEAL_OPTIONS.map((m) => ({ id: m.id, label: m.label }))}
          selected={state.meals}
          onToggle={(v) => onToggle("meals", v)}
          ariaLabel="Meal plan"
        />
      </FilterAccordion>

      {/* 11. Visa */}
      <FilterAccordion
        id="visa"
        title="Visa"
        icon={StampIcon}
        activeCount={state.visa.length}
        defaultOpen={false}
        persistKey="visa"
      >
        <CheckboxFilter
          options={VISA_OPTIONS.map((v) => ({ id: v.id, label: v.label }))}
          selected={state.visa}
          onToggle={(v) => onToggle("visa", v)}
          ariaLabel="Visa requirements"
        />
      </FilterAccordion>

      {/* 12. Rating */}
      <FilterAccordion
        id="rating"
        title="Rating"
        icon={StarIcon}
        activeCount={state.minRating > 0 ? 1 : 0}
        defaultOpen={false}
        persistKey="rating"
      >
        <RatingFilter
          options={RATING_OPTIONS.map((r) => ({ id: r.id, label: r.label }))}
          selected={state.minRating}
          onSelect={(v) => onChange("minRating", v)}
          ariaLabel="Minimum rating"
        />
      </FilterAccordion>

      {/* 13. Offers */}
      <FilterAccordion
        id="offers"
        title="Offers"
        icon={TagIcon}
        activeCount={state.offers.length}
        defaultOpen={false}
        persistKey="offers"
      >
        <CheckboxFilter
          options={OFFERS_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
          selected={state.offers}
          onToggle={(v) => onToggle("offers", v)}
          ariaLabel="Special offers"
        />
      </FilterAccordion>
    </div>
  );
}
