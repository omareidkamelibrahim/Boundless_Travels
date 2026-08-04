"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Reveal } from "@/components/common/Reveal";
import { cn } from "@/lib/utils";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 4000);
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <Reveal as="div">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-bluesky p-1 shadow-premium-lg">
            <div className="relative overflow-hidden rounded-[calc(1.5rem-4px)] bg-gradient-to-br from-primary to-secondary p-8 sm:p-12 lg:p-16">
              {/* Decorative */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -right-20 -top-20 size-72 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-accent/30 blur-3xl" />
                <Sparkles className="absolute right-10 top-10 size-6 text-white/30" />
                <Sparkles className="absolute left-1/3 bottom-10 size-4 text-white/20" />
              </div>

              <div className="relative grid items-center gap-8 lg:grid-cols-2">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/20">
                    <Sparkles className="size-3.5" />
                    Travel inspiration
                  </span>
                  <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                    Get exclusive deals
                    <br />
                    delivered to your inbox
                  </h2>
                  <p className="mt-4 max-w-md text-base text-white/85">
                    Join 48,000+ travelers receiving our weekly deals, hidden gems,
                    and travel inspiration. No spam, ever.
                  </p>
                </div>

                <div className="lg:pl-8">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={cn(
                          "h-12 rounded-xl border-white/20 bg-white pl-12 pr-4 text-base text-foreground shadow-premium",
                        )}
                        aria-label="Email address"
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 rounded-xl bg-slate-950 text-base font-bold text-white shadow-premium-lg hover:bg-slate-900"
                    >
                      {submitted ? (
                        <>
                          <CheckCircle2 className="size-5" />
                          Subscribed!
                        </>
                      ) : (
                        <>
                          <Send className="size-4" />
                          Subscribe now
                        </>
                      )}
                    </Button>
                    <p className="text-center text-xs text-white/70">
                      By subscribing, you agree to our Privacy Policy.
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
