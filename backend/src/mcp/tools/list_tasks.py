"""MCP Tool: list_tasks - Retrieve tasks with filtering

Contract: specs/001-constitution-alignment/contracts/list-tasks-tool.yaml
Constitution: Stateless tool, no direct database access
"""
from typing import Dict, List
from sqlmodel import Session, select

from ...models.task import Task
from ...database.connection import get_session


async def list_tasks(
    user_id: str,
    status: str = "all",
    session: Session = None
) -> List[Dict]:
    """
    Retrieve tasks for the user filtered by completion status.

    MCP Tool Implementation per contract specification.
    This tool is STATELESS - no session state maintained.

    Args:
        user_id (str): ID of the user (must match authenticated user)
        status (str): Filter by status - "all", "pending", or "completed"

    Returns:
        List[Dict]: Array of tasks matching the filter. Each task contains:
            - task_id (int)
            - title (str)
            - description (str | None)
            - completed (bool)
            - created_at (str, ISO8601)
            - updated_at (str, ISO8601)

    Raises:
        ValueError: If validation fails
    """
    # Validation
    if not user_id or len(user_id.strip()) == 0:
        raise ValueError("User ID is required")

    if status not in ["all", "pending", "completed"]:
        raise ValueError("Status must be 'all', 'pending', or 'completed'")

    # Get session if not provided
    if session is None:
        session = next(get_session())

    # Build query
    statement = select(Task).where(Task.user_id == user_id)

    # Apply status filter
    if status == "pending":
        statement = statement.where(Task.completed == False)
    elif status == "completed":
        statement = statement.where(Task.completed == True)

    # Order by created_at DESC (newest first)
    statement = statement.order_by(Task.created_at.desc())

    # Execute query
    result = session.exec(statement)
    tasks = result.all()

    # Format results per contract
    return [
        {
            "task_id": task.id,
            "title": task.title,
            "description": task.description,
            "completed": task.completed,
            "created_at": task.created_at.isoformat() + "Z",
            "updated_at": task.updated_at.isoformat() + "Z"
        }
        for task in tasks
    ]


# MCP Tool Schema for OpenAI function calling
LIST_TASKS_SCHEMA = {
    "type": "function",
    "function": {
        "name": "list_tasks",
        "description": "Retrieve tasks for the user filtered by completion status",
        "parameters": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "ID of the user"
                },
                "status": {
                    "type": "string",
                    "enum": ["all", "pending", "completed"],
                    "description": "Filter tasks by status"
                }
            },
            "required": ["user_id", "status"]
        }
    }
}
