"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ReviewCard } from "@/components/cards/ReviewCard";
import { Reveal } from "@/components/common/Reveal";
import { getReviews, getPlatformStats } from "@/services";
import { StarRating } from "@/components/common/StarRating";

export function CustomerReviews() {
  const reviews = getReviews().slice(0, 6);
  const stats = getPlatformStats();

  return (
    <section id="reviews" className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 size-96 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>

      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Traveler stories"
          align="center"
          title={
            <>
              Loved by <span className="text-gradient-bluesky">48,000+</span> travelers
            </>
          }
          description="Real reviews from verified travelers who explored the world with BlueSky."
        />

        {/* Summary banner */}
        <Reveal as="div">
          <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-center gap-6 rounded-2xl border border-border/60 bg-card p-6 shadow-premium sm:flex-row sm:gap-10">
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="text-5xl font-extrabold tracking-tight text-foreground">
                {stats.averageRating.toFixed(1)}
              </span>
              <StarRating rating={5} size={18} />
              <span className="text-xs text-muted-foreground">Average rating</span>
            </div>
            <div className="hidden h-16 w-px bg-border sm:block" />
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">48K+</p>
                <p className="text-xs text-muted-foreground">Reviews</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">96%</p>
                <p className="text-xs text-muted-foreground">Repeat customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={(i % 3) * 0.08} as="div" className="h-full">
              <ReviewCard review={r} className="h-full" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
