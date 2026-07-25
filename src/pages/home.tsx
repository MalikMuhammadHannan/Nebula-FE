import { PageTransition } from "@/components/layout/page-transition"
import { Hero } from "@/components/home/hero"
import { BlogSection } from "@/components/home/blog-section"

export function Home() {
  return (
    <PageTransition>
      <Hero />
      <BlogSection />
    </PageTransition>
  )
}
