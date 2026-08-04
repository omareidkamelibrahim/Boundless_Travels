"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Plane, Target, Eye, Heart, Award, Users, Globe2, CheckCircle2, Star } from "lucide-react";
import { SectionTitle } from "@/components/common/SectionTitle";
import { Reveal } from "@/components/common/Reveal";
import { StatsCounter } from "@/components/common/StatsCounter";

const VALUES = [
  { icon: Heart, title: "Customer First", desc: "Every decision starts with what's best for our travelers." },
  { icon: Award, title: "Excellence", desc: "We pursue perfection in every trip, every detail, every moment." },
  { icon: Globe2, title: "Global Reach", desc: "150+ destinations across 6 continents, curated by local experts." },
  { icon: Users, title: "Expert Team", desc: "320+ travel specialists with deep destination knowledge." },
];

const TIMELINE = [
  { year: "2014", title: "BOUNDLESS Founded", desc: "Started with 3 people and a dream to redefine travel." },
  { year: "2017", title: "10,000 Travelers", desc: "Reached our first major milestone of happy customers." },
  { year: "2020", title: "Digital Transformation", desc: "Launched our online booking platform with real-time pricing." },
  { year: "2023", title: "Global Expansion", desc: "Expanded to 150+ destinations across 6 continents." },
  { year: "2026", title: "50,000+ Travelers", desc: "Trusted by travelers worldwide with a 4.9★ rating." },
];

const TEAM = [
  { name: "Yasmin El-Sayed", role: "Founder & CEO", image: "https://picsum.photos/seed/team-yasmin/200/200" },
  { name: "Karim Mostafa", role: "Chief Travel Officer", image: "https://picsum.photos/seed/team-karim/200/200" },
  { name: "Sarah Johnson", role: "Head of Operations", image: "https://picsum.photos/seed/team-sarah/200/200" },
  { name: "Michael Chen", role: "Head of Technology", image: "https://picsum.photos/seed/team-michael/200/200" },
];

const ACHIEVEMENTS = [
  { icon: Award, label: "Best Travel Agency 2025", desc: "World Travel Awards" },
  { icon: Star, label: "4.9/5 Customer Rating", desc: "48,000+ verified reviews" },
  { icon: Users, label: "50,000+ Travelers", desc: "Served since 2014" },
  { icon: Globe2, label: "150+ Destinations", desc: "Across 6 continents" },
];

