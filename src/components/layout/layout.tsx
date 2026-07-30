import type { ReactNode } from "react"
import { Outlet } from "react-router-dom"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"

export function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">{children ?? <Outlet />}</main>
      <Footer />
    </div>
  )
}
