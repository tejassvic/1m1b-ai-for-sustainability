# Verdant — Frontend

**Smarter choices. Healthier communities. A greener future.**

The interface for Verdant, an AI sustainability platform. React + Vite +
Tailwind, built around a biophilic design language: forests, leaves, soil, water
and sunlight, rather than the stock aesthetics of an environmental NGO or a
cyberpunk AI dashboard.

Two surfaces carry the product's argument:

| Surface | What it does | Where the numbers come from |
| --- | --- | --- |
| **Ask Verdant** | Answers sustainability questions | Retrieved from a cited knowledge base |
| **Impact Analyzer** | Estimates and explains a footprint | **Deterministic arithmetic — never the model** |

That distinction is the whole point. A language model may explain a figure; it
may never produce one. The frontend enforces this by never calculating anything:
it sends inputs, and renders what the API returns.

## Getting started

```bash
npm install
npm run dev             # dev server on http://localhost:5173
npm run build           # production build into dist/
npm run preview         # serve the production build
npm run check:contrast  # assert the colour contrast budget
npm run smoke           # SSR render smoke test (see below)
npm run verify          # all three, in order
```

The dev server proxies `/api` to the backend at `http://127.0.0.1:8000`, so the
browser only ever talks to one origin. Override with `VERDANT_API_URL`, or point
a deployed build at a real host with `VITE_API_BASE_URL`.

**Start the backend too**, or the assistant and analyzer will report themselves
offline rather than pretending:

```bash
cd ../backend && uvicorn app.main:app --reload --port 8000
```

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 (classic `tailwind.config.js` theme) |
| Typography | Fraunces (display serif) + Nunito Sans (body) — self-hosted, latin subset |
| Motion | CSS keyframes + `IntersectionObserver` |
| Runtime dependencies | 4 — React, React DOM, and two font packages. No animation, icon, chart, markdown or HTTP library |

## Design system

**Palette** (in `tailwind.config.js`)

| Role | Tokens |
| --- | --- |
| Soft greens | `mist` `pale` `sage` `fern` `moss` `leaf` `forest` |
| Earthy browns | `bark` `soil` `sand` `stone` |
| Sky and water | `sky` `mistblue` `water` |
| Botanical accents | `pollen` (gold, for fills) `honey` (light gold, for text on dark) `blush` (floral) |
| Text | `ink` (body) `forest` (headings) |

**Forms** — no harsh angles. Custom radii (`pebble`, `stone`, `leaf`, `blob`)
include asymmetric, water-worn curves.

