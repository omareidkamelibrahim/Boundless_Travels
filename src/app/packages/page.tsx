"use client";

import { AppProviders } from "@/components/providers/AppProviders";
import { PopularTourPackages } from "@/components/sections/PopularTourPackages";
import { TripsExplorer } from "@/components/sections/TripsExplorer";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function PackagesPage() {
  return (
    <AppProviders>
      <PopularTourPackages />
      <TripsExplorer
        id="domestic-trips"
        type="domestic"
        eyebrow="Local adventures"
        title={<>Domestic <span className="text-gradient-bluesky">trips</span> in Egypt</>}
        description="Explore the wonders of Egypt — from the Pyramids to the Red Sea."
      />
      <TripsExplorer
        id="international-trips"
        type="international"
        eyebrow="Beyond borders"
        title={<>International <span className="text-gradient-bluesky">trips</span></>}
        description="Handcrafted journeys to the world's most beautiful destinations."
        showFab={false}
      />
      <ContactCTA />
    </AppProviders>
  );
}
