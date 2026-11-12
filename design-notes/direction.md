# Potluck: brief and direction

## Brief

| Field | Answer |
|---|---|
| Product | Potluck, a shared-bills app for flatmates and trip groups in India: log what you paid, see who owes whom, settle in the fewest UPI payments. Fictional concept. |
| Job | When I share a flat or a trip, I want to log what I paid in seconds and see who owes whom, so we settle up without awkward maths or chasing friends. |
| Outcome | A flatmate can read their balance in one glance, add an expense in under 20 seconds, and settle with the fewest payments. |
| Who, how often, device | Flatmates in their twenties, a few times a week, mostly on a phone in the evening; occasionally on a laptop for the month-end settle. Checked at 1440 and 390. |
| Surface | Operate (app). The demo is a faux UI for a landing hero. |
| Feeling (user's words) | "Warm and friendly", and also "modern, classy, premium, and like a high-budget product". |
| Material | Real: none (fictional product). Sample data: four invented flatmates, nine expenses and one payment, Oct–Nov 2026, amounts in paise, totals computed. UPI IDs on example domains. Absent: brand, logo, customers, proof. |
| No-gos | No fake payments (settling only records "Mark received"), no live services, no invented metrics. |

## Five lines

| Line | Answer |
|---|---|
| Product | Shared bills for a flat, settled in the fewest UPI payments |
| Character | Generous, fair, unhurried |
| World | The kitchen table at the end of the month: chits, the kitty, a lamp-lit evening; saffron from marigolds and haldi |
| Moments | The balance (one dark, card-like object) and the settle-up chits |
| Signature | Settle-up payments as tear-off chits: a paper slip with a perforated stub that holds the one action |

## Candidates (internal) and the pick

| # | Source | Skeleton | Why kept or cut |
|---|---|---|---|
| A | Reasoning: "kitchen-table chit" | Dark balance object + chits + quiet activity rail | **Picked**: the chit only belongs to settling a shared kitty; premium via one dark object and restraint |
| B | Style library: Friendly fintech | Saffron field balance card, capsule everything, big candy jars | Alternate: friendlier, louder; less classy |
| C | Real reference: Mercury-like ledger | All light, hairlines, one green accent | Alternate: calm and premium, but cool; loses warmth |
| D | Style library: Hum (paper, pear yellow) | Torn-paper cards, springy | Cut: reads kids' product |
| E | Designer lens: restrained Swiss | Black on white, one signal colour | Cut: not warm |
| F | Designer lens: playful tactile | One full-bleed colour per screen | Cut: overdone for a money screen |

Why A won: the brief asked for warm and friendly but also classy and high-budget; one dark, deep balance object with
a saffron accent and paper chits gives warmth through material and colour while the chrome stays quiet.

## Direction contract (A)

| Block | Value |
|---|---|
| Feeling | Generous, fair, unhurried; warm but premium |
| Surface | Operate |
| Scene | Evening, a phone in a lit flat; laptop at month end → light theme, one dark object |
| Type | Figtree only (the one tested face with its own ₹ glyph and tabular figures; Hanken Grotesk and Onest fall back for ₹). 12/13/14/16/20/28/40; weights 420/520/620; −0.02em at 20–28, −0.03em at 40 |
| Colour | Warm near-white ground L 0.982; warm graphite ink L 0.22; saffron accent (mark L 0.78, ink L 0.50) for selection, focus and the payment glyph; espresso neutral primary button; four muted identity hues for people (sage, rose, slate blue, plum); posture Restrained plus one dark identity object |
| Density and grid | 1152 content cap, `1fr 400px`, 24 gap; phone single column in reading order balance → settle → activity → spending |
| Radius and depth | Controls pill, inputs 12, tiles 14, cards 20, hero and dialog 24; layered low-alpha neutral shadows, no borders on cards |
| Motion | Quiet: Number Flow rolls changed digits, AutoAnimate 220 ms ease-out on rows and chits, dialog 0.96 → 1 in 220 ms; reduced motion keeps fades only |
| Signature | Tear-off chits in Settle up |
| References | Mercury (take: restraint, one dark object, figure scale; do not take: layout, palette). Friendly fintech specimen (take: warmth of pale identity tints; do not take: candy fields, capsule-everything) |

## Status

Direction A shown rendered (2026-11-03), followed by a palette round before choosing. Category icons kept neutral:
colour means people.

Palette round: live switcher (keys 1–8, `?palette=`), 8 palettes incl. one full-dark, wide range.
A palette file overrode colour tokens only (removed once the palette was picked). Contrast measured in the browser on computed tokens for 30 pairs
per palette (text 4.5:1, controls/focus/marks 3:1, identity initials 4.5:1): all pass after darkening the bar tokens.

Palette pick: **Oxblood & apricot**, with a dark mode switch (see `potluck.md`).
