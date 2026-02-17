"""Phase III Chat API - Stateless chat endpoint for AI-powered todo management

Contract: specs/001-constitution-alignment/contracts/chat-api.yaml
Constitution: Implements 8-step stateless execution cycle
"""
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict, Any
from sqlmodel import Session, select, func

from ..database.connection import get_session
from ..middleware.auth import get_current_user_id
from ..agent.chat_handler import StatelessChatHandler


# Request/Response Models (per contract)

class ChatRequest(BaseModel):
    """Chat request schema per contract"""
    conversation_id: Optional[int] = Field(
        None,
        description="ID of existing conversation to continue, or null to start new"
    )
    message: str = Field(
        ...,
        min_length=1,
        max_length=10000,
        description="User's message in natural language"
    )

    @validator('message')
    def message_not_empty(cls, v):
        """Ensure message is not just whitespace"""
        if not v or not v.strip():
            raise ValueError("Message cannot be empty or only whitespace")
        return v.strip()


class ToolCallInfo(BaseModel):
    """Tool call information in response"""
    tool: str = Field(..., description="Name of MCP tool executed")
    arguments: Dict = Field(..., description="Arguments passed to tool")
    result: Any = Field(..., description="Tool execution result (dict or list)")


class ChatResponse(BaseModel):
    """Chat response schema per contract"""
    conversation_id: int = Field(..., description="ID of conversation (created or existing)")
    response: str = Field(..., description="AI assistant's response message")
    tool_calls: Optional[List[ToolCallInfo]] = Field(
        None,
        description="MCP tools executed during request processing"
    )


class ErrorResponse(BaseModel):
    """Error response schema per contract"""
    error: str = Field(..., description="Error type")
    detail: str = Field(..., description="Detailed error message")


class ConversationInfo(BaseModel):
    """Conversation information for listing"""
    id: int = Field(..., description="Conversation ID")
    created_at: str = Field(..., description="Conversation creation timestamp")
    updated_at: str = Field(..., description="Last message timestamp")
    message_count: int = Field(..., description="Number of messages in conversation")


class ConversationListResponse(BaseModel):
    """Response for conversation listing"""
    conversations: List[ConversationInfo] = Field(..., description="List of user's conversations")


# Router setup
router = APIRouter(
    prefix="/api",
    tags=["Chat"]
)


# Initialize chat handler (stateless)
chat_handler = StatelessChatHandler()


@router.post(
    "/{user_id}/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Process chat message",
    description="Stateless chat endpoint implementing the 8-step execution cycle per constitution",
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        404: {"model": ErrorResponse, "description": "Conversation not found"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    }
)
async def chat(
    user_id: str,
    request: ChatRequest,
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
) -> ChatResponse:
    """
    Process a chat message through the AI agent.

    This endpoint implements the constitutional 8-step stateless execution cycle:
    1. Receive message
    2. Fetch conversation from DB (or create new)
    3. Build agent message array from conversation history
    4. Store user message in DB
    5. Run agent with MCP tool access
    6. Agent calls MCP tools (stateless)
    7. Store assistant message in DB
    8. Return response

    Args:
        user_id: User ID from path (must match authenticated user)
        request: Chat request with message and optional conversation_id
        authenticated_user_id: User ID from JWT token (injected by auth middleware)
        session: Database session (injected)

    Returns:
        ChatResponse: AI response with conversation_id, response text, and tool_calls

    Raises:
        HTTPException: 400 (invalid request), 401 (unauthorized), 404 (not found), 500 (server error)
    """
    # Validate path user_id matches authenticated user
    if user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID in path does not match authenticated user"
        )

    try:
        # Execute chat request through stateless handler
        result = await chat_handler.handle_chat_request(
            user_id=user_id,
            message=request.message,
            conversation_id=request.conversation_id,
            session=session
        )

        # Transform result to response model
        return ChatResponse(
            conversation_id=result["conversation_id"],
            response=result["response"],
            tool_calls=[
                ToolCallInfo(**tool_call)
                for tool_call in result["tool_calls"]
            ] if result["tool_calls"] else None
        )

    except ValueError as e:
        # Validation errors (e.g., conversation not found, invalid conversation_id)
        if "not found" in str(e).lower():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(e)
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    except LookupError as e:
        # Resource not found (conversation doesn't belong to user)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )

    except Exception as e:
        # Unexpected errors (AI service failures, database errors, etc.)
        # Log the error for debugging
        print(f"[ERROR] Chat request failed for user {user_id}: {type(e).__name__}: {str(e)}")

        # Return generic error to client (don't expose internal details)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI service unavailable. Please try again later."
        )


