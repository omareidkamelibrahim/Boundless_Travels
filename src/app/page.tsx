"use client";

import { AppProviders } from "@/components/providers/AppProviders";
import { Hero } from "@/components/sections/Hero";
import { AboutCompany } from "@/components/sections/AboutCompany";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { PopularTourPackages } from "@/components/sections/PopularTourPackages";
import { Statistics } from "@/components/sections/Statistics";
import { CustomerReviews } from "@/components/sections/CustomerReviews";
import { InstagramGallery } from "@/components/sections/InstagramGallery";
import { Partners } from "@/components/sections/Partners";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <AppProviders>
      {/* 1. Hero */}
      <Hero />

      {/* 2. About Company */}
      <AboutCompany />

      {/* 3. Why Choose Us */}
      <WhyChooseUs />

      {/* 4. Featured Services */}
      <FeaturedServices />

      {/* 5. Popular Tour Packages */}
      <PopularTourPackages />

      {/* 6. Statistics */}
      <Statistics />

      {/* 7. Testimonials */}
      <CustomerReviews />

      {/* 8. Gallery Preview */}
      <InstagramGallery />

      {/* 9. Partners */}
      <Partners />

      {/* 10. Contact CTA */}
      <ContactCTA />

      {/* 11. Footer (rendered by AppProviders) */}
    </AppProviders>
  );
}
