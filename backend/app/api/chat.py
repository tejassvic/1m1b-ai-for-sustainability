"""Ask Verdant — the conversational endpoint."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.core.logging import get_logger
from app.schemas.chat import ChatRequest, ChatResponse
from app.services import assistant
from app.services.rag.index import get_index

logger = get_logger(__name__)

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse, summary="Ask a sustainability question")
def chat(payload: ChatRequest) -> ChatResponse:
    """Retrieve supporting passages, then answer from them.

    Responses always carry the sources they were built from, so a reader can
    check the answer rather than trust it.
    """
    try:
        get_index()
    except RuntimeError as error:
        logger.error("Knowledge index unavailable: %s", error)
        raise HTTPException(status_code=503, detail="The knowledge base is unavailable.") from error

    return assistant.answer_question(payload)
