import { render } from './dist-ssr/entry-server.js'

// Build-time smoke test: render the whole page once and assert that the real
// content made it through. Catches render-time errors that a bundler will not.
const html = render()

const expected = [
  'Smarter choices.',
  'A greener future.',
  'Understanding sustainability should be simple.',
  'How a question becomes a change',
  'Ask Verdant',
  'Grounded in cited sources',
  'See the impact of your choices.',
  'Small actions. Collective impact.',
  'Clean Energy',
  'Water Conservation',
  'Waste Reduction',
  'Sustainable Transportation',
  'Responsible Consumption',
  'Biodiversity',
  'Climate Action',
  'SDG 11',
  'SDG 12',
  'SDG 13',
  'Change grows through community.',
  'Technology should serve the planet responsibly.',
  'Grounded AI',
  'Your next sustainable action starts here.',
  'UN Sustainable Development Goals 11',
  'Aligned with the goals that decide this decade.'
]

let failures = 0

for (const text of expected) {
  const found = html.includes(text)
  if (!found) failures += 1
  console.log(`${found ? 'OK  ' : 'MISS'}  ${text}`)
}

const count = (pattern) => (html.match(pattern) || []).length

console.log('')
console.log(`Rendered HTML length : ${html.length}`)
console.log(`<section> elements   : ${count(/<section/g)}`)
console.log(`<img> elements       : ${count(/<img/g)}`)
console.log(`lazy-loaded images   : ${count(/loading="lazy"/g)}`)
console.log(`responsive srcset    : ${count(/srcset=/gi)}`)
console.log(`sizes attributes     : ${count(/sizes="/gi)}`)
console.log(`aria-hidden decorations: ${count(/aria-hidden="true"/g)}`)
console.log(`labelled sections    : ${count(/aria-labelledby=/g)}`)

const images = count(/<img/g)
const lazy = count(/loading="lazy"/g)
const responsive = count(/srcset=/gi)
const sections = count(/<section/g)
const labelled = count(/aria-labelledby=/g)

if (!lazy) {
  console.log('FAIL  no lazy-loaded imagery found')
  failures += 1
}

if (responsive < images) {
  console.log(`FAIL  only ${responsive} of ${images} images are responsive`)
  failures += 1
}

if (lazy !== images - 1) {
  console.log(`FAIL  expected exactly 1 eager image (the hero), found ${images - lazy}`)
  failures += 1
}

if (sections !== 9) {
  console.log(`FAIL  expected 9 sections, found ${sections}`)
  failures += 1
}

if (labelled !== sections) {
  console.log(`FAIL  ${sections - labelled} section(s) are missing an accessible name`)
  failures += 1
}

// Tailwind emits `.relative` after `.absolute`, so an element carrying both is
// relative and `absolute` is silently discarded. That produced a section whose
// background image became an in-flow block: a large empty band above the
// content, with nothing in the markup to explain it. Fail the build instead.
const POSITION = ['static', 'fixed', 'absolute', 'relative', 'sticky']
const conflicts = []

for (const match of html.matchAll(/class="([^"]*)"/g)) {
  const classes = match[1].split(/\s+/)
  const clashing = POSITION.filter((value) => classes.includes(value))

  if (clashing.length > 1) {
    conflicts.push(`[${clashing.join(' + ')}] ${match[1]}`)
  }
}

if (conflicts.length) {
  console.log(`FAIL  ${conflicts.length} element(s) carry conflicting position classes`)
  conflicts.slice(0, 5).forEach((entry) => console.log(`      ${entry}`))
  failures += 1
} else {
  console.log('position conflicts  : none')
}

console.log('')
console.log(failures === 0 ? 'SMOKE TEST PASSED' : `SMOKE TEST FAILED (${failures} problem(s))`)

process.exit(failures === 0 ? 0 : 1)

