import { hero } from '../data/content'
import { iconMap, IconArrowRight } from './Icons'
import NatureImage from './NatureImage'
import Reveal from './Reveal'
import Cloud from './decorations/Cloud'
import Leaf from './decorations/Leaf'
import RippleRings from './decorations/RippleRings'
import WaterRipple from './decorations/WaterRipple'

/**
 * Hero — the trailhead.
 *
 * A serene landscape sits behind drifting clouds and gently swaying leaves, so
 * the first impression is calm rather than loud. The motion is ambient only: it
 * never blocks reading, and it stops entirely under reduced-motion.
 *
 * The two calls to action establish the product immediately — one opens the
 * assistant, the other opens the calculator — so a visitor never has to guess
 * what is interactive.
 */
export default function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-screen items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      <NatureImage
        src={hero.image.src}
        alt={hero.image.alt}
        priority
        fill
        sizes="100vw"
        widths={[640, 960, 1280, 1600, 1920, 2560]}
        className="-z-30"
        imgClassName="scale-105"
      />

      {/* Light washes so text stays readable over any photograph. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-gradient-to-b from-mist/90 via-mist/70 to-pale/95"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-gradient-to-tr from-forest/25 via-transparent to-sky/30"
      />

      {/* Clouds drifting slowly across the sky. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Cloud className="absolute left-0 top-14 w-52 animate-drift text-white/55" />
        <Cloud
          className="absolute left-0 top-36 w-80 animate-drift-slow text-white/40"
          style={{ animationDelay: '-14s' }}
        />
        <Cloud
          className="absolute left-0 top-4 w-40 animate-drift text-white/45"
          style={{ animationDelay: '-34s' }}
        />
      </div>

      {/* Foliage swaying at the edges of the frame. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Leaf className="absolute right-[7%] top-24 h-16 w-16 origin-top animate-sway text-leaf/45" />
        <Leaf className="absolute left-[5%] top-56 h-10 w-10 origin-top animate-sway-slow text-moss/45" />
        <Leaf
          className="absolute bottom-28 right-[22%] h-12 w-12 origin-top animate-sway text-fern/40"
          style={{ animationDelay: '-2.6s' }}
        />
        <Leaf
          className="absolute bottom-40 left-[14%] h-8 w-8 origin-top animate-sway-slow text-sage/60"
          style={{ animationDelay: '-4.2s' }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-28 pt-36 sm:pt-40">
        <div className="max-w-2xl">
          <Reveal as="p" className="eyebrow">
            {hero.eyebrow}
          </Reveal>

          <Reveal as="h1" id="hero-title" delay={110} className="mt-5 text-4xl leading-[1.08] sm:text-6xl lg:text-7xl">
            {hero.headline.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </Reveal>

          <Reveal as="p" delay={220} className="mt-6 max-w-xl text-lg leading-relaxed text-ink/80">
            {hero.body}
          </Reveal>

          <Reveal delay={320} className="mt-9 flex flex-wrap items-center gap-3">
            <a href={hero.primaryCta.href} className="btn-primary">
              {hero.primaryCta.label}
              <IconArrowRight className="h-4 w-4" />
            </a>
            <a href={hero.secondaryCta.href} className="btn-ghost">
              {hero.secondaryCta.label}
            </a>
          </Reveal>

          <Reveal delay={420} as="ul" className="mt-12 flex flex-wrap gap-x-7 gap-y-3">
            {hero.highlights.map((item) => {
              const Icon = iconMap[item.icon]
              return (
                <li
                  key={item.label}
                  className="flex items-center gap-2.5 text-sm font-semibold text-forest"
                >
                  {Icon && (
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/70 text-moss shadow-soft">
                      <Icon className="h-4 w-4" />
                    </span>
                  )}
                  {item.label}
                </li>
              )
            })}
          </Reveal>
        </div>
      </div>

      {/* Water rings spreading where the land meets the stream. */}
      <RippleRings className="bottom-12 left-[9%] h-32 w-32 text-water/50" />
      <RippleRings className="bottom-28 right-[13%] h-20 w-20 text-sky/70" rings={2} />

      {/* Ripple seam: the section flows into the next like water over stones. */}
      <WaterRipple className="pointer-events-none absolute inset-x-0 bottom-0 h-16 w-full text-water/60" />
    </section>
  )
}
