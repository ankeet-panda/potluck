import { useEffect, useState } from 'react'
import { Stage } from '@kit/stage'
import type { Act } from '@kit/act'
import { Phone } from '@kit/phone'
import { Count } from '@kit/motion/Count'
import { Collapse } from '@kit/motion/Collapse'
import { Check, Plus } from 'lucide-react'
import { ME, PEOPLE, SEED, type Entry, type Expense, type PersonId } from '../data'
import { balances, inr, settlePlan, shares } from '../money'
import { categoryOf } from '../ui'

// The real product's data and money logic: the demo adds "Biryani night" to the flat
// as it was before that dinner, so every figure on screen is computed, not typed.
const BEFORE: Entry[] = SEED.filter(e => e.id !== 'e8')
const BIRYANI = SEED.find(e => e.id === 'e8') as Expense
// The rows under the new one, newest first, until the crop cuts them off
const RECENT = BEFORE.filter((e): e is Expense => e.kind === 'expense').reverse().slice(0, 8)

type S = { sheet: boolean; added: boolean; title: string; amount: string; paidBy: PersonId; naina: boolean }
const START: S = { sheet: false, added: false, title: '', amount: '', paidBy: ME, naina: true }
const END: S = { sheet: false, added: true, title: 'Biryani night', amount: '1437', paidBy: 'kabir', naina: false }

const REST = { x: 500, y: 460 }

const script = async (a: Act<S>) => {
  // Hold the before state (₹25,855; Kabir ₹12,381) long enough to read
  await a.wait(1600)
  a.mark('open')
  await a.click('add')
  a.put({ sheet: true })
  await a.wait(750)
  a.mark('type')
  await a.click('title')
  await a.type('title', 'Biryani night')
  await a.wait(250)
  await a.click('amount')
  await a.type('amount', '1437', { interval: 70 })
  await a.wait(350)
  a.mark('split')
  await a.click('paid-kabir')
  a.put({ paidBy: 'kabir' })
  await a.wait(450)
  await a.click('split-naina')
  a.put({ naina: false })
  await a.wait(1100)
  a.mark('save')
  await a.click('save')
  a.put({ sheet: false, added: true })
  await a.wait(500)
  a.mark('payoff')
  await a.move(REST)
  await a.wait(2200)
}

const inrN = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 })
const grouped = (digits: string) => (digits ? Number(digits).toLocaleString('en-IN') : '')

const NAMES: Record<PersonId, string> = { ishaan: 'You', tara: 'Tara', kabir: 'Kabir', naina: 'Naina' }

function Avatar({ id }: { id: PersonId }) {
  return <span className="pd-avatar" data-person={id}>{PEOPLE.find(p => p.id === id)!.name[0]}</span>
}

function Row({ e }: { e: Expense }) {
  const { Icon } = categoryOf(e.category)
  const mine = shares(e.amount, e.split).get(ME) ?? 0
  const lent = e.paidBy === ME
  const payer = e.paidBy === ME ? 'You' : PEOPLE.find(p => p.id === e.paidBy)!.name
  return (
    <div className="pd-row">
      <span className="pd-cat"><Icon size={16} strokeWidth={1.75} aria-hidden /></span>
      <div className="pd-row__text">
        <div className="pd-strong">{e.title}</div>
        <div className="pd-faint">{payer} paid {inr(e.amount)}{e.split.length < 4 ? ` · ${e.split.length} ways` : ''}</div>
      </div>
      <div className="pd-row__pos">
        <span className="pd-word">{lent ? 'you lent' : 'you owe'}</span>
        <span className={`pd-strong${lent ? ' pd-in' : ''}`}>{inr(lent ? e.amount - mine : mine)}</span>
      </div>
    </div>
  )
}

