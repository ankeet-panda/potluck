import { useAutoAnimate } from '@formkit/auto-animate/react'
import { CircleCheck } from 'lucide-react'
import { ME, personById } from '../data'
import type { Transfer } from '../money'
import { Avatar, FlowMoney } from '../ui'

const LIST_MOTION = { duration: 220, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }

/** The signature: each payment that settles the flat is a paper chit; its stub holds the amount and the action. */
export function Chits({ plan, onSettle }: { plan: Transfer[]; onSettle: (t: Transfer) => void }) {
  const [list] = useAutoAnimate<HTMLUListElement>(LIST_MOTION)
  const n = plan.length

  return (
    <div className="chits-area">
      <h3 id="settle-title" className="chits-area__title" tabIndex={-1}>
        {n === 0 ? 'Settle up' : `${n} ${n === 1 ? 'payment settles' : 'payments settle'} the flat`}
      </h3>
      <ul ref={list} className="chits">
        {plan.map(t => {
          const toMe = t.to === ME
          const from = personById(t.from)
          const to = personById(t.to)
          return (
            <li key={`${t.from}-${t.to}`} className="chit-wrap">
              <div className="chit">
                <div className="chit__body">
                  <Avatar id={t.from} />
                  <div className="chit__who">
                    <p className="chit__line">{toMe ? `${from.name} pays you` : t.from === ME ? `You pay ${to.name}` : `${from.name} pays ${to.name}`}</p>
                    <p className="chit__sub">{toMe ? 'to your UPI ID' : `to ${to.name}’s UPI ID`}</p>
                  </div>
                </div>
                <div className="chit__stub">
                  <p className="chit__amount"><FlowMoney p={t.amount} /></p>
                  <button type="button" className="chit__action" onClick={() => onSettle(t)}>
                    {toMe ? 'Mark received' : 'Mark paid'}
                    <span className="sr-only">: {from.name} to {to.name}</span>
                  </button>
                </div>
              </div>
            </li>
          )
        })}
        {n === 0 && (
          <li className="settled">
            <CircleCheck size={20} strokeWidth={1.75} aria-hidden />
            <span>All square. New expenses show up here as chits to settle.</span>
          </li>
        )}
      </ul>
    </div>
  )
}
