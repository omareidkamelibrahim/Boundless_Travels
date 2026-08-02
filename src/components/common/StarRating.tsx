"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { starCount } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  reviewCount?: number;
}

/** Reusable star rating display. */
export function StarRating({ rating, size = 14, className, showValue = false, reviewCount }: StarRatingProps) {
  const { full, half, empty } = starCount(rating);
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="inline-flex items-center">
        {Array.from({ length: full }).map((_, i) => (
          <Star key={`f-${i}`} width={size} height={size} className="fill-amber-400 text-amber-400" />
        ))}
        {half && (
          <span className="relative inline-block" style={{ width: size, height: size }}>
            <Star width={size} height={size} className="absolute inset-0 text-amber-400" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: size / 2 }}>
              <Star width={size} height={size} className="fill-amber-400 text-amber-400" />
            </span>
          </span>
        )}
        {Array.from({ length: empty }).map((_, i) => (
          <Star key={`e-${i}`} width={size} height={size} className="text-amber-400/40" />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-foreground">
          {rating.toFixed(1)}
          {reviewCount != null && <span className="ml-1 text-muted-foreground">({reviewCount.toLocaleString()})</span>}
        </span>
      )}
    </div>
  );
}
