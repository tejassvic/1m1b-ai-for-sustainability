import { iconMap, IconCheck, IconGauge, IconRefresh } from './Icons'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { ChoicePills, FieldGroup, RangeField, ToggleField } from './FormFields'
import ImpactResults from './ImpactResults'
import useImpact from '../hooks/useImpact'
import {
  impactCopy as copy,
  impactFields,
  purchasingLevels,
  transportModes
} from '../data/impactOptions'

const WHAT_YOU_GET = [
  'An estimated annual total, with the band it falls into',
  'Which category contributes most, and by how much',
  'A current-choice versus better-choice comparison',
  'The actions that would move your number the furthest'
]

/**
 * ImpactAnalyzer — decision support for everyday sustainability choices.
 *
 * The form is deliberately short. Four inputs are enough to identify where the
 * biggest reduction lives, and a long questionnaire would lose the visitor
 * before it produced a result.
 *
 * No figure on this page is computed here. Inputs go to the API, arithmetic
 * happens there, and the response is rendered as-is — which is what makes the
 * result reproducible and the method worth stating.
 */
export default function ImpactAnalyzer({ onInputsChange = null }) {
  const { inputs, update, result, status, error, calculate, reset } = useImpact({ onInputsChange })

  const pending = status === 'pending'

  return (
    <section
      id="impact"
      className="relative overflow-hidden bg-sky-fade py-24 sm:py-32"
      aria-labelledby="impact-heading"
    >
      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          id="impact-heading"
          align="center"
          eyebrow={copy.eyebrow}
          title={copy.title}
          body={copy.body}
        />

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[1fr_1.35fr]">
          <Reveal>
            <form
              onSubmit={(event) => {
                event.preventDefault()
                calculate()
              }}
              className="space-y-5"
            >
              <FieldGroup
                legend={impactFields.transport.legend}
                hint={impactFields.transport.hint}
                tone="blush"
              >
                <ChoicePills
                  legend="How you usually travel"
                  name="transport-mode"
                  options={transportModes}
                  icons={iconMap}
                  value={inputs.transport.mode}
                  onChange={(value) => update('transport', 'mode', value)}
                />
                <RangeField
                  id="transport-distance"
                  label={impactFields.transport.distanceLabel}
                  unit={impactFields.transport.unit}
                  value={inputs.transport.distance_km_per_week}
                  max={impactFields.transport.max}
                  step={impactFields.transport.step}
                  onChange={(value) => update('transport', 'distance_km_per_week', value)}
                />
              </FieldGroup>

              <FieldGroup
                legend={impactFields.energy.legend}
                hint={impactFields.energy.hint}
                tone="pollen"
              >
                <RangeField
                  id="energy-kwh"
                  label={impactFields.energy.label}
                  unit={impactFields.energy.unit}
                  value={inputs.energy.electricity_kwh_per_month}
                  max={impactFields.energy.max}
                  step={impactFields.energy.step}
                  onChange={(value) => update('energy', 'electricity_kwh_per_month', value)}
                />
              </FieldGroup>

              <FieldGroup
                legend={impactFields.waste.legend}
                hint={impactFields.waste.hint}
                tone="leaf"
              >
                <RangeField
                  id="waste-kg"
                  label={impactFields.waste.label}
                  unit={impactFields.waste.unit}
                  value={inputs.waste.waste_kg_per_week}
                  max={impactFields.waste.max}
                  step={impactFields.waste.step}
                  onChange={(value) => update('waste', 'waste_kg_per_week', value)}
                />
                <div className="space-y-3 pt-1">
                  <ToggleField
                    id="waste-recycles"
                    label={impactFields.waste.recyclesLabel}
                    checked={inputs.waste.recycles}
                    onChange={(value) => update('waste', 'recycles', value)}
                  />
                  <ToggleField
                    id="waste-composts"
                    label={impactFields.waste.compostsLabel}
                    checked={inputs.waste.composts}
                    onChange={(value) => update('waste', 'composts', value)}
                  />
                </div>
              </FieldGroup>

              <FieldGroup
                legend={impactFields.lifestyle.legend}
                hint={impactFields.lifestyle.hint}
                tone="water"
              >
                <RangeField
                  id="lifestyle-items"
                  label={impactFields.lifestyle.itemsLabel}
                  unit={impactFields.lifestyle.itemsUnit}
                  value={inputs.lifestyle.single_use_items_per_week}
                  max={impactFields.lifestyle.max}
                  step={impactFields.lifestyle.step}
                  onChange={(value) => update('lifestyle', 'single_use_items_per_week', value)}
                />
                <ChoicePills
                  legend={impactFields.lifestyle.purchasingLabel}
                  name="purchasing"
                  options={purchasingLevels}
                  value={inputs.lifestyle.sustainable_purchasing}
                  onChange={(value) => update('lifestyle', 'sustainable_purchasing', value)}
                />
              </FieldGroup>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={pending}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  <IconGauge aria-hidden="true" className="h-4 w-4" />
                  {result ? copy.recalculate : copy.cta}
                </button>

                <button
                  type="button"
                  onClick={reset}
                  disabled={pending}
                  className="btn-ghost disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <IconRefresh aria-hidden="true" className="h-4 w-4" />
                  {copy.reset}
                </button>
              </div>

              <p className="text-xs leading-relaxed text-ink/75">{copy.disclaimer}</p>
            </form>
          </Reveal>

          <ResultsColumn result={result} status={status} error={error} />
        </div>
      </div>
    </section>
  )
}

/** The right-hand column: result, empty state, or failure. */
function ResultsColumn({ result, status, error }) {
  if (status === 'failed') {
    return (
      <Reveal>
        <div
          role="alert"
          className="rounded-leaf border border-blush/45 bg-blush/10 p-7 text-sm leading-relaxed text-ink/80"
        >
          <p className="font-semibold text-[#8A5258]">The calculation did not complete</p>
          <p className="mt-2">{error}</p>
        </div>
      </Reveal>
    )
  }

  if (status === 'pending') {
    return (
      <Reveal>
        <div
          role="status"
          aria-live="polite"
          className="rounded-leaf border border-forest/10 bg-white/40 p-12 text-center"
        >
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-pale text-moss">
            <IconGauge className="h-7 w-7 animate-sway-slow" />
          </span>
          <p className="mt-4 text-sm text-ink/75">Calculating your estimate…</p>
        </div>
      </Reveal>
    )
  }

  if (result) {
    return <ImpactResults result={result} />
  }

  return (
    <Reveal delay={120}>
      <div className="rounded-leaf border border-forest/10 bg-white/60 p-7 backdrop-blur-sm sm:p-8">
        <h3 className="text-lg">What you will get back</h3>
        <ul className="mt-5 space-y-3.5">
          {WHAT_YOU_GET.map((item) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/75">
              <IconCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#3F6E33]" />
              {item}
            </li>
          ))}
        </ul>

        <p className="mt-6 border-t border-forest/10 pt-5 text-xs leading-relaxed text-ink/75">
          Nothing is stored and no account is needed. The estimate is calculated on the Verdant
          server from fixed emission factors — the language model explains the result, it does not
          produce it.
        </p>
      </div>
    </Reveal>
  )
}
