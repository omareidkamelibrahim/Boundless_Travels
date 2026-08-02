"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  CheckCircle2,
  Calendar,
  Users,
  UserPlus,
  CreditCard,
  Minus,
  Plus,
  ArrowRight,
  ArrowLeft,
  Plane,
  PartyPopper,
  Shield,
  Mail,
  Phone,
  Lock,
  Wallet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBooking } from "@/stores/use-booking";
import { useAuth } from "@/stores/use-auth";
import { useUI } from "@/stores/use-ui";
import { cn, formatPrice, formatTripDuration, generateBookingReference } from "@/lib/utils";
import { findCountry, findCity } from "@/services";
import { toast } from "sonner";

const STEPS = [
  { id: 1, label: "Date", icon: Calendar },
  { id: 2, label: "Travelers", icon: Users },
  { id: 3, label: "Info", icon: UserPlus },
  { id: 4, label: "Payment", icon: CreditCard },
  { id: 5, label: "Done", icon: CheckCircle2 },
] as const;

export function BookingFlowModal() {
  const { isOpen, close, step, setStep, trip, selectedDate, setDate, adults, children, infants, setCounts, passengers, setPassengers, contactEmail, contactPhone, setContact, paymentMethod, setPaymentMethod, promoCode, setPromoCode, reset } = useBooking();
  const isAuthenticated = useAuth((s) => s.isAuthenticated);
  const openAuth = useUI((s) => s.openAuth);
  const [reference] = useState(generateBookingReference());

  if (!trip) return null;

  const handleClose = () => {
    if (step === 5) reset();
    else close();
  };

  const country = findCountry(trip.countryId);
  const city = findCity(trip.cityId);

  const subtotal = trip.price * adults + trip.price * 0.7 * children + trip.price * 0.1 * infants;
  const serviceFee = subtotal * 0.05;
  const discount = promoCode === "EARLYBIRD15" ? subtotal * 0.15 : 0;
  const total = subtotal + serviceFee - discount;

  const goNext = () => {
    if (step === 3 && !isAuthenticated) {
      toast.info("Please sign in to continue");
      openAuth("login");
      return;
    }
    if (step === 4) {
      // Simulate payment
      setStep(5);
      toast.success("Booking confirmed!");
      return;
    }
    setStep(Math.min(5, (step + 1) as 1 | 2 | 3 | 4 | 5));
  };
  const goBack = () => setStep(Math.max(1, step - 1) as 1 | 2 | 3 | 4 | 5);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl gap-0 overflow-hidden p-0 sm:rounded-3xl max-h-[95vh]">
        <DialogTitle className="sr-only">Book {trip.title}</DialogTitle>

        {/* Header with progress */}
        <div className="border-b border-border/60 bg-gradient-bluesky-soft p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-wider text-primary">
                Booking {step === 5 ? "Confirmed" : "in Progress"}
              </p>
              <h2 className="mt-1 line-clamp-1 text-lg font-bold text-foreground sm:text-xl">
                {trip.title}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {country?.name}
                {city && ` · ${city.name}`} · {formatTripDuration(trip.durationDays)}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="grid size-9 place-items-center rounded-xl border border-border/60 bg-card text-muted-foreground hover:text-foreground"
              aria-label="Close booking"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Steps progress */}
          {step < 5 && (
            <div className="mt-5 flex items-center">
              {STEPS.slice(0, 4).map((s, i) => {
                const isDone = step > s.id;
                const isActive = step === s.id;
                return (
                  <div key={s.id} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "grid size-9 place-items-center rounded-full text-xs font-bold transition-all sm:size-10",
                          isDone
                            ? "bg-primary text-primary-foreground shadow-glow-bluesky"
                            : isActive
                              ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                              : "bg-card text-muted-foreground ring-1 ring-border",
                        )}
                      >
                        {isDone ? <CheckCircle2 className="size-4" /> : i + 1}
                      </div>
                      <span className={cn("hidden text-[0.65rem] font-semibold sm:block", isActive ? "text-primary" : "text-muted-foreground")}>
                        {s.label}
                      </span>
                    </div>
                    {i < 3 && (
                      <div className="mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-border">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: step > s.id ? "100%" : "0%" }}
                          transition={{ duration: 0.3 }}
                          className="h-full bg-gradient-bluesky"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Step 1: Date */}
              {step === 1 && (
                <div className="space-y-4">
                  <StepHeader title="Choose your travel date" description="Pick the start date for your adventure." />
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {[3, 7, 14, 21, 30, 45, 60, 90].map((d) => {
                      const date = new Date(Date.now() + d * 86_400_000);
                      const iso = date.toISOString();
                      const isActive = selectedDate === iso;
                      const seats = Math.max(2, trip.maxTravelers - Math.floor(Math.random() * 6));
                      return (
                        <button
                          key={d}
                          onClick={() => setDate(iso)}
                          className={cn(
                            "flex flex-col items-center gap-0.5 rounded-xl border p-3 transition-all",
                            isActive
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border bg-card hover:border-primary/40",
                          )}
                        >
                          <span className="text-[0.65rem] font-medium text-muted-foreground">
                            {date.toLocaleDateString("en-US", { month: "short" })}
                          </span>
                          <span className="text-lg font-bold text-foreground">{date.getDate()}</span>
                          <span className="text-[0.6rem] text-muted-foreground">
                            {date.toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                          <span className="mt-1 text-[0.6rem] font-semibold text-emerald-600">
                            {seats} seats
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Travelers */}
              {step === 2 && (
                <div className="space-y-4">
                  <StepHeader title="How many travelers?" description="Choose the number of adults, children, and infants." />
                  <div className="space-y-3">
                    <CounterRow
                      label="Adults"
                      description="Age 12+"
                      value={adults}
                      min={1}
                      max={10}
                      onChange={(v) => setCounts({ adults: v, children, infants })}
                    />
                    <CounterRow
                      label="Children"
                      description="Age 2-11"
                      value={children}
                      min={0}
                      max={8}
                      onChange={(v) => setCounts({ adults, children: v, infants })}
                    />
                    <CounterRow
                      label="Infants"
                      description="Under 2, on lap"
                      value={infants}
                      min={0}
                      max={3}
                      onChange={(v) => setCounts({ adults, children, infants: v })}
                    />
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                    <p><span className="font-semibold text-foreground">Child policy:</span> 30% discount on adult price. Infants fly free on lap.</p>
                  </div>
                </div>
              )}

              {/* Step 3: Traveler Info */}
              {step === 3 && (
                <div className="space-y-4">
                  <StepHeader title="Traveler information" description="Enter details for each traveler." />
                  <div className="space-y-3">
                    {passengers.map((p, i) => (
                      <div key={p.id} className="rounded-xl border border-border/60 bg-card p-3">
                        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Traveler {i + 1} · {p.type}
                        </p>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <Input
                            placeholder="Full name (as on passport)"
                            value={p.fullName}
                            onChange={(e) => {
                              const next = [...passengers];
                              next[i] = { ...p, fullName: e.target.value };
                              setPassengers(next);
                            }}
                          />
                          <Input
                            placeholder="Passport number"
                            value={p.passportNumber ?? ""}
                            onChange={(e) => {
                              const next = [...passengers];
                              next[i] = { ...p, passportNumber: e.target.value };
                              setPassengers(next);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/60 bg-card p-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contact details</p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="email"
                          placeholder="Contact email"
                          value={contactEmail}
                          onChange={(e) => setContact(e.target.value, contactPhone)}
                          className="pl-10"
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="tel"
                          placeholder="Contact phone"
                          value={contactPhone}
                          onChange={(e) => setContact(contactEmail, e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  {!isAuthenticated && (
                    <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-700 ring-1 ring-amber-200">
                      <p>You'll need to sign in to complete your booking. We'll redirect you.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Payment */}
              {step === 4 && (
                <div className="space-y-4">
                  <StepHeader title="Payment summary" description="Review your booking and choose a payment method." />
                  <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{trip.title}</span>
                      <span className="font-semibold text-foreground">{formatPrice(trip.price, trip.currency)}</span>
                    </div>
                    <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Adults × {adults}</span>
                        <span>{formatPrice(trip.price * adults, trip.currency)}</span>
                      </div>
                      {children > 0 && (
                        <div className="flex justify-between">
                          <span>Children × {children} (30% off)</span>
                          <span>{formatPrice(trip.price * 0.7 * children, trip.currency)}</span>
                        </div>
                      )}
                      {infants > 0 && (
                        <div className="flex justify-between">
                          <span>Infants × {infants}</span>
                          <span>{formatPrice(trip.price * 0.1 * infants, trip.currency)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Service fee (5%)</span>
                        <span>{formatPrice(serviceFee, trip.currency)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Promo EARLYBIRD15</span>
                          <span>-{formatPrice(discount, trip.currency)}</span>
                        </div>
                      )}
                    </div>
                    <div className="my-2 h-px bg-border" />
                    <div className="flex items-center justify-between font-bold text-foreground">
                      <span>Total</span>
                      <span className="text-lg">{formatPrice(total, trip.currency)}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Promo code</Label>
                    <div className="mt-1.5 flex gap-2">
                      <Input
                        placeholder="EARLYBIRD15"
                        value={promoCode ?? ""}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase() || undefined)}
                      />
                      <Button variant="outline" onClick={() => toast.success(promoCode === "EARLYBIRD15" ? "Applied!" : "Invalid code")}>
                        Apply
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-semibold">Payment method</Label>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {[
                        { id: "card" as const, label: "Card", icon: CreditCard },
                        { id: "paypal" as const, label: "PayPal", icon: Wallet },
                        { id: "bank" as const, label: "Bank", icon: Lock },
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => setPaymentMethod(m.id)}
                          className={cn(
                            "flex flex-col items-center gap-1 rounded-xl border px-3 py-3 transition-all",
                            paymentMethod === m.id
                              ? "border-primary bg-primary/5 ring-1 ring-primary"
                              : "border-border bg-card hover:border-primary/40",
                          )}
                        >
                          <m.icon className="size-5 text-primary" />
                          <span className="text-xs font-semibold">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-2 rounded-xl border border-border/60 bg-card p-3">
                      <Input placeholder="Card number" />
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="MM / YY" />
                        <Input placeholder="CVC" />
                      </div>
                      <Input placeholder="Name on card" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="size-3.5 text-emerald-500" />
                    Secured with 256-bit SSL encryption · Powered by Stripe
                  </div>
                </div>
              )}

              {/* Step 5: Success */}
              {step === 5 && (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="grid size-20 place-items-center rounded-full bg-emerald-100"
                  >
                    <CheckCircle2 className="size-10 text-emerald-600" />
                  </motion.div>
                  <div>
                    <h3 className="flex items-center justify-center gap-2 text-2xl font-bold text-foreground">
                      <PartyPopper className="size-5 text-amber-500" />
                      Booking Confirmed!
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Get ready for your {trip.title.split(" — ")[0]} adventure.
                    </p>
                  </div>
                  <div className="w-full max-w-sm rounded-xl border border-border/60 bg-muted/30 p-4 text-left text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Reference</span>
                      <span className="font-mono font-bold text-foreground">{reference}</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-muted-foreground">Trip</span>
                      <span className="font-semibold text-foreground">{trip.title}</span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-semibold text-foreground">
                        {selectedDate ? new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-muted-foreground">Travelers</span>
                      <span className="font-semibold text-foreground">
                        {adults + children + infants} ({adults}A · {children}C · {infants}I)
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-muted-foreground">Total paid</span>
                      <span className="font-bold text-primary">{formatPrice(total, trip.currency)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Confirmation sent to {contactEmail || "your email"}. You can manage your booking from your dashboard.
                  </p>
                  <Button onClick={handleClose} className="bg-gradient-bluesky shadow-glow-bluesky">
                    View My Bookings
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        {step < 5 && (
          <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-card p-4 sm:p-5">
            <div className="flex flex-col">
              <span className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">Total</span>
              <span className="text-lg font-bold text-foreground">{formatPrice(total, trip.currency)}</span>
            </div>
            <div className="flex items-center gap-2">
              {step > 1 && (
                <Button variant="outline" onClick={goBack}>
                  <ArrowLeft className="size-4" />
                  Back
                </Button>
              )}
              <Button onClick={goNext} className="bg-gradient-bluesky shadow-glow-bluesky">
                {step === 4 ? (
                  <>
                    <Lock className="size-4" />
                    Pay {formatPrice(total, trip.currency)}
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function StepHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function CounterRow({
  label,
  description,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-card p-3">
      <div>
        <p className="text-sm font-bold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="grid size-9 place-items-center rounded-xl border border-border text-foreground transition-colors hover:bg-accent disabled:opacity-40"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-8 text-center text-base font-bold">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="grid size-9 place-items-center rounded-xl border border-border text-foreground transition-colors hover:bg-accent disabled:opacity-40"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
