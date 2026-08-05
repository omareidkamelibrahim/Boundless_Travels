"use client";

import { AppProviders } from "@/components/providers/AppProviders";
import { Hero } from "@/components/sections/Hero";
import { SearchTours } from "@/components/sections/SearchTours";
import { FeaturedDestinations } from "@/components/sections/FeaturedDestinations";
import { AboutCompany } from "@/components/sections/AboutCompany";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { PopularTourPackages } from "@/components/sections/PopularTourPackages";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { LimitedOffers } from "@/components/sections/LimitedOffers";
import { CustomerReviews } from "@/components/sections/CustomerReviews";
import { InstagramGallery } from "@/components/sections/InstagramGallery";
import { Statistics } from "@/components/sections/Statistics";
import { Partners } from "@/components/sections/Partners";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <AppProviders>
      {/* 1. Hero */}
      <Hero />
      {/* 2. Search Tours */}
      <SearchTours />
      {/* 3. Featured Destinations */}
      <FeaturedDestinations />
      {/* 4. About Company */}
      <AboutCompany />
      {/* 5. Why Choose Us */}
      <WhyChooseUs />
      {/* 6. Popular Tour Packages */}
      <PopularTourPackages />
      {/* 7. Services */}
      <FeaturedServices />
      {/* 8. Special Offers */}
      <LimitedOffers />
      {/* 9. Testimonials */}
      <CustomerReviews />
      {/* 10. Gallery Preview */}
      <InstagramGallery />
      {/* 11. Travel Statistics */}
      <Statistics />
      {/* 12. Partners */}
      <Partners />
      {/* 13. Call To Action */}
      <ContactCTA />
      {/* 14. Contact Preview */}
      <ContactSection />
      {/* 15. Footer (rendered by AppProviders) */}
    </AppProviders>
  );
}
