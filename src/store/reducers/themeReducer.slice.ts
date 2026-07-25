import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type Theme = "light" | "dark"

interface ThemeState {
  theme: Theme
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

const initialState: ThemeState = {
  theme: getSystemTheme(),
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark"
    },
  },
})

export const { setTheme, toggleTheme } = themeSlice.actions
export default themeSlice.reducer
