/**
 * Nature-inspired line icons.
 *
 * Hand-rolled inline SVG (no icon library) to keep the JavaScript payload tiny —
 * a deliberate sustainability choice. All strokes inherit `currentColor` so each
 * icon adopts the botanical accent of the surface it sits in.
 */

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false
}

/* -------------------------------------------------------------------------- */
/* Nature and environment                                                     */
/* -------------------------------------------------------------------------- */

export function IconTree({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 3 6.5 10h3L5 16h14l-4.5-6h3L12 3Z" />
      <path d="M12 16v5" />
    </svg>
  )
}

export function IconLeaf({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M20 4c0 8-4.5 13-11 13H5c0-7 5-10 9-10" />
      <path d="M5 20c1.5-5 5-8.5 9.5-10.5" />
    </svg>
  )
}

export function IconSprout({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 21v-8" />
      <path d="M12 13C12 9 9.5 6.5 5.5 6.5c0 4 2.5 6.5 6.5 6.5Z" />
      <path d="M12 13c0-3.4 2.2-5.6 5.8-5.6 0 3.4-2.2 5.6-5.8 5.6Z" />
    </svg>
  )
}

export function IconDroplet({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 3.5c3 3.8 6 7 6 10.2A6 6 0 0 1 6 13.7C6 10.5 9 7.3 12 3.5Z" />
      <path d="M9.5 14.5c.6 1.2 1.5 1.8 2.8 1.9" />
    </svg>
  )
}

export function IconSun({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </svg>
  )
}

export function IconBolt({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M13.5 2.5 5 13.5h5l-1.5 8L18 10h-5l.5-7.5Z" />
    </svg>
  )
}

export function IconThermometer({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M13.5 13.6V5a2 2 0 1 0-4 0v8.6a4 4 0 1 0 4 0Z" />
      <path d="M11.5 9v5.4" />
    </svg>
  )
}

export function IconRecycle({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M8.2 4.6 10.4 8H6l2.2-3.4Z" />
      <path d="M6 8 3.4 12.4l2.2 3.9" />
      <path d="M15.8 4.6 18 8h-4.4l2.2-3.4Z" />
      <path d="M18 8l2.6 4.4-2.2 3.9" />
      <path d="M6.6 16.3h8.8l-2 3.4H8.6l-2-3.4Z" />
    </svg>
  )
}

export function IconGlobe({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.3 3.3 8.5S14.2 19.6 12 20.5c-2.2-.9-3.3-5.3-3.3-8.5S9.8 5.9 12 3.5Z" />
    </svg>
  )
}

