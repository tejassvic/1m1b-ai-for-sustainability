import { assistant as copy } from '../data/assistant'
import { IconAlert, IconArrowRight, IconCheck, IconLeaf, IconSparkle } from './Icons'
import RichText from './RichText'

/** Human-readable names for the provider identifiers the API returns. */
const PROVIDER_LABELS = {
  'watsonx-granite': 'IBM Granite · watsonx.ai',
  'ollama-granite': 'IBM Granite · local Ollama',
  'grounded-extractive': 'Assembled from sources — no model configured'
}

/**
 * ChatMessage — one turn in the conversation.
 *
 * Assistant answers are structured rather than a single blob: the answer, then
 * the actions it recommends, then the sources it used. That order matches how a
 * reader should evaluate it — understand the advice, then check where it came
 * from — and it keeps the grounding visible instead of decorative.
 */
export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <article className="flex justify-end" aria-label={`${copy.labels.you}: ${message.content}`}>
        <div className="max-w-[85%] rounded-[1.5rem_1.5rem_0.4rem_1.5rem] bg-forest px-5 py-3.5 text-sm leading-relaxed text-mist shadow-soft">
          {message.content}
        </div>
      </article>
    )
  }

  if (message.failed) {
    return (
      <article className="flex gap-3" aria-label={`${copy.labels.assistant}: error`}>
        <Avatar tone="alert" />
        <div className="max-w-[88%] rounded-[1.5rem_1.5rem_1.5rem_0.4rem] border border-blush/45 bg-blush/10 px-5 py-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-[#8A5258]">
            <IconAlert className="h-4 w-4" />
            {message.offline ? 'Assistant offline' : 'Something went wrong'}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink/75">{message.content}</p>
        </div>
      </article>
    )
  }

  const hasSources = message.sources?.length > 0
  const hasActions = message.actions?.length > 0

  return (
    <article className="flex gap-3" aria-label={copy.labels.assistant}>
      <Avatar tone="leaf" />

      <div className="min-w-0 max-w-[88%] flex-1 rounded-[1.5rem_1.5rem_1.5rem_0.4rem] border border-forest/10 bg-white/80 px-5 py-4 shadow-soft backdrop-blur-sm">
        <RichText text={message.content} className="text-sm leading-relaxed text-ink/85" />

        {hasActions && (
          <section className="mt-5 border-t border-forest/10 pt-4">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-moss">
              {copy.labels.actions}
            </h4>
            <ul className="mt-3 space-y-2.5">
              {message.actions.map((action) => (
                <li key={action} className="flex gap-2.5 text-sm leading-relaxed text-ink/80">
                  <IconCheck
                    aria-hidden="true"
                    className="mt-0.5 h-4 w-4 shrink-0 text-[#3F6E33]"
                  />
                  <span className="min-w-0">{action}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {hasSources && (
          <details className="group mt-5 border-t border-forest/10 pt-4">
            <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-moss transition hover:text-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-white">
              <IconArrowRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-open:rotate-90"
              />
              {copy.labels.sources} ({message.sources.length})
            </summary>

            <ul className="mt-4 space-y-4">
              {message.sources.map((source, index) => (
                <li
                  key={`${source.title}-${index}`}
                  className="rounded-pebble border border-forest/10 bg-mist/70 p-4"
                >
                  <p className="text-sm font-semibold leading-snug text-forest">{source.title}</p>
                  <p className="mt-1 text-xs font-medium text-moss">{source.publisher}</p>
                  {source.excerpt && (
                    <p className="mt-2 text-xs leading-relaxed text-ink/75">{source.excerpt}</p>
                  )}
                  {source.url && (
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-[#35687A] underline decoration-dotted underline-offset-2 transition hover:text-forest"
                    >
                      Open the source
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </details>
        )}

        <footer className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-forest/10 pt-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-pale px-2.5 py-1 text-[0.7rem] font-semibold text-forest">
            <IconSparkle aria-hidden="true" className="h-3 w-3 text-moss" />
            {PROVIDER_LABELS[message.provider] ?? message.provider ?? 'Verdant'}
          </span>
          {message.grounded === false && (
            <span className="text-[0.7rem] font-medium text-[#8A5258]">
              No matching sources were found
            </span>
          )}
        </footer>
      </div>
    </article>
  )
}

/** The small round marker that identifies who is speaking. */
function Avatar({ tone }) {
  const isAlert = tone === 'alert'

  return (
    <span
      aria-hidden="true"
      className={`mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full shadow-soft ${
        isAlert ? 'bg-blush/25 text-[#8A5258]' : 'bg-canopy text-mist'
      }`}
    >
      {isAlert ? <IconAlert className="h-4 w-4" /> : <IconLeaf className="h-4 w-4 animate-sway-slow" />}
    </span>
  )
}

/**
 * TypingIndicator — shown while the assistant is retrieving and generating.
 *
 * Announced politely rather than assertively, so a screen reader is told what is
 * happening without interrupting the sentence it is already reading.
 */
export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 text-sm text-ink/75" role="status" aria-live="polite">
      <span
        aria-hidden="true"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-canopy text-mist shadow-soft"
      >
        <IconLeaf className="h-4 w-4 animate-sway-slow" />
      </span>

      <span className="flex items-center gap-2">
        <span className="sr-only">{copy.labels.thinking}</span>
        <span aria-hidden="true" className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className="h-2 w-2 rounded-full bg-moss/70 animate-typing"
              style={{ animationDelay: `${index * 0.18}s` }}
            />
          ))}
        </span>
        <span aria-hidden="true" className="text-ink/75">
          {copy.labels.thinking}
        </span>
      </span>
    </div>
  )
}
