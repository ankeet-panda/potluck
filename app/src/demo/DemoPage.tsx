import { useEffect, useLayoutEffect, useState } from 'react'
import './full-motion'
import { PhoneDemo } from './PhoneDemo'

/** A landing-hero setting for the demo: copy as page HTML beside one stage. */
export function DemoPage({ appHref = './' }: { appHref?: string }) {
  // Full motion whatever the OS asks, set before the stage reads the preference
  useLayoutEffect(() => {
    document.documentElement.dataset.motion = 'full'
    return () => { delete document.documentElement.dataset.motion }
  }, [])
  // Mount the demo once Figtree is in, so no text reflows under the first beat
  const [fonts, setFonts] = useState(false)
  useEffect(() => { document.fonts.ready.then(() => setFonts(true)) }, [])
  return (
    <main className="hero">
      <div className="hero__copy">
        <div className="hero__brand">Potluck</div>
        <h1 className="hero__title">Every flat bill, settled in a few UPI payments</h1>
        <p className="hero__lede">
          Log what you paid in a few taps. Potluck splits it, keeps everyone’s balance current and works out the
          fewest payments that clear the flat.
        </p>
        <a className="hero__action" href={appHref}>Open Flat 4B</a>
      </div>
      {fonts ? <PhoneDemo /> : <div className="pd-figure pd-figure--pending" aria-hidden />}
    </main>
  )
}
