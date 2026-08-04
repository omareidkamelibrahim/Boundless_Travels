"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AppProviders } from "@/components/providers/AppProviders";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Reveal } from "@/components/common/Reveal";
import { InstagramGallery } from "@/components/sections/InstagramGallery";
import { ContactCTA } from "@/components/sections/ContactCTA";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Destinations", "Hotels", "Adventure", "Culture", "Beach"];
const GALLERY_ITEMS = Array.from({ length: 12 }, (_, i) => ({
  id: `g-${i}`,
  image: `https://picsum.photos/seed/gallery-${i}/600/600`,
  category: CATEGORIES[(i % (CATEGORIES.length - 1)) + 1],
  title: `Gallery Item ${i + 1}`,
}));

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? GALLERY_ITEMS : GALLERY_ITEMS.filter((g) => g.category === filter);

  return (
    <AppProviders>
      <div className="pt-20" />
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
                onClick={() => setFilter(cat)}
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
                <div className="group relative overflow-hidden rounded-2xl shadow-premium">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={600}
                    className="w-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <div>
                      <span className="rounded-full bg-white/15 px-2 py-0.5 text-[0.6rem] font-bold text-white backdrop-blur-md">
                        {item.category}
                      </span>
                      <p className="mt-1 text-sm font-bold text-white">{item.title}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <InstagramGallery />
      <ContactCTA />
    </AppProviders>
  );
}
