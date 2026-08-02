// Data service layer — currently reads from in-memory dummy data.
// Each function signature mirrors a future Prisma query, so swapping to `db` is one-line per function.
// Example future implementation:
//   export const getTrips = (filters) => db.trip.findMany({ where: {...}, include: {...} })

import {
  countries,
  cities,
  categories,
  destinations,
  trips,
  hotels,
  flights,
  visas,
  offers,
  reviews,
  blogs,
  instagramPosts,
  findCountry,
  findCity,
  findCategory,
  findTrip,
  findHotel,
  findVisa,
  findDestination,
} from "@/data";
import type {
  Country,
  City,
  Category,
  Destination,
  Trip,
  Hotel,
  Flight,
  Visa,
  Offer,
  Review,
  Blog,
  TripSearchFilters,
  HotelSearchFilters,
  FlightSearchFilters,
  Paginated,
} from "@/types";

const DEFAULT_PAGE_SIZE = 9;

// ===== Lookups =====
export const getCountries = (): Country[] => [...countries].sort((a, b) => b.popularity - a.popularity);
export const getCountry = (id: string): Country | undefined => findCountry(id);
export const getCountryBySlug = (slug: string): Country | undefined => countries.find((c) => c.slug === slug);

export const getCities = (): City[] => [...cities].sort((a, b) => b.popularity - a.popularity);
export const getCitiesByCountry = (countryId: string): City[] =>
  cities.filter((c) => c.countryId === countryId);
export const getCity = (id?: string): City | undefined => (id ? findCity(id) : undefined);

export const getCategories = (): Category[] => categories;
export const getCategory = (id?: string): Category | undefined => (id ? findCategory(id) : undefined);

export const getDestinations = (): Destination[] =>
  [...destinations].sort((a, b) => b.popularity - a.popularity);
export const getPopularDestinations = (limit = 6): Destination[] =>
  [...destinations].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
export const getDestination = (id?: string): Destination | undefined => (id ? findDestination(id) : undefined);

// ===== Trips =====
export const getTrips = (): Trip[] => [...trips].sort((a, b) => b.popularity - a.popularity);
export const getTrip = (id: string): Trip | undefined => trips.find((t) => t.id === id);
export const getTripBySlug = (slug: string): Trip | undefined => trips.find((t) => t.slug === slug);
export const getFeaturedTrips = (limit = 6): Trip[] =>
  trips.filter((t) => t.featured).sort((a, b) => b.popularity - a.popularity).slice(0, limit);
export const getDomesticTrips = (limit?: number): Trip[] => {
  const out = trips.filter((t) => t.type === "domestic").sort((a, b) => b.popularity - a.popularity);
  return limit ? out.slice(0, limit) : out;
};
export const getInternationalTrips = (limit?: number): Trip[] => {
  const out = trips.filter((t) => t.type === "international").sort((a, b) => b.popularity - a.popularity);
  return limit ? out.slice(0, limit) : out;
};
export const getTripsByCountry = (countryId: string): Trip[] => trips.filter((t) => t.countryId === countryId);
export const getTripsByCategory = (categoryId: string): Trip[] => trips.filter((t) => t.categoryId === categoryId);
export const getRelatedTrips = (trip: Trip, limit = 3): Trip[] =>
  trips
    .filter((t) => t.id !== trip.id && (t.countryId === trip.countryId || t.categoryId === trip.categoryId))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);

