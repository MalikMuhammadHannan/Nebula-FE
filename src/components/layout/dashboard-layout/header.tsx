import { LogOut, Menu, Moon, Sun } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { ROUTES } from "@/constants/routes"
import { useTheme } from "@/hooks/use-theme"
import { logout } from "@/store/reducers/authReducer.slice"
import type { AppDispatch, RootState } from "@/store/store"

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme()
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  function handleLogout() {
    setMenuOpen(false)
    dispatch(logout())
    navigate(ROUTES.SIGN_IN, { replace: true })
  }

  const initial = user?.full_name?.trim()?.[0]?.toUpperCase() ?? "U"

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:text-foreground md:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-4" />
      </button>

      <div className="hidden md:block" />

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

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            className="flex size-8 items-center justify-center rounded-full bg-gradient-brand text-sm font-semibold text-white shadow-[0_0_16px_var(--brand-glow)]"
          >
            {initial}
          </button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-lg"
              >
                <div className="border-b border-border px-3 py-2.5">
                  <p className="truncate text-sm font-medium">{user?.full_name ?? "User"}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  <LogOut className="size-4" />
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default Header
