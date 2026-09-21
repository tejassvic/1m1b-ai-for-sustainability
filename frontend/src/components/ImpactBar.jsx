const TONE_FILL = {
  leaf: 'from-moss to-leaf',
  water: 'from-water to-[#8FC0D0]',
  pollen: 'from-[#D9A93F] to-pollen',
  blush: 'from-[#C08C8C] to-blush'
}

/**
 * ImpactBar — one horizontal contribution bar.
 *
 * The numeric value is always printed beside the bar. A bar alone would encode
 * meaning in length and colour only, which fails for anyone who cannot
 * distinguish the hues.
 */
export default function ImpactBar({
  label,
  valueLabel,
  share,
  tone = 'leaf',
  secondaryShare = null
}) {
  const percent = Math.max(0, Math.min(share * 100, 100))
  const secondary = secondaryShare === null ? null : Math.max(0, Math.min(secondaryShare * 100, 100))

  return (
    <li className="group">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold text-forest">{label}</span>
        <span className="font-display text-sm text-ink/80">{valueLabel}</span>
      </div>

      <div
        className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-sage/30"
        role="img"
        aria-label={`${label}: ${valueLabel}, ${percent.toFixed(0)} percent of the total`}
      >
        <div
          className={`h-full rounded-full bg-gradient-to-r ${TONE_FILL[tone] ?? TONE_FILL.leaf} transition-[width] duration-700 ease-out`}
          style={{ width: `${percent}%` }}
        />

        {/* The improved scenario, drawn as a thin overlay on the same scale. */}
        {secondary !== null && (
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 rounded-full border-r-2 border-mist/90 bg-mist/25"
            style={{ width: `${secondary}%` }}
          />
        )}
      </div>
    </li>
  )
}
