import { useId } from 'react'

/**
 * Fine wood-grain texture.
 *
 * A whisper-thin striation layer (default 7% opacity) that gives warm, earthy
 * surfaces a tactile quality without ever competing with the content above it.
 */
export default function WoodGrain({ className = '', opacity = 0.07 }) {
  const id = useId()

  return (
    <svg
      className={className}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id={`${id}-grain`}
          width="140"
          height="46"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0 9 Q 35 3 70 9 T 140 9" fill="none" stroke="#6F523B" strokeWidth="1" />
          <path d="M0 21 Q 35 15 70 21 T 140 21" fill="none" stroke="#6F523B" strokeWidth="0.7" />
          <path d="M0 34 Q 35 28 70 34 T 140 34" fill="none" stroke="#6F523B" strokeWidth="1.2" />
          <path d="M0 43 Q 35 39 70 43 T 140 43" fill="none" stroke="#8B6F5E" strokeWidth="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-grain)`} opacity={opacity} />
    </svg>
  )
}