function Screen({ s }: { s: S }) {
  const entries = s.added ? [...BEFORE, BIRYANI] : BEFORE
  const net = balances(entries)
  const kabir = settlePlan(net).find(t => t.from === 'kabir' && t.to === ME)
  const split: PersonId[] = s.naina ? ['ishaan', 'tara', 'kabir', 'naina'] : ['ishaan', 'tara', 'kabir']
  const paise = Number(s.amount || 0) * 100
  const each = paise ? shares(paise, split).get(split[split.length - 1])! / 100 : 0

  return (
    <div className="pd-screen">
      <div className="pd-head">
        <div>
          <div className="pd-title">Flat 4B</div>
          <div className="pd-sub">4 flatmates</div>
        </div>
        <span className="pd-add" data-target="add"><Plus size={16} strokeWidth={2.25} aria-hidden />Add</span>
      </div>

      <div className="pd-balance">
        <div className="pd-balance__label">You get back</div>
        <Count className="pd-balance__figure" value={net.get(ME)! / 100} format={inrN} />
        <div className="pd-balance__why">Kabir, Tara and Naina owe you.</div>
        {/* The same paper chit as the product, cut against the wine */}
        <div className="pd-chit-wrap">
          <div className="pd-chit">
            <div className="pd-chit__body">
              <Avatar id="kabir" />
              <div>
                <div className="pd-strong">Kabir pays you</div>
                <div className="pd-chit__sub">to your UPI ID</div>
              </div>
            </div>
            <div className="pd-chit__stub">
              <div className="pd-chit__amount"><Count value={(kabir?.amount ?? 0) / 100} format={inrN} /></div>
              <span className="pd-chit__action">Mark received</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pd-section">Activity</div>
      <Collapse open={s.added} reveal="drop">
        <Row e={BIRYANI} />
      </Collapse>
      {RECENT.map(e => <Row key={e.id} e={e} />)}

      {/* The add sheet: iOS-style large sheet; its actions sit in the top bar so the crop never cuts them */}
      <div className="pd-scrim" data-on={s.sheet || undefined} />
      <div className="pd-sheet" data-on={s.sheet || undefined}>
        <div className="pd-sheet__bar">
          <span className="pd-cancel">Cancel</span>
          <span className="pd-strong">New expense</span>
          <span className="pd-save" data-target="save">Save</span>
        </div>
        <div className="pd-field" data-target="title">
          <span className="pd-label">What for</span>
          <span className="pd-input">{s.title || <span className="pd-placeholder">Weekly groceries</span>}{s.sheet && s.title.length > 0 && s.title.length < 13 && <span className="pd-caret" />}</span>
        </div>
        <div className="pd-field" data-target="amount">
          <span className="pd-label">Amount</span>
          <span className="pd-amount">₹{grouped(s.amount) || <span className="pd-placeholder">0</span>}</span>
        </div>
        <div className="pd-label pd-label--group">Paid by</div>
        <div className="pd-chips">
          {(['ishaan', 'kabir'] as PersonId[]).map(id => (
            <span key={id} className="pd-chip" data-on={s.paidBy === id || undefined} data-target={`paid-${id}`}>
              <Avatar id={id} />{NAMES[id]}<Check className="pd-tick" size={14} strokeWidth={2.25} aria-hidden />
            </span>
          ))}
        </div>
        <div className="pd-label pd-label--group">Split between</div>
        <div className="pd-chips">
          {(['ishaan', 'tara', 'kabir', 'naina'] as PersonId[]).map(id => (
            <span key={id} className="pd-chip" data-on={(id !== 'naina' || s.naina) || undefined} data-target={`split-${id}`}>
              <Avatar id={id} />{NAMES[id]}<Check className="pd-tick" size={14} strokeWidth={2.25} aria-hidden />
            </span>
          ))}
        </div>
        {/* The split appears whole at its beat, in whole values that add up; no digits roll through a sentence */}
        <div className="pd-preview">
          <span className="pd-swap">
            <span data-on={s.naina || undefined}>Split equally between the people you pick</span>
            <span data-on={!s.naina || undefined}>{inrN(each)} each, {split.length} people</span>
          </span>
        </div>
        <Collapse open={!s.naina} reveal="drop">
          <div className="pd-split">
            {split.map(id => (
              <div key={id} className="pd-split__row">
                <Avatar id={id} /><span>{NAMES[id]}</span><span className="pd-strong">{inrN(shares(paise, split).get(id)! / 100)}</span>
              </div>
            ))}
            <div className="pd-split__total"><span>Adds up to</span><span className="pd-strong">{inrN(paise / 100)}</span></div>
          </div>
        </Collapse>
      </div>
    </div>
  )
}

/** The self-playing demo. Plays once in view; Pause shows the finished still; Replay remounts it. */
export function PhoneDemo() {
  const [paused, setPaused] = useState(false)
  const [run, setRun] = useState(0)
  const [dark, setDark] = useState(() => document.documentElement.dataset.theme === 'dark')

  useEffect(() => {
    const o = new MutationObserver(() => setDark(document.documentElement.dataset.theme === 'dark'))
    o.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => o.disconnect()
  }, [])

  return (
    <figure className="pd-figure">
      <Stage<S>
        key={`${run}-${paused}`}
        width={560}
        height={700}
        compact={{ below: 560, width: 358, height: 620 }}
        initial={START}
        poster={END}
        play="once"
        script={paused ? undefined : script}
        cursor={{ at: REST, style: 'touch' }}
        className="pd"
      >
        {(s, _rect, layout) => (
          <Phone width={layout === 'compact' ? 440 : 400} className="pd-phone" dark={dark} wallpaper="var(--bg)">
            <Screen s={s} />
          </Phone>
        )}
      </Stage>
      <figcaption className="pd-controls">
        <button type="button" className="pd-btn" onClick={() => setPaused(p => !p)} aria-pressed={paused}>
          {paused ? 'Play demo' : 'Pause demo'}
        </button>
        <button type="button" className="pd-btn" onClick={() => { setPaused(false); setRun(n => n + 1) }}>Replay</button>
        <span className="pd-note">Sample data in a product concept</span>
      </figcaption>
    </figure>
  )
}
