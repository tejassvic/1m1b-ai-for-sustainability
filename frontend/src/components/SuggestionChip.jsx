import { IconSparkle } from './Icons'

/**
 * SuggestionChip — a question a visitor can borrow when they do not yet know
 * what to ask.
 *
 * Rendered as a real button with `aria-label` context, because a chip that only
 * responds to a pointer is a chip that excludes keyboard users.
 */
export default function SuggestionChip({ children, onSelect, disabled = false }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(children)}
      disabled={disabled}
      className="group inline-flex items-center gap-2 rounded-pebble border border-forest/15 bg-white/70 px-4 py-2.5 text-left text-sm font-medium text-forest transition-all duration-300 hover:-translate-y-0.5 hover:border-moss/40 hover:bg-pale hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-mist disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
    >
      <IconSparkle
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-moss transition-transform duration-500 group-hover:rotate-12"
      />
      {children}
    </button>
  )
}
