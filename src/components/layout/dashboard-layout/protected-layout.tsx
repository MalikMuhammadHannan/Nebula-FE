import { Suspense, useState } from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation } from "react-router-dom"

import Header from "@/components/layout/dashboard-layout/header"
import SideBar from "@/components/layout/dashboard-layout/side-bar"
import { PageTransition } from "@/components/layout/page-transition"
import { Loading } from "@/components/ui/loading"
import { ROUTES } from "@/constants/routes"
import type { RootState } from "@/store/store"


const ProtectedLayout = () => {
    const location = useLocation()
    const token = useSelector((state: RootState) => state.auth.token)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    if (!token) {
        return <Navigate to={ROUTES.SIGN_IN} state={{ from: location }} replace />
    }

    return (
        <div className="flex min-h-svh bg-background text-foreground">
            <SideBar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-x-hidden p-4 sm:p-6">
                    <Suspense fallback={<Loading />}>
                        <PageTransition key={location.pathname}>
                            <Outlet />
                        </PageTransition>
                    </Suspense>
                </main>
            </div>
        </div>
    )
}

export default ProtectedLayout
