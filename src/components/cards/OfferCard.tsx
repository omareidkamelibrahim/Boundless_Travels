"use client";

import { motion } from "framer-motion";
import { Tag, ArrowRight } from "lucide-react";
import Image from "next/image";
import type { Offer } from "@/types";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "@/components/common/CountdownTimer";

interface OfferCardProps {
  offer: Offer;
  className?: string;
  onApply?: (offer: Offer) => void;
}

export function OfferCard({ offer, className, onApply }: OfferCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium",
        className,
      )}
    >
      <div className="relative aspect-[2/1] overflow-hidden">
        <Image
          src={offer.imageUrl}
          alt={offer.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/85 via-primary/40 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-primary shadow-md">
            <Tag className="size-3.5" />
            {offer.discountPct}% OFF
          </span>
        </div>
        <div className="absolute bottom-3 right-3">
          <CountdownTimer targetIso={offer.endsAt} variant="light" size="sm" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold leading-tight text-foreground">{offer.title}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{offer.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/60 pt-4">
          <div>
            <span className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
              Use code
            </span>
            <span className="ml-2 rounded-md bg-primary/10 px-2 py-0.5 font-mono text-sm font-bold tracking-wider text-primary">
              {offer.code}
            </span>
          </div>
          <button
            onClick={() => onApply?.(offer)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow-glow-bluesky transition-transform hover:scale-[1.04] active:scale-95"
          >
            Apply
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </motion.article>
  );
}
