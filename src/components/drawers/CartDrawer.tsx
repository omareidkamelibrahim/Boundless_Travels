"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ShoppingCart,
  X,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  Shield,
  Tag,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUI } from "@/stores/use-ui";
import { useCart, computeItemTotal } from "@/stores/use-cart";
import { findCountry } from "@/services";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { cartOpen, setCartOpen } = useUI();
  const { items, remove, updateQty, clear, subtotal } = useCart();
  const openBooking = useUI((s) => s.openBooking);

  const total = subtotal();
  const count = items.reduce((s, i) => s + i.adults + i.children + i.infants, 0);

  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full border-l-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 bg-gradient-bluesky-soft p-5">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow-bluesky">
              <ShoppingCart className="size-4" />
            </div>
            <div>
              <span className="block">Shopping Cart</span>
              <span className="text-xs font-normal text-muted-foreground">
                {count} {count === 1 ? "traveler" : "travelers"} · {items.length} {items.length === 1 ? "trip" : "trips"}
              </span>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="flex max-h-[calc(100vh-260px)] flex-col gap-3 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="grid size-20 place-items-center rounded-full bg-muted">
                <ShoppingCart className="size-9 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Your cart is empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add trips to your cart to checkout in one go.
                </p>
              </div>
              <Button onClick={() => setCartOpen(false)} variant="outline" className="rounded-xl">
                Browse trips
              </Button>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item) => {
                const country = findCountry(item.trip.countryId);
                const itemTotal = computeItemTotal(item);
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    className="group rounded-2xl border border-border/60 bg-card p-3 shadow-sm"
                  >
                    <div className="flex gap-3">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl">
                        <Image src={item.trip.imageUrl} alt={item.trip.title} fill sizes="80px" className="object-cover" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="line-clamp-2 text-sm font-bold text-foreground">{item.trip.title}</h4>
                          <button
                            onClick={() => remove(item.id)}
                            aria-label="Remove"
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {country?.name} · {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <Counter
                            label="A"
                            value={item.adults}
                            min={1}
                            onChange={(v) => updateQty(item.id, "adults", v)}
                          />
                          <Counter
                            label="C"
                            value={item.children}
                            min={0}
                            onChange={(v) => updateQty(item.id, "children", v)}
                          />
                          <Counter
                            label="I"
                            value={item.infants}
                            min={0}
                            onChange={(v) => updateQty(item.id, "infants", v)}
                          />
                          <span className="ml-auto text-sm font-bold text-foreground">
                            {formatPrice(itemTotal, item.trip.currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}

          {/* Promo */}
          {items.length > 0 && (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-3">
              <div className="flex items-center gap-2">
                <Tag className="size-4 text-primary" />
                <Input placeholder="Promo code" className="h-8 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0" />
                <Button size="sm" variant="outline">Apply</Button>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border/60 bg-card p-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">{formatPrice(total)}</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Service fee (5%)</span>
                <span className="font-semibold text-foreground">{formatPrice(total * 0.05)}</span>
              </div>
              <div className="my-2 h-px bg-border" />
              <div className="flex items-center justify-between font-bold">
                <span className="text-base">Total</span>
                <span className="text-xl text-primary">{formatPrice(total * 1.05)}</span>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-4 w-full bg-gradient-bluesky shadow-glow-bluesky"
              onClick={() => {
                if (items[0]) {
                  setCartOpen(false);
                  openBooking(items[0].trip.id);
                }
              }}
            >
              Checkout
              <ArrowRight className="size-4" />
            </Button>
            <p className="mt-2 flex items-center justify-center gap-1.5 text-[0.65rem] text-muted-foreground">
              <Shield className="size-3 text-emerald-500" />
              Secure checkout · Free cancellation up to 7 days
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Counter({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-card px-1 py-0.5">
      <span className="px-1 text-[0.6rem] font-bold text-muted-foreground">{label}</span>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="grid size-5 place-items-center rounded text-muted-foreground hover:bg-accent disabled:opacity-40"
      >
        <Minus className="size-3" />
      </button>
      <span className="w-4 text-center text-xs font-bold">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        className="grid size-5 place-items-center rounded text-muted-foreground hover:bg-accent"
      >
        <Plus className="size-3" />
      </button>
    </div>
  );
}
