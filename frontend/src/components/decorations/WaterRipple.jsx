import { useId } from 'react'

/**
 * A band of water ripples.
 *
 * Rendered as concentric, fading wave lines and layered above section seams so
 * one part of the page appears to flow into the next — like a stream crossing
 * a garden path.
 */
export default function WaterRipple({ className = '', style }) {
  const id = useId()

  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
          <stop offset="48%" stopColor="currentColor" stopOpacity="0.65" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 8, 16, 24].map((offset, index) => (
        <path
          key={offset}
          d={`M0 ${28 + offset} Q 75 ${16 + offset} 150 ${28 + offset} T 300 ${28 + offset} T 450 ${28 + offset} T 600 ${28 + offset} T 750 ${28 + offset} T 900 ${28 + offset} T 1050 ${28 + offset} T 1200 ${28 + offset}`}
          fill="none"
          stroke={`url(#${id}-fade)`}
          strokeWidth={2.2}
          opacity={0.95 - index * 0.2}
        />
      ))}
    </svg>
  )
}
