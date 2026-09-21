import { useEffect, useRef, useState } from 'react'

/**
 * Reveal-on-scroll.
 *
 * Watches an element and reports the first time it enters the viewport, so
 * content can "grow" into place like a plant reaching for light. The observer
 * detaches after the first reveal — nothing keeps watching once it has bloomed.
 */
export default function useReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -60px 0px'
} = {}) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Graceful fallback for environments without IntersectionObserver.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, visible]
}
