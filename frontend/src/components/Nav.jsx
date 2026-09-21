import { useEffect, useState } from 'react'
import { navigation, navSectionIds, organization } from '../data/content'
import useScrollSpy from '../hooks/useScrollSpy'
import { IconClose, IconMenu, IconSparkle } from './Icons'
import Leaf from './decorations/Leaf'

/**
 * Nav — natural wayfinding.
 *
 * Section links are laid out like stones across a stream: the active "stone"
 * fills in as you travel, so a visitor always knows where they stand along the
 * path. On smaller screens the same trail unfurls as a soft, rounded panel.
 *
 * The assistant is both a section and the primary action, so it appears in the
 * trail and again as the button — a visitor who wants to ask something should
 * not have to go looking for it.
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const activeId = useScrollSpy(navSectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the mobile trail as soon as the viewport grows to desktop width.
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-6xl px-4">
        <nav
          aria-label="Primary"
          className={`mt-3 flex items-center justify-between gap-4 rounded-stone border px-4 py-3 transition-all duration-500 ${
            scrolled
              ? 'border-forest/10 bg-mist/85 shadow-soft backdrop-blur-md'
              : 'border-transparent bg-mist/40 backdrop-blur-sm'
          }`}
        >
          {/* Brand */}
          <a
            href="#top"
            className="flex shrink-0 items-center gap-2.5 rounded-pebble px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-canopy text-mist shadow-soft">
              <Leaf className="h-5 w-5 origin-top animate-sway-slow" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-semibold tracking-tight text-forest">
                {organization.name}
              </span>
              <span className="mt-0.5 hidden text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-moss sm:block">
                AI for sustainability
              </span>
            </span>
          </a>

          {/* Desktop stepping stones */}
          <ul className="hidden items-center gap-0.5 lg:flex">
            {navigation.map((item) => {
              const active = activeId === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={active ? 'true' : undefined}
                    className={`group flex items-center gap-2 rounded-pebble px-3 py-2 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${
                      active
                        ? 'bg-forest text-mist shadow-soft'
                        : 'text-forest hover:bg-pale hover:text-forest'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                        active ? 'bg-pollen' : 'bg-sage/60 group-hover:bg-sage'
                      }`}
                    />
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a href="#assistant" className="btn-primary hidden lg:inline-flex">
              <IconSparkle aria-hidden="true" className="h-4 w-4" />
              Ask Verdant
            </a>

            {/* Mobile trail toggle */}
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-trail"
              aria-label={open ? 'Close navigation' : 'Open navigation'}
              className="grid h-10 w-10 place-items-center rounded-pebble border border-forest/15 text-forest transition hover:bg-pale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest lg:hidden"
            >
              {open ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </nav>

        {/* Mobile trail */}
        {open && (
          <div
            id="mobile-trail"
            className="mt-2 origin-top animate-grow overflow-hidden rounded-stone border border-forest/10 bg-mist/95 p-3 shadow-soft backdrop-blur-md lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {navigation.map((item) => {
                const active = activeId === item.id

                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={() => setOpen(false)}
                      aria-current={active ? 'true' : undefined}
                      className={`flex items-center gap-2.5 rounded-pebble px-4 py-3 text-sm font-semibold transition ${
                        active ? 'bg-forest text-mist' : 'text-forest hover:bg-pale'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${
                          active ? 'bg-pollen' : 'bg-sage/60'
                        }`}
                      />
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>

            <a href="#assistant" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              <IconSparkle aria-hidden="true" className="h-4 w-4" />
              Ask Verdant
            </a>
          </div>
        )}
      </div>
    </header>
  )
}
