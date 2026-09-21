"""Language model providers.

Every provider implements the same two-method surface, so the assistant does not
know or care whether it is talking to IBM Granite in the cloud, Granite running
locally, or the offline grounded composer.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Sequence


class LLMError(RuntimeError):
    """Raised when a provider is reachable but cannot complete a generation."""


@dataclass(frozen=True)
class Message:
    """One turn in the conversation handed to the model."""

    role: str  # "user" | "assistant"
    content: str


@dataclass(frozen=True)
class GenerationRequest:
    """Everything a provider might need to produce an answer.

    Generative providers work from ``system`` and ``messages``. Providers that
    assemble text rather than generate it work from ``question`` and ``passages``
    instead, which keeps the extractive path honest rather than making it parse a
    prompt it was handed.
    """

    system: str
    messages: Sequence[Message]
    question: str = ""
    passages: Sequence[str] = field(default_factory=tuple)


class LLMProvider(ABC):
    """Common interface for every generation backend."""

    #: Short identifier reported in API responses.
    name: str = "provider"

    #: Concrete model identifier, or a description for non-model providers.
    model: str = ""

    #: False for providers that assemble text rather than generate it, which
    #: lets the API label such answers honestly.
    is_generative: bool = True

    @abstractmethod
    def generate(self, request: GenerationRequest) -> str:
        """Return the assistant's reply."""
