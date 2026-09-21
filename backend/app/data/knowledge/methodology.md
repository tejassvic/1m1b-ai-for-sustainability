---
title: How Verdant estimates impact (methodology)
publisher: Verdant
document_type: methodology
topics: methodology, emissions factors, estimation, uncertainty, co2e
---

## What the Impact Analyzer does

The Impact Analyzer converts a small number of everyday inputs — how you travel,
how much electricity you use, how much waste you produce, and a few purchasing
habits — into an estimated annual greenhouse-gas figure in kilograms of carbon
dioxide equivalent (kg CO2e).

## Calculations are deterministic

Every figure is produced by arithmetic using fixed, published-style emission
factors. The figure is calculated by code, not written by a language model. The
AI layer's role is limited to explaining the result in plain language and
suggesting what to do next. This separation exists so that numbers can be
checked, reproduced and corrected.

## How each category is estimated

| Category | Basis of estimate |
| --- | --- |
| Transport | distance travelled per week × emission factor for the chosen mode |
| Electricity | monthly kWh × grid emission factor, annualised |
| Waste | weekly waste mass × a per-kilogram factor for the disposal route, reduced where recycling or composting is reported |
| Lifestyle | single-use item count and purchasing frequency, converted with per-item and per-purchase factors |

The "more sustainable" scenario applies a defined improvement to each input —
for example, shifting the same distance from a private car to public transport,
or applying a recycling and composting uplift. Both scenarios use identical
factors, so the difference between them reflects only the change in behaviour.

## Why the result is an estimate

The factors are averages. A specific journey, appliance or product can differ
substantially from the average depending on load, terrain, occupancy, age and
supply chain. Grid emission factors also vary by region and change over time.

The result is therefore a **direction and a magnitude**. It is useful for
comparing options and for identifying which category matters most. It is not a
measurement, and it should not be presented as one.

## What is excluded

The estimate covers the categories the visitor supplies. It excludes aviation,
embodied emissions in buildings and infrastructure, indirect emissions from
services, and the emissions of anything the visitor does not report. A reported
total is therefore a partial total, and a low total may reflect missing
information rather than low impact.

## A fairness caution

Areas and households without reliable data are not automatically low-impact.
Presenting a partial estimate as though it were complete understates impact in
exactly the places where data is thinnest. Verdant labels its estimates as
partial for this reason.
