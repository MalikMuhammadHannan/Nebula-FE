import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import type { AppDispatch, RootState } from "@/store/store"
import {
  setTheme as setThemeAction,
  toggleTheme as toggleThemeAction,
  type Theme,
} from "@/store/reducers/themeReducer.slice"

export type { Theme }

export function useTheme() {
  const theme = useSelector((state: RootState) => state.theme.theme)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return {
    theme,
    setTheme: (theme: Theme) => dispatch(setThemeAction(theme)),
    toggleTheme: () => dispatch(toggleThemeAction()),
  }
}
