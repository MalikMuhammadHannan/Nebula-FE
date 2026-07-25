import { motion } from "motion/react"

import type { BlogPost } from "@/data/blog-posts"

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground transition-shadow hover:shadow-xl hover:shadow-[var(--brand-glow)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={post.featured_image}
          alt={post.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {post.status === "draft" && (
          <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold text-muted-foreground shadow-sm backdrop-blur">
            Draft
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-xs font-medium text-muted-foreground">
          {formatDate(post.published_at)}
        </p>
        <h3 className="text-lg leading-snug font-semibold text-foreground">
          {post.title}
        </h3>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {post.description}
        </p>
        <span className="mt-2 text-sm font-medium text-gradient-brand">
          Read more →
        </span>
      </div>
    </motion.article>
  )
}
