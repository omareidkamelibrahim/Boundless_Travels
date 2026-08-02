"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Search,
  Plane,
  Hotel,
  Stamp,
  MapPin,
  ArrowRight,
  Tag,
  Sparkles,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useUI } from "@/stores/use-ui";
import { useBooking } from "@/stores/use-booking";
import { getTrips, getHotels, getCountries, getVisas, getOffers } from "@/services";
import { formatPrice, formatTripDuration } from "@/lib/utils";
import { cn } from "@/lib/utils";

const QUICK_ACTIONS = [
  { label: "Browse domestic trips", icon: MapPin, section: "domestic-trips" },
  { label: "Browse international trips", icon: Plane, section: "international-trips" },
  { label: "Find hotels", icon: Hotel, section: "hotels" },
  { label: "Book a flight", icon: Plane, section: "flights" },
  { label: "Apply for a visa", icon: Stamp, section: "visa" },
  { label: "View current offers", icon: Tag, section: "offers" },
];

export function CommandPalette() {
  const { commandOpen, setCommandOpen } = useUI();
  const setTripDetailId = useUI((s) => s.setTripDetailId);
  const openBooking = useBooking((s) => s.open);
  const [query, setQuery] = useState("");

  const trips = useMemo(() => getTrips(), []);
  const hotels = useMemo(() => getHotels(), []);
  const countries = useMemo(() => getCountries(), []);
  const visas = useMemo(() => getVisas(), []);
  const offers = useMemo(() => getOffers(), []);

  const filteredTrips = query
    ? trips.filter((t) => t.title.toLowerCase().includes(query.toLowerCase()) || t.summary.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : trips.slice(0, 5);

  const filteredHotels = query
    ? hotels.filter((h) => h.name.toLowerCase().includes(query.toLowerCase())).slice(0, 3)
    : hotels.slice(0, 3);

  const filteredCountries = query
    ? countries.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 4)
    : countries.slice(0, 4);

  const closeAnd = (fn: () => void) => {
    setCommandOpen(false);
    setTimeout(fn, 100);
  };

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Search trips, hotels, destinations..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {filteredTrips.length > 0 && (
          <CommandGroup heading="Trips">
            {filteredTrips.map((t) => (
              <CommandItem
                key={t.id}
                onSelect={() => closeAnd(() => setTripDetailId(t.id))}
                className="group"
              >
                <div className="relative size-9 shrink-0 overflow-hidden rounded-lg">
                  <Image src={t.imageUrl} alt={t.title} fill sizes="36px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">{t.title}</span>
                  <span className="text-xs text-muted-foreground">{formatTripDuration(t.durationDays)}</span>
                </div>
                <span className="text-sm font-bold text-primary">{formatPrice(t.price, t.currency)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredHotels.length > 0 && (
          <CommandGroup heading="Hotels">
            {filteredHotels.map((h) => (
              <CommandItem key={h.id} onSelect={() => closeAnd(() => document.getElementById("hotels")?.scrollIntoView({ behavior: "smooth" }))}>
                <Hotel className="size-4 text-primary" />
                <span className="flex-1 truncate text-sm">{h.name}</span>
                <span className="text-xs text-muted-foreground">{"★".repeat(h.stars)}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {filteredCountries.length > 0 && (
          <CommandGroup heading="Destinations">
            {filteredCountries.map((c) => (
              <CommandItem
                key={c.id}
                onSelect={() => closeAnd(() => document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" }))}
              >
                <MapPin className="size-4 text-primary" />
                <span className="flex-1 truncate text-sm">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.continent}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {offers.length > 0 && (
          <CommandGroup heading="Offers">
            {offers.map((o) => (
              <CommandItem
                key={o.id}
                onSelect={() => closeAnd(() => document.getElementById("offers")?.scrollIntoView({ behavior: "smooth" }))}
              >
                <Tag className="size-4 text-rose-500" />
                <span className="flex-1 truncate text-sm">{o.title}</span>
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-bold text-primary">{o.discountPct}% OFF</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        <CommandGroup heading="Quick actions">
          {QUICK_ACTIONS.map((a) => (
            <CommandItem
              key={a.label}
              onSelect={() => closeAnd(() => document.getElementById(a.section)?.scrollIntoView({ behavior: "smooth" }))}
            >
              <a.icon className="size-4 text-primary" />
              <span className="flex-1 text-sm">{a.label}</span>
              <ArrowRight className="size-3.5 opacity-50" />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
