export type PostStatus = "published" | "draft"

export interface BlogPost {
  title: string
  slug: string
  description: string
  content: string
  featured_image: string
  status: PostStatus
  published_at: string
}

export const blogPosts: BlogPost[] = [
  {
    title: "Designing with a Purple-to-Pink Gradient",
    slug: "designing-with-gradient",
    description:
      "How a four-stop brand gradient can carry an entire interface — from buttons to backgrounds — without ever feeling noisy.",
    content:
      "A restrained gradient palette, applied consistently through CSS custom properties, keeps a design system coherent across dozens of components.",
    featured_image:
      "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    published_at: "2026-07-18",
  },
  {
    title: "Shaders in the Browser: A Gentle Introduction",
    slug: "shaders-in-the-browser",
    description:
      "WebGL2 fragment shaders aren't just for games — a single dithered sphere can carry the personality of an entire hero section.",
    content:
      "Fragment shaders run once per pixel, giving you full control over color, noise, and motion with almost no DOM overhead.",
    featured_image:
      "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    published_at: "2026-07-10",
  },
  {
    title: "Motion as a First-Class Design Tool",
    slug: "motion-as-a-design-tool",
    description:
      "Stagger, spring, and exit transitions aren't decoration — used well, they explain hierarchy and guide attention.",
    content:
      "Reach for motion when it clarifies state changes: entrances, exits, and reordering all benefit from a well-tuned transition.",
    featured_image:
      "https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    published_at: "2026-06-29",
  },
  {
    title: "Dark Mode Is a Design System, Not a Filter",
    slug: "dark-mode-is-a-system",
    description:
      "Inverting lightness isn't enough — a good dark theme rebalances contrast, saturation, and glow independently.",
    content:
      "Treat light and dark as two coherent palettes sharing the same semantic tokens, not one palette flipped upside down.",
    featured_image:
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    published_at: "2026-06-14",
  },
  {
    title: "Migrating a Small App to TypeScript",
    slug: "migrating-to-typescript",
    description:
      "A pragmatic, file-by-file path for adding TypeScript to an existing React codebase without a big-bang rewrite.",
    content:
      "Start from the leaves — utilities with no dependents — and work inward toward entry points so every rename compiles cleanly.",
    featured_image:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1200&auto=format&fit=crop",
    status: "published",
    published_at: "2026-05-30",
  },
  {
    title: "Notes on a Component Library, Six Months In",
    slug: "notes-on-a-component-library",
    description:
      "Unfinished thoughts on what worked, what didn't, and what we'd rebuild from scratch.",
    content:
      "Draft notes — not ready for publication yet.",
    featured_image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    status: "draft",
    published_at: "2026-07-22",
  },
]
