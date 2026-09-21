import { useCallback, useState } from 'react'
import { ApiError, calculateImpact } from '../services/api'
import { impactDefaults } from '../data/impactOptions'

/**
 * useImpact — inputs and results for the Impact Analyzer.
 *
 * The hook holds the form state; it never derives an emission figure itself.
 * Every number shown to the reader arrives from the server, which is what makes
 * the result auditable.
 */
export default function useImpact({ onInputsChange } = {}) {
  const [inputs, setInputs] = useState(impactDefaults)
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState('idle') // idle | pending | ready | failed
  const [error, setError] = useState(null)

  /** Update one nested section without disturbing the others. */
  const update = useCallback((section, key, value) => {
    setInputs((current) => ({
      ...current,
      [section]: { ...current[section], [key]: value }
    }))
  }, [])

  const calculate = useCallback(async () => {
    setStatus('pending')
    setError(null)

    try {
      const data = await calculateImpact(inputs)
      setResult(data)
      setStatus('ready')
      // Let the assistant answer follow-up questions using this profile. Only
      // the inputs travel — the server recomputes the figures itself.
      onInputsChange?.(inputs)
    } catch (caught) {
      const message =
        caught instanceof ApiError && caught.offline
          ? 'Could not reach the Verdant API. Start the backend and try again.'
          : caught?.message || 'The calculation failed.'

      setError(message)
      setStatus('failed')
    }
  }, [inputs, onInputsChange])

  const reset = useCallback(() => {
    setInputs(impactDefaults)
    setResult(null)
    setStatus('idle')
    setError(null)
    onInputsChange?.(null)
  }, [onInputsChange])

  return { inputs, update, result, status, error, calculate, reset }
}
