---
id: 2
title: Debug and Fix Tasks + Chat 500 Errors
stage: general
date: 2026-02-17
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: 001-constitution-alignment
user: Nafay
command: debug-resolver
labels: ["debugging","fastapi","postgresql","openai","async","migration"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/agent/openai_agent.py
  - backend/src/agent/chat_handler.py
  - backend/src/api/chat.py
  - backend/src/main.py
  - backend/migrations/008_add_priority_due_date_category_to_tasks.sql
  - frontend/src/app/dashboard/page.tsx
  - frontend/src/lib/types.ts
tests:
  - GET /api/tasks returns 200 with tasks array
  - POST /api/tasks creates task with priority/due_date/category fields
  - PUT /api/tasks/{id} updates task
  - DELETE /api/tasks/{id} deletes task
  - POST /api/{user_id}/chat first message returns 200
  - POST /api/{user_id}/chat second message same conversation returns 200
  - Multi-turn chat with tool calls (list_tasks) works correctly
  - CORS allows localhost:3000 and localhost:3001
---

## Prompt

Debug and fix all issues in a FastAPI backend + Next.js frontend Todo app. Here's the context:

## Current Issues
1. Dashboard shows permanent "Error loading tasks" + "Network Error"
2. AI chat shows "AI service unavailable" (500 error) after first message

## Tech Stack
- Backend: FastAPI, SQLModel, PostgreSQL (Neon), Python
- Frontend: Next.js, TypeScript, Axios
- AI: OpenRouter API (Qwen 2.5-7b-instruct model)
- Auth: JWT tokens

[Full request details - see user prompt for complete spec]

## Response snapshot

### Root Causes Found

**Issue 1 - Dashboard "Error loading tasks":**
Root cause: The database `tasks` table was missing columns `priority`, `due_date`, and `category` that were added to the `Task` SQLModel but never migrated to the actual PostgreSQL schema. Every query failed with `psycopg2.errors.UndefinedColumn: column tasks.priority does not exist`.

**Issue 2 - AI Chat 500 error:**
Root cause: Multiple bugs compounding:
1. `openai_agent.py` used synchronous `OpenAI` client (`client.chat.completions.create()`) inside an async FastAPI handler, blocking the event loop and causing failures under uvicorn.
2. `process_with_tool_results()` built an incorrect message sequence - it sent tool results without the required preceding user message and assistant tool_call response, causing OpenRouter to return 400 "bad request".
3. `ToolCallInfo` Pydantic model had `result: Dict` but `list_tasks` returns `List[Dict]`, causing a 422 validation error.
4. The AI hallucinated fake user IDs in tool calls (e.g., "user123", "101") instead of using the authenticated user's real UUID.

### Fixes Applied

1. **Database migration** (`backend/migrations/008_add_priority_due_date_category_to_tasks.sql`):
   Added the three missing columns:
   ```sql
   ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'medium';
   ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date VARCHAR(100);
   ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category VARCHAR(100);
   ```

2. **`backend/src/agent/openai_agent.py`**:
   - Changed `OpenAI` to `AsyncOpenAI` (async client)
   - Made `process_message()` and `process_with_tool_results()` async methods
   - Fixed `process_with_tool_results()` to include the full message sequence: system + history + user_message + assistant_tool_calls + tool_results
   - Changed tool result role from `"function"` to `"tool"` (correct OpenAI v1 API format)
   - Added `user_id` parameter to system prompt so AI uses the real authenticated user ID in tool calls
   - Added English language instruction to system prompt (model was responding in Chinese)

3. **`backend/src/agent/chat_handler.py`**:
   - Added `await` to `process_message()` call (now async)
   - Added `await` to `process_with_tool_results()` call (now async)
   - Passed `user_id`, `user_message`, and `agent_tool_calls` to `process_with_tool_results()`

4. **`backend/src/api/chat.py`**:
   - Added `Any` to imports
   - Changed `result: Dict` to `result: Any` in `ToolCallInfo` model to support list results from `list_tasks`

5. **`backend/src/main.py`**:
   - Added `http://localhost:3001` to CORS allowed origins

6. **`frontend/src/app/dashboard/page.tsx`**:
   - Added missing `import type { TaskCreateRequest } from '@/lib/types'`

7. **`frontend/src/lib/types.ts`**:
   - Changed `result: Record<string, any>` to `result: Record<string, any> | any[]` in `ToolCall` interface

## Outcome

- Impact: Both critical issues resolved. Tasks endpoint returns 200. Multi-turn AI chat works correctly with proper tool calls.
- Tests: All manual API tests pass (GET/POST/PUT/DELETE tasks, single and multi-turn chat with tool calls)
- Files: 7 files changed, 1 migration file created
- Next prompts: Consider adding automatic migration runner on startup; add user_id validation in MCP tools (compare against authenticated user in path)
- Reflection: The fundamental issue was a schema drift (model updated without migration) and synchronous blocking call in async context. The tool result message format was also incorrect for OpenAI v1 API spec.

## Evaluation notes (flywheel)

- Failure modes observed: uvicorn --reload doesn't work reliably on Windows; synchronous OpenAI client blocks async event loop; Pydantic model type mismatch between List and Dict for tool results
- Graders run and results (PASS/FAIL): All 8 manual API tests PASS
- Prompt variant (if applicable): none
- Next experiment: Add asyncio.run_in_executor for any remaining sync DB calls; add integration tests
