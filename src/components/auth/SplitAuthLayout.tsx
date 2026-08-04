"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Globe, Plane, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  decimals?: number;
  label: string;
}

const STATS: StatItem[] = [
  { icon: Star, value: 4.9, decimals: 1, suffix: "/5", label: "Rating" },
  { icon: Globe, value: 150, suffix: "+", label: "Destinations" },
  { icon: Plane, value: 50000, suffix: "+", label: "Happy Travelers" },
  { icon: Building2, value: 5000, suffix: "+", label: "Hotels" },
];

/**
 * Animated count-up that starts when the element enters the viewport.
 * SSR-safe (renders 0 on the server, animates only on the client after mount).
 */
function CountUp({ target, decimals = 0, suffix = "" }: { target: number; decimals?: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        obs.disconnect();
        const duration = 1600;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          requestAnimationFrame(() => setValue(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [target]);

  const display = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString();
  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

interface SplitAuthLayoutProps {
  children: React.ReactNode;
  /** Optional caption shown above the stats card, e.g. a testimonial quote. */
  caption?: string;
  className?: string;
}

/**
 * Cinematic split-screen authentication layout.
 *
 * Left side: full-bleed travel image with subtle parallax (scrolls slower than page)
 *            + a floating glass card showing animated platform statistics with count-up.
 * Right side: the auth form (Login / Register / Forgot / OTP / Reset) — passed as children.
 *
 * On mobile / tablet (below lg): the image panel is hidden and the form takes full width.
 *
 * Inspired by Stripe / Apple / Notion / Linear — communicates trust, luxury and scale.
 */
export function SplitAuthLayout({ children, caption, className }: SplitAuthLayoutProps) {
  // Parallax: the image moves slower than the dialog scroll.
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "grid max-h-[88vh] overflow-y-auto bg-card lg:grid-cols-2",
        className,
      )}
    >
      {/* ===== Left: Cinematic image with parallax + floating stats glass card ===== */}
      <div className="relative hidden lg:block">
        <motion.div style={{ y }} className="absolute inset-0 -top-[10%] h-[120%]">
          <Image
            src="https://picsum.photos/seed/bluesky-auth-santorini/1200/1500"
            alt="Travel inspiration — Santorini coastline at sunset"
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/70 via-primary/30 to-accent/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </motion.div>

        {/* Brand mark */}
        <div className="absolute left-8 top-8 z-10 flex items-center gap-2 text-white">
          <div className="grid size-10 place-items-center rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/30">
            <Plane className="size-5 -rotate-45" />
          </div>
          <div className="leading-none">
            <p className="text-base font-extrabold tracking-tight">BlueSky</p>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white/80">Travel</p>
          </div>
        </div>

        {/* Floating glass stats card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-8 left-8 right-8 z-10"
        >
          <div className="glass-card rounded-3xl p-6 text-white shadow-premium-lg">
            {caption && (
              <p className="mb-5 text-base font-medium leading-relaxed text-white/95">
                &ldquo;{caption}&rdquo;
              </p>
            )}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {STATS.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur-md ring-1 ring-white/25">
                      <Icon className="size-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xl font-bold leading-tight tracking-tight">
                        <CountUp target={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                      </p>
                      <p className="text-[0.7rem] font-medium uppercase tracking-wider text-white/70">
                        {stat.label}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ===== Right: Auth form (children) ===== */}
      <div className="flex min-h-full flex-col justify-center overflow-y-auto bg-card px-6 py-10 sm:px-12 lg:px-16">
        {/* Mobile brand mark */}
        <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
          <div className="grid size-10 place-items-center rounded-xl bg-gradient-bluesky shadow-glow-bluesky">
            <Plane className="size-5 -rotate-45 text-white" />
          </div>
          <div className="leading-none">
            <p className="text-base font-extrabold tracking-tight text-foreground">BlueSky</p>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">Travel</p>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
