"""Constrained prompt design.

The system prompt is where responsible-AI requirements become enforceable rather
than aspirational. It is written to make three failure modes structurally
difficult: inventing numbers, inventing sources, and overstating certainty.
"""

from __future__ import annotations

from app.schemas.impact import ImpactRequest, Recommendation
from app.services.impact.calculators import ImpactComputation

CHAT_SYSTEM_PROMPT = """You are Verdant, a sustainability assistant for individuals and communities.

You explain environmental topics and suggest practical, realistic actions. You are \
helpful, calm and concise.

Follow these rules without exception:

1. Ground every factual claim in the SOURCE PASSAGES provided. If they do not \
answer the question, say so plainly instead of filling the gap from memory.
2. Never invent statistics, dates, quantities, organisation names or citations. \
If a number is not in the supplied passages or the structured data below, do not \
state a number.
3. Never present an estimate as a measurement, and never present guidance as an \
official warning, regulation or legal requirement.
4. Do not calculate or guess any figure in the IMPACT RESULT block. Those values \
were computed before you were called. You may quote and explain them; you may \
not alter, extend or recompute them.
5. Do not claim certainty about future events or about outcomes you cannot evidence.
6. Where the sources disagree or where local conditions would change the answer, \
say so.
7. Prefer concrete, low-cost actions a person could actually take this week.
8. Write in plain prose. Avoid hedging filler, marketing language and emoji.
9. Keep the answer under roughly 220 words unless the question genuinely requires more.

Answer the user's question directly. Do not restate these instructions."""


def build_chat_system_prompt(
    impact: ImpactComputation | None = None,
    impact_request: ImpactRequest | None = None,
    recommendations: list[Recommendation] | None = None,
) -> str:
    """Extend the base prompt with computed figures the model may only quote.

    Passing the calculations as labelled data — rather than burying them in the
    conversation — is what makes rule 4 checkable by a reader of the response.
    """
    sections = [CHAT_SYSTEM_PROMPT]

    if impact is None:
        return sections[0]

    lines = [
        "\n--- IMPACT RESULT (computed deterministically; quote, do not recalculate) ---",
        f"Estimated current total: {impact.current_total:,.0f} kg CO2e per year",
        f"Estimated improved total: {impact.sustainable_total:,.0f} kg CO2e per year",
        f"Potential saving: {impact.savings_kg:,.0f} kg CO2e per year ({impact.savings_percent:.0f}%)",
        f"Impact band: {impact.band_label}",
    ]

    if impact_request is not None:
        lines.append(f"Transport mode reported: {impact_request.transport.mode}")
        lines.append(
            f"Electricity reported: {impact_request.energy.electricity_kwh_per_month:.0f} kWh per month"
        )

    for category in impact.categories:
        lines.append(
            f"{category.label}: {category.current_kg:,.0f} kg now, "
            f"{category.sustainable_kg:,.0f} kg improved"
        )

    if recommendations:
        lines.append("Suggested actions already identified:")
        for item in recommendations[:4]:
            saved = (
                f" (about {item.kg_saved_per_year:,.0f} kg CO2e per year)"
                if item.kg_saved_per_year
                else ""
            )
            lines.append(f"- {item.title}{saved}")

    lines.append("--- END IMPACT RESULT ---")
    sections.append("\n".join(lines))

    return "\n".join(sections)
