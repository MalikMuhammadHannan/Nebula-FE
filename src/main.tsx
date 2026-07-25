import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import './index.css'
import App from './App.tsx'
import { persistor, store } from './store/store'
import { Toaster } from "sonner"


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Toaster
            position="top-center"
            duration={3000}
            richColors
            theme="light"
            toastOptions={{
              classNames: {
                success: "bg-green-500 text-white",
                error: "bg-red-500 text-white",
                info: "bg-orange-500 text-white",
                warning: "bg-yellow-500 text-white",
                loading: "bg-gray-500 text-white",
                default: "bg-gray-500 text-white",
                description: "text-muted-foreground",
              },
            }}
          />
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
