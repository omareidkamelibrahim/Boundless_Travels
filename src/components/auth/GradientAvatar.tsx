"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn, initials } from "@/lib/utils";

interface GradientAvatarProps {
  name?: string;
  email?: string;
  imageUrl?: string;
  /** When provided, renders this icon instead of initials/image (used for guest state). */
  icon?: React.ElementType;
  /** Pixel size — defaults to 40 (responsive navbar sizing handled by parent). */
  size?: number;
  /** Show the green online indicator dot. */
  showOnline?: boolean;
  /** Show an animated pulse ring around the avatar (attracts attention to the guest CTA). */
  pulse?: boolean;
  className?: string;
  /** Click handler — when provided, the avatar gets hover scale + cursor-pointer. */
  onClick?: () => void;
  interactive?: boolean;
}

/**
 * Premium circular avatar — used in the Navbar for both guest and authenticated states.
 *
 * - If `icon` is provided, renders the icon (used for the guest / "Sign In" CTA).
 * - Else if `imageUrl` is provided, displays the profile image (object-cover, rounded-full).
 * - Otherwise generates a deterministic Boundless gradient avatar with the user's initials.
 * - Optional green online indicator dot at the bottom-right.
 * - Optional animated pulse ring to draw attention to the guest CTA.
 * - Hover scales up subtly when `interactive` is true (cursor-pointer + ring).
 *
 * Sizes (per spec): 48px desktop, 40px tablet, 36px mobile — passed via `size` prop.
 */
export function GradientAvatar({
  name,
  email,
  imageUrl,
  icon: Icon,
  size = 40,
  showOnline = true,
  pulse = false,
  className,
  onClick,
  interactive = false,
}: GradientAvatarProps) {
  const label = initials(name || email);
  // Deterministic hue based on the name so the same user always gets the same gradient.
  const hue = (name || email || "BS")
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 60;
  const gradient = `linear-gradient(135deg, hsl(${210 + hue} 85% 55%) 0%, hsl(${200 + hue} 90% 60%) 50%, hsl(${190 + hue} 85% 65%) 100%)`;

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={interactive ? { scale: 1.06 } : undefined}
      whileTap={interactive ? { scale: 0.96 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      aria-label={name ? `Account: ${name}` : Icon ? "Sign in or create account" : "Account"}
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full ring-2 ring-white/70 shadow-premium",
        interactive && "cursor-pointer hover:ring-primary/40",
        className,
      )}
      style={{ width: size, height: size, background: Icon || imageUrl ? undefined : gradient }}
    >
      {/* Animated pulse ring to attract attention (guest state) */}
      {pulse && (
        <span
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-bluesky"
          style={{ animation: "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
          aria-hidden
        />
      )}

      {Icon ? (
        <Icon className="relative z-10 text-white" style={{ width: Math.round(size * 0.45), height: Math.round(size * 0.45) }} />
      ) : imageUrl ? (
        <Image
          src={imageUrl}
          alt={name || "User avatar"}
          fill
          sizes={`${size}px`}
          className="rounded-full object-cover"
        />
      ) : (
        <span
          className="relative z-10 font-bold text-white"
          style={{ fontSize: Math.round(size * 0.36) }}
        >
          {label}
        </span>
      )}

      {showOnline && (
        <span
          className="absolute bottom-0 right-0 z-20 grid place-items-center rounded-full bg-emerald-500 ring-2 ring-white"
          style={{ width: Math.max(8, Math.round(size * 0.22)), height: Math.max(8, Math.round(size * 0.22)) }}
        >
          <span className="size-1.5 rounded-full bg-white/90" />
        </span>
      )}
    </motion.button>
  );
}
