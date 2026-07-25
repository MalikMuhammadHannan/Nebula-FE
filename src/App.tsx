import { AnimatePresence } from "motion/react"
import { lazy, Suspense } from "react"
import { Route, Routes, useLocation } from "react-router-dom"

import { Layout } from "@/components/layout/layout"
import { Loading } from "./components/ui/loading"
import { ROUTES } from "./constants/routes"


const Home = lazy(() => import("@/pages/home"))
const SignIn = lazy(() => import("@/pages/sign-in"))
const SignUp = lazy(() => import("@/pages/sign-up"))


function App() {
  const location = useLocation()

  return (
    <Layout>
      <Suspense fallback={<Loading />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path={ROUTES.LANDING} element={<Home />} />
            <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
            <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </Layout >
  )
}

export default App