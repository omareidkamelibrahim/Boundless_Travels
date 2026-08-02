"use client";

import { motion } from "framer-motion";
import { Clock, FileText, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import type { Visa } from "@/types";
import { cn, formatPrice } from "@/lib/utils";
import { countryName } from "@/data";

interface VisaCardProps {
  visa: Visa;
  className?: string;
  onApply?: (v: Visa) => void;
}

export function VisaCard({ visa, className, onApply }: VisaCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium",
        className,
      )}
    >
      <div className="relative aspect-[2/1] overflow-hidden">
        <Image
          src={visa.imageUrl}
          alt={`Visa for ${countryName(visa.countryId)}`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
        <div className="absolute inset-x-4 bottom-3 flex items-center justify-between text-white">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-white/70">
              {visa.visaType} visa
            </p>
            <h3 className="text-lg font-bold">{countryName(visa.countryId)}</h3>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2.5 py-1 text-xs font-semibold backdrop-blur-md">
            <Clock className="size-3" /> {visa.processingDays} days
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-muted/60 p-2.5">
            <p className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
              Stay
            </p>
            <p className="text-sm font-bold text-foreground">{visa.stayDays}d</p>
          </div>
          <div className="rounded-xl bg-muted/60 p-2.5">
            <p className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
              Valid
            </p>
            <p className="text-sm font-bold text-foreground">{visa.validityDays}d</p>
          </div>
          <div className="rounded-xl bg-muted/60 p-2.5">
            <p className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
              Fee
            </p>
            <p className="text-sm font-bold text-foreground">{formatPrice(visa.fee, visa.currency)}</p>
          </div>
        </div>

        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <FileText className="size-3.5" /> Documents
          </p>
          <ul className="grid gap-1.5">
            {visa.documentsNeeded.slice(0, 4).map((d) => (
              <li key={d} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-emerald-500" />
                <span className="line-clamp-1">{d}</span>
              </li>
            ))}
            {visa.documentsNeeded.length > 4 && (
              <li className="text-xs font-medium text-primary">+{visa.documentsNeeded.length - 4} more</li>
            )}
          </ul>
        </div>

        <button
          onClick={() => onApply?.(visa)}
          className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow-bluesky transition-transform hover:scale-[1.02] active:scale-95"
        >
          Apply Now
          <ArrowRight className="size-4" />
        </button>
      </div>
    </motion.article>
  );
}
