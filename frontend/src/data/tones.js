/**
 * Botanical accent tones.
 *
 * Tailwind extracts class names by reading source files literally, so dynamic
 * strings like `text-${tone}` would be purged. Every tone therefore maps to a
 * complete, literal class string here.
 *
 * The `metric` and `iconWrap` text colours are deliberately darker than the
 * surface accents they sit on. A mid-tone green or gold reads well as a fill but
 * fails WCAG AA as small text, so the text variants are chosen for contrast:
 * each lands between 5:1 and 6:1 on the pale surfaces used across the site.
 */
export const tones = {
  leaf: {
    iconWrap: 'bg-leaf/15 text-[#3F6E33]',
    // Solid fills are deeper than the surface accents so the white icon on top
    // clears the 3:1 non-text contrast requirement — the mid-tone fill reached
    // only 2.2:1 for blush, which read as a smudge rather than a glyph.
    solid: 'bg-[#4A7F3D] text-white',
    metric: 'text-[#3F6E33]',
    bar: 'bg-leaf',
    border: 'border-leaf/25',
    glow: 'group-hover:shadow-leaf'
  },
  water: {
    iconWrap: 'bg-water/15 text-[#35687A]',
    solid: 'bg-[#4E7A8D] text-white',
    metric: 'text-[#35687A]',
    bar: 'bg-water',
    border: 'border-water/30',
    glow: 'group-hover:shadow-soft'
  },
  pollen: {
    iconWrap: 'bg-pollen/20 text-[#8A5E14]',
    solid: 'bg-pollen text-ink',
    metric: 'text-[#8A5E14]',
    bar: 'bg-pollen',
    border: 'border-pollen/35',
    glow: 'group-hover:shadow-sandy'
  },
  blush: {
    iconWrap: 'bg-blush/25 text-[#8A5258]',
    solid: 'bg-[#B48282] text-white',
    metric: 'text-[#8A5258]',
    bar: 'bg-blush',
    border: 'border-blush/35',
    glow: 'group-hover:shadow-soft'
  }
}

export const getTone = (tone) => tones[tone] ?? tones.leaf
