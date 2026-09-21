/**
 * A soft, low-lying cloud form.
 * Cloud shapes drift slowly across the hero sky to suggest passing weather.
 */
export default function Cloud({ className = '', style }) {
  return (
    <svg
      viewBox="0 0 240 80"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        <ellipse cx="60" cy="52" rx="48" ry="22" />
        <ellipse cx="104" cy="38" rx="40" ry="27" />
        <ellipse cx="150" cy="52" rx="46" ry="21" />
        <ellipse cx="198" cy="58" rx="26" ry="15" />
      </g>
    </svg>
  )
}
