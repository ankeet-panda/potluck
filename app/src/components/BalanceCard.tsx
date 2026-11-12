import { ME, type Entry } from '../data'
import { shares, type Transfer } from '../money'
import { FlowMoney, Money, listNames, nameOrYou } from '../ui'
import { Chits } from './Chits'

/** The one deep object: the answer on the left, the chits that settle it on the right. */
export function BalanceCard({ net, plan, entries, onSettle }: { net: number; plan: Transfer[]; entries: Entry[]; onSettle: (t: Transfer) => void }) {
  let myShare = 0, iPaid = 0, received = 0, paidBack = 0
  for (const e of entries) {
    if (e.kind === 'expense') {
      myShare += shares(e.amount, e.split).get(ME) ?? 0
      if (e.paidBy === ME) iPaid += e.amount
    } else {
      if (e.to === ME) received += e.amount
      if (e.from === ME) paidBack += e.amount
    }
  }

  const owers = plan.filter(t => t.to === ME).map(t => nameOrYou(t.from, ME))
  const owed = plan.filter(t => t.from === ME).map(t => nameOrYou(t.to, ME))
  const verdict = net > 0 ? 'You get back' : net < 0 ? 'You owe' : 'You’re settled up'
  const why =
    net > 0 ? `${listNames(owers)} ${owers.length === 1 ? 'owes' : 'owe'} you.`
    : net < 0 ? `You owe ${listNames(owed)}.`
    : 'Nobody owes you and you owe nobody.'

  // The working: paid − share − received + paid back = balance.
  const terms: { label: string; p: number; sign: '' | '−' | '+' }[] = [
    { label: 'You paid', p: iPaid, sign: '' },
    { label: 'Your share', p: myShare, sign: '−' },
  ]
  if (received) terms.push({ label: 'Paid to you', p: received, sign: '−' })
  if (paidBack) terms.push({ label: 'You paid back', p: paidBack, sign: '+' })

  return (
    <section className="balance" aria-labelledby="balance-title">
      <div className="balance__main">
        <h2 id="balance-title" className="balance__verdict">{verdict}</h2>
        <p className="balance__figure">
          {net === 0 ? <span className="num">₹0</span> : <FlowMoney p={net} />}
        </p>
        <p className="balance__why">{why}</p>
        <dl className="balance__working" aria-label="How your balance adds up">
          {terms.map(t => (
            <div key={t.label} className="balance__term">
              <dt>{t.label}</dt>
              <dd>
                {t.sign && <span aria-label={t.sign === '−' ? 'minus' : 'plus'}>{t.sign}</span>}
                <Money p={t.p} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <Chits plan={plan} onSettle={onSettle} />
    </section>
  )
}
