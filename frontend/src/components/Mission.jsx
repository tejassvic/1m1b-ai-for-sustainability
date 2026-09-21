import { mission } from '../data/content'
import { getTone } from '../data/tones'
import { IconArrowRight, iconMap } from './Icons'
import NatureImage from './NatureImage'
import OrganicCard, { ToneIcon } from './OrganicCard'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import WoodGrain from './decorations/WoodGrain'

/**
 * Mission — the problem, stated plainly, then the five steps that answer it.
 *
 * The journey strip is the section's real argument: sustainable decisions are a
 * sequence, not an epiphany, and the product exists to carry someone along it.
 */
export default function Mission() {
  return (
    <section
      id="mission"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-labelledby="mission-heading"
    >
      <WoodGrain className="pointer-events-none absolute inset-0 h-full w-full" opacity={0.05} />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <SectionHeading
            id="mission-heading"
            eyebrow={mission.eyebrow}
            title={mission.title}
            body={mission.body}
          />

          <Reveal delay={140} className="relative">
            {/* Organic silhouette peeking out from behind the photograph. */}
            <div aria-hidden="true" className="absolute -inset-5 -z-10 rounded-blob bg-sage/30" />
            <NatureImage
              src={mission.image.src}
              alt={mission.image.alt}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="aspect-[4/3] rounded-leaf shadow-soft"
              imgClassName="hover:scale-[1.03]"
            />
          </Reveal>
        </div>

        {/* ---------------------- The gap the product closes ---------------------- */}
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {mission.gaps.map((gap, index) => {
            const Icon = iconMap[gap.icon]
            const tone = getTone(gap.tone)

            return (
              <Reveal key={gap.title} delay={index * 120} className="h-full">
                <OrganicCard tone={gap.tone} className="p-7">
                  <ToneIcon tone={gap.tone} icon={Icon} />

                  <h3 className="mt-5 text-xl">{gap.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/75">{gap.body}</p>

                  <span
                    aria-hidden="true"
                    className={`mt-6 block h-1 w-12 rounded-full ${tone.bar}`}
                  />
                </OrganicCard>
              </Reveal>
            )
          })}
        </div>

        {/* ------------------------- The five-step journey ------------------------ */}
        <Reveal delay={140}>
          <div className="mt-20 rounded-leaf border border-forest/10 bg-pale/60 p-7 sm:p-10">
            <p className="eyebrow text-center">How a question becomes a change</p>

            <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
              {mission.journey.map((step, index) => {
                const isLast = index === mission.journey.length - 1

                return (
                  <li key={step.label} className="relative flex gap-4 lg:flex-col lg:gap-0">
                    {/* Connector: a drawn line rather than a border, so it can
                        point sideways on wide screens and downward on narrow. */}
                    {!isLast && (
                      <span
                        aria-hidden="true"
                        className="absolute left-[1.1rem] top-12 h-[calc(100%+1rem)] w-px bg-sage/60 lg:left-[3.1rem] lg:top-6 lg:h-px lg:w-[calc(100%-1.5rem)]"
                      />
                    )}

                    <span className="relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest font-display text-sm font-semibold text-mist shadow-soft">
                      {index + 1}
                    </span>

                    <div className="lg:mt-5 lg:pr-4">
                      <p className="font-display text-lg leading-none text-forest">{step.label}</p>
                      <p className="mt-2 text-xs leading-relaxed text-ink/75">{step.detail}</p>
                    </div>
                  </li>
                )
              })}
            </ol>

            <p className="mt-10 flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-forest">
              Start at step one
              <IconArrowRight aria-hidden="true" className="h-4 w-4 text-moss" />
              <a
                href="#assistant"
                className="underline decoration-moss/50 decoration-2 underline-offset-4 transition hover:decoration-moss focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-pale"
              >
                ask Verdant
              </a>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
