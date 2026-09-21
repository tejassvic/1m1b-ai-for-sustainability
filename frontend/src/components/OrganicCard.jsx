import { getTone } from '../data/tones'

/**
 * OrganicCard — the shared soft surface.
 *
 * Rounded, gently lifted, with a botanical accent drawn from `tones`. Used
 * wherever a card is needed and no more specific component applies, so the
 * shape language stays consistent across the whole site.
 */
export default function OrganicCard({
  children,
  tone = 'leaf',
  as: Tag = 'article',
  interactive = true,
  className = '',
  ...rest
}) {
  const accent = getTone(tone)

  return (
    <Tag
      className={`group relative flex h-full flex-col overflow-hidden rounded-leaf border bg-white/70 backdrop-blur-sm transition-all duration-500 ${
        accent.border
      } ${
        interactive
          ? `hover:-translate-y-1.5 hover:border-forest/25 hover:shadow-soft ${accent.glow}`
          : ''
      } ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/**
 * ToneIcon — the small rounded accent tile that anchors most cards.
 * Kept beside OrganicCard so cards and their icons never drift apart.
 */
export function ToneIcon({ tone = 'leaf', icon: Icon, className = '' }) {
  const accent = getTone(tone)

  if (!Icon) return null

  return (
    <span
      aria-hidden="true"
      className={`grid h-12 w-12 shrink-0 place-items-center rounded-pebble transition-transform duration-500 group-hover:-rotate-6 ${accent.iconWrap} ${className}`}
    >
      <Icon className="h-6 w-6" />
    </span>
  )
}
