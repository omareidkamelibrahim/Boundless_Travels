"use client";

import { SectionTitle } from "@/components/common/SectionTitle";
import { CategoryCard } from "@/components/cards/CategoryCard";
import { Reveal } from "@/components/common/Reveal";
import { getCategories } from "@/services";

export function TravelCategories() {
  const categories = getCategories();
  return (
    <section id="categories" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Find your vibe"
          align="center"
          title={
            <>
              Travel <span className="text-gradient-bluesky">categories</span>
            </>
          }
          description="Whatever your travel style, we have a perfect trip waiting for you."
        />

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={(i % 4) * 0.05} as="div">
              <CategoryCard category={c} className="h-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
