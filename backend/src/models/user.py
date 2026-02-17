"""User model for Phase III - SQLModel definition per constitution

Constitution-compliant schema with string id type for consistency.
"""
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class User(SQLModel, table=True):
    """User model for authentication and task ownership (Phase III)

    id type changed from UUID to string for constitution compliance.
    Matches actual database schema (no first_name/last_name, uses hashed_password).
    """

    __tablename__ = "users"

    id: str = Field(primary_key=True, max_length=255)
    email: str = Field(unique=True, index=True, max_length=255, nullable=False)
    hashed_password: str = Field(max_length=255, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "user123",
                "email": "user@example.com",
                "password_hash": "$2b$12$...",
                "created_at": "2026-02-15T10:00:00Z",
                "updated_at": "2026-02-15T10:00:00Z"
            }
        }


class UserResponse(SQLModel):
    """User response model (without password_hash)"""

    id: str
    email: str
    created_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": "user123",
                "email": "user@example.com",
                "created_at": "2026-02-15T10:00:00Z"
            }
        }
