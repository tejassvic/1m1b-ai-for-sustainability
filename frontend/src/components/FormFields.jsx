/**
 * Form primitives for the Impact Analyzer.
 *
 * Built on the platform's own elements rather than a UI library, so the controls
 * inherit the site's shapers and focus states. Each one is a real labelled input:
 * a slider is always paired with a number field, because a range control is
 * awkward to set precisely with a keyboard alone.
 */

/** A titled group of related controls. */
export function FieldGroup({ legend, hint, tone = 'leaf', children }) {
  const accent = {
    leaf: 'text-[#3F6E33]',
    water: 'text-[#35687A]',
    pollen: 'text-[#8A5E14]',
    blush: 'text-[#8A5258]'
  }[tone]

  return (
    <fieldset className="rounded-stone border border-forest/10 bg-mist/50 p-5 sm:p-6">
      <legend className={`px-2 text-sm font-semibold ${accent}`}>{legend}</legend>
      {hint && <p className="mt-1 text-xs leading-relaxed text-ink/75">{hint}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </fieldset>
  )
}

/** A slider paired with a number input, so it is usable with any input method. */
export function RangeField({ id, label, unit, value, min = 0, max, step = 1, onChange }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-forest">
          {label}
        </label>
        <span className="flex items-center gap-2">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-20 rounded-pebble border border-forest/15 bg-white/80 px-2.5 py-1.5 text-right text-sm tabular-nums text-ink transition focus:border-moss focus:outline-none focus:ring-2 focus:ring-leaf/25"
          />
          <span className="text-xs font-semibold text-moss" aria-hidden="true">
            {unit}
          </span>
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={`${label}, ${unit}`}
        className="range-natural mt-3 w-full"
      />
    </div>
  )
}

/**
 * A radio group rendered as pills.
 *
 * The native input stays in the DOM and keeps focus and keyboard behaviour; the
 * pill is only its visual surface. Nothing here is a div pretending to be a
 * control.
 */
export function ChoicePills({ legend, name, options, value, onChange, icons = {} }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-forest">{legend}</legend>

      {/* auto-fit keeps the pills readable at every width without a class per breakpoint. */}
      <div
        className="mt-3 grid gap-2"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(8.5rem, 1fr))' }}
      >
        {options.map((option) => {
          const Icon = icons[option.icon]
          const selected = value === option.value

          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-2 rounded-pebble border px-3.5 py-2.5 text-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-forest focus-within:ring-offset-2 focus-within:ring-offset-mist ${
                selected
                  ? 'border-moss/50 bg-forest text-mist shadow-soft'
                  : 'border-forest/15 bg-white/70 text-forest hover:-translate-y-0.5 hover:border-moss/40 hover:bg-pale'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {Icon && <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />}
              <span className="font-medium">{option.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

/** A checkbox styled as a switch, with the label still doing the work. */
export function ToggleField({ id, label, checked, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="sr-only"
      />
      <label
        htmlFor={id}
        className="flex cursor-pointer items-center gap-3 text-sm text-ink/80"
      >
        <span
          aria-hidden="true"
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-300 ${
            checked ? 'bg-moss' : 'bg-sage/50'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-300 ${
              checked ? 'translate-x-[1.45rem]' : 'translate-x-0.5'
            }`}
          />
        </span>
        <span className="font-medium">{label}</span>
      </label>
    </div>
  )
}
