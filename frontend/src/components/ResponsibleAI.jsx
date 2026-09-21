import { responsibleAI } from '../data/content'
import { getTone } from '../data/tones'
import { IconClose, iconMap } from './Icons'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import WoodGrain from './decorations/WoodGrain'

/**
 * ResponsibleAI — the commitments, and how each one is enforced.
 *
 * Each card pairs a principle with the mechanism that implements it. A promise
 * without a mechanism is marketing, so the "enforced by" line is treated as
 * part of the claim rather than a footnote.
 */
export default function ResponsibleAI() {
  return (
    <section
      id="responsible"
      className="relative overflow-hidden bg-canopy py-24 text-mist sm:py-32"
      aria-labelledby="responsible-heading"
    >
      <WoodGrain className="pointer-events-none absolute inset-0 h-full w-full" opacity={0.06} />

      {/* A soft light wash keeps the dark band from reading as a hard slab. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-mist/10 via-transparent to-forest/40"
      />

      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          id="responsible-heading"
          align="center"
          variant="light"
          tone="text-honey"
          eyebrow={responsibleAI.eyebrow}
          title={responsibleAI.title}
          body={responsibleAI.body}
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {responsibleAI.principles.map((principle, index) => {
            const Icon = iconMap[principle.icon]
            const tone = getTone(principle.tone)

            return (
              <Reveal key={principle.title} delay={index * 110} className="h-full">
                <article className="group flex h-full flex-col rounded-leaf border border-mist/20 bg-forest/40 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-mist/35 hover:bg-forest/50">
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-pebble transition-transform duration-500 group-hover:-rotate-6 ${tone.iconWrap}`}
                    >
                      {Icon && <Icon className="h-6 w-6" />}
                    </span>
                    <h3 className="text-xl text-mist">{principle.title}</h3>
                  </div>

                  <p className="mt-5 font-display text-base italic leading-snug text-honey">
                    {principle.statement}
                  </p>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-mist/85">
                    {principle.body}
                  </p>

                  <p className="mt-6 rounded-pebble border border-mist/20 bg-forest/30 px-4 py-3 text-xs font-medium leading-relaxed text-mist/85">
                    {principle.note}
                  </p>
                </article>
              </Reveal>
            )
          })}
        </div>

        {/* Explicit limits — an AI product should state its own boundaries. */}
        <Reveal delay={200}>
          <div className="mt-10 rounded-leaf border border-blush/35 bg-forest/35 p-7">
            <h3 className="text-lg text-mist">{responsibleAI.limits.title}</h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {responsibleAI.limits.items.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-mist/85">
                  <IconClose
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-blush"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
