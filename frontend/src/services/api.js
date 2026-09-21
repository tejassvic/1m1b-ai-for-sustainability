/**
 * API client.
 *
 * A thin boundary between the interface and the FastAPI backend. Everything the
 * frontend knows about the API lives in this file, so the local development
 * proxy, a deployed origin, or a future versioned endpoint is a one-line change
 * rather than a search-and-replace.
 *
 * There is one deliberate rule: the frontend never calculates an environmental
 * figure. It sends inputs and renders what comes back, so a number on screen can
 * always be traced to the server's deterministic model.
 */

/** Dev: proxied by Vite to the FastAPI server. Prod: set VITE_API_BASE_URL. */
const BASE_URL = (import.meta.env?.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '')

const DEFAULT_TIMEOUT_MS = 60000

export class ApiError extends Error {
  constructor(message, { status = 0, offline = false, detail = null } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.offline = offline
    this.detail = detail
  }
}

/** Turn a FastAPI validation body into something a person can read. */
function describeValidation(detail) {
  if (typeof detail === 'string') return detail

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || item?.message)
      .filter(Boolean)
      .join('; ')
  }

  return null
}

async function request(path, { method = 'GET', body, signal } = {}) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS)

  // Respect an externally supplied signal as well as our own timeout.
  if (signal) {
    if (signal.aborted) controller.abort()
    else signal.addEventListener('abort', () => controller.abort(), { once: true })
  }

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    })
  } catch (error) {
    // A fetch rejection means the request never completed: server down, DNS
    // failure, or the network dropped. That is a different situation from an
    // API that answered with an error, and the interface says so differently.
    throw new ApiError('Could not reach the Verdant API.', { offline: true })
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    let detail = null
    try {
      detail = (await response.json())?.detail ?? null
    } catch {
      detail = null
    }

    throw new ApiError(describeValidation(detail) || `Request failed (${response.status})`, {
      status: response.status,
      detail
    })
  }

  return response.json()
}

/* -------------------------------------------------------------------------- */
/* Endpoints                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Ask a sustainability question.
 *
 * @param {object} params
 * @param {string} params.message
 * @param {Array<{role: 'user'|'assistant', content: string}>} [params.history]
 * @param {object|null} [params.impact]  Impact inputs; the server recalculates them.
 */
export function askVerdant({ message, history = [], impact = null, signal }) {
  return request('/chat', {
    method: 'POST',
    body: { message, history, impact },
    signal
  })
}

/** Estimate and explain an annual impact profile. */
export function calculateImpact(input, { signal } = {}) {
  return request('/impact', { method: 'POST', body: input, signal })
}

/** Topic-keyed recommendations, used by the initiative cards. */
export function fetchRecommendations(topic, { signal } = {}) {
  return request(`/recommendations?topic=${encodeURIComponent(topic)}`, { signal })
}

/** Service status: retrieval size and the model actually answering. */
export function fetchHealth({ signal } = {}) {
  return request('/health', { signal })
}
