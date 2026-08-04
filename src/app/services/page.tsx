"use client";

import { AppProviders } from "@/components/providers/AppProviders";
import { FeaturedServices } from "@/components/sections/FeaturedServices";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function ServicesPage() {
  return (
    <AppProviders>
      <div className="pt-20" />
      <FeaturedServices />
      <WhyChooseUs />
      <ContactCTA />
    </AppProviders>
  );
}
