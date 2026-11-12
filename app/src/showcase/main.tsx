import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/tokens.css'
import '../styles/app.css'
import '../demo/demo.css'
import './showcase.css'
import { App } from '../App'
import { DemoPage } from '../demo/DemoPage'

type View = 'app' | 'demo'
const fromHash = (): View => (location.hash === '#demo' ? 'demo' : 'app')

/** One page for sharing: the clickable screen and the self-playing demo, switched by #app / #demo. */
function Showcase() {
  const [view, setView] = useState<View>(fromHash)
  useEffect(() => {
    const on = () => { setView(fromHash()); scrollTo(0, 0) }
    addEventListener('hashchange', on)
    return () => removeEventListener('hashchange', on)
  }, [])

  return (
    <>
      <nav className="showcase" aria-label="Potluck concept">
        <span className="showcase__name">Potluck concept</span>
        <span className="showcase__views">
          <a href="#app" aria-current={view === 'app' ? 'page' : undefined}>Clickable app</a>
          <a href="#demo" aria-current={view === 'demo' ? 'page' : undefined}>Product demo</a>
        </span>
      </nav>
      {view === 'app' ? <App /> : <DemoPage appHref="#app" />}
    </>
  )
}

createRoot(document.getElementById('root')!).render(<StrictMode><Showcase /></StrictMode>)
