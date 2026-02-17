"""OpenAI Agent Wrapper - AI orchestration for Phase III

Uses OpenAI Assistants API for natural language task management.
Stateless operation - no session state maintained.
"""
import os
import asyncio
from typing import List, Dict, Optional
from openai import AsyncOpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get OpenAI/OpenRouter configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4-turbo-preview")
OPENAI_BASE_URL = os.getenv("OPENAI_BASE_URL", None)  # For OpenRouter support

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is required")


class ChatAgent:
    """
    OpenAI-powered chat agent for natural language task management.

    This agent is STATELESS - all conversation state is maintained in the database.
    Each request rebuilds context from conversation history.
    """

    def __init__(self, api_key: str = None, model: str = None, base_url: str = None):
        """
        Initialize the chat agent.

        Args:
            api_key (str, optional): OpenAI/OpenRouter API key (defaults to env var)
            model (str, optional): Model to use (defaults to env var)
            base_url (str, optional): API base URL (for OpenRouter support)
        """
        self.api_key = api_key or OPENAI_API_KEY
        self.model = model or OPENAI_MODEL
        self.base_url = base_url or OPENAI_BASE_URL

        # Create async client with optional base_url (for OpenRouter)
        if self.base_url:
            self.client = AsyncOpenAI(api_key=self.api_key, base_url=self.base_url)
        else:
            self.client = AsyncOpenAI(api_key=self.api_key)

    async def process_message(
        self,
        user_message: str,
        conversation_history: List[Dict],
        tools: List[Dict],
        user_id: str = None
    ) -> Dict:
        """
        Process a user message with full conversation history (stateless).

        This method is STATELESS - it receives full conversation history
        and returns a response without maintaining any session state.

        Args:
            user_message (str): The user's current message
            conversation_history (List[Dict]): Full conversation history from database
                Each entry: {"role": "user"|"assistant", "content": str}
            tools (List[Dict]): MCP tool schemas for function calling
            user_id (str, optional): Authenticated user's ID (injected into system prompt)

        Returns:
            Dict: {
                "content": str,  # AI response message
                "tool_calls": List[Dict] | None  # Tool calls made by AI
            }
        """
        # Build messages array from conversation history
        messages = self._build_messages(conversation_history)

        # Add current user message
        messages.append({
            "role": "user",
            "content": user_message
        })

        # Add system message for task management context
        # Inject the actual user_id so the AI uses it in tool calls
        user_id_instruction = f"\nIMPORTANT: The authenticated user's ID is '{user_id}'. You MUST use this exact ID as the user_id parameter in ALL tool calls. Never use a different user_id." if user_id else ""
        system_message = {
            "role": "system",
            "content": f"""You are a helpful AI assistant that manages todo tasks through natural language.

You have access to these tools:
- add_task: Create new tasks
- list_tasks: Show tasks (all/pending/completed)
- complete_task: Mark tasks as done
- delete_task: Remove tasks
- update_task: Modify task title or description

Guidelines:
- Always confirm actions taken (e.g., "I've created a task 'buy groceries'")
- If user intent is ambiguous, ask clarifying questions
- Use tools to interact with tasks - never fabricate task data
- Be conversational and helpful
- When listing tasks, format them clearly for readability
- Always respond in English

When calling add_task, extract intelligently from the user's sentence:
- title: The SHORT core task name only (e.g. "Buy groceries", "Submit report")
- description: Any extra details or context mentioned
- priority: 'high' if urgent/important is mentioned, 'low' if optional/someday, else 'medium'
- due_date: Convert ALL date mentions to MM/DD/YYYY format. Today is 02/17/2026.
  Examples: "tomorrow" → "02/18/2026", "next Monday" → "02/23/2026", "in 3 days" → "02/20/2026"
- category: Infer from context (work, personal, shopping, health, etc.) if obvious{user_id_instruction}
"""
        }
        messages.insert(0, system_message)

        try:
            # Call OpenAI with tools (function calling) - async call
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                tools=tools if tools else None,
                tool_choice="auto" if tools else None,
                timeout=30.0  # Add timeout to prevent hanging
            )

            # Extract response
            message = response.choices[0].message

            # Check for tool calls
            tool_calls = None
            if message.tool_calls:
                tool_calls = [
                    {
                        "id": tool_call.id,
                        "name": tool_call.function.name,
                        "arguments": tool_call.function.arguments
                    }
                    for tool_call in message.tool_calls
                ]

            return {
                "content": message.content or "",
                "tool_calls": tool_calls
            }

        except Exception as e:
            # Provide more specific error messages
            error_message = str(e).lower()
            if "rate limit" in error_message or "quota" in error_message:
                raise Exception("AI service is currently rate limited. Please try again in a moment.") from e
            elif "api key" in error_message or "authentication" in error_message:
                raise Exception("AI service authentication error. Please contact support.") from e
            elif "timeout" in error_message:
                raise Exception("AI service timed out. Please try again.") from e
            else:
                raise Exception(f"AI service temporarily unavailable: {str(e)}") from e

    async def process_with_tool_results(
        self,
        conversation_history: List[Dict],
        user_message: str,
        agent_tool_calls: List[Dict],
        tool_results: List[Dict],
        tools: List[Dict]
    ) -> Dict:
        """
        Process tool execution results and get final AI response.

        After tools are executed, this method sends results back to AI
        for a final conversational response.

        The full message sequence required by the OpenAI API is:
        [system, history..., user_message, assistant_with_tool_calls, tool_results...]

        Args:
            conversation_history (List[Dict]): Full conversation history (before current message)
            user_message (str): The current user message
            agent_tool_calls (List[Dict]): Tool calls from the assistant's first response
            tool_results (List[Dict]): Results from executed tools
                Each: {"tool_call_id": str, "name": str, "result": Any}
            tools (List[Dict]): MCP tool schemas

        Returns:
            Dict: {"content": str, "tool_calls": None}
        """
        # Build system + history messages
        system_message = {
            "role": "system",
            "content": """You are a helpful AI assistant that manages todo tasks through natural language.

You have access to these tools:
- add_task: Create new tasks
- list_tasks: Show tasks (all/pending/completed)
- complete_task: Mark tasks as done
- delete_task: Remove tasks
- update_task: Modify task title or description

Guidelines:
- Always confirm actions taken (e.g., "I've created a task 'buy groceries'")
- If user intent is ambiguous, ask clarifying questions
- Use tools to interact with tasks - never fabricate task data
- Be conversational and helpful
- When listing tasks, format them clearly for readability
- Always respond in English
"""
        }
        messages = [system_message] + self._build_messages(conversation_history)

        # Add the current user message
        messages.append({
            "role": "user",
            "content": user_message
        })

        # Add the assistant's tool_call response (required before tool results)
        messages.append({
            "role": "assistant",
            "content": None,
            "tool_calls": [
                {
                    "id": tc["id"],
                    "type": "function",
                    "function": {
                        "name": tc["name"],
                        "arguments": tc["arguments"]
                    }
                }
                for tc in agent_tool_calls
            ]
        })

        # Add tool results as tool message responses (OpenAI v1 API format)
        for tool_result in tool_results:
            messages.append({
                "role": "tool",
                "tool_call_id": tool_result["tool_call_id"],
                "content": str(tool_result["result"])
            })

        try:
            # Get final response from AI - async call
            # Note: tool_choice="none" is not supported by all models, so we omit it
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                timeout=30.0  # Add timeout
            )

            message = response.choices[0].message

            return {
                "content": message.content or "Task completed successfully.",
                "tool_calls": None
            }

        except Exception as e:
            # Provide more specific error messages
            error_message = str(e).lower()
            if "rate limit" in error_message or "quota" in error_message:
                raise Exception("AI service is currently rate limited. Please try again in a moment.") from e
            elif "api key" in error_message or "authentication" in error_message:
                raise Exception("AI service authentication error. Please contact support.") from e
            elif "timeout" in error_message:
                raise Exception("AI service timed out. Please try again.") from e
            else:
                raise Exception(f"AI service temporarily unavailable: {str(e)}") from e

    def _build_messages(self, conversation_history: List[Dict]) -> List[Dict]:
        """
        Build messages array from conversation history.

        Args:
            conversation_history (List[Dict]): Conversation from database

        Returns:
            List[Dict]: Messages in OpenAI format
        """
        return [
            {
                "role": msg["role"],
                "content": msg["content"]
            }
            for msg in conversation_history
        ]
