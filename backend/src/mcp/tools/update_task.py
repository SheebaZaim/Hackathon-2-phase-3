"""MCP Tool: update_task - Update task title and/or description

Contract: specs/001-constitution-alignment/contracts/update-task-tool.yaml
Constitution: Stateless tool, no direct database access
"""
from typing import Dict, Optional
from sqlmodel import Session, select
from datetime import datetime

from ...models.task import Task
from ...database.connection import get_session


async def update_task(
    user_id: str,
    task_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None,
    session: Session = None
) -> Dict:
    """
    Update task title and/or description.

    MCP Tool Implementation per contract specification.
    This tool is STATELESS - no session state maintained.

    Args:
        user_id (str): ID of the user (must match authenticated user)
        task_id (int): ID of the task to update
        title (str, optional): New title for the task
        description (str, optional): New description (can be None to clear)

    Returns:
        Dict: {
            "task_id": int,
            "status": "updated",
            "title": str (current title after update)
        }

    Raises:
        ValueError: If validation fails or no changes provided
        LookupError: If task not found or doesn't belong to user
    """
    # Validation
    if not user_id or len(user_id.strip()) == 0:
        raise ValueError("User ID is required")

    if not isinstance(task_id, int) or task_id <= 0:
        raise ValueError("Task ID must be a positive integer")

    # At least one field must be provided
    if title is None and description is None:
        raise ValueError("At least one field (title or description) must be provided")

    # Validate title if provided
    if title is not None:
        if len(title.strip()) == 0:
            raise ValueError("Title cannot be empty")
        if len(title) > 255:
            raise ValueError("Title cannot exceed 255 characters")

    # Get session if not provided
    if session is None:
        session = next(get_session())

    # Fetch task
    statement = select(Task).where(
        Task.id == task_id,
        Task.user_id == user_id
    )
    result = session.exec(statement)
    task = result.first()

    if not task:
        raise LookupError(f"Task {task_id} not found or does not belong to user")

    # Update fields
    if title is not None:
        task.title = title.strip()

    if description is not None:
        # Allow clearing description by passing empty string or None
        task.description = description.strip() if description else None

    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    # Return MCP tool result per contract
    return {
        "task_id": task.id,
        "status": "updated",
        "title": task.title
    }


# MCP Tool Schema for OpenAI function calling
UPDATE_TASK_SCHEMA = {
    "type": "function",
    "function": {
        "name": "update_task",
        "description": "Update task title and/or description",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "ID of the user"
                },
                "task_id": {
                    "type": "integer",
                    "description": "ID of the task to update"
                },
                "title": {
                    "type": "string",
                    "description": "New title for the task (optional)"
                },
                "description": {
                    "type": "string",
                    "description": "New description for the task (optional, can be null to clear)"
                }
            },
            "required": ["user_id", "task_id"]
        }
    }
}
