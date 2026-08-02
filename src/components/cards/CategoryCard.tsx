"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  category: Category;
  className?: string;
  onClick?: (c: Category) => void;
}

export function CategoryCard({ category, className, onClick }: CategoryCardProps) {
  return (
    <motion.button
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick?.(category)}
      className={cn(
        "group relative flex aspect-[5/6] w-full flex-col items-start justify-end overflow-hidden rounded-2xl text-left shadow-premium",
        className,
      )}
    >
      {category.imageUrl && (
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent transition-opacity duration-300 group-hover:from-primary/95" />

      <div className="relative z-10 flex w-full flex-col gap-1 p-5">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-md">
          <ArrowRight className="size-3.5" />
        </span>
        <h3 className="mt-1 text-lg font-bold leading-tight text-white sm:text-xl">{category.name}</h3>
        {category.description && (
          <p className="line-clamp-2 text-xs text-white/85">{category.description}</p>
        )}
      </div>
    </motion.button>
  );
}
