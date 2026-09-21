import { useRef, useState } from 'react'
import { getTone } from '../data/tones'
import { fetchRecommendations } from '../services/api'
import { IconAlert, IconArrowRight, IconCheck, iconMap } from './Icons'
import NatureImage from './NatureImage'

const EFFORT_LABEL = { low: 'Quick win', medium: 'Some effort', high: 'Longer term' }

/**
 * InitiativeCard — one sustainability area.
 *
 * The card shows the problem, the action and the effect before asking for a
 * click. "Learn more" then retrieves the fuller guidance from the API's
 * recommendation catalogue, so the expanded panel and the assistant's advice
 * come from the same source rather than drifting apart.
 */
export default function InitiativeCard({ item }) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState('idle')
  const [recommendations, setRecommendations] = useState([])
  const [error, setError] = useState(null)
  const panelId = `initiative-${item.topic}`
  const requested = useRef(false)

  const Icon = iconMap[item.icon]
  const tone = getTone(item.tone)

  const toggle = async () => {
    const next = !open
    setOpen(next)

    if (!next || requested.current) return
    requested.current = true
    setStatus('loading')
    setError(null)

    try {
      const data = await fetchRecommendations(item.topic)
      setRecommendations(data.recommendations ?? [])
      setStatus('ready')
    } catch (caught) {
      setError(caught?.message || 'Could not load the guidance.')
      setStatus('failed')
      // Allow a retry on the next open.
      requested.current = false
    }
  }

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-leaf border bg-white/75 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:shadow-soft ${tone.border} ${tone.glow}`}
    >
      <div className="relative">
        <NatureImage
          src={item.image.src}
          alt={item.image.alt}
          sizes="(min-width: 768px) 33vw, 100vw"
          className="aspect-[16/10]"
          imgClassName="group-hover:scale-[1.06]"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-forest/55 via-forest/10 to-transparent"
        />

        <span
          className={`absolute -bottom-6 left-7 grid h-14 w-14 place-items-center rounded-pebble shadow-soft ring-4 ring-white/85 transition-transform duration-500 group-hover:scale-105 ${tone.solid}`}
        >
          {Icon && <Icon className="h-7 w-7" />}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-7 pb-7 pt-11">
        <h3 className="text-xl">{item.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink/75">{item.body}</p>

        <dl className="mt-5 space-y-3.5 border-t border-forest/10 pt-5">
          {[
            ['Problem', item.problem],
            ['What helps', item.action],
            ['What changes', item.impact]
          ].map(([label, value]) => (
            <div key={label}>
              <dt
                className={`text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${tone.metric}`}
              >
                {label}
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-ink/75">{value}</dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="mt-6 inline-flex w-fit items-center gap-2 rounded-pebble border border-forest/15 px-4 py-2.5 text-sm font-semibold text-forest transition hover:-translate-y-0.5 hover:bg-pale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {open ? 'Hide guidance' : 'Learn more'}
          <IconArrowRight
            aria-hidden="true"
            className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
          />
        </button>

        {/* Panel stays mounted so the transition can play; hidden from AT when closed. */}
        <div
          id={panelId}
          hidden={!open}
          className="mt-4 rounded-stone border border-forest/10 bg-mist/70 p-5"
        >
          {status === 'loading' && (
            <p role="status" aria-live="polite" className="text-sm text-ink/75">
              Loading guidance…
            </p>
          )}

          {status === 'failed' && (
            <p role="alert" className="flex gap-2.5 text-sm leading-relaxed text-[#8A5258]">
              <IconAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          {status === 'ready' && (
            <ul className="space-y-4">
              {recommendations.map((rec) => (
                <li key={rec.id}>
                  <p className="flex gap-2.5 text-sm font-semibold leading-snug text-forest">
                    <IconCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#3F6E33]" />
                    {rec.title}
                  </p>
                  <p className="mt-1.5 pl-6 text-xs leading-relaxed text-ink/75">{rec.detail}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-2 pl-6 text-[0.7rem]">
                    <span className="rounded-full bg-white/80 px-2.5 py-0.5 font-semibold text-ink/75">
                      {EFFORT_LABEL[rec.effort] ?? rec.effort}
                    </span>
                    {rec.sdg?.length > 0 && (
                      <span className="text-ink/75">SDG {rec.sdg.join(' · ')}</span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </article>
  )
}
