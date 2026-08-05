"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { cn } from "@/lib/utils";

const schema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().min(1, "Email is required").email("Enter a valid email"),
    phone: z.string().min(7, "Enter a valid phone number"),
    country: z.string().min(2, "Country is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm: z.string(),
    terms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });
type Values = z.infer<typeof schema>;

interface RegisterFormProps {
  onSubmit: (values: Values) => void;
  onSwitchToLogin: () => void;
}

const COUNTRIES = [
  "Egypt", "United Arab Emirates", "Saudi Arabia", "United States", "United Kingdom",
  "France", "Germany", "Italy", "Spain", "Turkey", "Greece", "Thailand", "Japan",
  "Malaysia", "Switzerland", "Netherlands", "Canada", "Australia", "Other",
];

/**
 * Premium register form — "Create your Boundless Account" with 8 fields
 * (First/Last Name, Email, Phone, Country, Password, Confirm Password),
 * password strength meter, terms checkbox, loading spinner, and social auth.
 */
export function RegisterForm({ onSubmit, onSwitchToLogin }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "", lastName: "", email: "", phone: "",
      country: "", password: "", confirm: "",
    } as unknown as Values,
  });

  const handleSubmit = form.handleSubmit((values) => {
    setLoading(true);
    setTimeout(() => {
      onSubmit(values);
      setLoading(false);
    }, 800);
  });

  const passwordValue = form.watch("password") || "";

  return (
    <div className="w-full max-w-sm">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-7"
      >
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Create your Boundless Account
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Start exploring the world.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FloatingInput
            label="First Name"
            icon={User}
            autoComplete="given-name"
            error={form.formState.errors.firstName?.message}
            {...form.register("firstName")}
          />
          <FloatingInput
            label="Last Name"
            icon={User}
            autoComplete="family-name"
            error={form.formState.errors.lastName?.message}
            {...form.register("lastName")}
          />
        </div>

        <FloatingInput
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />

        <FloatingInput
          label="Phone"
          icon={Phone}
          type="tel"
          autoComplete="tel"
          error={form.formState.errors.phone?.message}
          {...form.register("phone")}
        />

        {/* Country select using a styled native select for accessibility */}
        <div className="space-y-1.5">
          <div className="relative">
            <select
              {...form.register("country")}
              aria-invalid={Boolean(form.formState.errors.country)}
              defaultValue=""
              className={cn(
                "h-12 w-full appearance-none rounded-xl border bg-card px-3 text-sm font-medium text-foreground transition-all focus:outline-none",
                form.formState.errors.country
                  ? "border-destructive/60"
                  : "border-border hover:border-primary/40 focus:border-primary focus:ring-4 focus:ring-primary/15",
              )}
            >
              <option value="" disabled className="text-muted-foreground">Country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {form.formState.errors.country && (
            <p className="pl-1 text-xs font-medium text-destructive">
              {form.formState.errors.country.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <FloatingInput
            label="Password"
            icon={Lock}
            type="password"
            autoComplete="new-password"
            showPasswordToggle
            error={form.formState.errors.password?.message}
            {...form.register("password")}
          />
          <PasswordStrength password={passwordValue} />
        </div>

        <FloatingInput
          label="Confirm Password"
          icon={Lock}
          type="password"
          autoComplete="new-password"
          showPasswordToggle
          error={form.formState.errors.confirm?.message}
          {...form.register("confirm")}
        />

        <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-xs text-muted-foreground">
          <input
            type="checkbox"
            className="mt-0.5 size-3.5 shrink-0 rounded border-border accent-primary"
            {...form.register("terms")}
          />
          <span>
            I agree to Boundless&rsquo;s{" "}
            <a href="#" className="font-semibold text-primary hover:underline">Terms of Service</a> and{" "}
            <a href="#" className="font-semibold text-primary hover:underline">Privacy Policy</a>.
          </span>
        </label>
        {form.formState.errors.terms && (
          <p className="pl-1 text-xs font-medium text-destructive">
            {form.formState.errors.terms.message as string}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className={cn(
            "mt-2 h-12 w-full gap-2 rounded-xl bg-gradient-bluesky text-sm font-bold shadow-glow-bluesky transition-transform hover:scale-[1.01] active:scale-[0.99]",
          )}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <SocialAuthButtons className="mt-6" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}
