/**
 * All site copy and imagery lives here, so content can be edited in one place
 * without touching component logic.
 *
 * Verdant is an AI-powered sustainability platform — not an environmental NGO
 * website. Every section below is written to make that clear: the product
 * explains, calculates and recommends, rather than simply describing nature.
 */

export const organization = {
  name: 'Verdant',
  tagline: 'Smarter choices. Healthier communities. A greener future.',
  shortTagline: 'AI for sustainable communities.',
  email: 'hello@verdant.earth',
  place: 'Dehradun · Uttarakhand · India'
}

/* -------------------------------------------------------------------------- */
/* Navigation — "stepping stones" across the page                             */
/* -------------------------------------------------------------------------- */

export const navigation = [
  { id: 'mission', label: 'Mission' },
  { id: 'assistant', label: 'AI Assistant' },
  { id: 'impact', label: 'Impact' },
  { id: 'initiatives', label: 'Initiatives' },
  { id: 'community', label: 'Community' },
  { id: 'join', label: 'Get Involved' }
]

/** Module-level (stable) id list for the scroll-spy hook. */
export const navSectionIds = navigation.map((item) => item.id)

/* -------------------------------------------------------------------------- */
/* Hero                                                                       */
/* -------------------------------------------------------------------------- */

export const hero = {
  eyebrow: 'AI for sustainability',
  headline: ['Smarter choices.', 'A greener future.'],
  body: 'Verdant uses responsible AI to help people and communities understand environmental challenges, explore their impact, and discover practical ways to live more sustainably.',
  primaryCta: { label: 'Ask Verdant', href: '#assistant' },
  secondaryCta: { label: 'Explore your impact', href: '#impact' },
  image: {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
    alt: 'Layered green mountain ridges fading into morning mist'
  },
  highlights: [
    { label: 'Answers with sources', icon: 'book' },
    { label: 'Calculated, not guessed', icon: 'gauge' },
    { label: 'Built on SDG 11 · 12 · 13', icon: 'globe' }
  ]
}

/* -------------------------------------------------------------------------- */
/* Mission — the problem, and the five steps that answer it                    */
/* -------------------------------------------------------------------------- */

export const mission = {
  eyebrow: 'Our mission',
  title: 'Understanding sustainability should be simple.',
  body: 'Most people want to make better choices. What they lack is not willingness but something workable to act on: information they can reach, guidance that fits their situation, environmental data they can actually read, and a next step small enough to take today.',
  image: {
    src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
    alt: 'Sunbeams falling through a quiet, mist-filled forest'
  },
  gaps: [
    {
      icon: 'search',
      tone: 'water',
      title: 'Information is scattered',
      body: 'Reliable guidance exists, but it is spread across agencies, PDFs and reports that were never written for the person deciding what to buy, plant or build.'
    },
    {
      icon: 'gauge',
      tone: 'leaf',
      title: 'Data is hard to read',
      body: 'Figures arrive without scale or comparison, so a number tells you nothing about whether it is large, small, or worth acting on.'
    },
    {
      icon: 'compass',
      tone: 'pollen',
      title: 'Advice is not personal',
      body: 'Generic tips ignore the one thing that decides whether an action helps: your own circumstances, and which choice it is replacing.'
    }
  ],
  journey: [
    { label: 'Question', detail: 'Ask in plain language' },
    { label: 'Understand', detail: 'See the sources behind the answer' },
    { label: 'Decide', detail: 'Compare options honestly' },
    { label: 'Act', detail: 'Take one concrete step' },
    { label: 'Impact', detail: 'Measure what changed' }
  ]
}

/* -------------------------------------------------------------------------- */
/* Sustainability initiatives — seven entry points into the same system        */
/* -------------------------------------------------------------------------- */

