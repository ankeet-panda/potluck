import type { Category, Expense } from '../data'
import { CategoryIcon, Money, categoryOf } from '../ui'

export function Spending({ expenses }: { expenses: Expense[] }) {
  const byCat = new Map<Category, number>()
  let total = 0
  for (const e of expenses) {
    byCat.set(e.category, (byCat.get(e.category) ?? 0) + e.amount)
    total += e.amount
  }
  const rows = [...byCat].sort((a, b) => b[1] - a[1])
  const top = rows[0]?.[1] ?? 0

  return (
    <section className="card" aria-labelledby="spend-title">
      <div className="card__head">
        <h2 id="spend-title" className="card__title">Where it went</h2>
        <p className="card__aside"><Money p={total} /> spent together since 1 Oct</p>
      </div>
      {rows.length === 0 ? (
        <p className="empty">Nothing spent yet. Add the first expense and it shows up here by category.</p>
      ) : (
        <ul className="bars">
          {rows.map(([cat, p]) => (
            <li key={cat} className="bars__row">
              <CategoryIcon id={cat} size={16} />
              <span className="bars__label">{categoryOf(cat).label}</span>
              <span className="bars__track" aria-hidden>
                <span className="bars__bar" style={{ width: `${(p / top) * 88}%` }} />
              </span>
              <Money p={p} className="bars__value" />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
