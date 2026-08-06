import { motion } from "motion/react"

import { useGetPublicBlogsQuery } from "@/api/blog.api"
import { BlogCard } from "@/components/home/blog-card"

export function BlogSection() {
  const { data: posts, isLoading, isError } = useGetPublicBlogsQuery()

  return (
    <section id="posts" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center md:text-left"
      >
        <h2 className="text-gradient-brand">Latest posts</h2>
        <p className="mt-1 text-muted-foreground">
          Fresh thinking on design, code, and everything orbiting them.
        </p>
      </motion.div>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Loading posts…</p>
      ) : isError ? (
        <p className="text-center text-muted-foreground">Couldn't load posts. Please try again later.</p>
      ) : !posts?.length ? (
        <p className="text-center text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      )}
    </section>
  )
}
