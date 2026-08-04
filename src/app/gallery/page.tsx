"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { AppProviders } from "@/components/providers/AppProviders";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Reveal } from "@/components/common/Reveal";
import { InstagramGallery } from "@/components/sections/InstagramGallery";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Destinations", "Hotels", "Adventure", "Culture", "Beach"];

const GALLERY_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: `g-${i}`,
  image: `https://picsum.photos/seed/gallery-${i}/800/800`,
  category: CATEGORIES[(i % (CATEGORIES.length - 1)) + 1],
  title: `Gallery Image ${i + 1}`,
  height: i % 3 === 0 ? "tall" : i % 3 === 1 ? "medium" : "short",
}));

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = filter === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((g) => g.category === filter);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const nextImage = useCallback(() => setLightbox((prev) => prev === null ? null : (prev + 1) % filtered.length), [filtered.length]);
  const prevImage = useCallback(() => setLightbox((prev) => prev === null ? null : (prev - 1 + filtered.length) % filtered.length), [filtered.length]);

  return (
    <AppProviders>
      <section id="gallery" className="relative py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Visual journey"
            align="center"
            title={<>Our <span className="text-gradient-bluesky">gallery</span></>}
            description="A visual journey through the destinations we love."
          />

          {/* Category filter */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setFilter(cat); setLightbox(null); }}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-all",
                  filter === cat
                    ? "bg-gradient-bluesky text-white shadow-glow-bluesky"
                    : "border border-border/60 bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="mb-4 break-inside-avoid"
              >
                <div
                  className="group relative cursor-pointer overflow-hidden rounded-2xl shadow-premium"
                  onClick={() => setLightbox(i)}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={800}
                    height={item.height === "tall" ? 1000 : item.height === "medium" ? 700 : 500}
                    className="w-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex w-full items-center justify-between">
                      <div>
                        <span className="rounded-full bg-white/15 px-2 py-0.5 text-[0.6rem] font-bold text-white backdrop-blur-md">{item.category}</span>
                        <p className="mt-1 text-sm font-bold text-white">{item.title}</p>
                      </div>
                      <div className="grid size-8 place-items-center rounded-full bg-white/20 backdrop-blur-md">
                        <ZoomIn className="size-4 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <X className="size-5" />
            </button>
            {/* Previous */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" />
            </button>
            {/* Image */}
            <motion.div
              key={filtered[lightbox].id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightbox].image}
                alt={filtered[lightbox].title}
                width={1200}
                height={900}
                className="rounded-2xl object-contain"
              />
              <div className="mt-3 text-center">
                <p className="text-sm font-bold text-white">{filtered[lightbox].title}</p>
                <p className="text-xs text-white/60">{filtered[lightbox].category}</p>
              </div>
            </motion.div>
            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <InstagramGallery />
      <ContactCTA />
    </AppProviders>
  );
}
