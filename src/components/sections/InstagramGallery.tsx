"use client";

import { motion } from "framer-motion";
import { Heart, Instagram } from "lucide-react";
import Image from "next/image";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Reveal } from "@/components/common/Reveal";
import { getInstagramPosts } from "@/services";
import { cn } from "@/lib/utils";

export function InstagramGallery() {
  const posts = getInstagramPosts();
  return (
    <section id="instagram" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="@bluesky.travel"
          align="center"
          title={
            <>
              Follow our <span className="text-gradient-bluesky">journey</span>
            </>
          }
          description="Daily travel inspiration on Instagram. Tag #BlueSkyTravel to be featured."
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 6) * 0.04} as="div">
              <motion.a
                href="#"
                whileHover={{ y: -4 }}
                className="group relative block aspect-square overflow-hidden rounded-2xl shadow-premium"
              >
                <Image
                  src={post.imageUrl}
                  alt={post.caption}
                  fill
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Instagram className="size-5 text-white" />
                  <div className="flex items-center gap-1 text-xs font-semibold text-white">
                    <Heart className="size-3 fill-rose-400 text-rose-400" />
                    {(post.likes / 1000).toFixed(1)}k
                  </div>
                  <p className="line-clamp-2 text-center text-[0.65rem] text-white/85">
                    {post.caption}
                  </p>
                </div>
              </motion.a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
