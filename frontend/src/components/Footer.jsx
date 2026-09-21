import { footer, organization } from '../data/content'
import { IconArrowRight } from './Icons'
import Leaf from './decorations/Leaf'
import WaterRipple from './decorations/WaterRipple'

/**
 * Footer — where the path returns to its beginning.
 *
 * Carries the SDG alignment, the responsible-AI statement and the privacy note,
 * because a reader who scrolls to the bottom should be able to find the terms on
 * which this product is offering advice without hunting for a policy page.
 */
export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-canopy text-mist">
      <WaterRipple className="pointer-events-none absolute inset-x-0 top-0 h-16 w-full text-mist/35" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 bottom-8 h-24 w-24 origin-bottom animate-sway-slow text-mist/10"
      >
        <Leaf className="h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-10 pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <a
              href="#top"
              className="inline-flex items-center gap-2.5 rounded-pebble focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pollen"
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-mist/15 ring-1 ring-mist/25">
                <Leaf className="h-5 w-5 origin-top animate-sway-slow text-pollen" />
              </span>
              <span className="font-display text-lg font-semibold">{organization.name}</span>
            </a>

            <p className="mt-3 font-display text-sm italic text-honey">{footer.blurb}</p>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-mist/85">{footer.detail}</p>

            <a
              href={`mailto:${organization.email}`}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-honey transition-all duration-300 hover:gap-3"
            >
              {organization.email}
              <IconArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Link columns */}
          {footer.columns.map((column) => {
            const isExternal = column.links.some((link) => link.href.startsWith('http'))

            return (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-mist/85">
                  {column.title}
                </h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(link.href.startsWith('http')
                          ? { target: '_blank', rel: 'noreferrer noopener' }
                          : {})}
                        className="text-sm text-mist/85 transition hover:text-honey"
                      >
                        {link.label}
                        {link.href.startsWith('http') && (
                          <span className="sr-only"> (opens in a new tab)</span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
                {isExternal && (
                  <p className="mt-4 text-[0.7rem] leading-relaxed text-mist/85">
                    Official United Nations goal pages.
                  </p>
                )}
              </nav>
            )
          })}
        </div>

        {/* Alignment, responsible AI and privacy in one quiet block. */}
        <div className="mt-14 space-y-3 rounded-leaf border border-mist/15 bg-mist/10 p-6">
          <p className="text-sm leading-relaxed text-mist/85">{footer.sdgLine}</p>
          <p className="text-xs leading-relaxed text-mist/85">{footer.responsibleLine}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-mist/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-mist/85">{footer.legal}</p>
          <p className="text-xs text-mist/85">{organization.place}</p>
        </div>
      </div>
    </footer>
  )
}
