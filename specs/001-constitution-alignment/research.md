# Phase 0 Research: Phase III Constitution Alignment

**Feature**: 001-constitution-alignment
**Date**: 2026-02-14
**Status**: Completed

This document consolidates research findings for all technical unknowns identified in the implementation plan.

---

## R1: OpenAI Agents SDK Integration

### Decision
Use **OpenAI Python SDK v1.x** with Assistants API (Agents SDK) for AI orchestration in stateless FastAPI backend.

### Rationale
- Native Python support matches backend language
- Assistants API supports function calling (needed for MCP tools)
- Stateless operation possible by passing full conversation history per request
- Well-documented with FastAPI integration examples
- Supports streaming and non-streaming responses

### Integration Pattern

```python
# backend/src/agent/openai_agent.py
from openai import OpenAI
from typing import List, Dict

class ChatAgent:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

    def process_message(self, user_message: str, conversation_history: List[Dict], tools: List[Dict]) -> Dict:
        """
        Stateless message processing - no session state stored
        """
        # Build messages array from conversation history
        messages = self._build_messages(conversation_history)
        messages.append({"role": "user", "content": user_message})

        # Call OpenAI with tools (MCP tools registered as functions)
        response = self.client.chat.completions.create(
            model="gpt-4-turbo-preview",
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )

        return response
```

**Key Points**:
- No agent state persisted between requests
- Conversation history rebuilt from database each time
- Tools defined as OpenAI function schemas
- Response includes tool calls for MCP execution

### Alternatives Considered
- **LangChain**: More complex, unnecessary abstraction layer
- **Direct OpenAI Chat API**: Works but Assistants API provides better tool calling support
- **Azure OpenAI**: Vendor lock-in, similar API

---

## R2: MCP SDK Integration

### Decision
Use **Model Context Protocol (MCP) SDK** to define tools, integrate with OpenAI function calling.

### Rationale
- Official MCP SDK provides standardized tool definition
- Compatible with OpenAI function calling format
- Ensures constitution compliance (AI uses ONLY MCP tools)
- Stateless by design - tools don't maintain state
- Clear separation between AI layer and data operations

### Integration Pattern

```python
# backend/src/mcp/tools/add_task.py
from mcp import Tool, ToolParameter, ToolResult
from typing import Dict

add_task_tool = Tool(
    name="add_task",
    description="Create a new task for the user",
    parameters=[
        ToolParameter(name="user_id", type="string", required=True),
        ToolParameter(name="title", type="string", required=True),
        ToolParameter(name="description", type="string", required=False)
    ]
)

def execute_add_task(user_id: str, title: str, description: str = None) -> ToolResult:
    """Execute add_task tool - stateless operation"""
    # Validate inputs
    # Call database service to create task
    # Return structured result
    return ToolResult(
        success=True,
        data={"task_id": task.id, "status": "created", "title": task.title}
    )
```

**Tool Registration**:
```python
# Convert MCP tools to OpenAI function schemas
tools_for_openai = [
    {
        "type": "function",
        "function": {
            "name": "add_task",
            "description": add_task_tool.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "user_id": {"type": "string"},
                    "title": {"type": "string"},
                    "description": {"type": "string"}
                },
                "required": ["user_id", "title"]
            }
        }
    }
]
```

**Key Points**:
- Each tool is stateless function
- Tools only operate on database, never maintain state
- AI can only interact with tasks through these tools
- Clear contract enforcement

### Alternatives Considered
- **Direct function definitions**: Less structured, harder to validate
- **Custom tool framework**: Reinventing the wheel, not standard-compliant

---

## R3: ChatKit UI Integration

### Decision
**Note**: OpenAI ChatKit UI is not a public package. Use **custom React components** styled per Figma design.

### Rationale
- "ChatKit" likely refers to chat UI patterns, not specific library
- Custom components provide full design control
- Figma design can be directly implemented
- Next.js + Tailwind CSS already present (matches requirements)
- More maintainable than third-party chat library

### Implementation Approach

**Component Structure**:
```typescript
// frontend/src/components/chat/ChatInterface.tsx
export function ChatInterface() {
  return (
    <div className="chat-container">
      <MessageList messages={messages} />
      <MessageInput onSend={handleSend} />
      <TypingIndicator visible={isAITyping} />
    </div>
  )
}
```

**Figma Design Integration**:
1. Extract design tokens (colors, spacing, typography) from Figma
2. Create Tailwind CSS configuration with design tokens
3. Apply consistent styling across chat components
4. Implement responsive breakpoints per Figma specs

**Message Rendering**:
- User messages: Right-aligned, distinct color
- AI messages: Left-aligned, formatted responses
- Smooth animations for message appearance
- Auto-scroll to latest message

### Alternatives Considered
- **react-chat-widget**: Limited customization, doesn't match Figma
- **stream-chat-react**: Overkill, real-time streaming not needed
- **@chatscope/chat-ui-kit-react**: Good but custom approach provides better Figma alignment

---

## R4: Stateless Execution Cycle Implementation

### Decision
Implement **8-step stateless cycle** using database queries and transactions per constitution.

### Architecture

**Request Flow** (per constitution):
```
1. Receive message (POST /api/{user_id}/chat)
2. Fetch conversation from DB (or create new)
3. Build agent message array from conversation history
4. Store user message in DB
5. Run agent with MCP tool access
6. Agent calls MCP tools (stateless)
7. Store assistant message in DB
8. Return response
```