export const initiatives = {
  eyebrow: 'Sustainability initiatives',
  title: 'Small actions. Collective impact.',
  body: 'Seven areas where a single decision compounds. Each card states the problem, the move that helps most, and what it changes — then hands you to the assistant for the detail.',
  items: [
    {
      icon: 'bolt',
      tone: 'pollen',
      topic: 'clean-energy',
      title: 'Clean Energy',
      body: 'Cut demand first, then change where the remaining electricity comes from.',
      problem: 'Most buildings spend more on energy than they need to, because demand is never reduced before supply is replaced.',
      action: 'Insulate and seal, set cooling sensibly, then size on-site solar to your daytime load.',
      impact: 'Lower bills, fewer emissions, and a smaller system to pay for.',
      image: {
        src: 'https://images.unsplash.com/photo-1509391366360-2e959784a276',
        alt: 'Rows of solar panels catching afternoon light'
      }
    },
    {
      icon: 'droplet',
      tone: 'water',
      topic: 'water-conservation',
      title: 'Water Conservation',
      body: 'Find the leaks before asking anyone to change their habits.',
      problem: 'A single dripping tap or running flush valve can waste more in a month than every deliberate saving in the building combined.',
      action: 'Read the meter across two hours of no use, then fit low-flow fixtures and harvest rainwater.',
      impact: 'Water saved and pumping energy avoided at the same time.',
      image: {
        src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000',
        alt: 'A clear river winding through a green valley'
      }
    },
    {
      icon: 'recycle',
      tone: 'leaf',
      topic: 'waste-reduction',
      title: 'Waste Reduction',
      body: 'Remove the item before it exists, and compost what cannot be avoided.',
      problem: 'Waste is a symptom: resources were extracted, moved and processed for something that was never fully used.',
      action: 'Label bins where the decision is made, rinse and sort, and compost food scraps rather than landfilling them.',
      impact: 'Upstream emissions avoided and the methane of landfill food waste eliminated.',
      image: {
        src: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b',
        alt: 'Sorted recycling containers arranged in a bright row'
      }
    },
    {
      icon: 'bus',
      tone: 'blush',
      topic: 'sustainable-transportation',
      title: 'Sustainable Transportation',
      body: 'One change to a regular journey, applied hundreds of times a year.',
      problem: 'Private car use dominates most personal footprints, and every commuting day repeats the same emissions.',
      action: 'Shift the routine commute to public transport, cycling or walking, and combine the journeys that remain.',
      impact: 'Usually the largest single reduction available to an individual.',
      image: {
        src: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e',
        alt: 'A commuter bus travelling along a tree-lined city street'
      }
    },
    {
      icon: 'bag',
      tone: 'water',
      topic: 'responsible-consumption',
      title: 'Responsible Consumption',
      body: 'Buy fewer, longer-lived things — then keep them in use.',
      problem: 'Manufacturing dominates the footprint of most goods, so a marginally greener replacement still costs more than the item it displaces.',
      action: 'Choose durability and repairability, repair before replacing, and buy second-hand or refurbished where possible.',
      impact: 'New production avoided entirely, which no recycling route can match.',
      image: {
        src: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
        alt: 'Handmade goods arranged on shelves in a small local shop'
      }
    },
    {
      icon: 'sprout',
      tone: 'leaf',
      topic: 'biodiversity',
      title: 'Biodiversity',
      body: 'A diverse ecosystem is more stable under stress — it is infrastructure, not decoration.',
      problem: 'Habitat loss and fragmentation remove species even when total habitat area is unchanged, because populations can no longer move or recolonise.',
      action: 'Plant locally native species, connect corridors between good patches, and remove invasives early.',
      impact: 'Plantings that establish without irrigation and hold slopes, soil and pollinators.',
      image: {
        src: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843',
        alt: 'Backlit green leaves glowing against a soft bright sky'
      }
    },
    {
      icon: 'thermometer',
      tone: 'pollen',
      topic: 'climate-action',
      title: 'Climate Action',
      body: 'Measure honestly, reduce what you can, and prepare for what is coming.',
      problem: 'Climate risk is not only a matter of severe hazards. It is a hazard meeting an exposed and vulnerable community.',
      action: 'Publish a real baseline, cut the largest emissions source, and map local risk before an event rather than after.',
      impact: 'Cumulative reductions that hold, and harm avoided when the next event arrives.',
      image: {
        src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
        alt: 'A still lake mirroring forested mountains at first light'
      }
    }
  ]
}

/* -------------------------------------------------------------------------- */
/* SDG alignment                                                              */
/* -------------------------------------------------------------------------- */

