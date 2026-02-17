"""MCP Server Setup - Register all MCP tools

This module registers all 5 MCP tools as required by the constitution:
- add_task
- list_tasks
- complete_task
- delete_task
- update_task

These tools are exposed as OpenAI function schemas for AI agent integration.
"""
from typing import List, Dict, Callable, Any
from sqlmodel import Session

# Import all MCP tools
from .tools.add_task import add_task, ADD_TASK_SCHEMA
from .tools.list_tasks import list_tasks, LIST_TASKS_SCHEMA
from .tools.complete_task import complete_task, COMPLETE_TASK_SCHEMA
from .tools.delete_task import delete_task, DELETE_TASK_SCHEMA
from .tools.update_task import update_task, UPDATE_TASK_SCHEMA


# Registry of all available MCP tools
MCP_TOOLS = {
    "add_task": add_task,
    "list_tasks": list_tasks,
    "complete_task": complete_task,
    "delete_task": delete_task,
    "update_task": update_task
}


# OpenAI function schemas for all MCP tools
MCP_TOOL_SCHEMAS = [
    ADD_TASK_SCHEMA,
    LIST_TASKS_SCHEMA,
    COMPLETE_TASK_SCHEMA,
    DELETE_TASK_SCHEMA,
    UPDATE_TASK_SCHEMA
]


async def execute_mcp_tool(
    tool_name: str,
    arguments: Dict[str, Any],
    session: Session = None
) -> Dict:
    """
    Execute an MCP tool by name with given arguments.

    This is the main dispatcher for MCP tool execution.
    Used by the AI agent to execute tools during chat.

    Args:
        tool_name (str): Name of the tool to execute
        arguments (Dict): Tool arguments from AI
        session (Session, optional): Database session

    Returns:
        Dict: Tool execution result

    Raises:
        ValueError: If tool not found
        Exception: If tool execution fails
    """
    if tool_name not in MCP_TOOLS:
        raise ValueError(f"Unknown MCP tool: {tool_name}")

    tool_function = MCP_TOOLS[tool_name]

    try:
        # Execute tool with arguments
        result = await tool_function(**arguments, session=session)
        return result
    except Exception as e:
        # Re-raise with context
        raise Exception(f"MCP tool '{tool_name}' failed: {str(e)}") from e


def get_tool_schemas() -> List[Dict]:
    """
    Get OpenAI function schemas for all MCP tools.

    Returns:
        List[Dict]: Array of OpenAI function schemas
    """
    return MCP_TOOL_SCHEMAS


def get_tool_registry() -> Dict[str, Callable]:
    """
    Get the registry of all MCP tool functions.

    Returns:
        Dict[str, Callable]: Mapping of tool names to functions
    """
    return MCP_TOOLS


# Constitution compliance check
def validate_constitution_compliance():
    """
    Validate that exactly 5 MCP tools are registered per constitution.

    Raises:
        AssertionError: If tool count doesn't match constitution
    """
    required_tools = ["add_task", "list_tasks", "complete_task", "delete_task", "update_task"]
    registered_tools = set(MCP_TOOLS.keys())

    assert len(registered_tools) == 5, f"Constitution requires exactly 5 MCP tools, found {len(registered_tools)}"
    assert registered_tools == set(required_tools), f"Tool mismatch: {registered_tools} != {required_tools}"

    print("[OK] MCP Server: Constitution compliance validated (5 tools registered)")


# Run validation on module load
validate_constitution_compliance()
