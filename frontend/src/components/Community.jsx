import { community } from '../data/content'
import { IconAlert } from './Icons'
import NatureImage from './NatureImage'
import OrganicCard from './OrganicCard'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import Stat from './Stat'
import LeafPattern from './decorations/LeafPattern'

/**
 * Community — what collective action has produced so far.
 *
 * The figures are real placeholders from a pilot, and they are labelled as such
 * directly beneath the numbers. Presenting illustrative data as audited outcomes
 * would be exactly the kind of claim this product argues against.
 */
export default function Community() {
  return (
    <section
      id="community"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-labelledby="community-heading"
    >
      <LeafPattern className="pointer-events-none absolute inset-0 h-full w-full" opacity={0.05} />

      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          id="community-heading"
          align="center"
          eyebrow={community.eyebrow}
          title={community.title}
          body={community.body}
        />

        {/* ------------------------------- Metrics ------------------------------- */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {community.metrics.map((metric, index) => (
            <Reveal key={metric.label} delay={index * 110} className="h-full">
              <Stat {...metric} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mx-auto mt-8 flex max-w-3xl items-start justify-center gap-2.5 text-center text-xs leading-relaxed text-ink/75">
            <IconAlert aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8A5E14]" />
            <span>{community.metricsNote}</span>
          </p>
        </Reveal>

        {/* ----------------------- Photograph and stories ----------------------- */}
        <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative">
            <div aria-hidden="true" className="absolute -inset-5 -z-10 rounded-blob bg-blush/25" />
            <NatureImage
              src={community.image.src}
              alt={community.image.alt}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="aspect-[4/3] rounded-leaf shadow-soft lg:aspect-[4/5]"
              imgClassName="hover:scale-[1.03]"
            />
          </Reveal>

          <div>
            <Reveal>
              <h3 className="text-xl text-forest">In their words</h3>
              <p className="mt-2 text-sm text-ink/75">
                From the campuses and panchayats that used the pilot.
              </p>
            </Reveal>

            <ul className="mt-7 space-y-4">
              {community.stories.map((story, index) => (
                <li key={story.quote}>
                  <Reveal delay={index * 120}>
                    <OrganicCard as="figure" tone="blush" className="p-5">
                      <blockquote className="font-display text-base italic leading-relaxed text-forest">
                        “{story.quote}”
                      </blockquote>
                      <figcaption className="mt-3 text-xs font-semibold text-ink/75">
                        {story.name} · {story.place}
                      </figcaption>
                    </OrganicCard>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
