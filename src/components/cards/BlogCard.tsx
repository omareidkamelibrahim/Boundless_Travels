"use client";

import { motion } from "framer-motion";
import { Clock, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import type { Blog } from "@/types";
import { cn, formatDate, initials } from "@/lib/utils";
import { useUI } from "@/stores/use-ui";

interface BlogCardProps {
  blog: Blog;
  className?: string;
  onClick?: (b: Blog) => void;
}

export function BlogCard({ blog, className, onClick }: BlogCardProps) {
  const setBlogId = useUI((s) => s.setBlogId);
  return (
    <motion.article
      whileHover={{ y: -6 }}
      onClick={() => { if (onClick) onClick(blog); else setBlogId(blog.id); }}
      className={cn(
        "group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-premium transition-shadow hover:shadow-premium-lg",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={blog.coverUrl}
          alt={blog.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary backdrop-blur-md">
          {blog.category}
        </span>
        <div className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/15 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
          <ArrowUpRight className="size-4" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatDate(blog.publishedAt, { year: "numeric", month: "short", day: "numeric" })}</span>
          <span className="size-1 rounded-full bg-muted-foreground/40" />
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" /> {blog.readMins} min read
          </span>
        </div>
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground group-hover:text-primary">
          {blog.title}
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{blog.excerpt}</p>
        <div className="mt-auto flex items-center gap-2 border-t border-border/60 pt-3">
          <div className="grid size-8 place-items-center rounded-full bg-gradient-bluesky text-[0.7rem] font-bold text-white">
            {initials(blog.authorName)}
          </div>
          <span className="text-xs font-medium text-foreground">{blog.authorName}</span>
        </div>
      </div>
    </motion.article>
  );
}
