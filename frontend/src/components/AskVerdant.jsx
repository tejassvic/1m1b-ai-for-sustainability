import { useEffect, useRef, useState } from 'react'
import { assistant as copy } from '../data/assistant'
import useChat from '../hooks/useChat'
import ChatMessage, { TypingIndicator } from './ChatMessage'
import { IconCheck, IconGauge, IconLeaf, IconRefresh, IconSend, IconSparkle } from './Icons'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import SuggestionChip from './SuggestionChip'
import Leaf from './decorations/Leaf'

const MAX_LENGTH = 1200

const HOW_IT_WORKS = [
  {
    title: 'It retrieves first',
    body: 'Your question is matched against a curated knowledge base before any answer is written.'
  },
  {
    title: 'You can check it',
    body: 'Every answer lists its sources with the publisher, so a claim can be verified rather than believed.'
  },
  {
    title: 'It says what it does not know',
    body: 'If the sources do not cover your question, the answer says so instead of improvising.'
  }
]

const WONT_DO = [
  'Invent a statistic, a date or a citation',
  'Present an estimate as a measurement',
  'Calculate your impact — that is arithmetic, not language',
  'Keep your questions after you close the tab'
]

/**
 * AskVerdant — the conversational surface.
 *
 * The panel is built around evidence rather than magic: the answer arrives with
 * its actions and sources attached, the model that produced it is named, and the
 * composer states plainly that nothing is stored. An assistant that asks to be
 * trusted about environmental claims should be legible about how it reached them.
 */
export default function AskVerdant({ impactInputs = null }) {
  const { messages, status, send, reset } = useChat({ impact: impactInputs })
  const [draft, setDraft] = useState('')
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  const pending = status === 'pending'
  const isEmpty = messages.length === 0

  // Keep the newest turn in view as the conversation grows.
  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages, pending])

  const submit = (event) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text || pending) return
    setDraft('')
    send(text)
  }

  const handleKeyDown = (event) => {
    // Enter sends; Shift+Enter is left alone so a multi-line question is possible.
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit(event)
    }
  }

  const useSuggestion = (question) => {
    if (pending) return
    send(question)
    inputRef.current?.focus()
  }

  const remaining = MAX_LENGTH - draft.length

  return (
    <section
      id="assistant"
      className="relative overflow-hidden py-24 sm:py-32"
      aria-labelledby="assistant-heading"
    >
      {/* Ambient foliage, kept at the edges so it never competes with the panel. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Leaf className="absolute left-[3%] top-24 h-20 w-20 origin-top animate-sway text-leaf/20" />
        <Leaf
          className="absolute bottom-32 right-[5%] h-14 w-14 origin-top animate-sway-slow text-moss/20"
          style={{ animationDelay: '-3s' }}
        />
        <Leaf
          className="absolute bottom-16 left-[8%] h-10 w-10 origin-top animate-sway text-sage/30"
          style={{ animationDelay: '-5s' }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading align="center" eyebrow={copy.eyebrow} title={copy.title} body={copy.body} />

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[1.55fr_1fr]">
          <Reveal>
            <div className="overflow-hidden rounded-stone border border-forest/10 bg-white/75 shadow-soft backdrop-blur-sm">
              <header className="flex flex-wrap items-center justify-between gap-3 border-b border-forest/10 bg-pale/70 px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-canopy text-mist shadow-soft">
                    <IconLeaf className="h-5 w-5 animate-sway-slow" />
                  </span>
                  <div>
                    <p className="font-display text-base font-semibold text-forest">Ask Verdant</p>
                    <p className="text-xs text-ink/75">
                      {pending ? copy.labels.thinking : 'Grounded in cited sources'}
                    </p>
                  </div>
                </div>

                {!isEmpty && (
                  <button
                    type="button"
                    onClick={() => {
                      reset()
                      inputRef.current?.focus()
                    }}
                    className="inline-flex items-center gap-1.5 rounded-pebble border border-forest/15 px-3 py-1.5 text-xs font-semibold text-forest transition hover:bg-mist focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest"
                  >
                    <IconRefresh className="h-3.5 w-3.5" />
                    {copy.clearLabel}
                  </button>
                )}
              </header>

              {/* Conversation log. `aria-live` announces new turns politely. */}
              <div
                ref={scrollRef}
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                aria-label="Conversation with Verdant"
                className="max-h-[30rem] space-y-5 overflow-y-auto px-5 py-6 lg:max-h-[34rem]"
              >
                {isEmpty && (
                  <div className="flex flex-col items-center gap-4 py-6 text-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-pale text-moss">
                      <IconSparkle className="h-7 w-7" />
                    </span>
                    <div>
                      <p className="font-display text-lg text-forest">{copy.welcome.title}</p>
                      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/75">
                        {copy.welcome.body}
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {pending && <TypingIndicator />}
              </div>

              <div className="border-t border-forest/10 bg-mist/60 px-5 py-5">
                <fieldset className="mb-4 border-0 p-0" disabled={pending}>
                  <legend className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-moss">
                    Try asking
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {copy.suggested.map((question) => (
                      <SuggestionChip
                        key={question}
                        onSelect={useSuggestion}
                        disabled={pending}
                      >
                        {question}
                      </SuggestionChip>
                    ))}
                  </div>
                </fieldset>

                <form onSubmit={submit} className="flex flex-col gap-3">
                  <div className="flex items-end gap-3">
                    <label htmlFor="assistant-input" className="sr-only">
                      Your question
                    </label>
                    <textarea
                      id="assistant-input"
                      ref={inputRef}
                      rows={2}
                      value={draft}
                      onChange={(event) => setDraft(event.target.value.slice(0, MAX_LENGTH))}
                      onKeyDown={handleKeyDown}
                      placeholder={copy.placeholder}
                      aria-describedby="assistant-limits assistant-counter"
                      className="field min-h-[3.25rem] flex-1 resize-none"
                    />
                    <button
                      type="submit"
                      disabled={pending || !draft.trim()}
                      className="btn-primary shrink-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {copy.sendLabel}
                      <IconSend className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p
                      id="assistant-limits"
                      className="max-w-lg text-xs leading-relaxed text-ink/75"
                    >
                      {copy.limits}
                    </p>
                    <p
                      id="assistant-counter"
                      aria-label={`${remaining} characters remaining`}
                      className={`text-xs tabular-nums ${
                        remaining < 100 ? 'font-semibold text-[#8A5258]' : 'text-ink/75'
                      }`}
                    >
                      {remaining}
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </Reveal>

          {/* ------------------------------ Aside ------------------------------- */}
          <Reveal delay={140} className="flex flex-col gap-6">
            {impactInputs && (
              <div className="rounded-leaf border border-moss/30 bg-pale/80 p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-forest">
                  <IconGauge aria-hidden="true" className="h-4 w-4 text-moss" />
                  Your impact profile is attached
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink/75">
                  Follow-up questions will be answered against your own calculated figures. The
                  server recomputes them, so nothing here can be edited in transit.
                </p>
              </div>
            )}

            <div className="rounded-leaf border border-forest/10 bg-white/70 p-6">
              <h3 className="text-lg">How this works</h3>
              <ol className="mt-5 space-y-5">
                {HOW_IT_WORKS.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-pale font-display text-sm font-semibold text-forest">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-forest">{step.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink/75">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-leaf border border-forest/10 bg-sky-fade p-6">
              <h3 className="text-lg">What it will not do</h3>
              <ul className="mt-4 space-y-3">
                {WONT_DO.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-ink/75">
                    <IconCheck
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#3F6E33]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-ink/75">{copy.privacyNote}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
