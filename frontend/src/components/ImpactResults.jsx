import { impactCopy as copy } from '../data/impactOptions'
import { IconArrowRight, IconCheck, IconSparkle } from './Icons'
import CircularMeter from './CircularMeter'
import ImpactBar from './ImpactBar'
import Reveal from './Reveal'

const CATEGORY_TONE = {
  transport: 'blush',
  energy: 'pollen',
  waste: 'leaf',
  lifestyle: 'water'
}

const EFFORT_LABEL = { low: 'Quick win', medium: 'Some effort', high: 'Longer term' }

const PROVIDER_LABELS = {
  'watsonx-granite': 'IBM Granite · watsonx.ai',
  'ollama-granite': 'IBM Granite · local Ollama',
  'grounded-extractive': 'Calculated summary — no model configured'
}

const KG = (value) => `${Math.round(value).toLocaleString('en-IN')} kg CO₂e`

/**
 * ImpactResults — the evaluation half of the analyzer.
 *
 * Every figure here arrived from the server's deterministic model. This
 * component formats and lays out; it never derives. That constraint is what lets
 * a reader check the number against the method disclosed at the foot of the panel.
 */
export default function ImpactResults({ result }) {
  const { current, sustainable, savings, band, band_label: bandLabel, comparisons } = result

  const max = current.total_kg_co2e_per_year || 1

  return (
    <div className="space-y-6">
      {/* ------------------------------- Headline ------------------------------ */}
      <Reveal>
        <div className="grid items-center gap-8 rounded-leaf border border-forest/10 bg-white/75 p-7 shadow-soft backdrop-blur-sm sm:grid-cols-[auto_1fr] sm:p-8">
          <CircularMeter value={current.total_kg_co2e_per_year} max={max} band={band} active />

          <div>
            <p className="eyebrow">{copy.resultLabels.current}</p>

            <p className="mt-3 font-display text-2xl leading-snug text-forest">{bandLabel}</p>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink/75">
              Your estimated total is{' '}
              <strong className="font-semibold text-forest">
                {KG(current.total_kg_co2e_per_year)}
              </strong>{' '}
              a year. The same inputs with the modelled improvements come to{' '}
              <strong className="font-semibold text-forest">
                {KG(sustainable.total_kg_co2e_per_year)}
              </strong>
              .
            </p>

            {savings.kg_co2e_per_year > 0 && (
              <div className="mt-5 inline-flex flex-wrap items-center gap-3 rounded-pebble border border-leaf/30 bg-leaf/10 px-4 py-3">
                <span className="text-sm font-semibold text-[#3F6E33]">
                  {copy.resultLabels.savings}: {KG(savings.kg_co2e_per_year)}
                </span>
                <span className="rounded-full bg-white/70 px-2.5 py-0.5 text-xs font-semibold text-forest">
                  {savings.percent.toFixed(0)}% lower
                </span>
                {savings.trees_equivalent > 0 && (
                  <span className="text-xs text-ink/75">
                    ≈ {savings.trees_equivalent.toLocaleString('en-IN')} {copy.resultLabels.trees}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* ----------------------------- Contributors ---------------------------- */}
      <Reveal delay={90}>
        <div className="rounded-leaf border border-forest/10 bg-white/75 p-7">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-lg">{copy.resultLabels.contributors}</h3>
            <p className="text-xs text-ink/75">
              Share of your total · the lighter overlay marks the improved case
            </p>
          </div>

          <ul className="mt-6 space-y-5">
            {current.contributors.map((contributor) => (
              <ImpactBar
                key={contributor.key}
                label={contributor.label}
                valueLabel={KG(contributor.current_kg)}
                share={contributor.share}
                tone={CATEGORY_TONE[contributor.key] ?? 'leaf'}
                secondaryShare={
                  current.total_kg_co2e_per_year
                    ? contributor.sustainable_kg / current.total_kg_co2e_per_year
                    : 0
                }
              />
            ))}
          </ul>
        </div>
      </Reveal>

      {/* ------------------------------ Comparisons ---------------------------- */}
      {comparisons?.length > 0 && (
        <Reveal delay={140}>
          <div className="rounded-leaf border border-forest/10 bg-white/75 p-7">
            <h3 className="text-lg">{copy.resultLabels.comparisons}</h3>
            <p className="mt-1.5 text-sm text-ink/75">The same activity, a different choice.</p>

            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {comparisons.map((option) => (
                <li key={option.key} className="rounded-stone border border-forest/10 bg-mist/60 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-moss">
                    {option.label}
                  </p>

                  <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-pebble bg-white/80 px-2.5 py-1 font-medium text-ink/75">
                      {option.current_label}
                    </span>
                    <IconArrowRight aria-hidden="true" className="h-4 w-4 text-moss" />
                    <span className="rounded-pebble bg-leaf/15 px-2.5 py-1 font-semibold text-[#3F6E33]">
                      {option.better_label}
                    </span>
                  </p>

                  <p className="mt-4 font-display text-xl text-forest">
                    −{Math.round(option.saving_kg).toLocaleString('en-IN')}
                    <span className="ml-1.5 font-sans text-sm font-semibold text-moss">
                      kg CO₂e / year
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}

      {/* ---------------------------- Recommendations -------------------------- */}
      {result.recommendations?.length > 0 && (
        <Reveal delay={190}>
          <div className="rounded-leaf border border-forest/10 bg-white/75 p-7">
            <h3 className="text-lg">{copy.resultLabels.recommendations}</h3>

            <ol className="mt-6 space-y-4">
              {result.recommendations.map((item, index) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-stone border border-forest/10 bg-mist/50 p-5"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-canopy font-display text-sm font-semibold text-mist">
                    {index + 1}
                  </span>

                  <div className="min-w-0">
                    <p className="font-semibold leading-snug text-forest">{item.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink/75">{item.detail}</p>

                    <p className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-pale px-2.5 py-1 font-semibold text-forest">
                        {item.category}
                      </span>
                      <span className="rounded-full bg-white/80 px-2.5 py-1 font-semibold text-ink/75">
                        {EFFORT_LABEL[item.effort] ?? item.effort}
                      </span>
                      {item.kg_saved_per_year > 0 && (
                        <span className="rounded-full bg-leaf/15 px-2.5 py-1 font-semibold text-[#3F6E33]">
                          ≈ {Math.round(item.kg_saved_per_year).toLocaleString('en-IN')} kg / year
                        </span>
                      )}
                      {item.sdg?.length > 0 && (
                        <span className="text-ink/75">SDG {item.sdg.join(' · ')}</span>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      )}

      {/* ------------------------------ Explanation ---------------------------- */}
      <Reveal delay={240}>
        <div className="rounded-leaf border border-moss/25 bg-sage/10 p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg">{copy.resultLabels.explanation}</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[0.7rem] font-semibold text-forest">
              <IconSparkle aria-hidden="true" className="h-3 w-3 text-moss" />
              {PROVIDER_LABELS[result.provider] ?? result.provider}
            </span>
          </div>

          <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80">
            {String(result.explanation)
              .split(/\n{2,}/)
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-forest/10 pt-4">
            <p className="flex gap-2.5 text-xs leading-relaxed text-ink/75">
              <IconCheck aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss" />
              <span>
                <strong className="font-semibold text-forest">Method.</strong>{' '}
                {result.methodology}
              </span>
            </p>
            <p className="text-xs leading-relaxed text-ink/75">{result.disclaimer}</p>
          </div>
        </div>
      </Reveal>
    </div>
  )
}
