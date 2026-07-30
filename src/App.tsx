import { AnimatePresence } from "motion/react"
import { lazy, Suspense } from "react"
import { useSelector } from "react-redux"
import { Route, Routes, useLocation } from "react-router-dom"

import ProtectedLayout from "@/components/layout/dashboard-layout/protected-layout"
import { Layout } from "@/components/layout/layout"
import { Loading } from "@/components/ui/loading"
import { ROUTES } from "@/constants/routes"
import ScrollToTop from "@/helper/ScrollToTop"
import { getAccessibleRoutes } from "@/router/app-routes"
import type { RootState } from "@/store/store"


const Home = lazy(() => import("@/pages/home"))
const SignIn = lazy(() => import("@/pages/sign-in"))
const SignUp = lazy(() => import("@/pages/sign-up"))


function App() {
  const location = useLocation()
  const role = useSelector((state: RootState) => state.auth.user?.role)
  const dashboardRoutes = getAccessibleRoutes(role)

  return (
    <Suspense fallback={<Loading />}>
      <ScrollToTop />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route element={<Layout />}>
            <Route path={ROUTES.LANDING} element={<Home />} />
            <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
            <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
          </Route>

          <Route element={<ProtectedLayout />}>
            {dashboardRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={<route.element />} />
            ))}
          </Route>
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

export default App