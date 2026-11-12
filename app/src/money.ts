import { PEOPLE, type Entry, type PersonId } from './data'

/** Equal split in paise; the first people in the list absorb the remainder, one paisa each. */
export function shares(amount: number, split: PersonId[]): Map<PersonId, number> {
  const base = Math.floor(amount / split.length)
  let rest = amount - base * split.length
  const out = new Map<PersonId, number>()
  for (const id of split) {
    out.set(id, base + (rest > 0 ? 1 : 0))
    if (rest > 0) rest--
  }
  return out
}

/** Net per person: positive = gets back, negative = owes. Sums to zero. */
export function balances(entries: Entry[]): Map<PersonId, number> {
  const net = new Map<PersonId, number>(PEOPLE.map(p => [p.id, 0]))
  for (const e of entries) {
    if (e.kind === 'expense') {
      net.set(e.paidBy, net.get(e.paidBy)! + e.amount)
      for (const [id, s] of shares(e.amount, e.split)) net.set(id, net.get(id)! - s)
    } else {
      net.set(e.from, net.get(e.from)! + e.amount)
      net.set(e.to, net.get(e.to)! - e.amount)
    }
  }
  return net
}

export type Transfer = { from: PersonId; to: PersonId; amount: number }

/** Fewest payments: repeatedly match the largest debtor with the largest creditor. */
export function settlePlan(net: Map<PersonId, number>): Transfer[] {
  const owe = [...net].filter(([, v]) => v < 0).map(([id, v]) => ({ id, v: -v }))
  const get = [...net].filter(([, v]) => v > 0).map(([id, v]) => ({ id, v }))
  const plan: Transfer[] = []
  while (owe.length && get.length) {
    owe.sort((a, b) => b.v - a.v)
    get.sort((a, b) => b.v - a.v)
    const d = owe[0], c = get[0]
    const amount = Math.min(d.v, c.v)
    plan.push({ from: d.id, to: c.id, amount })
    d.v -= amount
    c.v -= amount
    if (d.v === 0) owe.shift()
    if (c.v === 0) get.shift()
  }
  return plan
}

const whole = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 })
const paise = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** ₹ with Indian grouping; paise shown only when there are any. Never signed: words carry direction. */
export function inr(p: number): string {
  const v = Math.abs(p)
  return '₹' + (v % 100 === 0 ? whole.format(v / 100) : paise.format(v / 100))
}

export function hasPaise(p: number) {
  return Math.abs(p) % 100 !== 0
}
