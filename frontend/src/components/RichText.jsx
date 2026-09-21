import { useMemo } from 'react'

const BOLD = /(\*\*[^*]+\*\*)/
const LIST_ITEM = /^\s*(?:[-*+]|\d+[.)])\s+/

/** Render inline `**bold**` without pulling a Markdown parser into the bundle. */
function renderInline(text, keyPrefix) {
  return text
    .split(new RegExp(BOLD.source, 'g'))
    .filter(Boolean)
    .map((part, index) => {
      const key = `${keyPrefix}-${index}`
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={key} className="font-semibold text-forest">
            {part.slice(2, -2)}
          </strong>
        )
      }
      return <span key={key}>{part}</span>
    })
}

/** Group raw text into paragraph and list blocks. */
function parseBlocks(text) {
  const paragraphs = String(text ?? '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)

  return paragraphs
    .map((raw) => {
      const lines = raw.split('\n').filter((line) => line.trim())
      if (!lines.length) return null

      const isList = lines.every((line) => LIST_ITEM.test(line))
      if (isList) {
        return {
          type: 'list',
          items: lines.map((line) => line.replace(LIST_ITEM, '').trim())
        }
      }

      return { type: 'paragraph', text: lines.join(' ') }
    })
    .filter(Boolean)
}

/**
 * RichText — the small amount of formatting assistant answers actually use:
 * paragraphs, bullet lists, and emphasis. Anything more would be a Markdown
 * engine, which is not worth the bytes.
 */
export default function RichText({ text, className = '' }) {
  const blocks = useMemo(() => parseBlocks(text), [text])

  return (
    <div className={`space-y-3 ${className}`}>
      {blocks.map((block, index) =>
        block.type === 'list' ? (
          <ul key={index} className="space-y-2 pl-1">
            {block.items.map((item, itemIndex) => (
              <li key={itemIndex} className="flex gap-2.5">
                <span
                  aria-hidden="true"
                  className="mt-[0.5rem] h-1.5 w-1.5 shrink-0 rounded-full bg-moss/70"
                />
                <span className="min-w-0">{renderInline(item, `${index}-${itemIndex}`)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p key={index}>{renderInline(block.text, String(index))}</p>
        )
      )}
    </div>
  )
}
