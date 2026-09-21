"""Deterministic narrative.

Builds the factual summary of an impact result. This is arithmetic describing
arithmetic: no model is involved. The language model receives this as ground
truth when writing its explanation, and the offline fallback returns it
unchanged — which guarantees the numbers a reader sees are the calculated ones.
"""

from __future__ import annotations

from app.schemas.impact import ImpactRequest, ScenarioOption

from .calculators import ImpactComputation


def _kg(value: float) -> str:
    return f"{value:,.0f} kg CO2e"


def _share(category_kg: float, total: float) -> str:
    if total <= 0:
        return "0%"
    return f"{category_kg / total * 100:.0f}%"


def headline(computation: ImpactComputation) -> str:
    """One line a reader can take in at a glance."""
    if computation.savings_kg <= 0:
        return (
            f"Estimated annual impact {_kg(computation.current_total)} — "
            f"{computation.band_label.lower()}."
        )

    return (
        f"Estimated annual impact {_kg(computation.current_total)} — "
        f"{computation.band_label.lower()}, with {_kg(computation.savings_kg)} "
        f"({computation.savings_percent:.0f}%) avoidable."
    )


def dominant_category(computation: ImpactComputation):
    """The category contributing most to the current total."""
    if not computation.categories:
        return None
    return max(computation.categories, key=lambda category: category.current_kg)


def summary(request: ImpactRequest, computation: ImpactComputation) -> str:
    """A factual, multi-sentence summary of the calculated result."""
    lines: list[str] = []

    lines.append(
        f"Estimated annual greenhouse-gas impact is {_kg(computation.current_total)} "
        f"across transport, electricity, waste and everyday consumption "
        f"({computation.band_label.lower()})."
    )

    ordered = sorted(
        computation.categories, key=lambda category: category.current_kg, reverse=True
    )

    breakdown = "; ".join(
        f"{category.label} {_kg(category.current_kg)} ({_share(category.current_kg, computation.current_total)})"
        for category in ordered
        if category.current_kg > 0
    )

    if breakdown:
        lines.append(f"By category: {breakdown}.")

    if computation.savings_kg > 0:
        lines.append(
            f"Applying the modelled improvements to the same inputs gives "
            f"{_kg(computation.sustainable_total)}, a reduction of "
            f"{_kg(computation.savings_kg)} or {computation.savings_percent:.0f}%."
        )

    top = dominant_category(computation)
    if top is not None and top.current_kg > 0:
        lines.append(
            f"{top.label} is the largest single contributor and offers the most "
            "room to reduce."
        )

    if request.context == "community_climate_risk":
        lines.append(
            "Read alongside local risk information, these categories also indicate "
            "where a community's exposure is concentrated."
        )

    # Standing caveat, kept explicit rather than softened.
    lines.append(
        "The figures are averages intended for comparing options, not measurements "
        "of a specific household, and they cover only the categories reported."
    )

    return " ".join(lines)


def comparison_sentence(comparison: ScenarioOption) -> str:
    """A single 'current → better' sentence for one scenario card."""
    return (
        f"{comparison.current_label} to {comparison.better_label} on the same "
        f"activity would save about {_kg(comparison.saving_kg)} a year."
    )
