import type { ReactNode } from "react"
import { motion } from "motion/react"

interface AuthCardProps {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="relative flex min-h-[calc(100svh-8rem)] items-center justify-center overflow-hidden px-4 py-16 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/3 rounded-full opacity-30 blur-3xl"
        style={{ backgroundImage: "var(--brand-gradient)" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-3xl border border-border/60 bg-card p-8 text-card-foreground shadow-xl"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <motion.span
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "backOut" }}
            className="mb-3 inline-flex size-10 items-center justify-center rounded-full bg-gradient-brand text-lg font-bold text-white shadow-[0_0_24px_var(--brand-glow)]"
          >
            N
          </motion.span>
          <h1 className="m-0 text-2xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {children}

        <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
      </motion.div>
    </div>
  )
}
