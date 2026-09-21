import { sdg } from '../data/content'
import { getTone } from '../data/tones'
import { IconArrowRight, iconMap } from './Icons'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import LeafPattern from './decorations/LeafPattern'

/**
 * The official SDG identity colours.
 *
 * Used only on the goal numeral, so a reader recognises the goal immediately
 * while the card itself stays inside Verdant's own palette. The result should
 * read as a product's alignment, not as a poster.
 */
const SDG_COLOUR = {
  11: '#FD9D24',
  12: '#BF8B2E',
  13: '#3F7E44'
}

/**
 * SDGSection — why the product does what it does.
 *
 * Each card states the goal's promise and then the specific mechanism by which
 * Verdant contributes. A claim of alignment without a named mechanism is
 * decoration; the point here is to make the link falsifiable.
 */
export default function SDGSection() {
  return (
    <section
      id="sdg"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-labelledby="sdg-heading"
    >
      <LeafPattern className="pointer-events-none absolute inset-0 h-full w-full" opacity={0.05} />

      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          id="sdg-heading"
          align="center"
          eyebrow={sdg.eyebrow}
          title={sdg.title}
          body={sdg.body}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {sdg.goals.map((goal, index) => {
            const Icon = iconMap[goal.icon]
            const tone = getTone(goal.tone)
            const colour = SDG_COLOUR[goal.number] ?? '#5E9C4F'

            return (
              <Reveal key={goal.number} delay={index * 120} className="h-full">
                <article
                  className={`group flex h-full flex-col rounded-leaf border bg-white/75 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft ${tone.border} ${tone.glow}`}
                >
                  <div className="flex items-center gap-4">
                    {/* The numeral sits on the site's own deep green; the goal's
                        official colour is carried by the ring. White numerals on
                        the official colours reached only 2.1:1 (SDG 11) and
                        3.0:1 (SDG 12), which is unreadable at this size. */}
                    <span
                      className="grid h-14 w-14 shrink-0 place-items-center rounded-pebble border-4 bg-forest font-display text-xl font-semibold text-mist shadow-soft"
                      style={{ borderColor: colour }}
                      aria-hidden="true"
                    >
                      {goal.number}
                    </span>

                    <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-pebble ${tone.iconWrap}`}>
                      {Icon && <Icon className="h-5 w-5" />}
                    </span>
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-moss">
                    SDG {goal.number}
                  </p>

                  <h3 className="mt-2 text-xl leading-snug">{goal.name}</h3>

                  <p className="mt-3 text-sm italic leading-relaxed text-ink/75">{goal.promise}</p>

                  <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/75">
                    {goal.contribution}
                  </p>

                  <a
                    href={goal.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all duration-300 hover:gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-white ${tone.metric}`}
                  >
                    Read the goal
                    <span className="sr-only"> (opens the United Nations site)</span>
                    <IconArrowRight aria-hidden="true" className="h-4 w-4" />
                  </a>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
