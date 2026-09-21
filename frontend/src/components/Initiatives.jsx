import { initiatives } from '../data/content'
import InitiativeCard from './InitiativeCard'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

/**
 * Initiatives — seven entry points into the same system.
 *
 * Seven cards is more than a grid of four would be, so the layout uses three
 * columns on wide screens and lets the last row breathe rather than stretching
 * two cards across the full width.
 */
export default function Initiatives() {
  return (
    <section
      id="initiatives"
      className="relative py-24 sm:py-32"
      aria-labelledby="initiatives-heading"
    >
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          id="initiatives-heading"
          align="center"
          eyebrow={initiatives.eyebrow}
          title={initiatives.title}
          body={initiatives.body}
        />

        <div className="mt-16 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {initiatives.items.map((item, index) => (
            <Reveal
              key={item.title}
              delay={(index % 3) * 120}
              className={index === initiatives.items.length - 1 ? 'lg:col-start-2' : ''}
            >
              <InitiativeCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
