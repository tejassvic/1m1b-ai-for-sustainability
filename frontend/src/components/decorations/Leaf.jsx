/**
 * A single organic leaf silhouette.
 * Used as an ambient decoration that sways gently behind content.
 */
export default function Leaf({ className = '', style }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M32 3C17 13 8 32 12 48c3 12 37 12 40 0 4-16-5-35-20-45Z"
        fill="currentColor"
      />
      <g
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      >
        <path d="M32 10v46" />
        <path d="M32 24 20 18M32 24l12-6M32 36 18 32M32 36l14-4M32 46 22 43M32 46l10-3" />
      </g>
    </svg>
  )
}