export function IconBuilding({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M4 20V6.5L12 3l8 3.5V20" />
      <path d="M4 20h16M9 20v-5h6v5" />
      <path d="M8.5 9h1.5M14 9h1.5M8.5 12.5H10M14 12.5h1.5" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Mobility                                                                   */
/* -------------------------------------------------------------------------- */

export function IconWalk({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="13" cy="4.5" r="1.8" />
      <path d="M12.5 8.5 10 12l2.5 2.5L12 20" />
      <path d="m10 12-2 8M14.5 14.5 17 20M12.5 8.5 16 10" />
    </svg>
  )
}

export function IconBike({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="6" cy="16.5" r="3.5" />
      <circle cx="18" cy="16.5" r="3.5" />
      <path d="M6 16.5 9.5 9h4l3 7.5M9.5 9 12 4.5h2.5" />
    </svg>
  )
}

export function IconCar({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M4.5 16v-2.8L6.6 8h10.8l2.1 5.2V16" />
      <path d="M3.5 16h17M6.5 16v2M17.5 16v2" />
      <path d="M6.6 12.8h10.8" />
    </svg>
  )
}

export function IconBus({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <rect x="4" y="4.5" width="16" height="12.5" rx="3" />
      <path d="M4 11h16M9 4.5v6.5M15 4.5v6.5" />
      <path d="M7 17v2.5M17 17v2.5" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Consumption and measurement                                                */
/* -------------------------------------------------------------------------- */

export function IconBag({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M5.5 8h13l-1 12.5h-11L5.5 8Z" />
      <path d="M9 8V6.2a3 3 0 0 1 6 0V8" />
    </svg>
  )
}

export function IconGauge({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M4 18a8.5 8.5 0 1 1 16 0" />
      <path d="M12 18 15.5 11" />
      <circle cx="12" cy="18" r="1.4" />
    </svg>
  )
}

export function IconSearch({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 4.5 4.5" />
    </svg>
  )
}

export function IconBook({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M4 4.5h6.5A2.5 2.5 0 0 1 13 7v12.5a2 2 0 0 0-2-2H4V4.5Z" />
      <path d="M20 4.5h-4.5A2.5 2.5 0 0 0 13 7v12.5a2 2 0 0 1 2-2h5V4.5Z" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* AI surface                                                                 */
/* -------------------------------------------------------------------------- */

export function IconChat({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16H10l-4 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-7Z" />
      <path d="M8.5 10h7" />
    </svg>
  )
}

export function IconSparkle({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.3l-1.8-5.7L4.5 10.8 10.2 9 12 3.5Z" />
      <path d="M18.5 16.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2Z" />
    </svg>
  )
}

export function IconSend({ className = 'h-5 w-5' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M4 12 20 4.5l-6.5 15.5-2.3-6.2L4 12Z" />
    </svg>
  )
}

export function IconRefresh({ className = 'h-5 w-5' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M20 11.5a8 8 0 1 0-2.4 5.8" />
      <path d="M20 5.5v6h-6" />
    </svg>
  )
}

export function IconCompass({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m9 15 2.2-4.8L16 8l-2.2 4.8L9 15Z" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Trust                                                                      */
/* -------------------------------------------------------------------------- */

export function IconEye({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.8" />
    </svg>
  )
}

export function IconLock({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
      <path d="M12 14v2.5" />
    </svg>
  )
}

export function IconAlert({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v5M12 16.2v.3" />
    </svg>
  )
}

export function IconCheck({ className = 'h-5 w-5' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Interface                                                                  */
/* -------------------------------------------------------------------------- */

export function IconUsers({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 19.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <path d="M16.5 6.2a3 3 0 0 1 0 5.6M18 14.8c2.1.6 3.5 2.3 3.5 4.7" />
    </svg>
  )
}

export function IconCalendar({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
      <path d="M3.5 10h17M8 3.5v4M16 3.5v4" />
    </svg>
  )
}

export function IconMapPin({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 21s6.5-5.6 6.5-10.2A6.5 6.5 0 0 0 5.5 10.8C5.5 15.4 12 21 12 21Z" />
      <circle cx="12" cy="10.6" r="2.4" />
    </svg>
  )
}

export function IconHeart({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M12 20s-7-4.4-7-9.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7 3.2C19 15.6 12 20 12 20Z" />
    </svg>
  )
}

export function IconArrowRight({ className = 'h-5 w-5' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M4.5 12h14M13 6.5 18.5 12 13 17.5" />
    </svg>
  )
}

export function IconMenu({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function IconClose({ className = 'h-6 w-6' }) {
  return (
    <svg {...svgProps} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Lookup                                                                     */
/* -------------------------------------------------------------------------- */

/** Key → component lookup so content data can stay free of JSX. */
export const iconMap = {
  tree: IconTree,
  leaf: IconLeaf,
  sprout: IconSprout,
  droplet: IconDroplet,
  sun: IconSun,
  bolt: IconBolt,
  thermometer: IconThermometer,
  recycle: IconRecycle,
  globe: IconGlobe,
  building: IconBuilding,
  walk: IconWalk,
  bike: IconBike,
  car: IconCar,
  bus: IconBus,
  bag: IconBag,
  gauge: IconGauge,
  search: IconSearch,
  book: IconBook,
  chat: IconChat,
  sparkle: IconSparkle,
  send: IconSend,
  refresh: IconRefresh,
  compass: IconCompass,
  eye: IconEye,
  lock: IconLock,
  alert: IconAlert,
  check: IconCheck,
  users: IconUsers,
  calendar: IconCalendar,
  pin: IconMapPin,
  heart: IconHeart
}
