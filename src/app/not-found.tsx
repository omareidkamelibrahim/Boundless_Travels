"use client";

import Link from "next/link";
import { Home, Search, Plane } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 px-4 text-center">
      <div className="relative">
        <div className="grid size-24 place-items-center rounded-3xl bg-gradient-bluesky shadow-glow-bluesky">
          <Plane className="size-12 -rotate-45 text-white" />
        </div>
        <div className="absolute -right-4 -top-4 grid size-10 place-items-center rounded-full bg-amber-400 text-lg font-bold text-amber-950">
          404
        </div>
      </div>

      <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-md text-base text-muted-foreground">
        Looks like this destination doesn't exist yet. Let's get you back on track.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/">
          <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-bluesky px-6 py-3 text-sm font-bold text-white shadow-glow-bluesky transition-transform hover:scale-105">
            <Home className="size-4" />
            Back to Home
          </button>
        </Link>
        <Link href="/packages">
          <button className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-card px-6 py-3 text-sm font-bold text-foreground shadow-premium transition-colors hover:bg-accent">
            <Search className="size-4" />
            Browse Packages
          </button>
        </Link>
      </div>
    </div>
  );
}
