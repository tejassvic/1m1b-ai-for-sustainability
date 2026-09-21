"""Recommendation catalogue endpoint.

Serves the static, topic-keyed guidance. The frontend uses this to populate the
initiative cards, so the wording on the site and the wording the assistant can
draw on come from a single source.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from app.schemas.recommendation import RecommendationResponse
from app.services.impact.catalogue import catalogue_for, catalogue_topics

router = APIRouter(tags=["recommendations"])


@router.get("/recommendations/topics", summary="List available recommendation topics")
def topics() -> dict[str, list[str]]:
    return {"topics": catalogue_topics()}


@router.get(
    "/recommendations",
    response_model=RecommendationResponse,
    summary="Recommendations for a sustainability topic",
)
def recommendations(
    topic: str = Query(default="climate-action", min_length=2, max_length=64),
) -> RecommendationResponse:
    slug = topic.strip().lower()
    items = catalogue_for(slug)

    if not items:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown topic '{slug}'. Available: {', '.join(catalogue_topics())}",
        )

    return RecommendationResponse(
        topic=slug,
        recommendations=items,
        sources=[
            "UN Sustainable Development Goals",
            "Intergovernmental Panel on Climate Change (IPCC)",
            "International Energy Agency (IEA)",
            "UN Environment Programme (UNEP)",
        ],
    )
