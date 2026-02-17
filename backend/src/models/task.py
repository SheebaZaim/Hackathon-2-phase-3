"""Task model for Phase III - SQLModel definition per constitution

Constitution-compliant schema for todo items managed through AI conversation.
Schema matches constitution exactly: int id, string user_id, no extra fields.
"""
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Task(SQLModel, table=True):
    """Task model for todo items (Phase III constitution-compliant)

    Tasks are created and managed ONLY through MCP tools via AI chat.
    Schema must match constitution exactly.
    """

    __tablename__ = "tasks"

    # Constitution-required fields (exact schema)
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(max_length=255, nullable=False, index=True)
    title: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False, nullable=False)
    priority: Optional[str] = Field(default="medium", max_length=50)
    due_date: Optional[str] = Field(default=None, max_length=100)
    category: Optional[str] = Field(default=None, max_length=100)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "user123",
                "title": "Complete project documentation",
                "description": "Write comprehensive docs for the API",
                "completed": False,
                "created_at": "2026-02-15T10:00:00Z",
                "updated_at": "2026-02-15T10:00:00Z"
            }
        }


class TaskCreate(SQLModel):
    """Request model for creating a task (used by MCP add_task tool)"""

    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    priority: Optional[str] = Field(default="medium", max_length=50)
    due_date: Optional[str] = Field(default=None)
    category: Optional[str] = Field(default=None, max_length=100)


class TaskUpdate(SQLModel):
    """Request model for updating a task (used by MCP update_task tool)"""

    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None)
    completed: Optional[bool] = None
    priority: Optional[str] = Field(default=None, max_length=50)
    due_date: Optional[str] = Field(default=None)
    category: Optional[str] = Field(default=None, max_length=100)


class TaskResponse(SQLModel):
    """Response model for task"""

    id: int
    title: str
    description: Optional[str]
    completed: bool
    priority: Optional[str] = "medium"
    due_date: Optional[str] = None
    category: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "title": "Complete project documentation",
                "description": "Write comprehensive docs for the API",
                "completed": False,
                "created_at": "2026-02-15T10:00:00Z",
                "updated_at": "2026-02-15T10:00:00Z"
            }
        }
