const BAND_COLOR = {
  low: '#5E9C4F',
  moderate: '#E9C46A',
  high: '#D4A5A5'
}

/**
 * CircularMeter — the headline figure of an impact result.
 *
 * Drawn as an SVG ring rather than a bar chart, because the reader is comparing
 * one number against a scale, not several against each other. The numeric value
 * is printed in the centre, so the ring is reinforcement rather than the only
 * channel carrying the meaning.
 */
export default function CircularMeter({
  value = 0,
  max = 5000,
  band = 'moderate',
  unit = 'kg CO₂e',
  caption = 'per year',
  active = true,
  size = 208,
  stroke = 15
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = max > 0 ? Math.max(0, Math.min(value / max, 1)) : 0
  const offset = circumference * (1 - ratio)
  const colour = BAND_COLOR[band] ?? BAND_COLOR.moderate

  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
        focusable="false"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#DCE7D6"
          strokeWidth={stroke}
        />

        {/* Value — grows into place once the result is available. */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colour}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={active ? offset : circumference}
          style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>

      <div className="absolute inset-0 grid place-content-center text-center">
        <p className="font-display text-3xl leading-none text-forest sm:text-4xl">
          {Math.round(value).toLocaleString('en-IN')}
        </p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-moss">{unit}</p>
        <p className="mt-0.5 text-xs text-ink/75">{caption}</p>
      </div>
    </div>
  )
}
