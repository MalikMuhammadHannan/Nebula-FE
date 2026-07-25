import { AnimatePresence } from "motion/react"
import { Route, Routes, useLocation } from "react-router-dom"

import { Layout } from "@/components/layout/layout"
import { ROUTES } from "@/constants/routes"
import { Home } from "@/pages/home"
import { SignIn } from "@/pages/sign-in"
import { SignUp } from "@/pages/sign-up"

function App() {
  const location = useLocation()

  return (
    <Layout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path={ROUTES.LANDING} element={<Home />} />
          <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
          <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
        </Routes>
      </AnimatePresence>
    </Layout>
  )
}

export default App
