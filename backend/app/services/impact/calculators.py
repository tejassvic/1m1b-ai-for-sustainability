"""Calculators.

Pure functions only: given the same inputs they always return the same figures,
which is what makes the Impact Analyzer auditable. Nothing here consults a model
or a network.
"""

from __future__ import annotations

from dataclasses import dataclass

from app.schemas.impact import ImpactRequest, ScenarioOption

from . import factors as F


@dataclass(frozen=True)
class CategoryResult:
    """One impact category, in both scenarios."""

    key: str
    label: str
    current_kg: float
    sustainable_kg: float


@dataclass(frozen=True)
class ImpactComputation:
    """The complete deterministic result set."""

    categories: list[CategoryResult]
    comparisons: list[ScenarioOption]
    current_total: float
    sustainable_total: float
    savings_kg: float
    savings_percent: float
    band: str
    band_label: str


def _round(value: float, places: int = 1) -> float:
    return round(float(value) + 0.0, places)


# ---------------------------------------------------------------------------
# Category calculators — each returns kg CO2e per year
# ---------------------------------------------------------------------------


def transport_kg_per_year(mode: str, km_per_week: float) -> float:
    factor = F.KG_CO2E_PER_KM.get(mode, 0.0)
    return factor * max(km_per_week, 0.0) * F.WEEKS_PER_YEAR


def energy_kg_per_year(kwh_per_month: float) -> float:
    return F.KG_CO2E_PER_KWH * max(kwh_per_month, 0.0) * F.MONTHS_PER_YEAR


def waste_kg_per_year(kg_per_week: float, recycles: bool, composts: bool) -> float:
    gross = F.KG_CO2E_PER_KG_WASTE * max(kg_per_week, 0.0) * F.WEEKS_PER_YEAR
    reduction = 0.0
    if recycles:
        reduction += F.RECYCLING_REDUCTION
    if composts:
        reduction += F.COMPOSTING_REDUCTION
    return gross * max(0.0, 1.0 - min(reduction, 0.9))


def lifestyle_kg_per_year(single_use_items_per_week: int, purchasing: str) -> float:
    items = max(single_use_items_per_week, 0) * F.WEEKS_PER_YEAR
    purchases = F.KG_CO2E_PER_CONVENTIONAL_PURCHASE_WEEK * F.WEEKS_PER_YEAR
    factor = F.PURCHASING_FACTORS.get(purchasing, 1.0)
    return (items * F.KG_CO2E_PER_SINGLE_USE_ITEM) + (purchases * factor)


# ---------------------------------------------------------------------------
# Scenario construction — each returns a category plus its comparison card
# ---------------------------------------------------------------------------


def _transport_category(request: ImpactRequest) -> tuple[CategoryResult, ScenarioOption | None]:
    transport = request.transport
    current = transport_kg_per_year(transport.mode, transport.distance_km_per_week)

    alternative = F.TRANSPORT_ALTERNATIVES.get(transport.mode, transport.mode)
    better = transport_kg_per_year(alternative, transport.distance_km_per_week)

    comparison = None
    if alternative != transport.mode and (current - better) > 1.0:
        comparison = ScenarioOption(
            key="transport",
            label="Getting around",
            current_label=F.TRANSPORT_LABELS.get(transport.mode, transport.mode),
            better_label=F.TRANSPORT_LABELS.get(alternative, alternative),
            current_kg=_round(current),
            better_kg=_round(better),
            saving_kg=_round(current - better),
        )

    return (
        CategoryResult(
            key="transport",
            label="Transport",
            current_kg=_round(current),
            sustainable_kg=_round(better),
        ),
        comparison,
    )


def _energy_category(request: ImpactRequest) -> tuple[CategoryResult, ScenarioOption | None]:
    current = energy_kg_per_year(request.energy.electricity_kwh_per_month)
    better = current * (1.0 - F.ENERGY_EFFICIENCY_REDUCTION)

    comparison = None
    if (current - better) > 1.0:
        comparison = ScenarioOption(
            key="energy",
            label="Electricity at home",
            current_label="Current grid electricity",
            better_label="Efficiency + cleaner supply",
            current_kg=_round(current),
            better_kg=_round(better),
            saving_kg=_round(current - better),
        )

    return (
        CategoryResult(
            key="energy",
            label="Electricity",
            current_kg=_round(current),
            sustainable_kg=_round(better),
        ),
        comparison,
    )


