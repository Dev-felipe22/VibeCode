import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext'  // ← added

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>   {/* ← wrap App so login state is available */}
      <App />
    </AuthProvider>
  </StrictMode>,
)
