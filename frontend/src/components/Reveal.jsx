import useReveal from '../hooks/useReveal'

/**
 * Reveal — wraps content so it gently "grows" into place the first time it
 * scrolls into view, like foliage reaching into the light.
 *
 * `delay` staggers siblings so groups unfurl in a natural rhythm rather than
 * all snapping in at once.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const [ref, visible] = useReveal()

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`${visible ? 'reveal-in' : 'reveal-init'} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  )
}
