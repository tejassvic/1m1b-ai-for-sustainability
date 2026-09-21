import Reveal from './Reveal'

/**
 * SectionHeading — a shared, breathable header for each section.
 *
 * Keeps proportion and rhythm consistent across the page, and staggers the
 * eyebrow, title and body so they unfurl one after another rather than all at
 * once.
 */
export default function SectionHeading({
  id,
  eyebrow,
  title,
  body,
  align = 'left',
  tone = 'text-moss',
  variant = 'dark',
  className = ''
}) {
  const isCentred = align === 'center'
  const isLight = variant === 'light'

  return (
    <div
      className={`flex flex-col gap-5 ${
        isCentred ? 'mx-auto max-w-2xl items-center text-center' : 'max-w-2xl items-start text-left'
      } ${className}`}
    >
      {eyebrow && (
        <Reveal as="p" className={`eyebrow ${tone}`}>
          {eyebrow}
        </Reveal>
      )}

      <Reveal
        as="h2"
        id={id}
        delay={90}
        className={`text-3xl leading-[1.15] sm:text-4xl lg:text-[2.6rem] ${
          isLight ? 'text-mist' : ''
        }`}
      >
        {title}
      </Reveal>

      {body && (
        <Reveal
          as="p"
          delay={180}
          className={`text-base leading-relaxed sm:text-lg ${
            isLight ? 'text-mist' : 'text-ink/75'
          }`}
        >
          {body}
        </Reveal>
      )}
    </div>
  )
}
