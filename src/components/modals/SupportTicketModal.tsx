"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Check, LifeBuoy, AlertCircle } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FloatingInput } from "@/components/auth/FloatingInput";
import { useUI } from "@/stores/use-ui";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRIORITIES = [
  { id: "low", label: "Low", color: "text-emerald-600" },
  { id: "medium", label: "Medium", color: "text-amber-600" },
  { id: "high", label: "High", color: "text-rose-500" },
];

const SUBJECTS = [
  "Booking Issue", "Payment Problem", "Cancellation / Refund",
  "Trip Inquiry", "Account Access", "Visa Assistance", "Other",
];

export function SupportTicketModal() {
  const { supportOpen, closeSupport } = useUI();
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Support ticket created — we'll reply within 24h!");
      setTimeout(() => { closeSupport(); setSubmitted(false); }, 2500);
    }, 1200);
  };

  return (
    <DialogPrimitive.Root open={supportOpen} onOpenChange={(o) => !o && closeSupport()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[4px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-card shadow-2xl w-[calc(100vw-1rem)] max-w-md">
          <DialogTitle className="sr-only">Support Ticket</DialogTitle>
          <DialogDescription className="sr-only">Get help from our support team.</DialogDescription>

          <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="grid size-9 place-items-center rounded-xl bg-gradient-bluesky shadow-glow-bluesky">
                <LifeBuoy className="size-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Contact Support</h2>
                <p className="text-xs text-muted-foreground">We reply within 24 hours</p>
              </div>
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
                  <h3 className="text-lg font-bold text-foreground">Ticket Submitted!</h3>
                  <p className="text-sm text-muted-foreground">Ticket #{Math.random().toString(36).slice(2, 8).toUpperCase()} — we'll email you a response.</p>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-4">
                  {/* Priority */}
                  <div>
                    <Label className="text-xs font-semibold text-foreground">Priority</Label>
                    <div className="mt-1.5 grid grid-cols-3 gap-2">
                      {PRIORITIES.map((p) => (
                        <button key={p.id} type="button" onClick={() => setPriority(p.id)} className={cn("flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all", priority === p.id ? "border-primary bg-primary/8 text-primary shadow-sm" : "border-border bg-card text-muted-foreground hover:border-primary/40")}>
                          <AlertCircle className={cn("size-3.5", p.color)} />
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Subject</Label>
                    <select required defaultValue="" className="h-12 w-full appearance-none rounded-xl border border-border bg-card px-3 text-sm font-medium transition-all focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15">
                      <option value="" disabled>Select a subject</option>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <FloatingInput label="Your Name" required defaultValue="" />
                  <FloatingInput label="Email" type="email" required defaultValue="" />

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">Message</Label>
                    <textarea required rows={4} placeholder="Describe your issue..." className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2.5 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15" />
                  </div>

                  <Button type="submit" disabled={loading} className="h-12 w-full gap-2 rounded-xl bg-gradient-bluesky font-bold shadow-glow-bluesky">
                    {loading ? <><Loader2 className="size-4 animate-spin" /> Submitting...</> : <><Send className="size-4" /> Submit Ticket</>}
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
