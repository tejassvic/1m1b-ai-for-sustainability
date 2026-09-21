import { getInvolved } from '../data/content'
import { getTone } from '../data/tones'
import { iconMap, IconArrowRight } from './Icons'
import NatureImage from './NatureImage'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import WaterRipple from './decorations/WaterRipple'

/**
 * GetInvolved — the closing call to action.
 *
 * Two buttons, pointing at the two things the product actually does: answer a
 * question, and calculate an impact. Three short steps explain the shape of the
 * journey for anyone who scrolled straight to the bottom.
 */
export default function GetInvolved() {
  return (
    <section
      id="join"
      className="relative isolate overflow-hidden py-24 sm:py-32"
      aria-labelledby="join-heading"
    >
      <NatureImage
        src={getInvolved.image.src}
        alt={getInvolved.image.alt}
        fill
        sizes="100vw"
        widths={[768, 1280, 1600, 1920, 2560]}
        className="-z-20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-b from-forest via-forest/90 to-forest/95"
      />

      <WaterRipple className="pointer-events-none absolute inset-x-0 top-0 h-14 w-full text-mist/35" />

      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          id="join-heading"
          align="center"
          variant="light"
          tone="text-honey"
          eyebrow={getInvolved.eyebrow}
          title={getInvolved.title}
          body={getInvolved.body}
        />

        <Reveal delay={260}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href={getInvolved.primaryCta.href} className="btn-primary bg-pollen text-ink hover:bg-white hover:text-forest">
              {getInvolved.primaryCta.label}
              <IconArrowRight className="h-4 w-4" />
            </a>
            <a
              href={getInvolved.secondaryCta.href}
              className="btn-ghost border-mist/40 bg-mist/10 text-mist hover:border-mist/70 hover:bg-mist/20"
            >
              {getInvolved.secondaryCta.label}
            </a>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {getInvolved.steps.map((step, index) => {
            const Icon = iconMap[step.icon]
            const tone = getTone(step.tone)

            return (
              <Reveal key={step.title} delay={index * 120} className="h-full">
                <article className="group flex h-full flex-col rounded-leaf border border-white/30 bg-mist/90 p-7 transition-all duration-500 hover:-translate-y-1.5 hover:bg-mist">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-pebble transition-transform duration-500 group-hover:-rotate-6 ${tone.iconWrap}`}
                    >
                      {Icon && <Icon className="h-5 w-5" />}
                    </span>
                    <span className="font-display text-sm font-semibold text-moss">
                      Step {index + 1}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl">{step.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/75">{step.body}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
