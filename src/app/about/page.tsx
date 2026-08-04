"use client";

import { AppProviders } from "@/components/providers/AppProviders";
import { AboutCompany } from "@/components/sections/AboutCompany";
import { Statistics } from "@/components/sections/Statistics";
import { Partners } from "@/components/sections/Partners";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function AboutPage() {
  return (
    <AppProviders>
      <div className="pt-20" />
      <AboutCompany />
      <Statistics />
      <Partners />
      <ContactCTA />
    </AppProviders>
  );
}
