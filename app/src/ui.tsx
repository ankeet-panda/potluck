import { createContext, useContext, type ComponentType } from 'react'
import { ChefHat, Flame, House, Receipt, ShoppingBasket, UtensilsCrossed, Wifi, Zap, type LucideProps } from 'lucide-react'
import NumberFlow from '@number-flow/react'
import { personById, type Category, type PersonId } from './data'
import { inr } from './money'

export const HiddenContext = createContext(false)

export const CATEGORIES: { id: Category; label: string; Icon: ComponentType<LucideProps> }[] = [
  { id: 'groceries', label: 'Groceries', Icon: ShoppingBasket },
  { id: 'food', label: 'Eating out', Icon: UtensilsCrossed },
  { id: 'rent', label: 'Rent', Icon: House },
  { id: 'power', label: 'Electricity', Icon: Zap },
  { id: 'internet', label: 'Internet', Icon: Wifi },
  { id: 'gas', label: 'Gas', Icon: Flame },
  { id: 'cook', label: 'Cook', Icon: ChefHat },
  { id: 'other', label: 'Other', Icon: Receipt },
]

export const categoryOf = (id: Category) => CATEGORIES.find(c => c.id === id)!

export function CategoryIcon({ id, size = 18 }: { id: Category; size?: number }) {
  const { Icon } = categoryOf(id)
  return (
    <span className="cat" aria-hidden>
      <Icon size={size} strokeWidth={1.75} />
    </span>
  )
}

export function Avatar({ id, size = 'md' }: { id: PersonId; size?: 'sm' | 'md' | 'lg' }) {
  const p = personById(id)
  return (
    <span className={`avatar avatar--${size}`} data-person={id} aria-hidden>
      {p.name[0]}
    </span>
  )
}

const MASK = '₹••••'

/** A static amount. Masked when amounts are hidden; the layout keeps a fixed-length mask. */
export function Money({ p, className }: { p: number; className?: string }) {
  const hidden = useContext(HiddenContext)
  return <span className={`num ${className ?? ''}`}>{hidden ? MASK : inr(p)}</span>
}

/** An amount that rolls its changed digits (Number Flow). Off under reduced motion by default. */
export function FlowMoney({ p, className }: { p: number; className?: string }) {
  const hidden = useContext(HiddenContext)
  if (hidden) return <span className={`num ${className ?? ''}`}>{MASK}</span>
  const v = Math.abs(p) / 100
  // The real figure as text for screen readers; the rolling digits are visual only.
  return (
    <span className={className}>
      <span className="sr-only">{inr(p)}</span>
      <span aria-hidden>
        <NumberFlow
          className="num"
          value={v}
          locales="en-IN"
          prefix="₹"
          format={{ minimumFractionDigits: v % 1 ? 2 : 0, maximumFractionDigits: 2 }}
        />
      </span>
    </span>
  )
}

export const nameOrYou = (id: PersonId, me: PersonId) => (id === me ? 'You' : personById(id).name)

/** "Kabir, Tara and Naina" */
export function listNames(names: string[]) {
  if (names.length <= 1) return names[0] ?? ''
  return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]
}
