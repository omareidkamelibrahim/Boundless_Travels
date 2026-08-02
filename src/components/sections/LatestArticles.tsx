"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/common/SectionTitle";
import { BlogCard } from "@/components/cards/BlogCard";
import { Reveal } from "@/components/common/Reveal";
import { getLatestArticles } from "@/services";

export function LatestArticles() {
  const blogs = getLatestArticles(3);
  return (
    <section id="blog" className="relative py-16 sm:py-20 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Travel journal"
          title={
            <>
              Latest <span className="text-gradient-bluesky">articles</span> & guides
            </>
          }
          description="Tips, stories, and inspiration from our travel experts around the world."
          action={
            <Button variant="outline" className="rounded-xl">
              All articles
              <ArrowRight className="size-4" />
            </Button>
          }
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.08} as="div">
              <BlogCard blog={b} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
