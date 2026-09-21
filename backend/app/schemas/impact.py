"""Schemas for the Impact Analyzer.

Every number returned by this endpoint comes from a deterministic calculation
(see ``services/impact``). The language model never produces these values — it
only explains them.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

TransportMode = Literal[
    "walking",
    "cycling",
    "public_transport",
    "car_petrol",
    "car_diesel",
    "motorcycle",
]
PurchasingLevel = Literal["rarely", "sometimes", "often"]


class TransportInput(BaseModel):
    mode: TransportMode = "car_petrol"
    distance_km_per_week: float = Field(default=100.0, ge=0.0, le=3000.0)


class EnergyInput(BaseModel):
    electricity_kwh_per_month: float = Field(default=180.0, ge=0.0, le=5000.0)


class WasteInput(BaseModel):
    waste_kg_per_week: float = Field(default=8.0, ge=0.0, le=120.0)
    recycles: bool = True
    composts: bool = False


class LifestyleInput(BaseModel):
    # Roughly how many single-use items (bottles, bags, cups) per week.
    single_use_items_per_week: int = Field(default=12, ge=0, le=300)
    sustainable_purchasing: PurchasingLevel = "sometimes"


class ImpactRequest(BaseModel):
    transport: TransportInput = Field(default_factory=TransportInput)
    energy: EnergyInput = Field(default_factory=EnergyInput)
    waste: WasteInput = Field(default_factory=WasteInput)
    lifestyle: LifestyleInput = Field(default_factory=LifestyleInput)

    # Optional: the hazard a visitor cares about, used only to tailor the
    # narrative framing (preparedness vs. day-to-day footprint).
    context: Literal["general", "community_climate_risk"] = "general"


class Contributor(BaseModel):
    """One source of impact, with both the current and improved figure."""

    key: str
    label: str
    current_kg: float
    sustainable_kg: float
    share: float = Field(ge=0.0, le=1.0)


class Scenario(BaseModel):
    total_kg_co2e_per_year: float
    contributors: list[Contributor]


class Savings(BaseModel):
    kg_co2e_per_year: float
    percent: float = Field(ge=0.0, le=100.0)
    trees_equivalent: int


class ScenarioOption(BaseModel):
    """A concrete 'current choice → better choice' comparison."""

    key: str
    label: str
    current_label: str
    better_label: str
    current_kg: float
    better_kg: float
    saving_kg: float


class Recommendation(BaseModel):
    id: str
    title: str
    detail: str
    category: str
    effort: Literal["low", "medium", "high"] = "low"
    kg_saved_per_year: float | None = None
    sdg: list[int] = Field(default_factory=list)


class ImpactResponse(BaseModel):
    current: Scenario
    sustainable: Scenario
    savings: Savings
    band: Literal["low", "moderate", "high"]
    band_label: str
    comparisons: list[ScenarioOption] = Field(default_factory=list)
    recommendations: list[Recommendation] = Field(default_factory=list)
    explanation: str = ""
    provider: str
    methodology: str
    disclaimer: str
