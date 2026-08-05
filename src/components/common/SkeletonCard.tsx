"use client";

import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
  variant?: "trip" | "hotel" | "compact";
}

/** Skeleton placeholder matching the visual shape of a TripCard / HotelCard. */
export function SkeletonCard({ className, variant = "trip" }: SkeletonCardProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium",
        className,
      )}
    >
      <div className="shimmer relative aspect-[4/3] bg-muted" />
      <div className="space-y-3 p-5">
        <div className="shimmer h-4 w-3/4 rounded bg-muted" />
        <div className="shimmer h-3 w-full rounded bg-muted/70" />
        <div className="shimmer h-3 w-2/3 rounded bg-muted/70" />
        <div className="flex items-center justify-between pt-2">
          <div className="shimmer h-5 w-16 rounded bg-muted" />
          <div className="shimmer h-8 w-20 rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
