import { useEffect, useState } from 'react'

/**
 * Natural wayfinding — highlights the navigation "stepping stone" that matches
 * the section currently in view, so a visitor always knows where they stand
 * along the path.
 *
 * NOTE: pass a module-level (stable) array of section ids.
 */
export default function useScrollSpy(sectionIds, offset = 140) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '')

  useEffect(() => {
    if (!sectionIds.length) return

    const onScroll = () => {
      let current = sectionIds[0]

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top - offset <= 0) current = id
      }

      setActiveId(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [sectionIds, offset])

  return activeId
}
