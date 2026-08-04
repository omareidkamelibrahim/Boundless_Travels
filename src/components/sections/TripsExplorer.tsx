"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionTitle } from "@/components/common/SectionTitle";
import { TripCard } from "@/components/cards/TripCard";
import { Pagination } from "@/components/common/Pagination";
import { SkeletonGrid } from "@/components/common/SkeletonCard";
import { FilterButton } from "@/components/filters/FilterButton";
import { FilterDialog } from "@/components/filters/FilterDialog";
import { FilterAccordionList } from "@/components/filters/FilterAccordionList";
import { useTripFilters } from "@/components/filters/use-trip-filters";
import { getDomesticTrips, getInternationalTrips, getCountries, getCities } from "@/services";
import { useUI } from "@/stores/use-ui";
import type { TripType } from "@/types";

const PAGE_SIZE = 8;
const PRICE_BOUND = 3500;

interface TripsExplorerProps {
  id: string;
  type: TripType;
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  /** When false, the mobile FAB is not rendered (prevents duplicate FABs
   *  when multiple TripsExplorer instances exist on the same page). */
  showFab?: boolean;
}

export function TripsExplorer({ id, type, eyebrow, title, description, showFab = true }: TripsExplorerProps) {
  const allTrips = useMemo(
    () => getDomesticTrips().concat(getInternationalTrips()).filter((t) => t.type === type),
    [type],
  );
  const countries = useMemo(() => getCountries(), []);
  const cities = useMemo(
    () => getCities().filter((c) => allTrips.some((t) => t.cityId === c.id)),
    [allTrips],
  );

  const {
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
  } = useTripFilters({ trips: allTrips, priceBound: PRICE_BOUND, pageSize: PAGE_SIZE });

  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const openBooking = useUI((s) => s.openBooking);

  // Quick-remove chips above the results grid (top selected cities + countries).
  const activeChips = useMemo(() => {
    const chips: { id: string; label: string; type: "country" | "city" }[] = [];
    state.selectedCountries.forEach((cid) => {
      const c = countries.find((x) => x.id === cid);
      if (c) chips.push({ id: `country-${cid}`, label: c.name, type: "country" });
    });
    state.selectedCities.forEach((cid) => {
      const c = cities.find((x) => x.id === cid);
      if (c) chips.push({ id: `city-${cid}`, label: c.name, type: "city" });
    });
    return chips;
  }, [state.selectedCountries, state.selectedCities, countries, cities]);

  const removeChip = (chip: { type: "country" | "city"; id: string }) => {
    const rawId = chip.id.replace(/^(country|city)-/, "");
    if (chip.type === "country") toggleArrayValue("selectedCountries", rawId);
    else toggleArrayValue("selectedCities", rawId);
  };

  return (
    <section id={id} className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionTitle eyebrow={eyebrow} title={title} description={description} />

        {/* ===== Top action bar: results count (left) + Filters button (right) — desktop/tablet ===== */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{filtered.length}</span> trips found
            {filtered.length > 0 && (
              <span className="ml-1">
                · showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filtered.length)}
              </span>
            )}
          </p>

          {/* FilterButton renders both desktop (inline) + mobile (FAB) variants internally */}
          <FilterButton
            activeCount={activeCount}
            onClick={() => setFilterDialogOpen(true)}
            showFab={showFab}
          />
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {activeChips.map((chip) => (
              <Badge key={chip.id} variant="secondary" className="gap-1.5 py-1 pl-2.5 pr-1">
                {chip.label}
                <button
                  onClick={() => removeChip(chip)}
                  aria-label={`Remove ${chip.label} filter`}
                  className="grid size-4 place-items-center rounded-full hover:bg-accent"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
            <button
              onClick={reset}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* ===== Full-width trip grid — NO sidebar, NO reserved space ===== */}
        <div className="mt-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="skeletons">
                <SkeletonGrid count={8} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
              </motion.div>
            ) : paginatedTrips.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                <AnimatePresence mode="popLayout">
                  {paginatedTrips.map((trip, i) => (
                    <motion.div
                      key={trip.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                    >
                      <TripCard trip={trip} onBook={(t) => openBooking(t.id)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-card py-20 text-center"
              >
                <div className="grid size-16 place-items-center rounded-full bg-muted">
                  <X className="size-7 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground">No trips match your filters</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try adjusting your filters or expanding your search.
                  </p>
                </div>
                <Button variant="outline" onClick={reset}>
                  Reset filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {filtered.length > PAGE_SIZE && !loading && (
          <div className="mt-10">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => {
                setLoading(true);
                setTimeout(() => {
                  setPage(p);
                  setLoading(false);
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 200);
              }}
            />
          </div>
        )}
      </div>

      {/* ===== Centered Filter Dialog — the ONLY way to access filters ===== */}
      <FilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        activeCount={activeCount}
        selectedCount={selectedCount}
        resultCount={filtered.length}
        onReset={reset}
        onApply={() => applyAndScroll(id)}
      >
        <FilterAccordionList
          state={state}
          defaultState={defaultState}
          countries={countries}
          cities={cities}
          onChange={update}
          onToggle={toggleArrayValue}
        />
      </FilterDialog>
    </section>
  );
}
