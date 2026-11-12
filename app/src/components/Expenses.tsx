import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Menu } from '@base-ui/react/menu'
import { ArrowRight, Ellipsis, Trash } from 'lucide-react'
import { ME, TODAY, personById, type Entry } from '../data'
import { inr, shares } from '../money'
import { CategoryIcon, Money, nameOrYou } from '../ui'

const LIST_MOTION = { duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }

const month = new Intl.DateTimeFormat('en-IN', { month: 'long' })
const shortDate = new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' })

/** Today / This week / the month name: a handful of groups, not one header per row. */
function groupOf(iso: string): string {
  if (iso === TODAY) return 'Today'
  const days = (new Date(TODAY + 'T00:00:00').getTime() - new Date(iso + 'T00:00:00').getTime()) / 86400000
  if (days < 7) return 'This week'
  return month.format(new Date(iso + 'T00:00:00'))
}

/** What this entry means for you, in words plus an amount. */
function position(e: Entry): { word: string; p: number | null; tone: 'in' | 'out' | 'none' } {
  if (e.kind === 'payment') {
    if (e.to === ME) return { word: 'you received', p: e.amount, tone: 'in' }
    if (e.from === ME) return { word: 'you paid back', p: e.amount, tone: 'out' }
    return { word: 'not involved', p: null, tone: 'none' }
  }
  const mine = shares(e.amount, e.split).get(ME) ?? 0
  if (e.paidBy === ME) return { word: 'you lent', p: e.amount - mine, tone: 'in' }
  if (mine) return { word: 'you owe', p: mine, tone: 'out' }
  return { word: 'not involved', p: null, tone: 'none' }
}

export function Expenses({ entries, onDelete }: { entries: Entry[]; onDelete: (id: string) => void }) {
  const [list] = useAutoAnimate<HTMLOListElement>(LIST_MOTION)
  // Newest day first; within a day, the most recently added first.
  const newest = entries
    .map((e, i) => ({ e, i }))
    .sort((a, b) => (a.e.date < b.e.date ? 1 : a.e.date > b.e.date ? -1 : b.i - a.i))
    .map(x => x.e)

  return (
    <section className="card expenses" aria-labelledby="exp-title">
      <div className="card__head">
        <h2 id="exp-title" className="card__title" tabIndex={-1}>Activity</h2>
        <p className="card__aside">Newest first</p>
      </div>
      {newest.length === 0 ? (
        <p className="empty">No expenses yet. Use Add expense to log the first one.</p>
      ) : (
        <ol ref={list} className="rows">
          {newest.map((e, i) => {
            const group = groupOf(e.date)
            const showDay = i === 0 || groupOf(newest[i - 1].date) !== group
            const pos = position(e)
            const title = e.kind === 'expense' ? e.title : `${nameOrYou(e.from, ME)} paid ${e.to === ME ? 'you' : personById(e.to).name}`
            const when = shortDate.format(new Date(e.date + 'T00:00:00'))
            // Short enough for one line on a phone; the split shows only when it is not the whole flat.
            const meta =
              e.kind === 'expense'
                ? <>{nameOrYou(e.paidBy, ME)} paid {inr(e.amount)}{e.split.length < 4 ? <> · {e.split.length} ways</> : ` on ${when}`}</>
                : `By UPI on ${when}`
            return [
              showDay && <li key={`g-${group}`} className="dayhead">{group}</li>,
              <li key={e.id} className="row">
                {e.kind === 'expense' ? (
                  <CategoryIcon id={e.category} />
                ) : (
                  <span className="cat cat--payment" aria-hidden><ArrowRight size={18} strokeWidth={1.75} /></span>
                )}
                <div className="row__text">
                  <p className="row__title">{title}</p>
                  <p className="row__meta">
                    {meta}
                  </p>
                </div>
                <div className="row__pos" data-tone={pos.tone}>
                  <span className="row__word">{pos.word}</span>
                  {pos.p !== null && <Money p={pos.p} className="row__amount" />}
                </div>
                <Menu.Root>
                  <Menu.Trigger className="iconbtn" aria-label={`More for ${title}`}>
                    <Ellipsis size={18} strokeWidth={1.75} aria-hidden />
                  </Menu.Trigger>
                  <Menu.Portal>
                    <Menu.Positioner sideOffset={6} align="end" className="menu-pos">
                      <Menu.Popup className="menu">
                        <Menu.Item className="menu__item menu__item--danger" onClick={() => onDelete(e.id)}>
                          <Trash size={16} strokeWidth={1.75} aria-hidden />
                          {e.kind === 'expense' ? 'Delete expense' : 'Delete payment'}
                        </Menu.Item>
                      </Menu.Popup>
                    </Menu.Positioner>
                  </Menu.Portal>
                </Menu.Root>
              </li>,
            ]
          })}
        </ol>
      )}
    </section>
  )
}
