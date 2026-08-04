"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Reveal } from "@/components/common/Reveal";

const PARTNERS = [
  { name: "EgyptAir", logo: "https://picsum.photos/seed/egyptair/200/80" },
  { name: "Emirates", logo: "https://picsum.photos/seed/emirates/200/80" },
  { name: "Turkish Airlines", logo: "https://picsum.photos/seed/turkish/200/80" },
  { name: "Booking.com", logo: "https://picsum.photos/seed/booking/200/80" },
  { name: "Four Seasons", logo: "https://picsum.photos/seed/fourseasons/200/80" },
  { name: "Marriott", logo: "https://picsum.photos/seed/marriott/200/80" },
];

export function Partners() {
  return (
    <section className="relative py-12 sm:py-16">
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Reveal as="div">
          <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-premium sm:p-10">
            <SectionTitle
              eyebrow="Trusted partners"
              align="center"
              title={<>We partner with the <span className="text-gradient-bluesky">best</span></>}
              description="Leading airlines, hotel chains, and travel providers worldwide."
            />
            <div className="mt-8 grid grid-cols-3 items-center gap-6 sm:grid-cols-4 lg:grid-cols-6">
              {PARTNERS.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-center"
                >
                  <div className="relative h-12 w-24 grayscale transition-all hover:grayscale-0 sm:h-14 sm:w-28">
                    <Image
                      src={p.logo}
                      alt={`${p.name} partner`}
                      fill
                      sizes="120px"
                      className="object-contain"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