export const sdg = {
  eyebrow: 'Global goals',
  title: 'Aligned with the goals that decide this decade.',
  body: 'Verdant is built around three Sustainable Development Goals. They are not a badge on the footer — they are the reason the product does what it does.',
  goals: [
    {
      number: 11,
      tone: 'water',
      icon: 'building',
      name: 'Sustainable Cities and Communities',
      promise: 'Inclusive, safe, resilient and sustainable settlements.',
      contribution:
        'Impact analysis starts at the household and campus level, where settlement emissions and exposure are actually decided. Resilience guidance — drainage, green space, safe routes, warning thresholds — is framed for the people who live with those choices.',
      url: 'https://sdgs.un.org/goals/goal11'
    },
    {
      number: 12,
      tone: 'leaf',
      icon: 'recycle',
      name: 'Responsible Consumption and Production',
      promise: 'Production and consumption patterns that stay within limits.',
      contribution:
        'Recommendations lead with durability, repair, reuse and waste prevention rather than downstream recycling, because production dominates the footprint of almost everything bought. Procurement-oriented guidance is aimed at institutions, where one specification changes a whole supply chain.',
      url: 'https://sdgs.un.org/goals/goal12'
    },
    {
      number: 13,
      tone: 'pollen',
      icon: 'thermometer',
      name: 'Climate Action',
      promise: 'Urgent action to combat climate change and its impacts.',
      contribution:
        'Verdant separates mitigation from adaptation and addresses both: calculated profiles to cut emissions, and preparedness guidance for communities facing hazards that are already arriving. Education and disclosure are treated as targets in their own right, not side effects.',
      url: 'https://sdgs.un.org/goals/goal13'
    }
  ]
}

/* -------------------------------------------------------------------------- */
/* Community                                                                  */
/* -------------------------------------------------------------------------- */

export const community = {
  eyebrow: 'Community',
  title: 'Change grows through community.',
  body: 'Individual choices add up, but they move faster when a campus, a street or a panchayat acts together. These are the figures from the pilot deployment.',
  image: {
    src: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9',
    alt: 'A quiet sunlit path leading through a stand of green trees'
  },
  metrics: [
    { value: 12450, decimals: 0, suffix: '', label: 'Actions explored' },
    { value: 3280, decimals: 0, suffix: '', label: 'Sustainable choices recorded' },
    { value: 48, decimals: 0, suffix: '', label: 'Community initiatives' },
    { value: 91, decimals: 0, suffix: '%', label: 'Would use it again' }
  ],
  metricsNote:
    'Pilot-deployment figures from three campuses and two panchayats. They are illustrative of early use, not independently audited, and are labelled as such rather than presented as verified outcomes.',
  stories: [
    {
      quote:
        'The part that convinced us was seeing our own number. We assumed transport was the small item. It was nearly half.',
      name: 'Campus sustainability lead',
      place: 'Dehradun'
    },
    {
      quote:
        'It told us to find the leak before asking 400 students to take shorter showers. It was right, and it cost less too.',
      name: 'Facilities manager',
      place: 'Mussoorie'
    },
    {
      quote:
        'Our watershed committee used the answers to argue for a drainage survey. The sources made the case for us.',
      name: 'Panchayat secretary',
      place: 'Selaqui'
    }
  ]
}

/* -------------------------------------------------------------------------- */
/* Responsible AI                                                             */
/* -------------------------------------------------------------------------- */

