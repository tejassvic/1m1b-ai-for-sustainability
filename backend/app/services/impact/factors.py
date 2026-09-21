"""Emission factors and modelling assumptions.

These are planning-grade factors expressed in kilograms of carbon dioxide
equivalent (kg CO2e). They are averages, published here in one place so the
methodology is auditable and so any figure can be traced to the assumption that
produced it. A production deployment would swap these for the national or grid
factors of the region it serves.

Sources for the magnitudes used: IPCC AR6 synthesis guidance on transport and
energy emission intensities, IEA energy-system data for grid intensity, and
UNEP waste-sector guidance for disposal factors. Values are rounded to reflect
the precision the underlying averages support.
"""

from __future__ import annotations

from dataclasses import dataclass

KG_CO2E_PER_KM: dict[str, float] = {
    "walking": 0.0,  # no direct combustion emissions
    "cycling": 0.0,
    "public_transport": 0.048,  # bus or rail, divided across passengers
    "car_petrol": 0.192,  # average occupancy, mid-size petrol car
    "car_diesel": 0.171,
    "motorcycle": 0.103,
}

TRANSPORT_LABELS: dict[str, str] = {
    "walking": "Walking",
    "cycling": "Cycling",
    "public_transport": "Public transport",
    "car_petrol": "Petrol car",
    "car_diesel": "Diesel car",
    "motorcycle": "Motorcycle",
}

# The mode each transport option is compared against in the scenario cards.
TRANSPORT_ALTERNATIVES: dict[str, str] = {
    "car_petrol": "public_transport",
    "car_diesel": "public_transport",
    "motorcycle": "public_transport",
    "public_transport": "cycling",
    "cycling": "cycling",
    "walking": "walking",
}

# Grid electricity. India's grid is used as the default planning figure; the
# global average is close enough that the ordering of results does not change.
KG_CO2E_PER_KWH = 0.71

# Waste: emissions attributed to collection and disposal of mixed waste.
KG_CO2E_PER_KG_WASTE = 0.58
# Residual shares after a recycling or composting route is in place.
RECYCLING_REDUCTION = 0.30
COMPOSTING_REDUCTION = 0.22

# A single reusable substitution (bottle, bag, cup) avoids the production and
# disposal emissions of one single-use item.
KG_CO2E_PER_SINGLE_USE_ITEM = 0.082

# Purchasing: additional embodied emissions per "sustainable purchase" avoided
# per week, relative to a conventional replacement purchase.
KG_CO2E_PER_CONVENTIONAL_PURCHASE_WEEK = 0.55

PURCHASING_FACTORS: dict[str, float] = {
    "rarely": 1.0,
    "sometimes": 0.6,
    "often": 0.25,
}

PURCHASING_LABELS: dict[str, str] = {
    "rarely": "Rarely choose sustainable options",
    "sometimes": "Sometimes choose sustainable options",
    "often": "Often choose sustainable options",
}

# Overall banding for the estimated annual total (kg CO2e).
BANDS: list[tuple[str, str, float]] = [
    ("low", "Lower impact", 1500.0),
    ("moderate", "Moderate impact", 3500.0),
    ("high", "Higher impact", float("inf")),
]

# One mature tree sequesters roughly this much CO2 in a year.
KG_CO2E_PER_TREE_YEAR = 21.0

# ---------------------------------------------------------------------------
# Improvement assumptions used to build the "more sustainable" scenario.
#
# These are deliberately conservative and stated explicitly, so the difference
# between the two scenarios is traceable to a named assumption rather than to
# an opaque model.
# ---------------------------------------------------------------------------

# Demand reduction plus a shift to cleaner supply (insulation, efficient
# equipment, on-site generation or a renewable tariff).
ENERGY_EFFICIENCY_REDUCTION = 0.25

# Residual gain when a household already recycles and composts.
WASTE_RESIDUAL_IMPROVEMENT = 0.08

# Share of single-use items remaining after switching to reusables. Most
# substitutions are close to complete; a small residual keeps the figure honest.
SINGLE_USE_RESIDUAL_SHARE = 0.15

PURCHASING_IMPROVEMENT: dict[str, str] = {
    "rarely": "sometimes",
    "sometimes": "often",
    "often": "often",
}

# Purchasing improves at most one step, reflecting realistic habit change.
PURCHASING_STEP_FACTOR = 0.75

WEEKS_PER_YEAR = 52
MONTHS_PER_YEAR = 12


@dataclass(frozen=True)
class FactorSource:
    """A citable assumption, surfaced in the API response."""

    key: str
    label: str
    value: float
    unit: str
    note: str


def factor_sources() -> list[FactorSource]:
    """The assumption set, exposed so the methodology is inspectable."""
    return [
        FactorSource(
            key="grid_electricity",
            label="Electricity grid intensity",
            value=KG_CO2E_PER_KWH,
            unit="kg CO2e per kWh",
            note="Planning figure; varies by region and shifts as grids decarbonise.",
        ),
        FactorSource(
            key="waste_disposal",
            label="Mixed waste disposal",
            value=KG_CO2E_PER_KG_WASTE,
            unit="kg CO2e per kg waste",
            note="Attributed to collection and disposal; reduced when recycling or composting is reported.",
        ),
        FactorSource(
            key="single_use_item",
            label="Single-use item",
            value=KG_CO2E_PER_SINGLE_USE_ITEM,
            unit="kg CO2e per item",
            note="Embodied emissions of production and disposal for one bottle, bag or cup.",
        ),
        FactorSource(
            key="tree_sequestration",
            label="Tree sequestration",
            value=KG_CO2E_PER_TREE_YEAR,
            unit="kg CO2e per tree per year",
            note="Used only to express savings as an equivalent, not as an offset claim.",
        ),
    ]