**Implementation Pattern**:
```python
# backend/src/api/chat.py
@router.post("/api/{user_id}/chat")
async def chat(user_id: str, request: ChatRequest):
    # Step 1: Receive message ✓

    # Step 2: Fetch or create conversation
    conversation = get_or_create_conversation(user_id, request.conversation_id)

    # Step 3: Build message array from DB
    messages = get_conversation_messages(conversation.id)

    # Step 4: Store user message
    save_message(conversation.id, "user", request.message, user_id)

    # Step 5: Run agent (stateless)
    agent_response = agent.process_message(
        user_message=request.message,
        conversation_history=messages,
        tools=mcp_tools
    )

    # Step 6: Handle tool calls if present
    if agent_response.tool_calls:
        tool_results = execute_mcp_tools(agent_response.tool_calls, user_id)
        # Get final response after tool execution
        final_response = agent.process_with_tool_results(messages, tool_results)
    else:
        final_response = agent_response

    # Step 7: Store assistant message
    save_message(conversation.id, "assistant", final_response.content, user_id)

    # Step 8: Return response
    return {
        "conversation_id": conversation.id,
        "response": final_response.content,
        "tool_calls": agent_response.tool_calls
    }
```

**Database Optimization**:
- Index on `conversation_id` for fast message retrieval
- Index on `user_id` for user isolation
- Connection pooling (already in place with SQLModel)
- Transaction for message storage (atomic operations)

**Concurrency Handling**:
- Each request is independent
- No shared state between requests
- Database handles concurrent writes
- User isolation prevents cross-contamination

### Alternatives Considered
- **In-memory caching**: Violates stateless requirement
- **Session-based state**: Violates constitution
- **WebSocket connections**: Adds complexity, not required for Phase III

---

## R5: Database Schema Migration Strategy

### Decision
Use **multi-step migration** with data preservation where possible, fresh start for Phase III users.

### Migration Approach

**Option 1: Fresh Start** (Recommended for Phase III)
- Constitution allows: "Migration of existing Phase II task data (users start fresh in Phase III)" is out of scope
- Create new tables with constitution-compliant schemas
- Existing Phase II data remains for reference/backup
- Simplest migration path
- No data type conversion complexity

**Schema Changes Required**:
```sql
-- NEW: Conversation model (constitution schema)
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- NEW: Message model (constitution schema)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id),
    role VARCHAR(20) CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- MODIFIED: Task model (constitution schema)
CREATE TABLE tasks_v3 (
    id SERIAL PRIMARY KEY,                    -- Changed from UUID to INT
    user_id VARCHAR(255) NOT NULL,             -- Changed from UUID to VARCHAR
    title VARCHAR(255) NOT NULL,
    description TEXT,                          -- VARCHAR to TEXT (more flexible)
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    -- Removed: priority, due_date, category (not in constitution)
);
```

**Migration Script**:
```sql
-- migrations/003_add_conversation_model.sql
-- migrations/004_add_message_model.sql
-- migrations/005_create_constitution_compliant_task_model.sql
```

### Rollback Strategy
- Keep Phase II tables intact as `tasks_old`, `users_old`
- Can revert backend to Phase II code if needed
- Database backups before migration

### Alternatives Considered
- **UUID to INT conversion**: Complex, high risk of data corruption
- **Gradual migration**: Dual schema support too complex
- **Keep UUID as string**: Not compliant with constitution (requires int)

---

## R6: Better Auth Compatibility

### Decision
Existing Better Auth system is **compatible with modifications** - update user_id handling to support string type.

### Compatibility Assessment

**Current Implementation**:
- JWT tokens with UUID user_id
- Password hashing with bcrypt (good)
- Session-based authentication (needs review for stateless requirement)

**Required Changes**:
1. **User ID Type**: Change from UUID to string in auth responses
2. **JWT Claims**: Ensure user_id claim is string type
3. **Stateless Validation**: Verify JWT validation doesn't rely on server-side session

**Modified Auth Flow**:
```python
# backend/src/services/auth.py
def create_access_token(user_id: str) -> str:  # Changed from UUID
    """Create JWT with string user_id"""
    payload = {
        "sub": user_id,  # String user_id
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

def verify_token(token: str) -> str:  # Returns string user_id
    """Stateless token verification"""
    payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    return payload["sub"]  # Returns string user_id
```

**Compatibility**: ✅ **COMPATIBLE** with modifications
- JWT is inherently stateless (no server-side session required)
- user_id can be string in JWT claims
- No breaking changes to auth flow

### Migration Path
1. Update User model to support both UUID and string representation
2. Modify JWT encoding/decoding to handle string user_id
3. Update middleware to extract string user_id from tokens
4. Test stateless authentication (token validation without database lookup)

### Alternatives Considered
- **Replace with new auth system**: Unnecessary, existing system is salvageable
- **Keep UUID throughout**: Not constitution-compliant

---

## Research Summary

**All Technical Unknowns Resolved**: ✅

| Research Area | Decision | Status |
|--------------|----------|--------|
| OpenAI Agents SDK | Use OpenAI Python SDK v1.x with Assistants API | ✅ Resolved |
| MCP SDK Integration | Use official MCP SDK with OpenAI function calling | ✅ Resolved |
| ChatKit UI | Build custom React components per Figma design | ✅ Resolved |
| Stateless Execution | Implement 8-step cycle per constitution | ✅ Resolved |
| Database Migration | Fresh start approach (Phase III users start new) | ✅ Resolved |
| Better Auth | Compatible with string user_id modifications | ✅ Resolved |

**Ready for Phase 1**: Design artifacts (data-model.md, contracts/, quickstart.md) can now be created with confidence.

**Key Risks Identified**:
1. OpenAI API costs could be high (mitigation: implement rate limiting)
2. Database migration complexity (mitigation: fresh start approach)
3. Figma design fidelity (mitigation: design review checklist)

**Dependencies Confirmed**:
- OpenAI API key required (environment variable)
- MCP SDK installation (Python package)
- No blockers identified
