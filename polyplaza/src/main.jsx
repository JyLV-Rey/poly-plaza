import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'   // import router
import './index.css'
import App from './App.jsx'
import { UserProvider } from './Pages/UserContext'
import ScrollToTop from './GlobalFeatures/ScrollToTop.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ScrollToTop/>
          <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>,
)