export function AboutCompany() {
  return (
    <section id="about" className="relative py-16 sm:py-20 lg:py-28">
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Company Story */}
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-premium-lg">
                <Image
                  src="https://picsum.photos/seed/boundless-about/800/600"
                  alt="BOUNDLESS Travel team"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-6 -right-4 flex flex-col gap-1 rounded-2xl bg-card p-5 shadow-premium-lg ring-1 ring-border/40 sm:-right-6"
              >
                <span className="text-3xl font-extrabold text-gradient-bluesky">12+</span>
                <span className="text-xs font-medium text-muted-foreground">Years of Excellence</span>
              </motion.div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <span className="size-1.5 rounded-full bg-primary" /> About BOUNDLESS
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                Crafting unforgettable journeys since <span className="text-gradient-bluesky">2014</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                BOUNDLESS was born from a simple belief: that travel should be effortless, inspiring, and deeply personal. What started as a small agency in Cairo has grown into a global travel platform serving 50,000+ travelers across 150+ destinations.
              </p>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                We combine cutting-edge technology with human expertise to deliver curated experiences that go beyond the ordinary — from luxury overwater villas in the Maldives to sunrise balloon rides over Cappadocia.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
                  <div className="mb-3 grid size-10 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15">
                    <Target className="size-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Our Mission</h3>
                  <p className="mt-1 text-xs text-muted-foreground">To make extraordinary travel accessible to everyone, everywhere.</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
                  <div className="mb-3 grid size-10 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15">
                    <Eye className="size-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Our Vision</h3>
                  <p className="mt-1 text-xs text-muted-foreground">To be the world's most loved travel companion, everywhere you go.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Achievements */}
        <div className="mt-16">
          <SectionTitle eyebrow="Recognized excellence" align="center" title={<>Our <span className="text-gradient-bluesky">achievements</span></>} description="Awards and milestones that validate our commitment to excellence." />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ACHIEVEMENTS.map((a, i) => {
              const Icon = a.icon;
              return (
                <Reveal key={a.label} delay={i * 0.08} as="div">
                  <motion.div whileHover={{ y: -6 }} className="flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-6 text-center shadow-premium">
                    <div className="grid size-12 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15"><Icon className="size-6" /></div>
                    <div><p className="text-sm font-bold text-foreground">{a.label}</p><p className="text-xs text-muted-foreground">{a.desc}</p></div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Values */}
        <div className="mt-16">
          <SectionTitle eyebrow="What drives us" align="center" title={<>Our core <span className="text-gradient-bluesky">values</span></>} description="The principles that guide every trip we design and every traveler we serve." />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={v.title} delay={i * 0.08} as="div">
                  <motion.div whileHover={{ y: -6 }} className="flex h-full flex-col gap-3 rounded-2xl border border-border/60 bg-card p-6 shadow-premium">
                    <div className="grid size-12 place-items-center rounded-xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/15"><Icon className="size-6" /></div>
                    <h3 className="text-base font-bold text-foreground">{v.title}</h3>
                    <p className="text-sm text-muted-foreground">{v.desc}</p>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-16">
          <SectionTitle eyebrow="Our journey" align="center" title={<>A decade of <span className="text-gradient-bluesky">milestones</span></>} description="From a Cairo startup to a global travel platform." />
          <div className="mt-10 relative">
            <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent sm:left-1/2 sm:-translate-x-1/2" />
            <div className="space-y-8">
              {TIMELINE.map((item, i) => (
                <Reveal key={item.year} delay={i * 0.05} as="div">
                  <div className={`flex gap-6 ${i % 2 === 0 ? "sm:flex-row-reverse sm:text-right" : ""}`}>
                    <div className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full bg-gradient-bluesky text-xs font-bold text-white shadow-glow-bluesky sm:absolute sm:left-1/2 sm:-translate-x-1/2">{i + 1}</div>
                    <div className={`flex-1 ${i % 2 === 0 ? "sm:pr-12" : "sm:pl-12"}`}>
                      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-premium">
                        <span className="text-2xl font-extrabold text-gradient-bluesky">{item.year}</span>
                        <h4 className="mt-1 text-sm font-bold text-foreground">{item.title}</h4>
                        <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mt-16">
          <SectionTitle eyebrow="Meet the team" align="center" title={<>The people behind <span className="text-gradient-bluesky">BOUNDLESS</span></>} description="Passionate travel experts dedicated to making your journey unforgettable." />
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {TEAM.map((member, i) => (
              <Reveal key={member.name} delay={i * 0.08} as="div">
                <motion.div whileHover={{ y: -6 }} className="group flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-card p-5 text-center shadow-premium">
                  <div className="relative size-24 overflow-hidden rounded-2xl">
                    <Image src={member.image} alt={member.name} fill sizes="96px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{member.name}</h4>
                    <p className="text-xs text-primary">{member.role}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16">
          <div className="grid grid-cols-2 gap-6 rounded-3xl bg-gradient-bluesky p-8 text-white shadow-premium-lg sm:grid-cols-4">
            <StatsCounter value={50000} label="Happy Travelers" suffix="+" />
            <StatsCounter value={150} label="Destinations" suffix="+" />
            <StatsCounter value={320} label="Expert Guides" suffix="+" />
            <StatsCounter value={4.9} label="Average Rating" suffix="★" decimals={1} />
          </div>
        </div>
      </div>
    </section>
  );
}
