/**
 * Configuration for the Impact Analyzer.
 *
 * The labels and option lists live here; the numbers do not. Every emission
 * figure is calculated by the backend from fixed factors, so the two can never
 * drift apart.
 */

export const impactCopy = {
  eyebrow: 'Impact Analyzer',
  title: 'See the impact of your choices.',
  body: 'Four short inputs — how you travel, how much electricity you use, what you throw away, and a couple of everyday habits. Verdant calculates the estimate, then explains what to change first.',
  disclaimer:
    'Estimates use average emission factors and are meant for comparing options, not for measuring a specific household. They cover only the categories you report.',
  cta: 'Calculate my impact',
  recalculate: 'Recalculate',
  reset: 'Reset',

  resultLabels: {
    current: 'Your current choices',
    sustainable: 'A more sustainable version',
    savings: 'Avoidable each year',
    contributors: 'Where it comes from',
    comparisons: 'What would change',
    recommendations: 'What to do first',
    explanation: 'What this means',
    trees: 'tree-years of sequestration'
  }
}

export const transportModes = [
  { value: 'walking', label: 'Walking', icon: 'walk' },
  { value: 'cycling', label: 'Cycling', icon: 'bike' },
  { value: 'public_transport', label: 'Public transport', icon: 'bus' },
  { value: 'car_petrol', label: 'Petrol car', icon: 'car' },
  { value: 'car_diesel', label: 'Diesel car', icon: 'car' },
  { value: 'motorcycle', label: 'Motorcycle', icon: 'bike' }
]

export const purchasingLevels = [
  { value: 'rarely', label: 'Rarely' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'often', label: 'Often' }
]

export const impactFields = {
  transport: {
    legend: 'Getting around',
    hint: 'How you travel on a typical week.',
    distanceLabel: 'Distance per week',
    unit: 'km',
    max: 3000,
    step: 5
  },
  energy: {
    legend: 'Electricity at home',
    hint: 'A recent monthly bill in kWh, or your best estimate.',
    label: 'Electricity per month',
    unit: 'kWh',
    max: 5000,
    step: 10
  },
  waste: {
    legend: 'Household waste',
    hint: 'Everything that leaves the kitchen and the bin.',
    label: 'Waste per week',
    unit: 'kg',
    max: 120,
    step: 1,
    recyclesLabel: 'We separate recyclables',
    compostsLabel: 'We compost food scraps'
  },
  lifestyle: {
    legend: 'Everyday habits',
    hint: 'Rough figures are enough — precision is not the point.',
    itemsLabel: 'Single-use items per week',
    itemsUnit: 'bottles, bags, cups',
    max: 300,
    step: 1,
    purchasingLabel: 'How often do you choose the sustainable option when buying?'
  }
}

export const impactDefaults = {
  transport: { mode: 'car_petrol', distance_km_per_week: 120 },
  energy: { electricity_kwh_per_month: 200 },
  waste: { waste_kg_per_week: 8, recycles: true, composts: false },
  lifestyle: { single_use_items_per_week: 10, sustainable_purchasing: 'sometimes' }
}
