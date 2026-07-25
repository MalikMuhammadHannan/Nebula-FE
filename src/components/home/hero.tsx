import { ArrowRight } from "lucide-react"
import { motion, type Variants } from "motion/react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { DitheringShader } from "@/components/ui/dithering-shader"
import { useTheme } from "@/hooks/use-theme"

/** Resolves a CSS color value (var(), oklch(), hex, ...) to a #rrggbb string the WebGL shader can parse. */
function resolveCssColor(value: string): string {
  if (typeof document === "undefined") return "#000000"
  const probe = document.createElement("span")
  probe.style.position = "absolute"
  probe.style.visibility = "hidden"
  probe.style.color = value
  document.body.appendChild(probe)
  const rgb = getComputedStyle(probe).color
  document.body.removeChild(probe)

  const channels = rgb.match(/[\d.]+/g)
  if (!channels) return "#000000"
  const [r, g, b] = channels.map(Number)
  return `#${[r, g, b]
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel))).toString(16).padStart(2, "0")
    )
    .join("")}`
}

const heroText: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const heroItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export function Hero() {
  const { theme } = useTheme()
  const [shaderFront, setShaderFront] = useState("#462c7d")

  useEffect(() => {
    setShaderFront(resolveCssColor("var(--primary)"))
  }, [theme])

  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:items-center md:py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative order-2 mx-auto aspect-square w-full max-w-md overflow-hidden md:order-1"
      >
        <DitheringShader
          shape="sphere"
          type="random"
          colorFront={shaderFront}
          colorBack="transparent"
          pxSize={2}
          speed={1.2}
          width={640}
          height={640}
          style={{ width: "100%", height: "100%" }}
        />
      </motion.div>

      <motion.div
        variants={heroText}
        initial="hidden"
        animate="show"
        className="order-1 text-center md:order-2 md:text-left"
      >
        <motion.span
          variants={heroItem}
          className="inline-flex items-center rounded-full border border-border bg-accent px-3 py-1 text-xs font-medium text-accent-foreground"
        >
          Welcome to Nebula
        </motion.span>

        <motion.h1
          variants={heroItem}
          className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
        >
          Stories that orbit{" "}
          <span className="text-gradient-brand">around ideas</span>
        </motion.h1>

        <motion.p
          variants={heroItem}
          className="mt-2 max-w-lg text-base text-muted-foreground md:text-lg"
        >
          A blog for builders, dreamers, and the endlessly curious — thoughtful
          writing on design, code, and everything in between.
        </motion.p>

        <motion.div
          variants={heroItem}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 md:justify-start"
        >
          <Button
            render={<a href="#posts" />}
            size="lg"
            className="bg-gradient-brand text-white hover:opacity-90"
          >
            Read the blog
            <ArrowRight data-icon="inline-end" className="size-4" />
          </Button>
          <Button render={<Link to="/sign-up" />} variant="outline" size="lg">
            Get started
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
