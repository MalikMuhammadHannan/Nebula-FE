import { AnimatePresence, motion } from "motion/react"
import { useSelector } from "react-redux"
import { NavLink } from "react-router-dom"

import { ROUTES } from "@/constants/routes"
import { cn } from "@/lib/utils"
import { getAccessibleRoutes, type AppRoute } from "@/router/app-routes"
import type { RootState } from "@/store/store"

const GROUP_LABELS: Record<string, string> = {
  general: "",
  blogs: "Content",
  ai: "AI Tools",
  account: "Account",
  admin: "Admin",
}

const GROUP_ORDER = ["general", "blogs", "ai", "account", "admin"]

function groupRoutes(routes: AppRoute[]) {
  const groups = new Map<string, AppRoute[]>()

  for (const route of routes) {
    if (!route.sidebar) continue
    const key = route.sidebar.group ?? "general"
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(route)
  }

  return GROUP_ORDER.filter((key) => groups.has(key)).map((key) => ({
    key,
    label: GROUP_LABELS[key] ?? key,
    routes: groups.get(key)!,
  }))
}

interface SideBarContentProps {
  onNavigate?: () => void
}

function SideBarContent({ onNavigate }: SideBarContentProps) {
  const role = useSelector((state: RootState) => state.auth.user?.role)
  const groups = groupRoutes(getAccessibleRoutes(role))

  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-5">
      <NavLink
        to={ROUTES.DASHBOARD}
        onClick={onNavigate}
        className="flex items-center gap-2 px-2 text-lg font-semibold tracking-tight"
      >
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-white shadow-[0_0_20px_var(--brand-glow)]">
          N
        </span>
        <span className="text-gradient-brand">Nebula</span>
      </NavLink>

      <nav className="flex flex-1 flex-col gap-5">
        {groups.map((group) => (
          <div key={group.key} className="flex flex-col gap-1">
            {group.label && (
              <span className="px-2 text-xs font-medium tracking-wide text-sidebar-foreground/50 uppercase">
                {group.label}
              </span>
            )}
            {group.routes.map((route) => (
              <NavLink
                key={route.path}
                to={route.path}
                end={route.path === ROUTES.DASHBOARD}
                onClick={onNavigate}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )
                }
              >
                {route.sidebar?.icon}
                {route.sidebar?.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </div>
  )
}

interface SideBarProps {
  open: boolean
  onClose: () => void
}

const SideBar = ({ open, onClose }: SideBarProps) => {
  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:block">
        <SideBarContent />
      </aside>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/50"
              onClick={onClose}
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="absolute inset-y-0 left-0 w-72 max-w-[80vw] border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl"
            >
              <SideBarContent onNavigate={onClose} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default SideBar
