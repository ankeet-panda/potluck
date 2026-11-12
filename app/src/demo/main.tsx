import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/tokens.css'
import './demo.css'
import { DemoPage } from './DemoPage'

createRoot(document.getElementById('root')!).render(<StrictMode><DemoPage /></StrictMode>)
