"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  Plane,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useUI } from "@/stores/use-ui";
import { useAuth } from "@/stores/use-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: "Passwords don't match", path: ["confirm"] });
const forgotSchema = z.object({ email: z.string().email("Enter a valid email") });

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;
type ForgotValues = z.infer<typeof forgotSchema>;

export function AuthModal() {
  const { authOpen, authView, closeAuth, setAuthView } = useUI();
  const login = useAuth((s) => s.login);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");

  const loginForm = useForm<LoginValues>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "" } });
  const registerForm = useForm<RegisterValues>({ resolver: zodResolver(registerSchema), defaultValues: { name: "", email: "", phone: "", password: "", confirm: "" } });
  const forgotForm = useForm<ForgotValues>({ resolver: zodResolver(forgotSchema), defaultValues: { email: "" } });

  const handleLogin = (values: LoginValues) => {
    setLoading(true);
    setTimeout(() => {
      login({ id: "u_demo", email: values.email, name: values.email.split("@")[0] });
      toast.success("Welcome back to BlueSky!");
      setLoading(false);
      closeAuth();
    }, 800);
  };
  const handleRegister = (values: RegisterValues) => {
    setLoading(true);
    setTimeout(() => {
      login({ id: "u_demo", email: values.email, name: values.name });
      toast.success("Account created — welcome aboard!");
      setLoading(false);
      closeAuth();
    }, 800);
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

  return (
    <Dialog open={authOpen} onOpenChange={(open) => !open && closeAuth()}>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0 sm:rounded-3xl">
        {/* Decorative top */}
        <div className="relative h-28 overflow-hidden bg-gradient-bluesky">
          <div className="pointer-events-none absolute inset-0 opacity-50">
            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute -left-10 bottom-0 size-32 rounded-full bg-accent/40 blur-2xl" />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between px-6 pb-3 text-white">
            <div className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-xl bg-white/20 backdrop-blur-md">
                <Plane className="size-5 -rotate-45" />
              </div>
              <div className="leading-none">
                <p className="text-sm font-bold">BlueSky Travel</p>
                <p className="text-[0.65rem] text-white/80">Your journey starts here</p>
              </div>
            </div>
            <DialogDescription className="sr-only">Authentication</DialogDescription>
          </div>
        </div>

        <div className="p-6 pt-5">
          <DialogHeader className="mb-1 space-y-1">
            <DialogTitle className="text-xl">
              {authView === "login" && "Welcome back"}
              {authView === "register" && "Create your account"}
              {authView === "forgot" && "Reset password"}
              {authView === "otp" && "Verify your email"}
              {authView === "reset" && "Set new password"}
            </DialogTitle>
            <DialogDescription>
              {authView === "login" && "Sign in to continue your travel journey."}
              {authView === "register" && "Join 48,000+ travelers exploring the world."}
              {authView === "forgot" && "Enter your email to receive a reset code."}
              {authView === "otp" && "We sent a 6-digit code to your email."}
              {authView === "reset" && "Choose a strong new password."}
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            <motion.div
              key={authView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {authView === "login" && (
                <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 pt-2">
                  <FormField label="Email" icon={Mail} error={loginForm.formState.errors.email?.message}>
                    <Input type="email" placeholder="you@email.com" {...loginForm.register("email")} className="pl-10" />
                  </FormField>
                  <FormField label="Password" icon={Lock} error={loginForm.formState.errors.password?.message}>
                    <Input
                      type={showPwd ? "text" : "password"}
                      placeholder="••••••••"
                      {...loginForm.register("password")}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </FormField>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-muted-foreground">
                      <input type="checkbox" className="size-3.5 accent-primary" />
                      Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthView("forgot")}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full bg-gradient-bluesky shadow-glow-bluesky">
                    {loading ? "Signing in..." : "Sign In"}
                    <ArrowRight className="size-4" />
                  </Button>

                  <SocialAuth />

                  <p className="text-center text-sm text-muted-foreground">
                    New to BlueSky?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthView("register")}
                      className="font-semibold text-primary hover:underline"
                    >
                      Create account
                    </button>
                  </p>
                </form>
              )}

              {authView === "register" && (
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-3.5 pt-2">
                  <FormField label="Full Name" icon={User} error={registerForm.formState.errors.name?.message}>
                    <Input placeholder="John Doe" {...registerForm.register("name")} className="pl-10" />
                  </FormField>
                  <FormField label="Email" icon={Mail} error={registerForm.formState.errors.email?.message}>
                    <Input type="email" placeholder="you@email.com" {...registerForm.register("email")} className="pl-10" />
                  </FormField>
                  <FormField label="Phone" icon={Phone} error={registerForm.formState.errors.phone?.message}>
                    <Input type="tel" placeholder="+1 555 123 4567" {...registerForm.register("phone")} className="pl-10" />
                  </FormField>
                  <FormField label="Password" icon={Lock} error={registerForm.formState.errors.password?.message}>
                    <Input
                      type={showPwd ? "text" : "password"}
                      placeholder="••••••••"
                      {...registerForm.register("password")}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </FormField>
                  <FormField label="Confirm Password" icon={Lock} error={registerForm.formState.errors.confirm?.message}>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...registerForm.register("confirm")}
                      className="pl-10"
                    />
                  </FormField>

                  <label className="flex items-start gap-2 text-xs text-muted-foreground">
                    <input type="checkbox" required className="mt-0.5 size-3.5 accent-primary" />
                    <span>
                      I agree to BlueSky's{" "}
                      <a href="#" className="font-semibold text-primary hover:underline">Terms</a> and{" "}
                      <a href="#" className="font-semibold text-primary hover:underline">Privacy Policy</a>.
                    </span>
                  </label>

                  <Button type="submit" disabled={loading} className="w-full bg-gradient-bluesky shadow-glow-bluesky">
                    {loading ? "Creating..." : "Create Account"}
                    <ArrowRight className="size-4" />
                  </Button>

                  <SocialAuth />

                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthView("login")}
                      className="font-semibold text-primary hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}

              {authView === "forgot" && (
                <form onSubmit={forgotForm.handleSubmit(handleForgot)} className="space-y-4 pt-2">
                  <FormField label="Email" icon={Mail} error={forgotForm.formState.errors.email?.message}>
                    <Input type="email" placeholder="you@email.com" {...forgotForm.register("email")} className="pl-10" />
                  </FormField>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-bluesky shadow-glow-bluesky">
                    {loading ? "Sending..." : "Send Reset Code"}
                    <ArrowRight className="size-4" />
                  </Button>
                  <button
                    type="button"
                    onClick={() => setAuthView("login")}
                    className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="size-3.5" /> Back to login
                  </button>
                </form>
              )}

              {authView === "otp" && (
                <div className="space-y-5 pt-2">
                  <div className="flex justify-center">
                    <div className="grid size-14 place-items-center rounded-2xl bg-gradient-bluesky-soft text-primary ring-1 ring-primary/20">
                      <ShieldCheck className="size-7" />
                    </div>
                  </div>
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
                  <Button onClick={handleVerifyOtp} disabled={loading || otp.length !== 6} className="w-full bg-gradient-bluesky shadow-glow-bluesky">
                    {loading ? "Verifying..." : "Verify Code"}
                    <CheckCircle2 className="size-4" />
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Didn't receive it?{" "}
                    <button type="button" className="font-semibold text-primary hover:underline">
                      Resend in 30s
                    </button>
                  </p>
                </div>
              )}

              {authView === "reset" && (
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
                  className="space-y-4 pt-2"
                >
                  <FormField label="New Password" icon={KeyRound}>
                    <Input type="password" placeholder="••••••••" required className="pl-10" />
                  </FormField>
                  <FormField label="Confirm Password" icon={KeyRound}>
                    <Input type="password" placeholder="••••••••" required className="pl-10" />
                  </FormField>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-bluesky shadow-glow-bluesky">
                    {loading ? "Saving..." : "Save New Password"}
                    <CheckCircle2 className="size-4" />
                  </Button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-foreground">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        {children}
      </div>
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function SocialAuth() {
  return (
    <>
      <div className="relative my-3">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-card px-3 text-xs font-medium text-muted-foreground">or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["Google", "Facebook", "Apple"].map((p) => (
          <button
            key={p}
            type="button"
            className="rounded-xl border border-border/60 bg-card px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
          >
            {p}
          </button>
        ))}
      </div>
    </>
  );
}
