"""MCP Tool: delete_task - Permanently delete a task

Contract: specs/001-constitution-alignment/contracts/delete-task-tool.yaml
Constitution: Stateless tool, no direct database access
"""
from typing import Dict
from sqlmodel import Session, select

from ...models.task import Task
from ...database.connection import get_session


async def delete_task(
    user_id: str,
    task_id: int,
    session: Session = None
) -> Dict:
    """
    Permanently delete a task.

    MCP Tool Implementation per contract specification.
    This tool is STATELESS - no session state maintained.

    Args:
        user_id (str): ID of the user (must match authenticated user)
        task_id (int): ID of the task to delete

    Returns:
        Dict: {
            "task_id": int,
            "status": "deleted",
            "title": str
        }

    Raises:
        ValueError: If validation fails
        LookupError: If task not found or doesn't belong to user
    """
    # Validation
    if not user_id or len(user_id.strip()) == 0:
        raise ValueError("User ID is required")

    if not isinstance(task_id, int) or task_id <= 0:
        raise ValueError("Task ID must be a positive integer")

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

    # Store title before deletion (for response)
    task_title = task.title

    # Delete task (hard delete)
    session.delete(task)
    session.commit()

    # Return MCP tool result per contract
    return {
        "task_id": task_id,
        "status": "deleted",
        "title": task_title
    }


# MCP Tool Schema for OpenAI function calling
DELETE_TASK_SCHEMA = {
    "type": "function",
    "function": {
        "name": "delete_task",
        "description": "Permanently delete a task",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "ID of the user"
                },
                "task_id": {
                    "type": "integer",
                    "description": "ID of the task to delete"
                }
            },
            "required": ["user_id", "task_id"]
        }
    }
}
