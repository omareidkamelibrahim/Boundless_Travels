"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, Star } from "lucide-react";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Reveal } from "@/components/common/Reveal";
import { getPopularDestinations } from "@/services";
import { useRouter } from "next/navigation";

export function FeaturedDestinations() {
  const destinations = getPopularDestinations(6);
  const router = useRouter();

  return (
    <section className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Explore the world"
          title={<>Featured <span className="text-gradient-bluesky">destinations</span></>}
          description="Hand-picked places travelers can't stop talking about this season."
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Tall hero card */}
          <Reveal as="div" className="lg:row-span-2">
            <motion.div
              whileHover={{ y: -4 }}
              onClick={() => router.push("/packages")}
              className="group relative h-full min-h-[400px] cursor-pointer overflow-hidden rounded-2xl shadow-premium"
            >
              <Image src={destinations[0].imageUrl} alt={destinations[0].name} fill sizes="(max-width: 1024px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                <ArrowUpRight className="size-4" />
              </div>
              <div className="absolute inset-x-4 bottom-4">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[0.65rem] font-semibold text-white backdrop-blur-md">{destinations[0].reviewCount.toLocaleString()} reviews</span>
                <h3 className="mt-1.5 text-xl font-bold text-white">{destinations[0].name}</h3>
                <p className="mt-0.5 line-clamp-1 text-sm text-white/80">{destinations[0].description}</p>
                <div className="mt-2 flex items-center gap-1">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-bold text-white">{destinations[0].rating}</span>
                  <span className="text-xs text-white/70">· 12 tours available</span>
                </div>
              </div>
            </motion.div>
          </Reveal>

          {destinations.slice(1, 5).map((d, i) => (
            <Reveal key={d.id} delay={i * 0.05} as="div">
              <motion.div
                whileHover={{ y: -4 }}
                onClick={() => router.push("/packages")}
                className="group relative h-full min-h-[200px] cursor-pointer overflow-hidden rounded-2xl shadow-premium"
              >
                <Image src={d.imageUrl} alt={d.name} fill sizes="(max-width: 1024px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="size-4" />
                </div>
                <div className="absolute inset-x-3 bottom-3">
                  <h3 className="text-base font-bold text-white">{d.name}</h3>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-white">{d.rating}</span>
                    <span className="text-xs text-white/70">· {d.reviewCount.toLocaleString()} reviews</span>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
