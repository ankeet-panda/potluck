import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { Check, CircleAlert, X } from 'lucide-react'
import { ME, PEOPLE, TODAY, type Category, type Expense, type PersonId } from '../data'
import { inr, shares } from '../money'
import { Avatar, CATEGORIES, FlowMoney } from '../ui'

type Draft = { title: string; amount: string; paidBy: PersonId; split: PersonId[]; category: Category; date: string }
type Errors = Partial<Record<'title' | 'amount' | 'split', string>>

const EMPTY: Draft = { title: '', amount: '', paidBy: ME, split: PEOPLE.map(p => p.id), category: 'groceries', date: TODAY }

/** "1,436.50" → 143650 paise; null when not a positive amount with at most 2 decimals. */
function parsePaise(s: string): number | null {
  const t = s.replace(/[,\s₹]/g, '')
  if (!/^\d+(\.\d{1,2})?$/.test(t)) return null
  const p = Math.round(parseFloat(t) * 100)
  return p > 0 ? p : null
}

function check(d: Draft): Errors {
  const e: Errors = {}
  if (!d.title.trim()) e.title = 'Add what it was for, like “Weekly groceries”.'
  if (parsePaise(d.amount) === null) e.amount = d.amount.trim() ? 'Enter an amount like 1,436 or 1,436.50.' : 'Enter the amount paid.'
  if (d.split.length === 0) e.split = 'Pick at least one person to share it.'
  return e
}

