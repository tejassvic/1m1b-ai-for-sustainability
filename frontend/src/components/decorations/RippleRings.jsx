/**
 * RippleRings — concentric water rings spreading outward from a point.
 *
 * The visual echo of a stone dropped into still water. Each ring shares one
 * keyframe animation, offset by a delay, so they appear to emanate rather than
 * pulse in unison.
 *
 * Position and size come from `className` (e.g. `bottom-10 left-[10%] h-32 w-32
 * text-water/50`).
 */
export default function RippleRings({ className = '', rings = 3, stagger = 1.05 }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} aria-hidden="true">
      {Array.from({ length: rings }).map((_, index) => (
        <span
          key={index}
          className="absolute inset-0 animate-ripple rounded-full border-2 border-current"
          style={{ animationDelay: `${index * stagger}s` }}
        />
      ))}
    </div>
  )
}
