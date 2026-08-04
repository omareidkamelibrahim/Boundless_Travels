"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { X, Clock, Calendar, Share2, Heart, ArrowRight, Tag } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUI } from "@/stores/use-ui";
import { useWishlist } from "@/stores/use-wishlist";
import { getBlogs, getBlog } from "@/services";
import { cn, formatDate, initials } from "@/lib/utils";
import { toast } from "sonner";

export function BlogArticleModal() {
  const { blogId, setBlogId, closeBlog } = useUI();
  const { toggle, has } = useWishlist();
  const blog = blogId ? getBlog(blogId) : undefined;
  const related = blog ? getBlogs().filter((b) => b.id !== blog.id && b.category === blog.category).slice(0, 2) : [];

  if (!blog) return null;

  const isSaved = has(blog.id);

  return (
    <DialogPrimitive.Root open={!!blogId} onOpenChange={(o) => !o && setBlogId(undefined)}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[4px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-card shadow-2xl",
            "w-[calc(100vw-1rem)] max-w-3xl max-h-[90vh]",
          )}
        >
          <DialogTitle className="sr-only">{blog.title}</DialogTitle>
          <DialogDescription className="sr-only">{blog.excerpt}</DialogDescription>

          {/* Close button */}
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>

          <div className="max-h-[90vh] overflow-y-auto">
            {/* Cover image */}
            <div className="relative aspect-[2/1] overflow-hidden">
              <Image src={blog.coverUrl} alt={blog.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2">
                <Badge className="bg-white/90 text-primary">{blog.category}</Badge>
                {blog.tags.slice(0, 2).map((t) => (
                  <Badge key={t} variant="secondary" className="bg-white/20 text-white backdrop-blur-md">{t}</Badge>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Meta */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar className="size-3.5" />{formatDate(blog.publishedAt, { year: "numeric", month: "short", day: "numeric" })}</span>
                <span className="flex items-center gap-1"><Clock className="size-3.5" />{blog.readMins} min read</span>
              </div>

              {/* Title */}
              <h1 className="mt-3 text-2xl font-bold leading-tight text-foreground sm:text-3xl">{blog.title}</h1>
              <p className="mt-2 text-base text-muted-foreground">{blog.excerpt}</p>

              {/* Author */}
              <div className="mt-5 flex items-center justify-between border-y border-border/60 py-3">
                <div className="flex items-center gap-2.5">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-gradient-bluesky text-xs font-bold text-white">{initials(blog.authorName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-foreground">{blog.authorName}</p>
                    <p className="text-xs text-muted-foreground">Travel Writer</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => toast.success("Link copied!")} aria-label="Share" className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary">
                    <Share2 className="size-4" />
                  </button>
                  <button onClick={() => { toggle({ trip: undefined as never }); toast.success(isSaved ? "Removed from saved" : "Saved!"); }} aria-label="Save" className={cn("grid size-8 place-items-center rounded-lg transition-colors", isSaved ? "text-rose-500" : "text-muted-foreground hover:bg-accent hover:text-primary")}>
                    <Heart className={cn("size-4", isSaved && "fill-current")} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="prose prose-sm mt-5 max-w-none text-sm leading-relaxed text-foreground/85">
                <p className="font-medium text-foreground">{blog.excerpt}</p>
                <p className="mt-3">{blog.content || `Travel opens our eyes to new cultures, cuisines, and ways of life. In this article, we explore ${blog.title.toLowerCase()} — sharing insider tips, must-see spots, and practical advice for travelers seeking an unforgettable experience.`}</p>
                <p className="mt-3">Whether you're planning your first visit or returning for another adventure, these insights will help you make the most of your journey. From hidden gems to popular attractions, we've got you covered with expert recommendations and local perspectives.</p>
                <blockquote className="border-l-4 border-primary pl-4 text-base font-medium italic text-foreground">
                  "The world is a book, and those who do not travel read only one page." — Saint Augustine
                </blockquote>
                <p className="mt-3">Remember to book in advance during peak seasons, respect local customs, and always have travel insurance. Safe travels!</p>
              </div>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Tag className="size-3.5 text-muted-foreground" />
                {blog.tags.map((t) => (
                  <Badge key={t} variant="secondary">{t}</Badge>
                ))}
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="mt-8 border-t border-border/60 pt-6">
                  <h3 className="mb-4 text-sm font-bold text-foreground">Related Articles</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {related.map((r) => (
                      <button key={r.id} onClick={() => setBlogId(r.id)} className="group flex gap-3 rounded-xl border border-border/60 bg-card p-3 text-left transition-shadow hover:shadow-premium">
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-lg">
                          <Image src={r.coverUrl} alt={r.title} fill sizes="64px" className="object-cover transition-transform group-hover:scale-110" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-bold text-foreground group-hover:text-primary">{r.title}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{r.readMins} min read</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
