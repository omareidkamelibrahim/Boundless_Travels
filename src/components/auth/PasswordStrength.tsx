"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  password: string;
  className?: string;
}

interface StrengthInfo {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
}

function evaluate(password: string): StrengthInfo {
  if (!password) return { score: 0, label: "", color: "bg-muted-foreground/20" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  // Cap at 4
  const s = Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
  const map: Record<number, StrengthInfo> = {
    0: { score: 0, label: "Too weak", color: "bg-rose-500" },
    1: { score: 1, label: "Weak", color: "bg-rose-500" },
    2: { score: 2, label: "Fair", color: "bg-amber-500" },
    3: { score: 3, label: "Good", color: "bg-sky-500" },
    4: { score: 4, label: "Strong", color: "bg-emerald-500" },
  };
  return map[s];
}

/**
 * 4-segment password strength meter with label.
 * Shown below the password field on the Register form.
 */
export function PasswordStrength({ password, className }: PasswordStrengthProps) {
  const info = useMemo(() => evaluate(password), [password]);
  if (!password) return null;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex flex-1 gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i < info.score ? info.color : "bg-muted",
            )}
          />
        ))}
      </div>
      <span
        className={cn(
          "w-12 text-right text-[0.65rem] font-semibold uppercase tracking-wider",
          info.score >= 3 ? "text-emerald-600" : info.score === 2 ? "text-amber-600" : "text-rose-500",
        )}
      >
        {info.label}
      </span>
    </div>
  );
}