**Motion** — seven ambient keyframes: `sway` / `sway-slow` (leaves), `drift` /
`drift-slow` (clouds), `ripple` (water rings), `grow` (content unfurling), and
`typing` (the assistant's thinking indicator).

**Textures** — hand-drawn inline SVG at 5–7% opacity: `WoodGrain`,
`LeafPattern`, `WaterRipple`, `RippleRings`, `Leaf`, `Cloud`.

> **A note on opacity values.** Tailwind's opacity scale steps in fives, so a
> class like `border-forest/12` produces *no CSS at all* and the element quietly
> loses its border in production. Every modifier in this codebase is a multiple
> of five for that reason.

> **A note on contrast.** Three tokens were deepened from their original values
> because the lighter versions failed WCAG AA: `moss` sat at 3.4:1 as an eyebrow
> label, and the `canopy` gradient brightened to a stop where mist text reached
> only 2.6:1. Accent *text* is a darker variant of each accent *fill* (see
> `src/data/tones.js`), and `honey` exists because gold on deep green tops out
> near 3.8:1 at the primary accent's own value. `npm run check:contrast` asserts
> all 39 combinations that actually appear on the site.

## Component architecture

```
App
├── Nav                    scroll-spy stepping stones + "Ask Verdant"
├── Hero                   "Smarter choices. A greener future."
├── Mission                the gap, then Question → Understand → Decide → Act → Impact
├── AskVerdant             the assistant
│   └── ChatMessage        answer · actions · sources · provider
├── ImpactAnalyzer         the calculator
│   ├── FormFields         RangeField · ChoicePills · ToggleField · FieldGroup
│   └── ImpactResults      CircularMeter · ImpactBar · comparisons · actions
├── Initiatives            seven areas, with a live "Learn more" panel
│   └── InitiativeCard
├── SDGSection             goals 11 · 12 · 13
├── Community              animated metrics + stories
├── ResponsibleAI          four principles, each with its enforcement mechanism
├── GetInvolved            closing call to action
└── Footer
```

Reusable primitives: `Reveal` · `SectionHeading` · `OrganicCard` · `ToneIcon` ·
`SuggestionChip` · `ImpactBar` · `CircularMeter` · `RichText` · `Stat` ·
`NatureImage` · `Icons`.

Content is separated from presentation: all copy lives in `src/data/`
(`content.js`, `assistant.js`, `impactOptions.js`), and the botanical accent
class map lives in `src/data/tones.js` — literal class strings, because Tailwind
extracts class names by reading source text and would purge `text-${tone}`.

## State and data flow

```
App
 ├── impactInputs  ──►  AskVerdant   (so follow-ups can reference your profile)
 └── ◄── ImpactAnalyzer              (emits the inputs after a calculation)
```

Only the *inputs* travel. The server recomputes the figures, so the number the
model reasons about is always the number the calculator produced — a client can
never hand the model a total to explain.

| Hook | Responsibility |
| --- | --- |
| `useChat` | Conversation state, history replay, offline and failure states |
| `useImpact` | Form state and the calculation request |
| `useReveal` | Reveal-on-scroll (detaches after first reveal) |
| `useCountUp` | Growth-animated figures |
| `useScrollSpy` | Navigation wayfinding |

`src/services/api.js` is the only place that knows the API exists — endpoints,
timeouts, and the `ApiError` shape that distinguishes "server unreachable" from
"server said no".

## Accessibility

- Semantic landmarks, a skip link, one `h1`, and every `<section>` named by
  `aria-labelledby` (asserted by the smoke test)
- Full keyboard operation; visible focus rings on every interactive element
- The conversation log is `role="log"` with `aria-live="polite"`, so replies are
  announced without interrupting
- Sources use native `<details>`/`<summary>` — disclosure without JavaScript
- Colour is never the sole carrier of meaning: every accent is paired with a
  label, icon or numeric value, and each impact bar prints its own figure
- `prefers-reduced-motion` disables all ambient and reveal animation
- Charts and decorative graphics are `aria-hidden`; every photograph has
  meaningful `alt` text

## Performance and sustainable engineering

A site arguing for environmental responsibility should not waste resources:

- **Self-hosted, latin-subset fonts only** — 5 weights, no third-party
  render-blocking requests
- **Responsive imagery** — `srcset` across 5–6 widths with `sizes`; the hero is
  the only eager image, everything else lazy-loads
- **Graceful degradation** — `NatureImage` paints a natural gradient beneath
  every photograph, so a slow or failed image never produces a broken layout
- **No throwaway dependencies** — no chart library (the meter is SVG), no icon
  library (icons are hand-drawn SVG), no markdown parser (`RichText` is 40 lines)
- **Real code splitting** — React is a separate chunk from application code, so
  returning visitors re-download only what changed
- **Purged CSS** — Tailwind removes every unused class

Production build: **~48 kB CSS** (8.6 kB gzipped) and **~235 kB JavaScript**
(72 kB gzipped) across two chunks, plus 10 font files.

## Validation

```bash
npm run smoke
```

Server-renders the whole page and asserts that real content, structure, imagery
and accessible names made it through — catching render-time errors a bundler
will not:

```
SMOKE TEST PASSED

Rendered HTML length : 121101
<section> elements   : 9
<img> elements       : 11
lazy-loaded images   : 10
responsive srcset    : 11
sizes attributes     : 11
labelled sections    : 9
```

It fails the build if a section loses its accessible name, if imagery stops being
responsive, or if the eager/lazy split changes.

### Contrast

```bash
npm run check:contrast
```

```
CONTRAST CHECK PASSED — all 39 combinations meet their WCAG threshold
```

`scripts/check-contrast.mjs` lists every foreground/background pair the site
actually renders and asserts 4.5:1 for text and 3:1 for graphics. It exists
because contrast is the property most easily lost in a redesign: a palette can
look calm while quietly dropping an eyebrow label to 3.4:1, and nothing else in
the build would notice.

## Privacy

The assistant needs no account, and nothing you type is stored on the server —
conversation history lives in the browser tab and is discarded when it closes.
Location coordinates are accepted only as optional context and are never logged.
The interface says this where a visitor can see it, rather than in a policy page.

## Limitations

- The Community metrics are labelled placeholders from a pilot; they are not
  audited outcomes, and the section says so beneath the numbers.
- `RichText` supports paragraphs, lists and bold only. That is the full extent of
  the formatting the assistant produces, so a Markdown engine would be dead weight.
- Photographs are loaded from Unsplash, which trades privacy and offline
  capability for quality. A production deployment should self-host them.

