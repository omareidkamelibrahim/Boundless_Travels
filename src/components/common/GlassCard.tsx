"use client";

import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "section" | "article" | "aside";
}

/** Glassmorphic card wrapper with soft premium shadow. */
export function GlassCard({ className, children, ...props }: GlassCardProps) {
  return (
    <div className={cn("glass-card rounded-2xl shadow-premium", className)} {...props}>
      {children}
    </div>
  );
}