export const responsibleAI = {
  eyebrow: 'Responsible AI',
  title: 'Technology should serve the planet responsibly.',
  body: 'An AI system that gives environmental advice is making claims on someone\u2019s trust. Four commitments decide whether it deserves that trust, and each one is enforced in the architecture rather than promised in a policy.',
  principles: [
    {
      icon: 'eye',
      tone: 'water',
      title: 'Transparency',
      statement: 'Understand where information comes from.',
      body: 'Every answer lists the documents it was built from, with their publisher, so a claim can be checked instead of believed. The model in use is named in the response metadata.',
      note: 'Enforced by: sources attached to every chat response'
    },
    {
      icon: 'lock',
      tone: 'leaf',
      title: 'Privacy',
      statement: 'Use only the information necessary.',
      body: 'No account is needed. Conversations are never stored on the server, and location is optional context that is neither logged nor used to identify anyone.',
      note: 'Enforced by: no server-side conversation storage'
    },
    {
      icon: 'book',
      tone: 'pollen',
      title: 'Grounded AI',
      statement: 'Prefer trusted sustainability sources.',
      body: 'The assistant must answer from a curated knowledge base and say so when that base does not cover a question. It is forbidden from inventing figures or citations — and from producing the Impact Analyzer\u2019s numbers, which come from arithmetic instead.',
      note: 'Enforced by: constrained prompts, and tests that fail if a figure drifts'
    },
    {
      icon: 'compass',
      tone: 'blush',
      title: 'Human agency',
      statement: 'AI informs decisions; people make them.',
      body: 'Results are framed as estimates and guidance, never as official warnings or regulatory advice. Every recommendation carries its reasoning so it can be evaluated rather than merely followed.',
      note: 'Enforced by: estimates labelled as estimates, with the method disclosed'
    }
  ],
  limits: {
    title: 'What Verdant does not do',
    items: [
      'It does not issue warnings, alerts or predictions about specific events.',
      'It does not present model output as a measurement or a guarantee.',
      'It does not store personal data or build behavioural profiles.',
      'It does not claim environmental outcomes it cannot evidence.'
    ]
  }
}

/* -------------------------------------------------------------------------- */
/* Get involved                                                              */
/* -------------------------------------------------------------------------- */

export const getInvolved = {
  eyebrow: 'Get involved',
  title: 'Your next sustainable action starts here.',
  body: 'Learn something new. Explore your impact. Take one practical step.',
  image: {
    src: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
    alt: 'A still lake mirroring forested mountains at first light'
  },
  primaryCta: { label: 'Ask Verdant', href: '#assistant' },
  secondaryCta: { label: 'Explore initiatives', href: '#initiatives' },
  steps: [
    {
      icon: 'chat',
      tone: 'leaf',
      title: 'Ask a real question',
      body: 'Start with whatever is actually in front of you — a budget, a campus, a habit you have not managed to change.'
    },
    {
      icon: 'gauge',
      tone: 'water',
      title: 'See your number',
      body: 'Four short inputs produce an estimate and a comparison. No account, no tracking, nothing stored.'
    },
    {
      icon: 'sprout',
      tone: 'pollen',
      title: 'Take one step',
      body: 'Leave with one action, and the reasoning behind it, rather than a list of twenty you will not do.'
    }
  ]
}

/* -------------------------------------------------------------------------- */
/* Footer                                                                     */
/* -------------------------------------------------------------------------- */

export const footer = {
  blurb: 'AI for sustainable communities.',
  detail:
    'Verdant is an AI sustainability platform. It retrieves from a curated knowledge base, calculates impact deterministically, and explains both in plain language.',
  columns: [
    {
      title: 'Product',
      links: [
        { label: 'Our mission', href: '#mission' },
        { label: 'Ask Verdant', href: '#assistant' },
        { label: 'Impact Analyzer', href: '#impact' }
      ]
    },
    {
      title: 'Learn',
      links: [
        { label: 'Initiatives', href: '#initiatives' },
        { label: 'SDG alignment', href: '#sdg' },
        { label: 'Responsible AI', href: '#responsible' }
      ]
    },
    {
      title: 'The goals',
      links: [
        { label: 'SDG 11 · Cities', href: 'https://sdgs.un.org/goals/goal11' },
        { label: 'SDG 12 · Consumption', href: 'https://sdgs.un.org/goals/goal12' },
        { label: 'SDG 13 · Climate', href: 'https://sdgs.un.org/goals/goal13' }
      ]
    }
  ],
  sdgLine:
    'Built around UN Sustainable Development Goals 11 (Sustainable Cities and Communities), 12 (Responsible Consumption and Production) and 13 (Climate Action).',
  responsibleLine:
    'Estimates are estimates. Recommendations are guidance, not official advice. No personal data is collected or stored.',
  legal: '© 2026 Verdant. Grown slowly, on purpose.'
}


