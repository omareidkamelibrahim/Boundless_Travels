"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Send, Loader2, Check } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { useUI } from "@/stores/use-ui";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ReviewsModal() {
  const { reviewsOpen, closeReviews, reviewTripTitle } = useUI();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Review submitted — thank you!");
      setTimeout(() => {
        closeReviews();
        setSubmitted(false);
        setRating(5);
      }, 2000);
    }, 1000);
  };

  const displayRating = hoverRating || rating;

  return (
    <DialogPrimitive.Root open={reviewsOpen} onOpenChange={(o) => !o && closeReviews()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[4px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-card shadow-2xl w-[calc(100vw-1rem)] max-w-md">
          <DialogTitle className="sr-only">Write a Review</DialogTitle>
          <DialogDescription className="sr-only">Share your experience with other travelers.</DialogDescription>

          <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <div>
              <h2 className="text-base font-bold text-foreground">Write a Review</h2>
              {reviewTripTitle && <p className="text-xs text-muted-foreground">{reviewTripTitle}</p>}
            </div>
            <DialogPrimitive.Close aria-label="Close" className="grid size-9 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground">
              <X className="size-5" />
            </DialogPrimitive.Close>
          </header>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3 py-8 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="grid size-16 place-items-center rounded-full bg-emerald-100">
                    <Check className="size-8 text-emerald-600" strokeWidth={3} />
                  </motion.div>
                  <h3 className="text-lg font-bold text-foreground">Thank You!</h3>
                  <p className="text-sm text-muted-foreground">Your review has been submitted and will appear after moderation.</p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
                  {/* Star rating */}
                  <div>
                    <Label className="text-xs font-semibold text-foreground">Your Rating</Label>
                    <div className="mt-2 flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} type="button" onClick={() => setRating(n)} onMouseEnter={() => setHoverRating(n)} onMouseLeave={() => setHoverRating(0)} className="p-1" aria-label={`${n} stars`}>
                          <Star className={cn("size-8 transition-all", n <= displayRating ? "fill-amber-400 text-amber-400 scale-110" : "fill-muted text-muted-foreground/40")} />
                        </button>
                      ))}
                      <span className="ml-2 text-sm font-bold text-foreground">{displayRating}.0</span>
                    </div>
                  </div>

                  <FloatingInput label="Review Title" required defaultValue="" />
                  
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Your Review</Label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share details of your experience..."
                      className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2.5 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FloatingInput label="Your Name" required defaultValue="" />
                    <FloatingInput label="Email" type="email" required defaultValue="" />
                  </div>

                  <Button type="submit" disabled={loading} className="h-12 w-full gap-2 rounded-xl bg-gradient-bluesky font-bold shadow-glow-bluesky">
                    {loading ? <><Loader2 className="size-4 animate-spin" /> Submitting...</> : <><Send className="size-4" /> Submit Review</>}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
