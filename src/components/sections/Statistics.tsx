"use client";

import { motion } from "framer-motion";
import { Plane, Award, Users, Globe2 } from "lucide-react";
import { StatsCounter } from "@/components/common/StatsCounter";
import { Reveal } from "@/components/common/Reveal";
import { SectionTitle } from "@/components/common/SectionTitle";

export function Statistics() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Reveal as="div">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-bluesky p-1 shadow-premium-lg">
            <div className="relative overflow-hidden rounded-[calc(1.5rem-4px)] bg-gradient-to-br from-primary to-secondary p-8 sm:p-12 lg:p-16">
              {/* Decorative */}
              <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute -right-10 -top-10 size-72 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-10 -left-10 size-72 rounded-full bg-accent/30 blur-3xl" />
              </div>

              <div className="relative">
                <SectionTitle
                  eyebrow="By the numbers"
                  align="center"
                  title={<span className="text-white">Trusted by travelers worldwide</span>}
                  description={<span className="text-white/85">A decade of excellence, measured in smiles and memories.</span>}
                />

                <div className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
                  <StatItem icon={Users} counter={<StatsCounter value={50000} suffix="+" />} label="Happy Travelers" />
                  <StatItem icon={Globe2} counter={<StatsCounter value={150} suffix="+" />} label="Destinations" />
                  <StatItem icon={Plane} counter={<StatsCounter value={912} />} label="Trips Completed" />
                  <StatItem icon={Award} counter={<StatsCounter value={4.9} decimals={1} suffix="★" />} label="Average Rating" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StatItem({ icon: Icon, counter, label }: { icon: React.ElementType; counter: React.ReactNode; label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-2 text-center"
    >
      <div className="grid size-12 place-items-center rounded-2xl bg-white/15 backdrop-blur-md ring-1 ring-white/25">
        <Icon className="size-6 text-white" />
      </div>
      <p className="text-3xl font-extrabold text-white sm:text-4xl">{counter}</p>
      <p className="text-sm font-medium text-white/80">{label}</p>
    </motion.div>
  );
}
