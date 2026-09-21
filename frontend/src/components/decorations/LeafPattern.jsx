import { useId } from 'react'

/**
 * A delicate, repeating leaf-vein motif.
 *
 * Used behind community and call-to-action bands at very low opacity — the
 * "canopy shade" of the page, felt more than seen.
 */
export default function LeafPattern({ className = '', opacity = 0.06 }) {
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
          id={`${id}-leaves`}
          width="90"
          height="90"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(16)"
        >
          <g fill="none" stroke="#4A6741" strokeLinecap="round">
            <path
              d="M40 12c-13 12-19 27-14 38 4 9 18 9 24-1 7-11 4-26-10-37Z"
              strokeWidth="1.1"
            />
            <path d="M40 50C38 37 33 24 26 16" strokeWidth="0.7" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}-leaves)`} opacity={opacity} />
    </svg>
  )
}
