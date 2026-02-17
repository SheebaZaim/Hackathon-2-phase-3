"""Message model for Phase III - SQLModel definition per data-model.md

Constitution-compliant schema for chat messages in conversations.
"""
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    """Message role enum - user or assistant"""
    user = "user"
    assistant = "assistant"


class Message(SQLModel, table=True):
    """Message model for chat messages

    Each message represents a single message in a conversation,
    either from the user or the AI assistant.
    """

    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(max_length=255, nullable=False, index=True)
    conversation_id: int = Field(foreign_key="conversations.id", nullable=False, index=True)
    role: MessageRole = Field(nullable=False)
    content: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "user123",
                "conversation_id": 1,
                "role": "user",
                "content": "remind me to buy groceries",
                "created_at": "2026-02-15T10:00:00Z"
            }
        }


class MessageCreate(SQLModel):
    """Request model for creating a message"""

    conversation_id: int
    role: MessageRole
    content: str = Field(min_length=1)


class MessageResponse(SQLModel):
    """Response model for message"""

    id: int
    user_id: str
    conversation_id: int
    role: MessageRole
    content: str
    created_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "user123",
                "conversation_id": 1,
                "role": "user",
                "content": "remind me to buy groceries",
                "created_at": "2026-02-15T10:00:00Z"
            }
        }
