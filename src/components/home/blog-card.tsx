import { motion } from "motion/react"
import { Link } from "react-router-dom"

import type { Blog } from "@/api/blog.api"
import { formatDate } from "@/constants";
import { ROUTES } from "@/constants/routes"

export function BlogCard({ post, index = 0 }: { post: Blog; index?: number }) {
  return (
    <Link to={ROUTES.BLOG.replace(":id", String(post.id))} className="contents">
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
        whileHover={{ y: -6 }}
        className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground transition-shadow hover:shadow-xl hover:shadow-[var(--brand-glow)]"
      >
        {post.image_url && (
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <div className="flex flex-1 flex-col gap-2 p-5">
          <p className="text-xs font-medium text-muted-foreground">
            {formatDate(post.created_at)}
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
    </Link>
  )
}