export function AddExpense({ open, onOpenChange, onAdd }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (e: Omit<Expense, 'id' | 'kind'>) => void
}) {
  const [d, setD] = useState<Draft>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)
  const id = useId()

  useEffect(() => {
    if (open) { setD(EMPTY); setErrors({}); setConfirmDiscard(false) }
  }, [open])

  const dirty = d.title !== EMPTY.title || d.amount !== EMPTY.amount
  const paise = parsePaise(d.amount)
  const each = paise && d.split.length ? shares(paise, d.split).get(d.split[d.split.length - 1])! : null

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setD(x => ({ ...x, [k]: v }))
    // An error clears as soon as the field is fixed.
    if (errors[k as keyof Errors]) {
      const next = check({ ...d, [k]: v })
      setErrors(er => ({ ...er, [k]: next[k as keyof Errors] }))
    }
  }

  // A non-empty field is checked when the user leaves it; an empty one never is.
  const blur = (k: 'title' | 'amount') => {
    if (!d[k].trim()) return
    setErrors(er => ({ ...er, [k]: check(d)[k] }))
  }

  function submit(ev: FormEvent) {
    ev.preventDefault()
    const e = check(d)
    setErrors(e)
    if (Object.keys(e).length) {
      requestAnimationFrame(() => summaryRef.current?.focus())
      return
    }
    onAdd({ title: d.title.trim(), amount: paise!, paidBy: d.paidBy, split: PEOPLE.map(p => p.id).filter(p => d.split.includes(p)), category: d.category, date: d.date })
    onOpenChange(false)
  }

  function requestClose(next: boolean) {
    if (!next && dirty && !confirmDiscard) { setConfirmDiscard(true); return }
    onOpenChange(next)
  }

  const errList = Object.entries(errors).filter(([, v]) => v) as [keyof Errors, string][]
  const fieldId = (k: string) => `${id}-${k}`

  return (
    <Dialog.Root open={open} onOpenChange={requestClose}>
      <Dialog.Portal>
        <Dialog.Backdrop className="backdrop" />
        <Dialog.Popup className="dialog" initialFocus={titleRef}>
          <div className="dialog__head">
            <Dialog.Title className="dialog__title">Add an expense</Dialog.Title>
            <Dialog.Close className="iconbtn" aria-label="Close">
              <X size={18} strokeWidth={1.75} aria-hidden />
            </Dialog.Close>
          </div>
          <Dialog.Description className="dialog__desc">Split equally between the people you pick. Balances update straight away.</Dialog.Description>

          <form noValidate onSubmit={submit} className="form">
            {errList.length > 0 && (
              <div ref={summaryRef} tabIndex={-1} role="alert" className="errsum">
                <CircleAlert size={18} strokeWidth={1.75} aria-hidden />
                <div>
                  <p className="errsum__title">{errList.length === 1 ? 'One thing to fix' : `${errList.length} things to fix`}</p>
                  <ul>
                    {errList.map(([k, msg]) => (
                      <li key={k}><a href={`#${fieldId(k)}`}>{msg}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="field">
              <label htmlFor={fieldId('title')} className="field__label">What was it for?</label>
              <input
                ref={titleRef} id={fieldId('title')} name="title" type="text" autoComplete="off" required
                className="input" value={d.title} maxLength={60}
                aria-invalid={!!errors.title} aria-describedby={errors.title ? fieldId('title-err') : undefined}
                onChange={e => set('title', e.target.value)} onBlur={() => blur('title')}
              />
              {errors.title && <p id={fieldId('title-err')} className="field__err"><CircleAlert size={14} aria-hidden />{errors.title}</p>}
            </div>

            <div className="form__pair">
              <div className="field">
                <label htmlFor={fieldId('amount')} className="field__label">Amount</label>
                <div className="input input--money" data-invalid={!!errors.amount || undefined}>
                  <span aria-hidden>₹</span>
                  <input
                    id={fieldId('amount')} name="amount" type="text" inputMode="decimal" autoComplete="off" required
                    value={d.amount}
                    aria-invalid={!!errors.amount} aria-describedby={errors.amount ? fieldId('amount-err') : fieldId('amount-hint')}
                    onChange={e => set('amount', e.target.value)} onBlur={() => blur('amount')}
                  />
                </div>
                {errors.amount
                  ? <p id={fieldId('amount-err')} className="field__err"><CircleAlert size={14} aria-hidden />{errors.amount}</p>
                  : <p id={fieldId('amount-hint')} className="field__hint">In rupees. Paise are fine.</p>}
              </div>
              <div className="field">
                <label htmlFor={fieldId('date')} className="field__label">Date</label>
                <input id={fieldId('date')} name="date" type="date" className="input" value={d.date} max={TODAY} required
                  onChange={e => set('date', e.target.value || TODAY)} />
              </div>
            </div>

            <fieldset className="field">
              <legend className="field__label">Paid by</legend>
              <div className="choices">
                {PEOPLE.map(p => (
                  <label key={p.id} className="choice" data-person={p.id}>
                    <input type="radio" name="paidBy" value={p.id} checked={d.paidBy === p.id} onChange={() => set('paidBy', p.id)} />
                    <Avatar id={p.id} size="sm" />
                    {p.id === ME ? 'You' : p.name}
                    <Check className="choice__tick" size={14} strokeWidth={2.25} aria-hidden />
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="field" aria-describedby={errors.split ? fieldId('split-err') : undefined}>
              <legend className="field__label" id={fieldId('split')}>Split between</legend>
              <div className="choices">
                {PEOPLE.map(p => (
                  <label key={p.id} className="choice" data-person={p.id}>
                    <input
                      type="checkbox" name="split" value={p.id} checked={d.split.includes(p.id)}
                      onChange={e => set('split', e.target.checked ? [...d.split, p.id] : d.split.filter(x => x !== p.id))}
                    />
                    <Avatar id={p.id} size="sm" />
                    {p.id === ME ? 'You' : p.name}
                    <Check className="choice__tick" size={14} strokeWidth={2.25} aria-hidden />
                  </label>
                ))}
              </div>
              {errors.split
                ? <p id={fieldId('split-err')} className="field__err"><CircleAlert size={14} aria-hidden />{errors.split}</p>
                : <p className="field__hint split-preview" aria-live="polite">
                    {each !== null
                      ? <>{paise! % d.split.length ? 'About ' : ''}<FlowMoney p={each} /> each, shared by {d.split.length} {d.split.length === 1 ? 'person' : 'people'}</>
                      : `Shared by ${d.split.length} ${d.split.length === 1 ? 'person' : 'people'}`}
                  </p>}
            </fieldset>

            <fieldset className="field">
              <legend className="field__label">Category</legend>
              <div className="choices choices--cats">
                {CATEGORIES.map(({ id: c, label, Icon }) => (
                  <label key={c} className="choice choice--cat">
                    <input type="radio" name="category" value={c} checked={d.category === c} onChange={() => set('category', c)} />
                    <Icon size={16} strokeWidth={1.75} aria-hidden />
                    {label}
                    <Check className="choice__tick" size={14} strokeWidth={2.25} aria-hidden />
                  </label>
                ))}
              </div>
            </fieldset>

            {confirmDiscard ? (
              <div className="discard" role="alert">
                <p>Discard this expense? What you typed will be lost.</p>
                <div className="dialog__actions">
                  <button type="button" className="btn btn--secondary" onClick={() => setConfirmDiscard(false)}>Keep editing</button>
                  <button type="button" className="btn btn--danger" onClick={() => onOpenChange(false)}>Discard expense</button>
                </div>
              </div>
            ) : (
              <div className="dialog__actions">
                <button type="button" className="btn btn--secondary" onClick={() => requestClose(false)}>Cancel</button>
                <button type="submit" className="btn btn--primary">
                  {paise ? `Add ${inr(paise)}` : 'Add expense'}
                </button>
              </div>
            )}
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
