"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Country } from "@/types";
import { cn } from "@/lib/utils";

interface CountryCardProps {
  country: Country;
  className?: string;
  onClick?: (c: Country) => void;
}

export function CountryCard({ country, className, onClick }: CountryCardProps) {
  return (
    <motion.button
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick?.(country)}
      className={cn(
        "group relative flex aspect-[4/5] w-full flex-col items-start justify-end overflow-hidden rounded-2xl text-left shadow-premium",
        className,
      )}
    >
      <Image
        src={country.imageUrl}
        alt={country.name}
        fill
        sizes="(max-width: 768px) 50vw, 20vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      {country.flagUrl && (
        <Image
          src={country.flagUrl}
          alt={`${country.name} flag`}
          width={32}
          height={22}
          style={{ width: "auto", height: 22 }}
          className="absolute left-3 top-3 rounded-sm shadow-sm ring-1 ring-white/30"
        />
      )}

      <div className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
        <ArrowUpRight className="size-4" />
      </div>

      <div className="relative z-10 flex w-full flex-col gap-1 p-4">
        <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-white/70">
          {country.continent}
        </span>
        <h3 className="text-base font-bold leading-tight text-white sm:text-lg">{country.name}</h3>
        <div className="mt-1 flex items-center gap-2 text-xs text-white/85">
          {country.visaRequired ? (
            <span className="rounded-full bg-amber-500/85 px-2 py-0.5 font-semibold text-amber-950">
              Visa required
            </span>
          ) : (
            <span className="rounded-full bg-emerald-500/85 px-2 py-0.5 font-semibold text-emerald-950">
              Visa-free
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}
