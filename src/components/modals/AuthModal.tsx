"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
  Loader2,
  Plane,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Dialog,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { SplitAuthLayout } from "@/components/auth/SplitAuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useUI } from "@/stores/use-ui";
import { useAuth } from "@/stores/use-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const forgotSchema = z.object({ email: z.string().email("Enter a valid email") });
type ForgotValues = z.infer<typeof forgotSchema>;

const QUOTES = [
  "Boundless made our honeymoon unforgettable — every detail was perfect.",
  "From the Pyramids to the Maldives, the best trips of my life.",
  "The booking experience was so smooth. Five stars, every time.",
];

export function AuthModal() {
  const { authOpen, authView, closeAuth, setAuthView } = useUI();
  const login = useAuth((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const forgotForm = useForm<ForgotValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const handleLogin = (values: { email: string; password: string }) => {
    login({ id: "u_demo", email: values.email, name: values.email.split("@")[0] });
    toast.success("Welcome back to Boundless!");
    closeAuth();
  };
  const handleRegister = (values: {
    firstName: string; lastName: string; email: string; phone: string; country: string;
  }) => {
    login({
      id: "u_demo",
      email: values.email,
      name: `${values.firstName} ${values.lastName}`,
    });
    toast.success("Account created — welcome aboard!");
    closeAuth();
  };
  const handleForgot = (values: ForgotValues) => {
    setLoading(true);
    setTimeout(() => {
      toast.success(`Reset code sent to ${values.email}`);
      setLoading(false);
      setAuthView("otp");
    }, 800);
  };
  const handleVerifyOtp = () => {
    if (otp.length !== 6) return;
    setLoading(true);
    setTimeout(() => {
      toast.success("Verified! Set your new password.");
      setLoading(false);
      setAuthView("reset");
    }, 800);
  };

  const quote = QUOTES[Math.floor(Date.now() / 86_400_000) % QUOTES.length];

  return (
    <Dialog open={authOpen} onOpenChange={(open) => !open && closeAuth()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[4px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-card shadow-2xl",
            "w-[calc(100vw-1rem)] max-w-[1100px] sm:w-[calc(100vw-2rem)]",
            "max-h-[92vh]",
          )}
        >
          <DialogTitle className="sr-only">Boundless Travel Authentication</DialogTitle>
          <DialogDescription className="sr-only">
            Sign in or create your Boundless Travel account to continue.
          </DialogDescription>

          {/* Close button */}
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-4 top-4 z-50 grid size-9 place-items-center rounded-full bg-card/80 text-muted-foreground backdrop-blur-md transition-colors hover:bg-accent hover:text-foreground"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </DialogPrimitive.Close>

          <SplitAuthLayout caption={quote}>
            <AnimatePresence mode="wait">
              <motion.div
                key={authView}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="flex justify-center"
              >
                {authView === "login" && (
                  <LoginForm
                    onSubmit={handleLogin}
                    onForgotPassword={() => setAuthView("forgot")}
                    onSwitchToRegister={() => setAuthView("register")}
                  />
                )}

                {authView === "register" && (
                  <RegisterForm
                    onSubmit={handleRegister}
                    onSwitchToLogin={() => setAuthView("login")}
                  />
                )}

                {authView === "forgot" && (
                  <div className="w-full max-w-sm">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mb-7"
                    >
                      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Reset password
                      </h1>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        Enter your email to receive a reset code.
                      </p>
                    </motion.div>

                    <form onSubmit={forgotForm.handleSubmit(handleForgot)} className="space-y-4">
                      <FloatingInput
                        label="Email"
                        icon={Mail}
                        type="email"
                        autoComplete="email"
                        error={forgotForm.formState.errors.email?.message}
                        {...forgotForm.register("email")}
                      />
                      <Button
                        type="submit"
                        disabled={loading}
                        className="mt-2 h-12 w-full gap-2 rounded-xl bg-gradient-bluesky text-sm font-bold shadow-glow-bluesky"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Reset Code
                            <ArrowRight className="size-4" />
                          </>
                        )}
                      </Button>
                      <button
                        type="button"
                        onClick={() => setAuthView("login")}
                        className="flex w-full items-center justify-center gap-1.5 pt-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ArrowLeft className="size-3.5" /> Back to login
                      </button>
                    </form>
                  </div>
                )}

                {authView === "otp" && (
                  <div className="w-full max-w-sm">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mb-7 flex flex-col items-center text-center"
                    >
                      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/20">
                        <ShieldCheck className="size-7" />
                      </div>
                      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Verify your email
                      </h1>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        We sent a 6-digit code to your email.
                      </p>
                    </motion.div>

                    <div className="space-y-5">
                      <div className="flex justify-center">
                        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <Button
                        onClick={handleVerifyOtp}
                        disabled={loading || otp.length !== 6}
                        className="h-12 w-full gap-2 rounded-xl bg-gradient-bluesky text-sm font-bold shadow-glow-bluesky"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Verify Code
                            <CheckCircle2 className="size-4" />
                          </>
                        )}
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">
                        Didn&rsquo;t receive it?{" "}
                        <button type="button" className="font-semibold text-primary hover:underline">
                          Resend in 30s
                        </button>
                      </p>
                    </div>
                  </div>
                )}

                {authView === "reset" && (
                  <div className="w-full max-w-sm">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mb-7"
                    >
                      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Set new password
                      </h1>
                      <p className="mt-1.5 text-sm text-muted-foreground">
                        Choose a strong new password.
                      </p>
                    </motion.div>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setLoading(true);
                        setTimeout(() => {
                          toast.success("Password reset! You can now sign in.");
                          setLoading(false);
                          setAuthView("login");
                        }, 800);
                      }}
                      className="space-y-4"
                    >
                      <FloatingInput label="New Password" icon={KeyRound} type="password" required />
                      <FloatingInput label="Confirm Password" icon={KeyRound} type="password" required />
                      <Button
                        type="submit"
                        disabled={loading}
                        className="mt-2 h-12 w-full gap-2 rounded-xl bg-gradient-bluesky text-sm font-bold shadow-glow-bluesky"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="size-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            Save New Password
                            <CheckCircle2 className="size-4" />
                          </>
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </SplitAuthLayout>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  );
}
