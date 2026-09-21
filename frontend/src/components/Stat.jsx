import useReveal from '../hooks/useReveal'
import useCountUp from '../hooks/useCountUp'

/** Locale-aware formatting so 18600 reads as "18,600". */
function format(value, decimals) {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * Stat — a single impact figure that grows from zero once it scrolls into view.
 * A thin accent bar fills proportionally, echoing a shoot breaking ground.
 */
export default function Stat({ value, decimals = 0, suffix = '', label }) {
  const [ref, visible] = useReveal({ threshold: 0.4 })
  const current = useCountUp(value, visible)

  const progress = value > 0 ? Math.min(current / value, 1) : 0

  return (
    <div
      ref={ref}
      className="group relative flex h-full flex-col overflow-hidden rounded-leaf border border-forest/10 bg-white/70 p-7 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-soft"
    >
      <p className="font-display text-4xl leading-none text-forest sm:text-[2.75rem]">
        {format(current, decimals)}
        <span className="text-moss">{suffix}</span>
      </p>

      <p className="mt-3 text-sm font-semibold leading-relaxed text-ink/75">{label}</p>

      {/* Accent bar fills in proportion to the figure — a shoot breaking ground. */}
      <div className="mt-auto pt-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-sage/35">
          <div
            className="h-full rounded-full bg-gradient-to-r from-moss to-leaf transition-[width] duration-300 ease-out"
            style={{ width: `${progress * 100}%` }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}
