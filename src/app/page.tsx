"use client";

import { AppProviders } from "@/components/providers/AppProviders";
import { Hero } from "@/components/sections/Hero";
import { PopularDestinations } from "@/components/sections/PopularDestinations";
import { TopCountries } from "@/components/sections/TopCountries";
import { FeaturedTrips } from "@/components/sections/FeaturedTrips";
import { TravelCategories } from "@/components/sections/TravelCategories";
import { LimitedOffers } from "@/components/sections/LimitedOffers";
import { BestHotels } from "@/components/sections/BestHotels";
import { TripsExplorer } from "@/components/sections/TripsExplorer";
import { FlightsSection } from "@/components/sections/FlightsSection";
import { VisaSection } from "@/components/sections/VisaSection";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { CustomerReviews } from "@/components/sections/CustomerReviews";
import { LatestArticles } from "@/components/sections/LatestArticles";
import { InstagramGallery } from "@/components/sections/InstagramGallery";
import { Newsletter } from "@/components/sections/Newsletter";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <AppProviders>
      <Hero />
      <PopularDestinations />
      <TopCountries />
      <FeaturedTrips id="featured-trips" />
      <TravelCategories />
      <LimitedOffers />
      <BestHotels />
      <TripsExplorer
        id="domestic-trips"
        type="domestic"
        eyebrow="Local adventures"
        title={
          <>
            Domestic <span className="text-gradient-bluesky">trips</span> in Egypt
          </>
        }
        description="Explore the wonders of Egypt — from the Pyramids to the Red Sea, all in one place."
      />
      <TripsExplorer
        id="international-trips"
        type="international"
        eyebrow="Beyond borders"
        title={
          <>
            International <span className="text-gradient-bluesky">trips</span>
          </>
        }
        description="Handcrafted journeys to the world's most beautiful destinations."
      />
      <FlightsSection />
      <VisaSection />
      <WhyChooseUs />
      <CustomerReviews />
      <LatestArticles />
      <InstagramGallery />
      <Newsletter />
      <ContactSection />
    </AppProviders>
  );
}
