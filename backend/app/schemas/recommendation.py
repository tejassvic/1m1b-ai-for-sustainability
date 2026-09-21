"""Schemas for the recommendation endpoint."""

from __future__ import annotations

from pydantic import BaseModel, Field

from .impact import Recommendation


class RecommendationResponse(BaseModel):
    topic: str
    recommendations: list[Recommendation] = Field(default_factory=list)
    sources: list[str] = Field(default_factory=list)
