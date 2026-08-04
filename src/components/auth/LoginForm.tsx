"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { cn } from "@/lib/utils";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type Values = z.infer<typeof schema>;

interface LoginFormProps {
  onSubmit: (values: Values) => void;
  onForgotPassword: () => void;
  onSwitchToRegister: () => void;
}

/**
 * Premium login form — "Welcome Back 👋" with floating-label inputs,
 * password visibility toggle, remember-me, forgot-password link,
 * loading spinner, and social auth (Google / Facebook / Apple).
 */
export function LoginForm({ onSubmit, onForgotPassword, onSwitchToRegister }: LoginFormProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const handleSubmit = form.handleSubmit((values) => {
    setLoading(true);
    // Defer to next tick so the spinner can paint before the parent's setTimeout.
    setTimeout(() => {
      onSubmit(values);
      setLoading(false);
    }, 800);
  });

  const emailError = form.formState.errors.email?.message;
  const passwordError = form.formState.errors.password?.message;

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
          Welcome Back <span className="inline-block animate-wave origin-[70%_70%]">👋</span>
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Continue your travel journey.</p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingInput
          label="Email"
          icon={Mail}
          type="email"
          autoComplete="email"
          error={emailError}
          {...form.register("email")}
        />
        <FloatingInput
          label="Password"
          icon={Lock}
          type="password"
          autoComplete="current-password"
          showPasswordToggle
          error={passwordError}
          {...form.register("password")}
        />

        <div className="flex items-center justify-between pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-muted-foreground">
            <input
              type="checkbox"
              className="size-3.5 rounded border-border accent-primary"
            />
            Remember me
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-xs font-semibold text-primary transition-colors hover:text-primary/80"
          >
            Forgot password?
          </button>
        </div>

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
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </form>

      <SocialAuthButtons className="mt-6" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to BlueSky?{" "}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="font-semibold text-primary transition-colors hover:text-primary/80"
        >
          Create account
        </button>
      </p>
    </div>
  );
}
