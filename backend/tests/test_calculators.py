"""Tests for the deterministic impact calculators.

These matter more than the average unit test: the whole responsible-AI claim on
the Impact Analyzer rests on these figures being reproducible and on the numbers
never depending on a language model.
"""

from __future__ import annotations

import pytest

from app.schemas.impact import ImpactRequest
from app.services.impact import calculators, factors


def test_walking_and_cycling_produce_no_transport_emissions() -> None:
    assert calculators.transport_kg_per_year("walking", 100) == 0.0
    assert calculators.transport_kg_per_year("cycling", 100) == 0.0


def test_transport_scales_linearly_with_distance() -> None:
    single = calculators.transport_kg_per_year("car_petrol", 100)
    double = calculators.transport_kg_per_year("car_petrol", 200)

    assert double == pytest.approx(single * 2, rel=1e-9)
    assert single == pytest.approx(
        factors.KG_CO2E_PER_KM["car_petrol"] * 100 * factors.WEEKS_PER_YEAR
    )


def test_recycling_and_composting_both_reduce_waste_emissions() -> None:
    gross = calculators.waste_kg_per_year(10, recycles=False, composts=False)
    recycled = calculators.waste_kg_per_year(10, recycles=True, composts=False)
    both = calculators.waste_kg_per_year(10, recycles=True, composts=True)

    assert gross > recycled > both


def test_compute_is_deterministic() -> None:
    payload = ImpactRequest(
        transport={"mode": "car_petrol", "distance_km_per_week": 150},
        energy={"electricity_kwh_per_month": 200},
        waste={"waste_kg_per_week": 8, "recycles": True, "composts": False},
        lifestyle={"single_use_items_per_week": 10, "sustainable_purchasing": "sometimes"},
    )

    first = calculators.compute(payload)
    second = calculators.compute(payload)

    assert first.current_total == second.current_total
    assert first.sustainable_total == second.sustainable_total
    assert first.savings_percent == second.savings_percent


def test_sustainable_scenario_is_never_worse_than_current() -> None:
    payload = ImpactRequest(
        transport={"mode": "walking", "distance_km_per_week": 40},
        energy={"electricity_kwh_per_month": 0},
        waste={"waste_kg_per_week": 4, "recycles": True, "composts": True},
        lifestyle={"single_use_items_per_week": 0, "sustainable_purchasing": "often"},
    )

    result = calculators.compute(payload)

    assert result.sustainable_total <= result.current_total
    assert result.savings_kg >= 0.0


def test_switching_car_to_public_transport_is_the_largest_transport_saving() -> None:
    by_car = ImpactRequest(transport={"mode": "car_petrol", "distance_km_per_week": 200})
    by_bus = ImpactRequest(transport={"mode": "public_transport", "distance_km_per_week": 200})

    assert calculators.compute(by_car).current_total > calculators.compute(by_bus).current_total


def test_band_reflects_total_magnitude() -> None:
    low = calculators.compute(ImpactRequest())
    high = calculators.compute(
        ImpactRequest(
            transport={"mode": "car_diesel", "distance_km_per_week": 900},
            energy={"electricity_kwh_per_month": 2000},
            waste={"waste_kg_per_week": 60, "recycles": False, "composts": False},
        )
    )

    assert low.band in {"low", "moderate"}
    assert high.band == "high"
