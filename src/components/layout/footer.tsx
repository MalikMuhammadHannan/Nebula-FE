import { Link } from "react-router-dom"
import { motion } from "motion/react"

const FOOTER_LINKS = [
  { to: "/", label: "Home" },
  { to: "/sign-in", label: "Sign in" },
  { to: "/sign-up", label: "Sign up" },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="border-t border-border/60 bg-background"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-6 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-white">
            N
          </span>
          <span className="font-medium text-foreground">Nebula</span>
        </div>

        <nav className="flex items-center gap-6">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p>© {year} Nebula. All rights reserved.</p>
      </div>
    </motion.footer>
  )
}
