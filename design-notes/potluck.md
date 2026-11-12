# Potluck: hand-over record

## Direction
Feeling: generous, fair, unhurried; warm but premium (user: "warm and friendly" + "modern, classy, premium, and like a
high-budget product"). Direction A "kitchen-table chit", confirmed through the palette pick "Oxblood & apricot & a dark
mode switch". Surface: Operate. Signature: settle-up payments as tear-off chits. Full contract: `direction.md`.

## Assumptions
- Fictional product and data; the demo is labelled "Sample data in a product concept".
- "You" is Ishaan; amounts in whole rupees in the seed (paise supported and shown only when present).
- Settling only records "Mark received / Mark paid"; no payment is made or faked.
- Local prototype: no server, so server-side validation is n/a (client validation only, stated here).

## Applied rules (main ones)
- One answer per view: "You get back ₹25,376" is the largest text; the working (paid − share − received) shows how it adds up.
- Totals computed from rows (`money.ts`); fewest-payments plan; U+2212 minus; en-IN grouping; tabular figures.
- Number Flow on changed figures with the real value as sr-only text; AutoAnimate 220 ms `--ease-out` on rows and chits.
- Undo over warning: delete and mark-received run at once with an 8 s Undo toast (Sonner); each undo reverses only its own change.
- Focus: dialog opens on its first field, returns to its trigger; after a row or chit leaves, focus moves to the section heading.
- Form: labels above, no placeholder labels, validation on submit and on leaving a non-empty field, errors at the field with
  `aria-invalid` + `aria-describedby`, focusable error summary, submit never pre-disabled, discard check for unsaved input.
- Colour: Restrained; one deep oxblood object; apricot only for selection, focus and the payment glyph; identity hues
  only on people; category icons neutral (colour means people). Dark theme designed, not inverted.
- Demo: kit Stage + Phone + Count + Collapse, touch cursor, plays once in view, poster = payoff, Pause and Replay,
  reduced motion shows the poster; compact design is a corner bleed.

## Checks
- Contrast (computed tokens, light and dark): all text, control-edge, focus and mark pairs pass, including the paper chit
  (slip ink 13.5–16.1:1, stub secondary ink 5.85–6.21:1, button edge on stub ≥ 5.8:1). The perforation dots (2.1–2.3:1) are
  decorative: slip and stub are told apart by the notches and the tone step, so WCAG 1.4.11 does not apply to them.
- Lint (`lint.py --surface app --system tokens.css`): 0 FAIL, 10 WARN, each kept:
  - 6 × `undersized-ui-text` 11 px inside the demo phone: allowed for phone demo text; the film gate confirms ≥ 10 px at true phone size.
  - `minus-sign` PhoneDemo.tsx: array index arithmetic in code, not text.
  - `tight-leading` 1.15 on the 20 px phone title: a heading, not running text.
  - `design-system-font-size` / `design-system-radius`: phone-scale type set in px on purpose; 18 px radius removed; remaining are rem/px equivalents.
- Render check (production build, 1440 and 390, light and dark): no FAIL; 3 WARN, all measurement artefacts
  (sr-only suffix counted inside "Mark received"; a 13 px caption read as body; grid cells read as one sentence).
- Film gate (production build): wide 1440 passed; compact 390 passed after two fixes (phone text at true size, corner bleed).
  Coverage marked "inconclusive" by the tool (frame sampling gaps on this machine), so motion between samples was not judged.
- Interactions used in the browser: add (validation, success, focus return), delete + undo, two settles + undo of the first
  (second survives), hide amounts, theme switch, discard check on Escape.

## Review (fresh-eye reviewer, separate agent, pixels only; 5 rounds)
- Round 1 `rebuild`: signature not on screen (chit read as a striped row), plate behind the device, a mid-roll "₹925 each" in the
  demo, hero half empty with two stacked labels, spaced minus, loose activity list, half-empty form with hue-only selection,
  a "dead hold" (disputed: the demo is play-once by design; accepted in round 2).
- Fix batch: chits rebuilt as paper slips with a perforated stub holding amount and action, moved inside the oxblood balance
  object (filling its empty half, removing the duplicate Settle-up card); "Your balance" dropped; minus glued; activity grouped
  Today / This week / October with one-line meta; demo: same chit, split preview only at its beat as whole values, breakdown
  that adds up to ₹1,437, apricot + tick selection, no plate (foot fades into the page).
- Round 2 `fix` → round 3 `fix` → round 4 `fix` (each closed its findings; new small regressions: "Received" read as a status,
  invented "3 of 4", half-erased hint, demo pill overflow, small phone labels, wide demo opening mid-sheet).
- Round 5 `ship`: every finding from rounds 1–4 resolved, no new product regressions.
- Reviewer could not judge from pixels: interaction, keyboard, Pause/Replay. Checked by me afterwards in the browser on the
  production build: settle ×3, undo of the first (second survives), all-settled state, delete + undo, focus to the section
  heading after each (fixed: the hand-off now uses a timer, rAF did not fire in a hidden tab), Pause shows the finished still,
  Replay remounts.

## Score (production build; critique.md sections A–C, E–G, V, S for the app; R for the demo)

| Section | Points | Notes |
|---|---|---|
| A Hierarchy | 14/14 | |
| B Type and numbers | 14/14 | T1 totals computed; T2 U+2212 verified in source |
| C Colour | 13/14 | C5 tint parity not measured (1). C7 ◆ judged, not measured: no touching parts rely on colour alone (every identity hue carries an initial or a name; slip and stub are split by perforation) |
| E Finish | 13/14 | E6: 100-character names, 1,000 items and RTL not tested (1) |
| F Piece | 13/14 | P6: no side-by-side with a reference product at the same size (1) |
| G Feel and flow | 25/26 | G9: no keyboard shortcuts (1); G2 and G12 n/a (no loading, no AI) |
| V Richness | 14/14 | |
| S1 ◆ | 2/2 | reviewer: "The swap test now fails for a competitor" |
| **App total** | **108/112 = 96%** | **Passing** (no 0, every gate 2; C7 by rule, see note) |
| R Demo | R2 = 0 | **Demo failing on R2 by rule**: the film gate's rehearsal passes at 1440 and 390 (dev server), but its coverage is "inconclusive" on this machine (frame-sampling gaps up to ~580 ms even at --slow 4). R1, R3–R11 pass. |

## Not checked
- Motion at full frame rate by eye (the pane forces reduced motion; frames judged from film sheets only).
- Colour-blind simulation (C7 judged by rule), tint parity (C5).
- Real touch device; a real screen reader; 200% zoom.
- Stress content (very long names, 1,000+ entries, RTL).
- Kit-override lines in production-build films: the bundle merges kit CSS with the demo's, so the tool cannot tell them apart;
  the dev-server films (separate files) show none. Base resets now sit in `@layer base` before the kit's `demokit` layer.
- "touching" between the demo stub's amount and "Mark received": the kit counter's hidden digit strips extend its measured
  box; the zoomed frame shows a clear gap.

## Lint and render WARNs kept
- Lint 0 FAIL / 12 WARN: 11 px phone text (allowed for phone demos; phone now near true size), mask colour stops (#000/#0000
  are alpha in masks), heading leading 1.15, a code `-` the minus check misreads, rem vs px phone type.
- Render check app: 0 FAIL; WARNs are measurement artefacts (sr-only suffix inside the chit button, a 13 px caption,
  grid cells read as one sentence). Demo page FAILs come from capturing mid-story with the sheet's scrim over the card.

