/**
 * Contrast check — `npm run check:contrast`
 *
 * Lists every foreground/background pair the site actually renders and asserts
 * the WCAG threshold for each: 4.5:1 for text (1.4.3) and 3:1 for graphical
 * objects (1.4.11).
 *
 * This exists because contrast is the accessibility property most easily lost
 * during a redesign — a palette that looks calm can quietly drop an eyebrow
 * label to 3.4:1, and nothing in the build would notice.
 */

const PALETTE = {
  mist: [242, 247, 242],
  pale: [234, 241, 231],
  white: [255, 255, 255],
  ink: [46, 58, 50],
  forest: [74, 103, 65],
  moss: [85, 116, 63],
  leaf: [94, 156, 79],
  water: [107, 155, 176],
  blush: [212, 165, 165],
  pollen: [233, 196, 106],
  honey: [245, 227, 174],
  canopy_a: [44, 70, 38],
  canopy_b: [53, 80, 45],
  canopy_c: [58, 85, 49],
  leaf_tint: [230, 240, 227],
  water_tint: [233, 240, 243],
  pollen_tint: [251, 243, 225],
  blush_tint: [244, 233, 233],
  accent_leaf: [63, 110, 51],
  accent_water: [53, 104, 122],
  accent_pollen: [138, 94, 20],
  accent_blush: [138, 82, 88],
  // Solid tone fills sit behind icons, so they need 3:1, not 4.5:1.
  solid_leaf: [74, 127, 61],
  solid_water: [78, 122, 141],
  solid_blush: [180, 130, 130]
}

/** [label, foreground, background, needsGraphicContrast] */
const CASES = [
  ['body copy', 'ink', 'mist'],
  ['body copy', 'ink', 'white'],
  ['body copy', 'ink', 'pale'],
  ['secondary copy', 'ink/75', 'mist'],
  ['secondary copy', 'ink/75', 'white'],
  ['secondary copy', 'ink/75', 'pale'],
  ['headings', 'forest', 'mist'],
  ['headings', 'forest', 'white'],
  ['headings', 'forest', 'pale'],
  ['eyebrow label', 'moss', 'mist'],
  ['eyebrow label', 'moss', 'pale'],
  ['nav link', 'forest', 'mist'],
  ['leaf accent', 'accent_leaf', 'mist'],
  ['leaf accent', 'accent_leaf', 'white'],
  ['leaf accent', 'accent_leaf', 'leaf_tint'],
  ['water accent', 'accent_water', 'white'],
  ['water accent', 'accent_water', 'water_tint'],
  ['pollen accent', 'accent_pollen', 'white'],
  ['pollen accent', 'accent_pollen', 'pollen_tint'],
  ['blush accent', 'accent_blush', 'white'],
  ['blush accent', 'accent_blush', 'blush_tint'],
  ['dark heading', 'mist', 'canopy_a'],
  ['dark heading', 'mist', 'canopy_b'],
  ['dark heading', 'mist', 'canopy_c'],
  ['dark body', 'mist/85', 'canopy_a'],
  ['dark body', 'mist/85', 'canopy_b'],
  ['dark body', 'mist/85', 'canopy_c'],
  ['dark accent', 'honey', 'canopy_a'],
  ['dark accent', 'honey', 'canopy_b'],
  ['dark accent', 'honey', 'canopy_c'],
  ['primary button', 'mist', 'forest'],
  ['primary button hover', 'mist', 'moss'],
  ['gold button', 'ink', 'pollen'],
  ['gold button hover', 'forest', 'white'],
  ['leaf chip icon', 'white', 'solid_leaf', true],
  ['water chip icon', 'white', 'solid_water', true],
  ['blush chip icon', 'white', 'solid_blush', true],
  ['gold chip icon', 'ink', 'pollen', true],
  ['sdg numeral', 'mist', 'forest']
]

const luminance = (rgb) => {
  const [r, g, b] = rgb.map((value) => {
    const channel = value / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

const ratio = (a, b) => {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (high + 0.05) / (low + 0.05)
}

/** Composite a translucent foreground over its background. */
const resolve = (token, background) => {
  if (!token.includes('/')) return PALETTE[token]

  const [name, alpha] = token.split('/')
  const weight = Number(alpha) / 100
  return PALETTE[name].map((value, index) => weight * value + (1 - weight) * background[index])
}

const lines = []
let failures = 0

for (const [label, foreground, background, isGraphic = false] of CASES) {
  const backdrop = PALETTE[background]
  const value = ratio(resolve(foreground, backdrop), backdrop)
  const target = isGraphic ? 3.0 : 4.5
  const ok = value >= target

  if (!ok) failures += 1

  lines.push(
    `  ${ok ? 'OK  ' : 'FAIL'} ${value.toFixed(2).padStart(5)}:1  ` +
      `(needs ${target})  ${label.padEnd(22)} ${foreground} on ${background}` +
      `  [${isGraphic ? 'graphic' : 'text'}]`
  )
}

console.log(lines.join('\n'))
console.log('')

if (failures) {
  console.log(`CONTRAST CHECK FAILED — ${failures} of ${CASES.length} combinations below threshold`)
  process.exit(1)
}

console.log(`CONTRAST CHECK PASSED — all ${CASES.length} combinations meet their WCAG threshold`)
