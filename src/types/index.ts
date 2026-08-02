// BlueSky Travel — domain types
// Mirrors prisma/schema.prisma 1:1 so that dummy services can be swapped for Prisma queries
// without touching any component or UI code.

export type Continent =
  | "Africa"
  | "Asia"
  | "Europe"
  | "Middle East"
  | "North America"
  | "Oceania"
  | "South America";

export type TripType = "domestic" | "international";

export type TripCategoryName =
  | "Adventure"
  | "Honeymoon"
  | "Family"
  | "Beach"
  | "Religious"
  | "Safari"
  | "Luxury"
  | "Weekend";

export type CabinClass = "economy" | "premium" | "business" | "first";

export type VisaType = "tourist" | "business" | "student" | "transit";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export type PaymentStatus = "unpaid" | "paid" | "refunded";

export type UserRole = "customer" | "agent" | "admin";

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  phone?: string;
  role: UserRole;
  nationality?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
  continent: Continent;
  isoCode?: string;
  flagUrl?: string;
  imageUrl: string;
  description?: string;
  visaRequired: boolean;
  popularity: number;
  createdAt: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  countryId: string;
  imageUrl: string;
  description?: string;
  latitude?: number;
  longitude?: number;
  popularity: number;
}

export interface Category {
  id: string;
  name: TripCategoryName;
  slug: string;
  icon: string; // lucide icon name
  description?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  countryId: string;
  cityId?: string;
  imageUrl: string;
  galleryUrls: string[];
  description?: string;
  rating: number;
  reviewCount: number;
  popularity: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface Trip {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  countryId: string;
  cityId?: string;
  categoryId?: string;
  destinationId?: string;
  type: TripType;
  durationDays: number;
  price: number;
  oldPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
  maxTravelers: number;
  transportation?: string;
  accommodation?: string;
  mealPlan?: string;
  visaRequired: boolean;
  imageUrl: string;
  galleryUrls: string[];
  included: string[];
  excluded: string[];
  itinerary: ItineraryDay[];
  tags: TripCategoryName[];
  featured: boolean;
  popularity: number;
  createdAt: string;
  updatedAt: string;
}

export interface TripDate {
  id: string;
  tripId: string;
  startDate: string;
  endDate: string;
  price: number;
  availableSeats: number;
}

export interface Hotel {
  id: string;
  name: string;
  slug: string;
  cityId: string;
  stars: number;
  description: string;
  pricePerNight: number;
  currency: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  galleryUrls: string[];
  facilities: string[];
  roomTypes: string[];
  latitude?: number;
  longitude?: number;
  address?: string;
  createdAt: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  originCity: string;
  destinationCity: string;
  departureAt: string;
  arrivalAt: string;
  durationMins: number;
  cabinClass: CabinClass;
  stops: number;
  price: number;
  currency: string;
  seatsLeft: number;
  baggage?: string;
  createdAt: string;
}

export interface Visa {
  id: string;
  countryId: string;
  visaType: VisaType;
  processingDays: number;
  validityDays: number;
  stayDays: number;
  fee: number;
  currency: string;
  documentsNeeded: string[];
  requirements: string[];
  imageUrl: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discountPct: number;
  tripId?: string;
  imageUrl: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  tripId?: string;
  hotelId?: string;
  rating: number;
  title: string;
  body: string;
  isVerified: boolean;
  createdAt: string;
  // denormalised for display
  authorName?: string;
  authorAvatar?: string;
  tripTitle?: string;
}

export interface Booking {
  id: string;
  reference: string;
  userId: string;
  tripId?: string;
  hotelId?: string;
  visaId?: string;
  status: BookingStatus;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  infants: number;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  bookingId: string;
  userId: string;
  number: string;
  amount: number;
  currency: string;
  issuedAt: string;
  pdfUrl?: string;
}

export interface WishlistItem {
  id: string;
  userId: string;
  tripId?: string;
  hotelId?: string;
  createdAt: string;
  // denormalised for display
  trip?: Trip;
  hotel?: Hotel;
}

export interface AppNotification {
  id: string;
  userId: string;
  bookingId?: string;
  title: string;
  body: string;
  type: "info" | "success" | "warning" | "error";
  readAt?: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string;
  authorName: string;
  authorAvatar?: string;
  category: string;
  tags: string[];
  readMins: number;
  publishedAt: string;
  createdAt: string;
}

// ===== Search / filter DTOs =====

export interface TripSearchFilters {
  query?: string;
  type?: TripType;
  countryId?: string;
  cityId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
  minRating?: number;
  transportation?: string;
  tags?: TripCategoryName[];
  page?: number;
  pageSize?: number;
}

export interface HotelSearchFilters {
  query?: string;
  cityId?: string;
  stars?: number[];
  minPrice?: number;
  maxPrice?: number;
  facilities?: string[];
  roomTypes?: string[];
  page?: number;
  pageSize?: number;
}

export interface FlightSearchFilters {
  originCity: string;
  destinationCity: string;
  departureAt: string;
  returnAt?: string;
  cabinClass: CabinClass;
  adults: number;
  children: number;
  infants: number;
  tripType: "oneway" | "roundtrip" | "multicity";
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ===== Booking flow =====

export interface BookingPassenger {
  id: string;
  type: "adult" | "child" | "infant";
  fullName: string;
  email?: string;
  phone?: string;
  passportNumber?: string;
  dateOfBirth?: string;
}

export interface BookingFlowState {
  step: 1 | 2 | 3 | 4 | 5;
  trip?: Trip;
  selectedDate?: string;
  adults: number;
  children: number;
  infants: number;
  passengers: BookingPassenger[];
  contactEmail: string;
  contactPhone: string;
  paymentMethod: "card" | "paypal" | "bank";
  promoCode?: string;
}
