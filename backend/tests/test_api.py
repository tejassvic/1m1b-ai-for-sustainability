"""Tests for the HTTP surface.

The most important assertions here are the ones that protect the platform's
central claim: every number in an impact response comes from the calculators, and
every answer is accompanied by the sources it was built from.
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.schemas.impact import ImpactRequest
from app.services.impact import calculators


@pytest.fixture(scope="module")
def client() -> TestClient:
    with TestClient(app) as test_client:
        yield test_client


SAMPLE_IMPACT = {
    "transport": {"mode": "car_petrol", "distance_km_per_week": 180},
    "energy": {"electricity_kwh_per_month": 220},
    "waste": {"waste_kg_per_week": 9, "recycles": False, "composts": False},
    "lifestyle": {"single_use_items_per_week": 12, "sustainable_purchasing": "sometimes"},
}


# ---------------------------------------------------------------------------
# Health and transparency
# ---------------------------------------------------------------------------


def test_health_reports_knowledge_and_model(client: TestClient) -> None:
    response = client.get("/api/v1/health")
    assert response.status_code == 200

    body = response.json()
    assert body["status"] == "ok"
    assert body["knowledge"]["documents"] > 0
    assert body["knowledge"]["chunks"] >= body["knowledge"]["documents"]

    # The active provider must always be named, whatever it resolved to.
    assert body["language_model"]["active"]
    assert body["language_model"]["generative"] in {True, False}


def test_health_lists_the_recommendation_topics(client: TestClient) -> None:
    topics = client.get("/api/v1/health").json()["recommendation_topics"]

    for expected in (
        "clean-energy",
        "water-conservation",
        "waste-reduction",
        "sustainable-transportation",
        "responsible-consumption",
        "biodiversity",
        "climate-action",
    ):
        assert expected in topics


# ---------------------------------------------------------------------------
# Ask Verdant
# ---------------------------------------------------------------------------


def test_chat_returns_a_grounded_answer_with_sources(client: TestClient) -> None:
    response = client.post("/api/v1/chat", json={"message": "How can we reduce waste?"})
    assert response.status_code == 200

    body = response.json()
    assert body["answer"].strip()
    assert body["grounded"] is True
    assert body["sources"], "an answer must carry the sources it was built from"
    assert body["disclaimer"]

    for source in body["sources"]:
        assert source["title"]
        assert source["publisher"]
        assert 0.0 <= source["relevance"] <= 1.0


def test_chat_surfaces_recommended_actions(client: TestClient) -> None:
    body = client.post("/api/v1/chat", json={"message": "What can I do about waste?"}).json()

    assert body["actions"]
    assert all(isinstance(action, str) and action for action in body["actions"])


def test_chat_rejects_a_too_short_message(client: TestClient) -> None:
    assert client.post("/api/v1/chat", json={"message": "a"}).status_code == 422


def test_chat_rejects_an_out_of_range_coordinate(client: TestClient) -> None:
    response = client.post(
        "/api/v1/chat",
        json={"message": "Where should we start?", "latitude": 120.0},
    )
    assert response.status_code == 422


def test_chat_accepts_history_without_storing_it(client: TestClient) -> None:
    response = client.post(
        "/api/v1/chat",
        json={
            "message": "And what about water?",
            "history": [
                {"role": "user", "content": "What should our campus do first?"},
                {"role": "assistant", "content": "Start by measuring consumption."},
            ],
        },
    )

    assert response.status_code == 200
    assert response.json()["answer"].strip()


# ---------------------------------------------------------------------------
# Impact Analyzer
# ---------------------------------------------------------------------------


def test_impact_totals_come_from_the_calculators(client: TestClient) -> None:
    response = client.post("/api/v1/impact", json=SAMPLE_IMPACT)
    assert response.status_code == 200

    body = response.json()
    expected = calculators.compute(ImpactRequest(**SAMPLE_IMPACT))

    # The language model may explain these figures; it may never change them.
    assert body["current"]["total_kg_co2e_per_year"] == expected.current_total
    assert body["sustainable"]["total_kg_co2e_per_year"] == expected.sustainable_total
    assert body["savings"]["kg_co2e_per_year"] == expected.savings_kg


def test_impact_contributors_sum_to_the_total(client: TestClient) -> None:
    body = client.post("/api/v1/impact", json=SAMPLE_IMPACT).json()

    contributors = body["current"]["contributors"]
    total = sum(item["current_kg"] for item in contributors)

    assert total == pytest.approx(body["current"]["total_kg_co2e_per_year"], abs=0.2)
    assert pytest.approx(sum(item["share"] for item in contributors), abs=0.01) == 1.0


def test_impact_is_reproducible(client: TestClient) -> None:
    first = client.post("/api/v1/impact", json=SAMPLE_IMPACT).json()
    second = client.post("/api/v1/impact", json=SAMPLE_IMPACT).json()

    assert first == second


def test_impact_offers_scenario_comparisons(client: TestClient) -> None:
    body = client.post("/api/v1/impact", json=SAMPLE_IMPACT).json()

    assert body["comparisons"], "a car-dependent profile should offer comparisons"

    for option in body["comparisons"]:
        assert option["better_kg"] < option["current_kg"]
        assert option["saving_kg"] == pytest.approx(
            option["current_kg"] - option["better_kg"], abs=0.2
        )


def test_impact_labels_its_figures_as_estimates(client: TestClient) -> None:
    body = client.post("/api/v1/impact", json=SAMPLE_IMPACT).json()

    assert "estimate" in body["disclaimer"].lower()
    assert body["methodology"]
    assert body["explanation"].strip()


def test_impact_rejects_an_impossible_electricity_figure(client: TestClient) -> None:
    payload = {**SAMPLE_IMPACT, "energy": {"electricity_kwh_per_month": 99_999}}
    assert client.post("/api/v1/impact", json=payload).status_code == 422


def test_impact_rejects_an_unknown_transport_mode(client: TestClient) -> None:
    payload = {**SAMPLE_IMPACT, "transport": {"mode": "hovercraft", "distance_km_per_week": 10}}
    assert client.post("/api/v1/impact", json=payload).status_code == 422


# ---------------------------------------------------------------------------
# Recommendations
# ---------------------------------------------------------------------------


def test_recommendations_return_guidance_for_a_topic(client: TestClient) -> None:
    response = client.get("/api/v1/recommendations", params={"topic": "waste-reduction"})
    assert response.status_code == 200

    body = response.json()
    assert body["topic"] == "waste-reduction"
    assert body["recommendations"]
    assert body["sources"]

    for item in body["recommendations"]:
        assert item["title"] and item["detail"]
        assert item["effort"] in {"low", "medium", "high"}
        assert item["sdg"]


def test_recommendations_reject_an_unknown_topic(client: TestClient) -> None:
    response = client.get("/api/v1/recommendations", params={"topic": "not-a-topic"})

    assert response.status_code == 404
    assert "Unknown topic" in response.json()["detail"]
