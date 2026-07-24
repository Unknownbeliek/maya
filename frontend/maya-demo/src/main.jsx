import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AnalysisPage from './pages/AnalysisPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AnalysisPage />
  </StrictMode>,
)