@router.get(
    "/{user_id}/conversations",
    response_model=ConversationListResponse,
    status_code=status.HTTP_200_OK,
    summary="List user's conversations",
    description="Get all conversations for the authenticated user, ordered by most recent"
)
async def list_conversations(
    user_id: str,
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
) -> ConversationListResponse:
    """
    List all conversations for the authenticated user.

    Returns conversations ordered by updated_at (most recent first).
    Includes message count for each conversation.

    Args:
        user_id: User ID from path (must match authenticated user)
        authenticated_user_id: User ID from JWT token
        session: Database session

    Returns:
        ConversationListResponse: List of user's conversations

    Raises:
        HTTPException: 401 if user_id doesn't match authenticated user
    """
    from ..models.conversation import Conversation
    from ..models.message import Message

    # Validate user_id matches authenticated user
    if user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID in path does not match authenticated user"
        )

    try:
        # Query conversations with message count
        statement = (
            select(
                Conversation,
                func.count(Message.id).label("message_count")
            )
            .outerjoin(Message, Message.conversation_id == Conversation.id)
            .where(Conversation.user_id == user_id)
            .group_by(Conversation.id)
            .order_by(Conversation.updated_at.desc())
        )

        results = session.exec(statement).all()

        # Build response
        conversations = [
            ConversationInfo(
                id=conv.id,
                created_at=conv.created_at.isoformat(),
                updated_at=conv.updated_at.isoformat(),
                message_count=count
            )
            for conv, count in results
        ]

        return ConversationListResponse(conversations=conversations)

    except Exception as e:
        print(f"[ERROR] Failed to list conversations for user {user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve conversations"
        )


@router.get(
    "/{user_id}/conversations/{conversation_id}",
    response_model=Dict,
    status_code=status.HTTP_200_OK,
    summary="Get conversation details",
    description="Retrieve a specific conversation with all its messages"
)
async def get_conversation(
    user_id: str,
    conversation_id: int,
    authenticated_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
) -> Dict:
    """
    Get a specific conversation with all its messages.

    Args:
        user_id: User ID from path
        conversation_id: Conversation ID
        authenticated_user_id: User ID from JWT token
        session: Database session

    Returns:
        Dict with conversation info and messages

    Raises:
        HTTPException: 401 (unauthorized), 404 (not found)
    """
    from ..models.conversation import Conversation
    from ..models.message import Message

    # Validate user_id
    if user_id != authenticated_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User ID in path does not match authenticated user"
        )

    try:
        # Fetch conversation
        conv_statement = select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == user_id
        )
        conversation = session.exec(conv_statement).first()

        if not conversation:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Conversation {conversation_id} not found"
            )

        # Fetch messages
        msg_statement = select(Message).where(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at.asc())

        messages = session.exec(msg_statement).all()

        return {
            "id": conversation.id,
            "created_at": conversation.created_at.isoformat(),
            "updated_at": conversation.updated_at.isoformat(),
            "messages": [
                {
                    "id": msg.id,
                    "role": msg.role.value,
                    "content": msg.content,
                    "created_at": msg.created_at.isoformat()
                }
                for msg in messages
            ]
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Failed to get conversation {conversation_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve conversation"
        )
