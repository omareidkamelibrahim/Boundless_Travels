"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ElementType;
  error?: string;
  /** Show password visibility toggle (only meaningful for type=password). */
  showPasswordToggle?: boolean;
  /** Optional right-side adornment node (e.g. a strength meter). */
  endAdornment?: React.ReactNode;
}

/**
 * Premium floating-label input with leading icon — inspired by Stripe / Apple.
 *
 * - Label starts inside the field (overlapping the input) and floats up when
 *   the input is focused or has a value.
 * - Leading icon in Boundless primary color when focused.
 * - Password toggle (eye / eye-off) for type=password inputs.
 * - Smooth color + scale transitions on focus / error.
 * - Fully accessible: real <label> wrapping a real <input>, ARIA-invalid on error.
 */
export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(function FloatingInput(
  { label, icon: Icon, error, showPasswordToggle = false, endAdornment, className, type = "text", id, ...props },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const hasValue = typeof props.value === "string" ? props.value.length > 0 : Boolean(props.defaultValue);
  const isFloating = focused || hasValue;
  const inputType = showPasswordToggle ? (showPwd ? "text" : "password") : type;
  const inputId = id || `fi-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="w-full">
      <div
        className={cn(
          "group relative flex items-center rounded-xl border bg-card transition-all",
          focused
            ? "border-primary ring-4 ring-primary/15"
            : error
              ? "border-destructive/60"
              : "border-border hover:border-primary/40",
          className,
        )}
      >
        {Icon && (
          <span
            className={cn(
              "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transition-colors",
              focused ? "text-primary" : error ? "text-destructive/60" : "text-muted-foreground",
            )}
          >
            <Icon className="size-4" />
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          type={inputType}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          placeholder=" "
          className={cn(
            "peer h-12 w-full bg-transparent text-sm font-medium text-foreground caret-primary placeholder-transparent focus:outline-none",
            Icon ? "px-10" : "px-3",
            showPasswordToggle || endAdornment ? "pr-10" : "",
          )}
          {...props}
        />

        <label
          htmlFor={inputId}
          className={cn(
            "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 origin-left bg-card px-1 text-sm font-medium transition-all",
            Icon && "left-9",
            isFloating
              ? "top-0 -translate-y-1/2 scale-[0.78] text-primary"
              : focused
                ? "text-primary"
                : error
                  ? "text-destructive/60"
                  : "text-muted-foreground",
          )}
        >
          {label}
        </label>

        {showPasswordToggle && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}

        {!showPasswordToggle && endAdornment && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{endAdornment}</div>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 pl-1 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
});
