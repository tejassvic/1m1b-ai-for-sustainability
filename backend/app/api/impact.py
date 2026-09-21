"""Impact Analyzer endpoint."""

from __future__ import annotations

from fastapi import APIRouter

from app.schemas.impact import ImpactRequest, ImpactResponse
from app.services import assistant

router = APIRouter(tags=["impact"])


@router.post(
    "/impact",
    response_model=ImpactResponse,
    summary="Estimate and explain an annual impact profile",
)
def impact(payload: ImpactRequest) -> ImpactResponse:
    """Calculate the impact deterministically, then have it explained.

    The figures in the response come from arithmetic over fixed emission
    factors. The AI layer explains them; it never produces them.
    """
    return assistant.analyse_impact(payload)
