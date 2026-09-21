"""Static recommendation catalogue.

Topic-keyed guidance that does not depend on a visitor's inputs. Used by the
recommendations endpoint and by the initiative cards on the site, so the same
wording appears wherever a topic is described.
"""

from __future__ import annotations

from app.schemas.impact import Recommendation

_ENERGY = [
    Recommendation(
        id="cat-energy-efficiency",
        title="Cut demand before changing supply",
        detail="Insulation, draught sealing and efficient lighting reduce consumption directly and usually pay back fastest.",
        category="Clean energy",
        effort="low",
        sdg=[7, 13],
    ),
    Recommendation(
        id="cat-energy-solar",
        title="Size on-site solar to daytime demand",
        detail="Matching generation to the load profile avoids export losses and makes the installation easier to justify.",
        category="Clean energy",
        effort="medium",
        sdg=[7, 12, 13],
    ),
]

_WATER = [
    Recommendation(
        id="cat-water-leaks",
        title="Find leaks before changing habits",
        detail="Meter readings taken across a period of no use reveal leaks that typically outweigh every deliberate saving combined.",
        category="Water conservation",
        effort="low",
        sdg=[6, 11],
    ),
    Recommendation(
        id="cat-water-fixtures",
        title="Fit low-flow fixtures and reuse rainwater",
        detail="Aerators, dual-flush fittings and roof-water harvesting reduce demand without asking anyone to change behaviour.",
        category="Water conservation",
        effort="medium",
        sdg=[6, 11, 12],
    ),
]

_WASTE = [
    Recommendation(
        id="cat-waste-refuse",
        title="Refuse, then reduce, then reuse",
        detail="Removing an item before it exists outperforms every downstream option, including recycling.",
        category="Waste reduction",
        effort="low",
        sdg=[12],
    ),
    Recommendation(
        id="cat-waste-compost",
        title="Compost food scraps",
        detail="Composting avoids the methane that food waste generates in landfill and returns nutrients to soil.",
        category="Waste reduction",
        effort="low",
        sdg=[11, 12, 13],
    ),
]

_TRANSPORT = [
    Recommendation(
        id="cat-transport-shift",
        title="Shift regular journeys to public transport, cycling or walking",
        detail="Because a commute repeats, one change in mode applies hundreds of times a year and removes combustion rather than reducing it.",
        category="Sustainable transportation",
        effort="medium",
        sdg=[11, 13],
    )
]

_CONSUMPTION = [
    Recommendation(
        id="cat-consumption-durable",
        title="Choose durability, repairability and second-hand",
        detail="Production dominates the footprint of most goods, so keeping an item in use longer avoids emissions outright.",
        category="Responsible consumption",
        effort="medium",
        sdg=[12],
    )
]

_BIODIVERSITY = [
    Recommendation(
        id="cat-biodiversity-native",
        title="Plant locally native species and connect habitats",
        detail="Native planting establishes without irrigation and supports the insects and birds that depend on it.",
        category="Biodiversity",
        effort="medium",
        sdg=[15, 11],
    ),
    Recommendation(
        id="cat-biodiversity-corridor",
        title="Restore corridors rather than isolated patches",
        detail="Fragmentation loses species even when total habitat area is unchanged; corridors restore movement.",
        category="Biodiversity",
        effort="high",
        sdg=[15],
    ),
]

_CLIMATE = [
    Recommendation(
        id="cat-climate-measure",
        title="Measure and publish emissions honestly",
        detail="A transparent baseline, including categories that are not improving, is the precondition for credible action.",
        category="Climate action",
        effort="low",
        sdg=[13],
    ),
    Recommendation(
        id="cat-climate-resilience",
        title="Assess local climate risk before an event",
        detail="Mapping who and what is exposed, and agreeing who acts on a warning, reduces harm far more than reacting afterwards.",
        category="Climate action",
        effort="medium",
        sdg=[11, 13],
    ),
]

_CATALOGUE: dict[str, list[Recommendation]] = {
    "clean-energy": _ENERGY,
    "water-conservation": _WATER,
    "waste-reduction": _WASTE,
    "sustainable-transportation": _TRANSPORT,
    "responsible-consumption": _CONSUMPTION,
    "biodiversity": _BIODIVERSITY,
    "climate-action": _CLIMATE,
}


def catalogue_topics() -> list[str]:
    """The topics the catalogue can answer for, sorted for stable output."""
    return sorted(_CATALOGUE)


def catalogue_for(topic: str) -> list[Recommendation]:
    """Recommendations for a topic, or an empty list if it is unknown."""
    return list(_CATALOGUE.get(topic.strip().lower(), []))


# Knowledge-base documents are tagged with the words their subject matter uses
# ("recycling", "solar", "commuting"), while the catalogue is keyed by programme
# name. This maps the former onto the latter so a retrieved passage can be turned
# into the right next steps instead of falling through to a generic list.
TOPIC_ALIASES: dict[str, str] = {
    "waste": "waste-reduction",
    "recycling": "waste-reduction",
    "composting": "waste-reduction",
    "plastics": "waste-reduction",
    "single-use": "waste-reduction",
    "consumption": "responsible-consumption",
    "shopping": "responsible-consumption",
    "repair": "responsible-consumption",
    "supply chain": "responsible-consumption",
    "circular": "responsible-consumption",
    "production": "responsible-consumption",
    "energy": "clean-energy",
    "solar": "clean-energy",
    "efficiency": "clean-energy",
    "electricity": "clean-energy",
    "renewables": "clean-energy",
    "transport": "sustainable-transportation",
    "mobility": "sustainable-transportation",
    "commuting": "sustainable-transportation",
    "public transport": "sustainable-transportation",
    "water": "water-conservation",
    "conservation": "water-conservation",
    "sanitation": "water-conservation",
    "biodiversity": "biodiversity",
    "ecosystem": "biodiversity",
    "nature": "biodiversity",
    "planting": "biodiversity",
    "habitat": "biodiversity",
    "climate": "climate-action",
    "climate risk": "climate-action",
    "climate action": "climate-action",
    "resilience": "climate-action",
    "preparedness": "climate-action",
    "disaster": "climate-action",
    "sdg 13": "climate-action",
    "sdg 11": "climate-action",
    "sdg 12": "waste-reduction",
    "cities": "climate-action",
    "communities": "climate-action",
    "housing": "climate-action",
    "carbon": "climate-action",
    "footprint": "climate-action",
}


def resolve_topic(topic: str) -> str | None:
    """Map any knowledge-base tag onto a catalogue topic, if one applies."""
    slug = topic.strip().lower()

    if slug in _CATALOGUE:
        return slug

    return TOPIC_ALIASES.get(slug)
