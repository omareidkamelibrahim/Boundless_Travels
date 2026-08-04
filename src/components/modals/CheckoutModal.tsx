"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Lock, Check, Shield, ArrowRight, Loader2, X,
  Calendar, Users, MapPin, Tag,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { useUI } from "@/stores/use-ui";
import { useCart, computeItemTotal } from "@/stores/use-cart";
import { toast } from "sonner";
import { cn, formatPrice, formatDate } from "@/lib/utils";
import { findCountry } from "@/services";

type CheckoutStep = "details" | "payment" | "processing" | "success";

export function CheckoutModal() {
  const { checkoutOpen, closeCheckout } = useUI();
  const { items, clear } = useCart();
  const [step, setStep] = useState<CheckoutStep>("details");
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = items.reduce((s, i) => s + computeItemTotal(i), 0);
  const discount = promoApplied ? subtotal * 0.15 : 0;
  const serviceFee = (subtotal - discount) * 0.05;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + serviceFee + tax;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "BLUESKY15") {
      setPromoApplied(true);
      toast.success("Promo code applied — 15% off!");
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
      toast.success("Payment successful! 🎉");
    }, 2000);
  };

  const handleClose = () => {
    if (step === "success") {
      clear();
      setPromoCode("");
      setPromoApplied(false);
      setStep("details");
    }
    closeCheckout();
    setTimeout(() => {
      if (step === "success") {
        setStep("details");
      }
    }, 300);
  };

  if (!checkoutOpen || items.length === 0) return null;

  return (
    <DialogPrimitive.Root open={checkoutOpen} onOpenChange={(o) => !o && handleClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[4px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-card shadow-2xl",
            "w-[calc(100vw-1rem)] max-w-2xl max-h-[90vh]",
          )}
        >
          <DialogTitle className="sr-only">Checkout</DialogTitle>
          <DialogDescription className="sr-only">Complete your booking payment.</DialogDescription>

          {/* Header */}
          <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-gradient-bluesky shadow-glow-bluesky">
                <Lock className="size-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Secure Checkout</h2>
                <p className="text-xs text-muted-foreground">
                  {step === "success" ? "Payment confirmed" : `${items.length} item(s) · ${formatPrice(total)} total`}
                </p>
              </div>
            </div>
            <DialogPrimitive.Close
              aria-label="Close"
              className="grid size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="size-5" />
            </DialogPrimitive.Close>
          </header>

          {/* Progress steps */}
          {step !== "success" && (
            <div className="flex items-center gap-2 px-6 py-3">
              {["Details", "Payment"].map((s, i) => {
                const stepNum = i + 1;
                const isActive = (step === "details" && stepNum === 1) || (step === "payment" && stepNum === 2) || (step === "processing" && stepNum === 2);
                const isDone = (step === "payment" || step === "processing") && stepNum === 1;
                return (
                  <div key={s} className="flex flex-1 items-center gap-2">
                    <div className={cn(
                      "grid size-7 place-items-center rounded-full text-xs font-bold transition-all",
                      isDone ? "bg-primary text-primary-foreground" : isActive ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground",
                    )}>
                      {isDone ? <Check className="size-3.5" /> : stepNum}
                    </div>
                    <span className={cn("text-xs font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>{s}</span>
                    {i < 1 && <div className="h-px flex-1 bg-border" />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Content */}
          <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              {step === "details" && (
                <motion.div key="details" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  {/* Order summary */}
                  <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
                    <h3 className="mb-3 text-sm font-bold text-foreground">Order Summary</h3>
                    <div className="space-y-3">
                      {items.map((item) => {
                        const country = findCountry(item.trip.countryId);
                        return (
                          <div key={item.id} className="flex gap-3">
                            <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                              <img src={item.trip.imageUrl} alt={item.trip.title} className="size-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="line-clamp-1 text-sm font-semibold text-foreground">{item.trip.title}</p>
                              <p className="text-xs text-muted-foreground">{country?.name} · {formatDate(item.date, { month: "short", day: "numeric" })}</p>
                              <p className="text-xs text-muted-foreground">{item.adults}A · {item.children}C · {item.infants}I</p>
                            </div>
                            <span className="text-sm font-bold text-foreground">{formatPrice(computeItemTotal(item))}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Promo code */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Promo code (try BLUESKY15)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        disabled={promoApplied}
                        className="h-10 rounded-xl pl-9"
                      />
                    </div>
                    <Button variant="outline" onClick={handleApplyPromo} disabled={promoApplied || !promoCode} className="rounded-xl">
                      {promoApplied ? <Check className="size-4 text-emerald-500" /> : "Apply"}
                    </Button>
                  </div>

                  {/* Billing details */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <FloatingInput label="Full Name" required defaultValue="" />
                    <FloatingInput label="Email" type="email" required defaultValue="" />
                    <FloatingInput label="Phone" type="tel" required defaultValue="" />
                    <FloatingInput label="Country" required defaultValue="" />
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-1.5 rounded-2xl border border-border/60 bg-card p-4 text-sm">
                    <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount (15%)</span><span>-{formatPrice(discount)}</span></div>}
                    <div className="flex justify-between text-muted-foreground"><span>Service fee</span><span>{formatPrice(serviceFee)}</span></div>
                    <div className="flex justify-between text-muted-foreground"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
                    <div className="my-2 h-px bg-border" />
                    <div className="flex justify-between font-bold text-foreground"><span>Total</span><span className="text-lg">{formatPrice(total)}</span></div>
                  </div>

                  <Button onClick={() => setStep("payment")} className="h-12 w-full gap-2 rounded-xl bg-gradient-bluesky font-bold shadow-glow-bluesky">
                    Continue to Payment
                    <ArrowRight className="size-4" />
                  </Button>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="flex items-center gap-2 rounded-xl bg-gradient-bluesky-soft p-3 text-sm">
                    <Shield className="size-4 text-primary" />
                    <span className="text-foreground">Your payment is secured with 256-bit SSL encryption</span>
                  </div>

                  {/* Card form */}
                  <div className="space-y-3">
                    <FloatingInput label="Card Number" icon={CreditCard} required placeholder="4242 4242 4242 4242" defaultValue="" />
                    <div className="grid grid-cols-2 gap-3">
                      <FloatingInput label="Expiry (MM/YY)" required placeholder="12/27" defaultValue="" />
                      <FloatingInput label="CVC" required placeholder="123" defaultValue="" />
                    </div>
                    <FloatingInput label="Name on Card" required defaultValue="" />
                  </div>

                  {/* Payment methods */}
                  <div className="flex items-center gap-2">
                    {["Visa", "Mastercard", "Amex", "PayPal"].map((m) => (
                      <div key={m} className="rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                        {m}
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between rounded-2xl bg-gradient-bluesky-soft p-4">
                    <span className="text-sm font-medium text-foreground">Total to pay</span>
                    <span className="text-xl font-bold text-foreground">{formatPrice(total)}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep("details")} className="flex-1 rounded-xl">
                      Back
                    </Button>
                    <Button onClick={handlePay} className="flex-[2] gap-2 rounded-xl bg-gradient-bluesky font-bold shadow-glow-bluesky">
                      <Lock className="size-4" />
                      Pay {formatPrice(total)}
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === "processing" && (
                <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center gap-4 py-12">
                  <Loader2 className="size-12 animate-spin text-primary" />
                  <div className="text-center">
                    <p className="text-sm font-bold text-foreground">Processing payment...</p>
                    <p className="text-xs text-muted-foreground">Do not close this window</p>
                  </div>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 py-8 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="grid size-20 place-items-center rounded-full bg-emerald-100"
                  >
                    <Check className="size-10 text-emerald-600" strokeWidth={3} />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Booking Confirmed! 🎉</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Your payment was successful and your booking is confirmed.</p>
                  </div>
                  <div className="w-full max-w-sm rounded-2xl border border-border/60 bg-muted/30 p-4 text-left text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Reference</span><span className="font-mono font-bold text-foreground">BS-{Math.random().toString(36).slice(2, 8).toUpperCase()}</span></div>
                    <div className="mt-1.5 flex justify-between"><span className="text-muted-foreground">Amount paid</span><span className="font-bold text-foreground">{formatPrice(total)}</span></div>
                    <div className="mt-1.5 flex justify-between"><span className="text-muted-foreground">Confirmation</span><span className="font-semibold text-foreground">Sent to your email</span></div>
                  </div>
                  <Button onClick={handleClose} className="gap-2 rounded-xl bg-gradient-bluesky shadow-glow-bluesky">
                    View My Bookings
                    <ArrowRight className="size-4" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
