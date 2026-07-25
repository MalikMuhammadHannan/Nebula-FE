import type { ReactNode } from "react"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
