import { useMemo, useState } from 'react'
import { Eye, EyeOff, Plus } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { ME, PEOPLE, SEED, TODAY, personById, type Entry, type Expense } from './data'
import { balances, inr, settlePlan, type Transfer } from './money'
import { Avatar, HiddenContext } from './ui'
import { BalanceCard } from './components/BalanceCard'
import { Spending } from './components/Spending'
import { Expenses } from './components/Expenses'
import { AddExpense } from './components/AddExpense'
import { ThemeControl } from './ThemeControl'

let nextId = 100

export function App() {
  const [entries, setEntries] = useState<Entry[]>(SEED)
  const [hidden, setHidden] = useState(false)
  const [adding, setAdding] = useState(false)

  const net = useMemo(() => balances(entries), [entries])
  const plan = useMemo(() => settlePlan(net), [net])
  const expenses = entries.filter((e): e is Expense => e.kind === 'expense')

  // Keep focus somewhere sensible when the thing that had it leaves the page.
  const focusHeading = (id: string) => setTimeout(() => document.getElementById(id)?.focus(), 0)

  function add(e: Omit<Expense, 'id' | 'kind'>) {
    setEntries(list => [...list, { ...e, kind: 'expense', id: `e${nextId++}` }])
  }

  // Each undo reverses only its own change, so later edits survive it.
  function remove(id: string) {
    const index = entries.findIndex(e => e.id === id)
    const gone = entries[index]
    setEntries(list => list.filter(e => e.id !== id))
    focusHeading('exp-title')
    const what = gone.kind === 'expense' ? `“${gone.title}”` : `${personById(gone.from).name}’s payment`
    const undo = () => setEntries(list => (list.some(e => e.id === id) ? list : [...list.slice(0, index), gone, ...list.slice(index)]))
    toast(`Deleted ${what}`, { action: { label: 'Undo', onClick: undo }, duration: 8000 })
  }

  function settle(t: Transfer) {
    const id = `p${nextId++}`
    setEntries(list => [...list, { kind: 'payment', id, from: t.from, to: t.to, amount: t.amount, date: TODAY }])
    focusHeading('settle-title')
    const from = personById(t.from).name
    const msg = t.to === ME ? `Marked ${inr(t.amount)} from ${from} as received` : `Marked ${from}’s ${inr(t.amount)} to ${personById(t.to).name} as paid`
    const undo = () => setEntries(list => list.filter(e => e.id !== id))
    toast(msg, { action: { label: 'Undo', onClick: undo }, duration: 8000 })
  }

  return (
    <HiddenContext.Provider value={hidden}>
      <header className="topbar">
        <div className="topbar__inner">
          <div className="wordmark">Potluck</div>
          <div className="topbar__tools">
            <button type="button" className="btn btn--ghost" aria-pressed={hidden} onClick={() => setHidden(h => !h)} aria-label={hidden ? 'Show amounts' : 'Hide amounts'}>
              {hidden ? <Eye size={16} strokeWidth={1.75} aria-hidden /> : <EyeOff size={16} strokeWidth={1.75} aria-hidden />}
              <span className="btn__label">{hidden ? 'Show amounts' : 'Hide amounts'}</span>
            </button>
            <ThemeControl />
          </div>
        </div>
      </header>

      <main className="page">
        <div className="pagehead">
          <h1>Flat 4B</h1>
          <button type="button" className="btn btn--primary pagehead__action" onClick={() => setAdding(true)}>
            <Plus size={18} strokeWidth={2} aria-hidden />
            Add expense
          </button>
          <div className="pagehead__meta">
            <span className="facepile" aria-hidden>
              {PEOPLE.map(p => <Avatar key={p.id} id={p.id} size="sm" />)}
            </span>
            <span>{PEOPLE.length} flatmates · {expenses.length} expenses since 1 Oct</span>
          </div>
        </div>

        <div className="layout">
          <div className="layout__main">
            <BalanceCard net={net.get(ME)!} plan={plan} entries={entries} onSettle={settle} />
            <Spending expenses={expenses} />
          </div>
          <Expenses entries={entries} onDelete={remove} />
        </div>
      </main>

      <AddExpense open={adding} onOpenChange={setAdding} onAdd={add} />
      <Toaster position="bottom-right" toastOptions={{ className: 'toast' }} />
    </HiddenContext.Provider>
  )
}
