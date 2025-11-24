import logging
from typing import Literal
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from fastapi.responses import StreamingResponse

# Import the controller logic
from ..controllers.chat_controllers import process_chat_stream

router = APIRouter()
logger = logging.getLogger(__name__)

# --- REQUEST MODEL ---
class ChatRequest(BaseModel):
    message: str
    persona: Literal["David Goggins", "Alastor Moody"] = "David Goggins"

@router.post(
    "/stream",
    summary="Stream a chat response with RAG and Persona switching",
    status_code=status.HTTP_200_OK,
    tags=["Chat"],
)
async def chat_stream_endpoint(request: ChatRequest):
    """
    **Chat Stream Endpoint**
    
    - **message**: The user's query (e.g., "My camera is offline")
    - **persona**: "David Goggins" or "Alastor Moody"
    
    Returns a text stream of the AI response.
    """
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    logger.info(f"Chat Request: Persona={request.persona} | Msg={request.message[:20]}...")

    try:
        # We pass the generator function directly to StreamingResponse
        return StreamingResponse(
            process_chat_stream(request.message, request.persona),
            media_type="text/plain"
        )
        
    except Exception as e:
        logger.exception("Chat stream failed")
        raise HTTPException(status_code=500, detail="Internal Server Error")