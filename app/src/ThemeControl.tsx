import { useEffect, useState, type KeyboardEvent } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

type Choice = 'system' | 'light' | 'dark'
const OPTIONS: { id: Choice; label: string; Icon: typeof Sun }[] = [
  { id: 'system', label: 'Match device', Icon: Monitor },
  { id: 'light', label: 'Light', Icon: Sun },
  { id: 'dark', label: 'Dark', Icon: Moon },
]

const read = (): Choice => {
  // ?theme=light|dark shows one theme for this view only (shareable link); it is not saved
  const q = new URLSearchParams(location.search).get('theme')
  if (q === 'light' || q === 'dark') return q
  try { const v = localStorage.getItem('potluck-theme'); return v === 'light' || v === 'dark' ? v : 'system' } catch { return 'system' }
}

/** System / Light / Dark. The inline script in index.html applies the saved choice before first paint. */
export function ThemeControl() {
  const [choice, setChoice] = useState<Choice>(read)

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      document.documentElement.dataset.theme = choice === 'system' ? (mq.matches ? 'dark' : 'light') : choice
    }
    apply()
    const fromUrl = new URLSearchParams(location.search).has('theme')
    try { if (!fromUrl) { if (choice === 'system') localStorage.removeItem('potluck-theme'); else localStorage.setItem('potluck-theme', choice) } } catch { /* private mode */ }
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [choice])

  // Radio-group keys: arrows move and select.
  const onKey = (e: KeyboardEvent) => {
    const i = OPTIONS.findIndex(o => o.id === choice)
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const next = OPTIONS[(i + d + OPTIONS.length) % OPTIONS.length]
    setChoice(next.id)
    ;(e.currentTarget.querySelector(`[data-id='${next.id}']`) as HTMLElement | null)?.focus()
  }

  return (
    <div className="seg" role="radiogroup" aria-label="Theme" onKeyDown={onKey}>
      {OPTIONS.map(({ id, label, Icon }) => (
        <button
          key={id} type="button" role="radio" data-id={id} className="seg__opt"
          aria-checked={choice === id} aria-label={label}
          tabIndex={choice === id ? 0 : -1} onClick={() => setChoice(id)}
        >
          <Icon size={16} strokeWidth={1.75} aria-hidden />
        </button>
      ))}
    </div>
  )
}
