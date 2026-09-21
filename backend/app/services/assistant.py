"""Assistant orchestration.

Ties the three engines together for a single request:

    retrieve  →  build context  →  generate  →  attach sources and actions

It also enforces the separation the whole platform rests on: numeric results are
computed here, before the model is called, and are passed to it as read-only
data. The model explains; it does not calculate.
"""

from __future__ import annotations

from app.core.logging import get_logger
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.impact import ImpactRequest, ImpactResponse
from app.services.impact import calculators, narrative
from app.services.impact import factors as impact_factors
from app.services.impact.catalogue import catalogue_for, resolve_topic
from app.services.impact.recommendations import build_recommendations
from app.services.rag.context import build_context
from app.services.rag.index import get_index
from app.services.rag.store import ScoredChunk
from app.services.text_utils import split_sentences

from .llm.base import GenerationRequest, LLMError, LLMProvider, Message
from .llm.factory import get_provider
from .llm.grounded import GroundedProvider
from .llm.prompts import build_chat_system_prompt

logger = get_logger(__name__)

MAX_HISTORY_TURNS = 6
MAX_ACTIONS = 3

IMPACT_METHODOLOGY = (
    "Deterministic arithmetic over published planning-grade emission factors. "
    "The language model explains these figures; it does not produce them."
)

IMPACT_DISCLAIMER = (
    "These are estimates built from average emission factors, intended for "
    "comparing options. They are not measurements of a specific household and "
    "cover only the categories reported."
)


def _first_sentence(text: str) -> str:
    sentences = split_sentences(text)
    return sentences[0] if sentences else text


def _actions_for(results: list[ScoredChunk], limit: int = MAX_ACTIONS) -> list[str]:
    """Turn the topics behind the retrieved passages into concrete next steps."""
    topics: list[str] = []

    for result in results:
        for topic in result.chunk.topics:
            slug = resolve_topic(topic)
            if slug and slug not in topics:
                topics.append(slug)

    actions: list[str] = []

    for topic in topics[:2]:
        for item in catalogue_for(topic)[:2]:
            actions.append(f"{item.title} — {_first_sentence(item.detail)}")
            if len(actions) >= limit:
                return actions

    if not actions:
        # Nothing topic-tagged matched, so offer the standing climate actions.
        for item in catalogue_for("climate-action")[:limit]:
            actions.append(f"{item.title} — {_first_sentence(item.detail)}")

    return actions[:limit]


def _generate(provider: LLMProvider, request: GenerationRequest) -> tuple[str, LLMProvider]:
    """Generate a reply, degrading to the grounded responder on any failure."""
    try:
        return provider.generate(request), provider
    except LLMError as error:
        logger.warning("Provider '%s' failed (%s) — using grounded responder", provider.name, error)
    except Exception as error:  # noqa: BLE001 — never fail a user request
        logger.exception("Unexpected provider error (%s) — using grounded responder", error)

    fallback = GroundedProvider()
    return fallback.generate(request), fallback


def answer_question(payload: ChatRequest) -> ChatResponse:
    """Answer a sustainability question, grounded in retrieved sources."""
    index = get_index()
    results = index.retriever.search(payload.message)
    built = build_context(results)

    impact = None
    impact_request: ImpactRequest | None = None
    recommendations: list = []

    # Recompute from the visitor's inputs rather than trusting any sent figure.
    if payload.impact is not None:
        impact_request = payload.impact
        impact = calculators.compute(impact_request)
        recommendations = build_recommendations(impact_request, impact)

    system = build_chat_system_prompt(impact, impact_request, recommendations)

    history = [
        Message(role=turn.role, content=turn.content)
        for turn in payload.history[-MAX_HISTORY_TURNS:]
    ]

    if built.is_empty:
        user_content = (
            f"QUESTION:\n{payload.message}\n\n"
            "No relevant source passages were retrieved from the knowledge base."
        )
    else:
        user_content = (
            f"SOURCE PASSAGES:\n{built.prompt_context}\n\n"
            f"QUESTION:\n{payload.message}"
        )

    messages = [*history, Message(role="user", content=user_content)]

    answer, provider = _generate(
        get_provider(),
        GenerationRequest(
            system=system,
            messages=messages,
            question=payload.message,
            passages=[result.chunk.text for result in results],
        ),
    )

    return ChatResponse(
        answer=answer,
        sources=built.sources,
        actions=_actions_for(results),
        grounded=not built.is_empty,
        provider=provider.name,
        model=provider.model or None,
    )


def analyse_impact(payload: ImpactRequest) -> ImpactResponse:
    """Calculate an impact profile, then explain it.

    Order matters. ``calculators.compute`` runs first and its output is the only
    source of numerical truth in the response. The model is asked to narrate that
    output and nothing else; if it is unavailable, the deterministic summary is
    returned unchanged.
    """
    computation = calculators.compute(payload)
    recommendations = build_recommendations(payload, computation)
    deterministic = narrative.summary(payload, computation)

    provider = get_provider()
    explanation = deterministic

    if provider.is_generative:
        system = (
            "You are Verdant, a sustainability assistant. Explain the IMPACT RESULT "
            "below in plain, calm language for a non-specialist.\n\n"
            "Rules:\n"
            "- Quote the figures exactly as given. Never calculate, round differently, "
            "or invent a number.\n"
            "- Do not present these estimates as measurements or as official advice.\n"
            "- Name the largest contributor and the single most effective change.\n"
            "- Mention that the estimate covers only the categories reported.\n"
            "- Three short paragraphs at most. No headings, no emoji, no marketing tone."
        )

        request = GenerationRequest(
            system=system,
            messages=[
                Message(
                    role="user",
                    content=(
                        f"IMPACT RESULT\n"
                        f"The visitor's inputs were recomputed server-side. "
                        f"Use only these figures.\n\n{deterministic}"
                    ),
                )
            ],
            question="Explain this impact result and what to act on first.",
        )

        explanation, provider = _generate(provider, request)

    return ImpactResponse(
        current={
            "total_kg_co2e_per_year": computation.current_total,
            "contributors": [
                {
                    "key": category.key,
                    "label": category.label,
                    "current_kg": category.current_kg,
                    "sustainable_kg": category.sustainable_kg,
                    "share": (
                        round(category.current_kg / computation.current_total, 4)
                        if computation.current_total > 0
                        else 0.0
                    ),
                }
                for category in computation.categories
            ],
        },
        sustainable={
            "total_kg_co2e_per_year": computation.sustainable_total,
            "contributors": [
                {
                    "key": category.key,
                    "label": category.label,
                    "current_kg": category.sustainable_kg,
                    "sustainable_kg": category.sustainable_kg,
                    "share": (
                        round(category.sustainable_kg / computation.sustainable_total, 4)
                        if computation.sustainable_total > 0
                        else 0.0
                    ),
                }
                for category in computation.categories
            ],
        },
        savings={
            "kg_co2e_per_year": computation.savings_kg,
            "percent": computation.savings_percent,
            "trees_equivalent": int(
                computation.savings_kg / impact_factors.KG_CO2E_PER_TREE_YEAR
            )
            if computation.savings_kg > 0
            else 0,
        },
        band=computation.band,
        band_label=computation.band_label,
        comparisons=computation.comparisons,
        recommendations=recommendations,
        explanation=explanation,
        provider=provider.name,
        methodology=IMPACT_METHODOLOGY,
        disclaimer=IMPACT_DISCLAIMER,
    )
