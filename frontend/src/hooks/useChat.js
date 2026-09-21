import { useCallback, useRef, useState } from 'react'
import { ApiError, askVerdant } from '../services/api'

let sequence = 0
const nextId = () => {
  sequence += 1
  return `m${sequence}`
}

/** How many previous turns to replay to the model for conversational context. */
const HISTORY_TURNS = 6

/**
 * useChat — conversation state for Ask Verdant.
 *
 * The server is stateless by design: nothing is persisted, and the browser
 * replays the recent turns with each request. That keeps the privacy claim in
 * the interface literally true rather than aspirational.
 */
export default function useChat({ impact = null } = {}) {
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('idle') // idle | pending | failed
  const [failure, setFailure] = useState(null)
  const inFlight = useRef(false)

  const send = useCallback(
    async (text) => {
      const message = text.trim()
      if (!message || inFlight.current) return

      const outgoing = { id: nextId(), role: 'user', content: message }

      // Read the history before this turn is added, then keep only the tail.
      const history = messages
        .filter((item) => !item.failed)
        .slice(-HISTORY_TURNS)
        .map((item) => ({ role: item.role, content: item.content }))

      setMessages((current) => [...current, outgoing])
      setStatus('pending')
      setFailure(null)
      inFlight.current = true

      try {
        const data = await askVerdant({ message, history, impact })

        setMessages((current) => [
          ...current,
          {
            id: nextId(),
            role: 'assistant',
            content: data.answer,
            sources: data.sources ?? [],
            actions: data.actions ?? [],
            provider: data.provider,
            model: data.model,
            grounded: data.grounded,
            disclaimer: data.disclaimer
          }
        ])
        setStatus('idle')
      } catch (error) {
        const isApiError = error instanceof ApiError
        const detail = isApiError && error.offline
          ? 'The assistant is offline. Start the Verdant API and try again.'
          : error?.message || 'Something went wrong.'

        setMessages((current) => [
          ...current,
          {
            id: nextId(),
            role: 'assistant',
            content: detail,
            sources: [],
            actions: [],
            failed: true,
            offline: Boolean(isApiError && error.offline)
          }
        ])
        setFailure({ detail, offline: Boolean(isApiError && error.offline) })
        setStatus('failed')
      } finally {
        inFlight.current = false
      }
    },
    [messages, impact]
  )

  const reset = useCallback(() => {
    setMessages([])
    setStatus('idle')
    setFailure(null)
  }, [])

  return { messages, status, failure, send, reset }
}
