import { Menu, Moon, Sun, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { ROUTES } from "@/constants/routes"
import { useTheme } from "@/hooks/use-theme"

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/#posts", label: "Posts" },
]

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to={ROUTES.LANDING}
          className="flex items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <motion.span
            whileHover={{ rotate: 12, scale: 1.05 }}
            className="inline-flex size-8 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-white shadow-[0_0_20px_var(--brand-glow)]"
          >
            N
          </motion.span>
          <span className="text-gradient-brand">Nebula</span>
        </Link>


        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            onClick={toggleTheme}
            whileTap={{ scale: 0.85 }}
            className="flex size-8 items-center justify-center overflow-hidden rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.span
                  key="sun"
                  initial={{ scale: 0, rotate: -90, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <Sun className="size-4" />
                </motion.span>
              ) : (
                <motion.span
                  key="moon"
                  initial={{ scale: 0, rotate: 90, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex"
                >
                  <Moon className="size-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={ROUTES.SIGN_IN} onClick={() => setMobileOpen(false)}>
              Sign in
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="flex-1 bg-gradient-brand text-white"
          >
            <Link to={ROUTES.SIGN_UP} onClick={() => setMobileOpen(false)}>
              Sign up
            </Link>
          </Button>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border/60 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-2 flex gap-2">
                <Button
                  asChild
                  size="sm"
                  className="flex-1 bg-gradient-brand text-white"
                >
                  <Link to={ROUTES.SIGN_IN} onClick={() => setMobileOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="flex-1 bg-gradient-brand text-white"
                >
                  <Link to={ROUTES.SIGN_UP} onClick={() => setMobileOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
