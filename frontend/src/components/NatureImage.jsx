import { useState } from 'react'

const UNSPLASH = 'https://images.unsplash.com/'
const ALLOWED_HOST = 'images.unsplash.com'

/**
 * Builds a single Unsplash delivery URL at a given width/quality.
 * Passing a pre-formatted absolute URL simply returns it untouched.
 */
function buildSrc(base, width, quality) {
  if (!base) return ''
  if (!base.startsWith(UNSPLASH)) return base

  const id = base.slice(UNSPLASH.length)
  return `${UNSPLASH}${id}?w=${width}&q=${quality}&auto=format&fit=crop`
}

/**
 * NatureImage — the photographic layer of the site.
 *
 * Two ways to place it:
 *  - Default: an in-flow block, sized by the parent or by an `aspect-*` class.
 *  - `fill`: an absolutely positioned layer that covers the nearest positioned
 *    ancestor, for section backgrounds behind a gradient wash.
 *
 * `fill` exists because the two positions cannot be expressed by class alone.
 * Tailwind emits `.relative` *after* `.absolute`, so an element carrying both
 * is relative and `absolute` is silently discarded. That turned section
 * backgrounds into in-flow blocks that pushed the section's own content down
 * and left a large empty band above it. The wrapper's position is therefore
 * owned by this component, never by the caller's `className`.
 *
 * Sustainability + resilience by design:
 *  - A soft natural-gradient "landscape" sits underneath permanently, so the
 *    layout never collapses and no broken-image icon ever appears.
 *  - The real photograph streams in lazily with a responsive `srcset`/`sizes`
 *    pair, so phones download small files and desktops get the detail.
 *  - The photo cross-fades in on load (motion is skipped automatically under
 *    `prefers-reduced-motion`, because the global CSS neutralises transitions).
 */
export default function NatureImage({
  src,
  alt,
  className = '',
  imgClassName = '',
  fill = false,
  sizes = '100vw',
  widths = [480, 768, 1024, 1440, 1920],
  quality = 70,
  priority = false,
  fallbackClass = 'bg-gradient-to-br from-mistblue via-pale to-sage/60'
}) {
  const [loaded, setLoaded] = useState(false)

  const srcSet = widths.map((w) => `${buildSrc(src, w, quality)} ${w}w`).join(', ')
  const widest = widths[widths.length - 1]

  return (
    <div
      className={`${fill ? 'absolute inset-0' : 'relative'} overflow-hidden bg-pale ${className}`}
    >
      {/* Permanent natural gradient: the calm backdrop behind every photo. */}
      <div className={`absolute inset-0 ${fallbackClass}`} aria-hidden="true" />

      <img
        src={buildSrc(src, 1024, quality)}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={widest}
        height={Math.round(widest * 0.625)}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(false)}
        data-host={ALLOWED_HOST}
        className={`h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-out ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${imgClassName}`}
      />
    </div>
  )
}