def _waste_category(request: ImpactRequest) -> tuple[CategoryResult, ScenarioOption | None]:
    waste = request.waste
    current = waste_kg_per_year(waste.waste_kg_per_week, waste.recycles, waste.composts)
    better = waste_kg_per_year(waste.waste_kg_per_week, True, True)

    # If both routes are already in place, fall back to a modest residual gain
    # from waste prevention rather than showing a false zero.
    if waste.recycles and waste.composts:
        better = current * (1.0 - F.WASTE_RESIDUAL_IMPROVEMENT)
        current_label = "Already segregated"
        better_label = "Prevent waste at source"
    else:
        missing = []
        if not waste.recycles:
            missing.append("recycling")
        if not waste.composts:
            missing.append("composting")
        current_label = "Mixed waste"
        better_label = "Segregate + " + " + ".join(missing)

    comparison = None
    if (current - better) > 1.0:
        comparison = ScenarioOption(
            key="waste",
            label="Household waste",
            current_label=current_label,
            better_label=better_label,
            current_kg=_round(current),
            better_kg=_round(better),
            saving_kg=_round(current - better),
        )

    return (
        CategoryResult(
            key="waste",
            label="Waste",
            current_kg=_round(current),
            sustainable_kg=_round(better),
        ),
        comparison,
    )


def _lifestyle_category(request: ImpactRequest) -> tuple[CategoryResult, ScenarioOption | None]:
    lifestyle = request.lifestyle
    current = lifestyle_kg_per_year(
        lifestyle.single_use_items_per_week, lifestyle.sustainable_purchasing
    )

    remaining_items = int(lifestyle.single_use_items_per_week * F.SINGLE_USE_RESIDUAL_SHARE)
    improved_purchasing = F.PURCHASING_IMPROVEMENT.get(
        lifestyle.sustainable_purchasing, lifestyle.sustainable_purchasing
    )
    better = lifestyle_kg_per_year(remaining_items, improved_purchasing)

    # Purchasing improves at most one step; if that yielded nothing, apply the
    # residual habit-change factor so the scenario is never a false zero.
    if better >= current:
        better = current * F.PURCHASING_STEP_FACTOR

    comparison = None
    if (current - better) > 1.0:
        comparison = ScenarioOption(
            key="lifestyle",
            label="Everyday purchases",
            current_label="Conventional, single-use",
            better_label="Reusable, considered purchases",
            current_kg=_round(current),
            better_kg=_round(better),
            saving_kg=_round(current - better),
        )

    return (
        CategoryResult(
            key="lifestyle",
            label="Lifestyle & consumption",
            current_kg=_round(current),
            sustainable_kg=_round(better),
        ),
        comparison,
    )


def _band_for(total_kg: float) -> tuple[str, str]:
    for key, label, ceiling in F.BANDS:
        if total_kg < ceiling:
            return key, label
    last = F.BANDS[-1]
    return last[0], last[1]


def compute(request: ImpactRequest) -> ImpactComputation:
    """Run every category calculator and assemble both scenarios."""
    categories: list[CategoryResult] = []
    comparisons: list[ScenarioOption] = []

    builders = (
        _transport_category,
        _energy_category,
        _waste_category,
        _lifestyle_category,
    )

    for builder in builders:
        category, comparison = builder(request)
        categories.append(category)
        if comparison is not None:
            comparisons.append(comparison)

    current_total = sum(category.current_kg for category in categories)
    sustainable_total = sum(category.sustainable_kg for category in categories)

    savings = max(current_total - sustainable_total, 0.0)
    percent = (savings / current_total * 100.0) if current_total > 0 else 0.0
    band, band_label = _band_for(current_total)

    return ImpactComputation(
        categories=categories,
        comparisons=comparisons,
        current_total=_round(current_total),
        sustainable_total=_round(sustainable_total),
        savings_kg=_round(savings),
        savings_percent=_round(percent, 1),
        band=band,
        band_label=band_label,
    )

