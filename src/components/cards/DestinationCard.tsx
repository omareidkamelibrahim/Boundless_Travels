"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Destination } from "@/types";
import { cn } from "@/lib/utils";
import { StarRating } from "@/components/common/StarRating";
import { countryName } from "@/data";

interface DestinationCardProps {
  destination: Destination;
  className?: string;
  size?: "sm" | "md" | "lg";
  onClick?: (d: Destination) => void;
}

export function DestinationCard({ destination, className, size = "md", onClick }: DestinationCardProps) {
  const heightClass =
    size === "lg" ? "aspect-[3/4]" : size === "sm" ? "aspect-[4/3]" : "aspect-[3/4]";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      onClick={() => onClick?.(destination)}
      className={cn(
        "group relative h-full cursor-pointer overflow-hidden rounded-2xl shadow-premium",
        heightClass,
        className,
      )}
    >
      <Image
        src={destination.imageUrl}
        alt={destination.name}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

      <div className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
        <ArrowUpRight className="size-4" />
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4">
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-white backdrop-blur-md">
          {countryName(destination.countryId)}
        </span>
        <h3 className="text-base font-bold leading-tight text-white sm:text-lg">{destination.name}</h3>
        {destination.description && (
          <p className="line-clamp-2 text-xs text-white/80">{destination.description}</p>
        )}
        <div className="mt-1 flex items-center gap-2">
          <StarRating rating={destination.rating} />
          <span className="text-xs font-medium text-white/80">
            {destination.reviewCount.toLocaleString()} reviews
          </span>
        </div>
      </div>
    </motion.article>
  );
}
