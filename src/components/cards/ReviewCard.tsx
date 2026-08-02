"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { StarRating } from "@/components/common/StarRating";
import { cn, formatDate, initials } from "@/lib/utils";
import type { Review } from "@/types";

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className={cn(
        "relative flex h-full flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 shadow-premium",
        className,
      )}
    >
      <Quote className="absolute right-5 top-5 size-9 text-primary/15" />

      <StarRating rating={review.rating} size={16} />
      <h4 className="text-base font-bold text-foreground">{review.title}</h4>
      <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">{review.body}</p>

      <div className="mt-auto flex items-center gap-3 border-t border-border/60 pt-4">
        <div className="grid size-10 place-items-center rounded-full bg-gradient-bluesky text-sm font-bold text-white">
          {initials(review.authorName)}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">{review.authorName}</span>
          <span className="text-xs text-muted-foreground">
            {review.tripTitle ?? "Verified traveler"} · {formatDate(review.createdAt, { year: "numeric", month: "short" })}
          </span>
        </div>
        {review.isVerified && (
          <span className="ml-auto inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-700">
            Verified
          </span>
        )}
      </div>
    </motion.article>
  );
}
