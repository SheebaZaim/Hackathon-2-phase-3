"""Stateless Chat Handler - 8-step execution cycle per constitution

Implements the constitutional requirement for stateless request processing.
Each request is independent and reproducible.
"""
import json
import logging
from typing import Dict, Optional
from sqlmodel import Session, select
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

from ..models.conversation import Conversation
from ..models.message import Message, MessageRole
from ..mcp.server import get_tool_schemas, execute_mcp_tool
from .openai_agent import ChatAgent


class StatelessChatHandler:
    """
    Stateless chat request handler implementing 8-step execution cycle.

    Per constitution, the cycle is:
    1. Receive message
    2. Fetch conversation from DB (or create new)
    3. Build agent message array from conversation history
    4. Store user message in DB
    5. Run agent with MCP tool access
    6. Agent calls MCP tools (stateless)
    7. Store assistant message in DB
    8. Return response

    NO SERVER-SIDE STATE IS MAINTAINED.
    """

    def __init__(self, agent: ChatAgent = None):
        """
        Initialize the chat handler.

        Args:
            agent (ChatAgent, optional): OpenAI agent instance
        """
        self.agent = agent or ChatAgent()

    async def handle_chat_request(
        self,
        user_id: str,
        message: str,
        conversation_id: Optional[int],
        session: Session
    ) -> Dict:
        """
        Handle a chat request following the 8-step stateless execution cycle.

        Args:
            user_id (str): Authenticated user ID
            message (str): User's message
            conversation_id (int, optional): Existing conversation ID or None for new
            session (Session): Database session

        Returns:
            Dict: {
                "conversation_id": int,
                "response": str,
                "tool_calls": List[Dict] | None
            }
        """
        # STEP 1: Receive message ✓ (done by caller)
        logger.info(f"[STEP 1] Received message from user {user_id}, conversation={conversation_id}")

        # STEP 2: Fetch or create conversation
        conversation = await self._get_or_create_conversation(
            user_id=user_id,
            conversation_id=conversation_id,
            session=session
        )
        logger.info(f"[STEP 2] Conversation ready: id={conversation.id}")

        # STEP 3: Build agent message array from conversation history
        conversation_history = await self._get_conversation_history(
            conversation_id=conversation.id,
            session=session
        )

        # STEP 4: Store user message in DB
        user_msg = Message(
            user_id=user_id,
            conversation_id=conversation.id,
            role=MessageRole.user,
            content=message,
            created_at=datetime.utcnow()
        )
        session.add(user_msg)
        session.commit()

        # STEP 5: Run agent with MCP tool access
        mcp_tools = get_tool_schemas()
        agent_response = await self.agent.process_message(
            user_message=message,
            conversation_history=conversation_history,
            tools=mcp_tools,
            user_id=user_id
        )

        # STEP 6: Handle tool calls if present (agent calls MCP tools)
        tool_calls_info = []
        final_response = agent_response["content"]

        if agent_response.get("tool_calls"):
            # Execute each tool call
            tool_results = []

            for tool_call in agent_response["tool_calls"]:
                try:
                    # Parse tool arguments
                    arguments = json.loads(tool_call["arguments"])
                    # Always override user_id with authenticated user (never trust AI-provided user_id)
                    arguments["user_id"] = user_id
                    logger.info(f"[STEP 6] Executing MCP tool: {tool_call['name']} with args: {arguments}")

                    # Execute MCP tool (stateless)
                    result = await execute_mcp_tool(
                        tool_name=tool_call["name"],
                        arguments=arguments,
                        session=session
                    )
                    logger.info(f"[STEP 6] Tool {tool_call['name']} executed successfully")

                    tool_results.append({
                        "tool_call_id": tool_call["id"],
                        "name": tool_call["name"],
                        "result": result
                    })

                    # Record tool call info for response
                    tool_calls_info.append({
                        "tool": tool_call["name"],
                        "arguments": arguments,
                        "result": result
                    })

                except Exception as e:
                    # Handle tool execution error
                    error_result = {"error": str(e)}
                    tool_results.append({
                        "tool_call_id": tool_call["id"],
                        "name": tool_call["name"],
                        "result": error_result
                    })
                    tool_calls_info.append({
                        "tool": tool_call["name"],
                        "arguments": arguments,
                        "result": error_result
                    })

            # Get final response after tool execution
            # Pass user_message and agent_response so the full context is available:
            # [history, user_message, assistant_tool_call, tool_results...]
            final_agent_response = await self.agent.process_with_tool_results(
                conversation_history=conversation_history,
                user_message=message,
                agent_tool_calls=agent_response["tool_calls"],
                tool_results=tool_results,
                tools=mcp_tools
            )

            final_response = final_agent_response["content"]

        # STEP 7: Store assistant message in DB
        assistant_msg = Message(
            user_id=user_id,
            conversation_id=conversation.id,
            role=MessageRole.assistant,
            content=final_response,
            created_at=datetime.utcnow()
        )
        session.add(assistant_msg)

        # Update conversation updated_at
        conversation.updated_at = datetime.utcnow()
        session.add(conversation)

        session.commit()

        # STEP 8: Return response
        return {
            "conversation_id": conversation.id,
            "response": final_response,
            "tool_calls": tool_calls_info if tool_calls_info else None
        }

    async def _get_or_create_conversation(
        self,
        user_id: str,
        conversation_id: Optional[int],
        session: Session
    ) -> Conversation:
        """
        Fetch existing conversation or create new one.

        Args:
            user_id (str): User ID
            conversation_id (int, optional): Conversation ID or None
            session (Session): Database session

        Returns:
            Conversation: Existing or newly created conversation

        Raises:
            ValueError: If conversation doesn't belong to user
        """
        if conversation_id:
            # Fetch existing conversation
            statement = select(Conversation).where(
                Conversation.id == conversation_id,
                Conversation.user_id == user_id
            )
            result = session.exec(statement)
            conversation = result.first()

            if not conversation:
                raise ValueError(f"Conversation {conversation_id} not found or does not belong to user")

            return conversation
        else:
            # Create new conversation
            conversation = Conversation(
                user_id=user_id,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            session.add(conversation)
            session.commit()
            session.refresh(conversation)

            return conversation

    async def _get_conversation_history(
        self,
        conversation_id: int,
        session: Session
    ) -> list:
        """
        Get full conversation history from database.

        Args:
            conversation_id (int): Conversation ID
            session (Session): Database session

        Returns:
            list: Messages in format [{"role": str, "content": str}, ...]
        """
        statement = select(Message).where(
            Message.conversation_id == conversation_id
        ).order_by(Message.created_at.asc())

        result = session.exec(statement)
        messages = result.all()

        return [
            {
                "role": msg.role.value,
                "content": msg.content
            }
            for msg in messages
        ]
