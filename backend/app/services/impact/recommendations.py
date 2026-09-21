"""Recommendation rules driven by the visitor's own inputs.

The kilogram figures attached to these recommendations always come from the
calculators — never from a hand-written guess — so a recommendation and the
scenario it describes can never disagree.
"""

from __future__ import annotations

from app.schemas.impact import ImpactRequest, Recommendation

from . import factors as F
from .calculators import ImpactComputation


def _transport_rules(request: ImpactRequest, saving: float) -> list[Recommendation]:
    mode = request.transport.mode
    labels = F.TRANSPORT_LABELS

    if mode in {"car_petrol", "car_diesel"}:
        return [
            Recommendation(
                id="transport-mode-shift",
                title="Shift your regular commute to public transport",
                detail=(
                    f"Your {labels[mode].lower()} travel accounts for the largest share of your "
                    "estimate. Moving the same distance to bus or rail removes most of those "
                    "combustion emissions, and because a commute repeats, the change applies "
                    "hundreds of times a year."
                ),
                category="Sustainable transportation",
                effort="medium",
                kg_saved_per_year=saving or None,
                sdg=[11, 13],
            ),
            Recommendation(
                id="transport-combine-trips",
                title="Combine or remove the least efficient journeys",
                detail=(
                    "Short single-occupancy car trips are the least efficient kilometres you "
                    "travel. Grouping errands into one journey, or replacing the shortest ones "
                    "with walking or cycling, reduces distance without changing your routine."
                ),
                category="Sustainable transportation",
                effort="low",
                sdg=[11, 13],
            ),
        ]

    if mode == "motorcycle":
        return [
            Recommendation(
                id="transport-mode-shift",
                title="Use public transport for longer regular journeys",
                detail=(
                    "Two-wheelers are efficient per kilometre but still burn fuel. For longer "
                    "or repeated journeys, public transport moves the same distance with a "
                    "fraction of the emissions per passenger."
                ),
                category="Sustainable transportation",
                effort="medium",
                kg_saved_per_year=saving or None,
                sdg=[11, 13],
            )
        ]

    return [
        Recommendation(
            id="transport-keep-it-up",
            title="Keep walking and cycling as your default",
            detail=(
                "Your travel already produces almost no direct emissions. Protecting that "
                "habit — safe routes, secure cycle parking, a good rain jacket — is the most "
                "effective thing you can do here."
            ),
            category="Sustainable transportation",
            effort="low",
            sdg=[11, 13],
        )
    ]


def _energy_rules(request: ImpactRequest, saving: float) -> list[Recommendation]:
    return [
        Recommendation(
            id="energy-efficiency",
            title="Reduce demand before changing supply",
            detail=(
                "Insulation, draught sealing, LED lighting and sensible cooling set-points "
                "lower consumption directly. Efficiency is usually the fastest-paying measure, "
                "and it shrinks the size of any generation you install later."
            ),
            category="Clean energy",
            effort="low",
            kg_saved_per_year=saving or None,
            sdg=[7, 13],
        ),
        Recommendation(
            id="energy-standby",
            title="Find the load that runs while nobody is looking",
            detail=(
                "Standby equipment, always-on cooling and out-of-hours lighting are commonly a "
                "meaningful share of a building's electricity. A week of metering by circuit "
                "usually identifies it quickly."
            ),
            category="Clean energy",
            effort="low",
            sdg=[7, 12, 13],
        ),
        Recommendation(
            id="energy-supply",
            title="Then move to a cleaner supply",
            detail=(
                "Rooftop solar, a renewable tariff or a power purchase agreement reduce the "
                "emissions per unit consumed. Where a contract is used, check that it "
                "finances genuinely additional generation."
            ),
            category="Clean energy",
            effort="medium",
            sdg=[7, 13],
        ),
    ]


def _waste_rules(request: ImpactRequest, saving: float) -> list[Recommendation]:
    waste = request.waste
    rules: list[Recommendation] = []

    if not waste.recycles:
        rules.append(
            Recommendation(
                id="waste-recycle",
                title="Segregate recyclables cleanly",
                detail=(
                    "Rinsed, sorted material is far more likely to be accepted. Contaminated "
                    "streams are frequently rejected, so the discipline of sorting matters as "
                    "much as putting the item in the correct bin."
                ),
                category="Waste reduction",
                effort="low",
                kg_saved_per_year=saving or None,
                sdg=[11, 12],
            )
        )

    if not waste.composts:
        rules.append(
            Recommendation(
                id="waste-compost",
                title="Compost food scraps",
                detail=(
                    "Food waste in landfill generates methane, a gas with far greater warming "
                    "effect than carbon dioxide. Composting — household, community or "
                    "institutional — avoids most of that and returns nutrients to soil."
                ),
                category="Waste reduction",
                effort="low",
                sdg=[11, 12, 13],
            )
        )

    rules.append(
        Recommendation(
            id="waste-refuse",
            title="Refuse first, then reuse",
            detail=(
                "The most effective step removes the item before it exists. Refillable "
                "containers, loose produce and a paperless default each eliminate a recurring "
                "stream rather than a single item."
            ),
            category="Waste reduction",
            effort="low",
            sdg=[12],
        )
    )

    return rules


def _lifestyle_rules(request: ImpactRequest, saving: float) -> list[Recommendation]:
    lifestyle = request.lifestyle
    rules: list[Recommendation] = []

    if lifestyle.single_use_items_per_week >= 5:
        rules.append(
            Recommendation(
                id="lifestyle-reusables",
                title="Make reusables the path of least resistance",
                detail=(
                    f"At about {lifestyle.single_use_items_per_week} single-use items a week, "
                    "the gain is not in remembering to refuse them — it is in never having to "
                    "decide. A bottle and bag that live in your everyday carry remove the "
                    "decision entirely."
                ),
                category="Responsible consumption",
                effort="low",
                kg_saved_per_year=saving or None,
                sdg=[12],
            )
        )

    if lifestyle.sustainable_purchasing != "often":
        rules.append(
            Recommendation(
                id="lifestyle-durability",
                title="Buy for durability and repair",
                detail=(
                    "Manufacturing dominates the footprint of most goods, so a longer-lived "
                    "item beats a marginally greener short-lived one. Repair, refurbished and "
                    "second-hand options avoid new production altogether."
                ),
                category="Responsible consumption",
                effort="medium",
                sdg=[12],
            )
        )

    return rules


def build_recommendations(
    request: ImpactRequest,
    computation: ImpactComputation,
    limit: int = 5,
) -> list[Recommendation]:
    """Return the most relevant changes, largest modelled saving first."""
    by_category = {category.key: category for category in computation.categories}

    def saving_for(key: str) -> float:
        category = by_category.get(key)
        if category is None:
            return 0.0
        # Rounded at source so floating-point residue never reaches the API.
        return round(max(category.current_kg - category.sustainable_kg, 0.0), 1)

    pool: list[Recommendation] = []
    pool.extend(_transport_rules(request, saving_for("transport")))
    pool.extend(_energy_rules(request, saving_for("energy")))
    pool.extend(_waste_rules(request, saving_for("waste")))
    pool.extend(_lifestyle_rules(request, saving_for("lifestyle")))

    # Largest modelled saving first, then low-effort items, so the list leads
    # with impact without burying the easy wins.
    effort_rank = {"low": 0, "medium": 1, "high": 2}
    pool.sort(
        key=lambda item: (
            -(item.kg_saved_per_year or 0.0),
            effort_rank.get(item.effort, 3),
        )
    )

    return pool[:limit]

