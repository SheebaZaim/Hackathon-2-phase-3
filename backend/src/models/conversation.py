"""Conversation model for Phase III - SQLModel definition per data-model.md

Constitution-compliant schema for chat conversations between user and AI assistant.
"""
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Conversation(SQLModel, table=True):
    """Conversation model for chat sessions

    Each conversation represents a chat session between a user and the AI assistant.
    Conversations are stateless - all state is stored in the database.
    """

    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(max_length=255, nullable=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "user123",
                "created_at": "2026-02-15T10:00:00Z",
                "updated_at": "2026-02-15T10:00:00Z"
            }
        }


class ConversationResponse(SQLModel):
    """Response model for conversation"""

    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "user123",
                "created_at": "2026-02-15T10:00:00Z",
                "updated_at": "2026-02-15T10:00:00Z"
            }
        }