export const searchTrips = (filters: TripSearchFilters): Paginated<Trip> => {
  let result = [...trips];
  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q),
    );
  }
  if (filters.type) result = result.filter((t) => t.type === filters.type);
  if (filters.countryId) result = result.filter((t) => t.countryId === filters.countryId);
  if (filters.cityId) result = result.filter((t) => t.cityId === filters.cityId);
  if (filters.categoryId) result = result.filter((t) => t.categoryId === filters.categoryId);
  if (filters.minPrice != null) result = result.filter((t) => t.price >= filters.minPrice!);
  if (filters.maxPrice != null) result = result.filter((t) => t.price <= filters.maxPrice!);
  if (filters.minDuration != null) result = result.filter((t) => t.durationDays >= filters.minDuration!);
  if (filters.maxDuration != null) result = result.filter((t) => t.durationDays <= filters.maxDuration!);
  if (filters.minRating != null) result = result.filter((t) => t.rating >= filters.minRating!);
  if (filters.transportation) result = result.filter((t) => t.transportation === filters.transportation);
  if (filters.tags?.length) result = result.filter((t) => t.tags.some((tag) => filters.tags!.includes(tag)));

  result.sort((a, b) => b.popularity - a.popularity);

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const items = result.slice((page - 1) * pageSize, page * pageSize);
  return { items, total, page, pageSize, totalPages };
};

// ===== Hotels =====
export const getHotels = (): Hotel[] => [...hotels].sort((a, b) => b.rating - a.rating);
export const getHotel = (id: string): Hotel | undefined => hotels.find((h) => h.id === id);
export const getBestHotels = (limit = 4): Hotel[] =>
  [...hotels].sort((a, b) => b.rating - a.rating).slice(0, limit);

export const searchHotels = (filters: HotelSearchFilters): Paginated<Hotel> => {
  let result = [...hotels];
  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter((h) => h.name.toLowerCase().includes(q) || h.description.toLowerCase().includes(q));
  }
  if (filters.cityId) result = result.filter((h) => h.cityId === filters.cityId);
  if (filters.stars?.length) result = result.filter((h) => filters.stars!.includes(h.stars));
  if (filters.minPrice != null) result = result.filter((h) => h.pricePerNight >= filters.minPrice!);
  if (filters.maxPrice != null) result = result.filter((h) => h.pricePerNight <= filters.maxPrice!);
  if (filters.facilities?.length)
    result = result.filter((h) => filters.facilities!.every((f) => h.facilities.includes(f)));

  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? DEFAULT_PAGE_SIZE;
  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const items = result.slice((page - 1) * pageSize, page * pageSize);
  return { items, total, page, pageSize, totalPages };
};

// ===== Flights =====
export const getFlights = (): Flight[] => [...flights];
export const searchFlights = (filters: FlightSearchFilters): Flight[] =>
  flights.filter(
    (f) =>
      f.originCity === filters.originCity &&
      f.destinationCity === filters.destinationCity &&
      f.cabinClass === filters.cabinClass,
  );

// ===== Visas =====
export const getVisas = (): Visa[] => visas;
export const getVisa = (id: string): Visa | undefined => visas.find((v) => v.id === id);
export const getVisasByCountry = (countryId: string): Visa[] =>
  visas.filter((v) => v.countryId === countryId);

// ===== Offers =====
export const getOffers = (): Offer[] => offers;
export const getActiveOffers = (): Offer[] =>
  offers.filter((o) => new Date(o.endsAt).getTime() > Date.now());

// ===== Reviews =====
export const getReviews = (): Review[] => [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export const getTripReviews = (tripId: string): Review[] => reviews.filter((r) => r.tripId === tripId);

// ===== Blog =====
export const getBlogs = (): Blog[] => [...blogs].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
export const getLatestArticles = (limit = 3): Blog[] =>
  [...blogs].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, limit);
export const getBlog = (id: string): Blog | undefined => blogs.find((b) => b.id === id);

// ===== Instagram =====
export const getInstagramPosts = () => instagramPosts;

// ===== Stats =====
export const getPlatformStats = () => ({
  destinations: destinations.length + countries.length * 4,
  happyTravelers: 48250,
  expertGuides: 320,
  averageRating: 4.9,
});

// Re-export raw lookup helpers for components that need single-record reads
export {
  findCountry,
  findCity,
  findCategory,
  findTrip,
  findHotel,
  findVisa,
  findDestination,
};
