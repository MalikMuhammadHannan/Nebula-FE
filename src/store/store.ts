import { api } from "@/service/api"
import authReducer from "@/store/reducers/authReducer.slice"
import themeReducer from "@/store/reducers/themeReducer.slice"
import storage from "@/store/storage"
import { combineReducers, configureStore } from "@reduxjs/toolkit"
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from "redux-persist"

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  [api.reducerPath]: api.reducer,
})

const persistConfig = {
  key: "blog-theme",
  storage,
  whitelist: ["theme", "auth"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
      },
    }).concat(api.middleware),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
