// Sample data for the prototype. Invented people; amounts in paise so every split adds up exactly.

export type PersonId = 'ishaan' | 'tara' | 'kabir' | 'naina'

export type Person = { id: PersonId; name: string; upi: string }

export const ME: PersonId = 'ishaan'

export const PEOPLE: Person[] = [
  { id: 'ishaan', name: 'Ishaan', upi: 'ishaan.r@exampleupi' },
  { id: 'tara', name: 'Tara', upi: 'tara.s@exampleupi' },
  { id: 'kabir', name: 'Kabir', upi: 'kabir.m@exampleupi' },
  { id: 'naina', name: 'Naina', upi: 'naina.k@exampleupi' },
]

export const personById = (id: PersonId) => PEOPLE.find(p => p.id === id)!

export type Category = 'rent' | 'groceries' | 'power' | 'internet' | 'food' | 'gas' | 'cook' | 'other'

export type Expense = {
  kind: 'expense'
  id: string
  title: string
  category: Category
  amount: number // paise
  paidBy: PersonId
  split: PersonId[] // shared equally
  date: string // ISO day
}

export type Payment = {
  kind: 'payment'
  id: string
  from: PersonId
  to: PersonId
  amount: number // paise
  date: string
}

export type Entry = Expense | Payment

const ALL: PersonId[] = ['ishaan', 'tara', 'kabir', 'naina']
const rs = (rupees: number) => Math.round(rupees * 100)

export const TODAY = '2026-11-03'

// Oldest first; the screen shows newest first.
export const SEED: Entry[] = [
  { kind: 'expense', id: 'e1', title: 'Rent, October', category: 'rent', amount: rs(48000), paidBy: 'ishaan', split: ALL, date: '2026-10-01' },
  { kind: 'expense', id: 'e2', title: 'Cook, October', category: 'cook', amount: rs(6000), paidBy: 'naina', split: ALL, date: '2026-10-03' },
  { kind: 'expense', id: 'e3', title: 'Electricity, September bill', category: 'power', amount: rs(2860), paidBy: 'kabir', split: ALL, date: '2026-10-09' },
  { kind: 'expense', id: 'e4', title: 'Wi-Fi, October', category: 'internet', amount: rs(1180), paidBy: 'naina', split: ALL, date: '2026-10-12' },
  { kind: 'expense', id: 'e5', title: 'Weekly groceries', category: 'groceries', amount: rs(3184), paidBy: 'tara', split: ALL, date: '2026-10-18' },
  { kind: 'expense', id: 'e6', title: 'Gas cylinder', category: 'gas', amount: rs(904), paidBy: 'kabir', split: ALL, date: '2026-10-24' },
  { kind: 'payment', id: 'p1', from: 'naina', to: 'ishaan', amount: rs(6000), date: '2026-10-27' },
  { kind: 'expense', id: 'e7', title: 'Diwali sweets and diyas', category: 'groceries', amount: rs(2240), paidBy: 'tara', split: ALL, date: '2026-10-30' },
  { kind: 'expense', id: 'e8', title: 'Biryani night', category: 'food', amount: rs(1437), paidBy: 'kabir', split: ['ishaan', 'tara', 'kabir'], date: '2026-11-02' },
  { kind: 'expense', id: 'e9', title: 'Milk and bread', category: 'groceries', amount: rs(212), paidBy: 'tara', split: ALL, date: '2026-11-03' },
]
