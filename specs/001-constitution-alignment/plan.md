# Implementation Plan: Phase III Constitution Alignment - AI Chat Todo Manager

**Branch**: `001-constitution-alignment` | **Date**: 2026-02-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-constitution-alignment/spec.md`

## Summary

Transform the Phase II traditional form-based todo app into a Phase III AI-powered conversational todo manager. The system will use OpenAI Agents SDK with MCP tools to enable natural language task management through a modern chat interface. This requires migrating to a stateless backend architecture, adding Conversation and Message models, implementing 5 MCP tools, creating a chat API endpoint, and redesigning the frontend to use ChatKit UI with the provided Figma design.

**Key Changes**:
- Add AI layer (OpenAI Agents SDK + MCP SDK)
- Migrate database schema (add Conversation/Message models, modify Task model)
- Implement stateless request processing
- Create 5 MCP tools for task operations
- Replace form-based UI with chat interface
- Apply Figma design system

## Technical Context

**Language/Version**: Python 3.11 (backend), TypeScript/Next.js 14+ (frontend)
**Primary Dependencies**:
- Backend: FastAPI 0.104.1 (existing), SQLModel 0.0.14 (existing), OpenAI Agents SDK (new), MCP SDK (new)
- Frontend: Next.js 14+ (existing), React 18 (existing), ChatKit UI (new), Tailwind CSS (existing)

**Storage**: Neon Serverless PostgreSQL (existing, schema migration required)
**Testing**: pytest (backend), Jest/React Testing Library (frontend)
**Target Platform**: Web application (backend: Linux server, frontend: browser-based responsive)
**Project Type**: Web (backend + frontend)

**Performance Goals**:
- <3s for task list retrieval via chat
- <15s for task creation end-to-end
- Support 100 concurrent users
- AI response time <5s (depends on OpenAI API)

**Constraints**:
- Stateless backend (no in-memory session state)
- All conversation state in database
- Task model schema must match constitution exactly
- user_id must be string type (currently UUID, needs migration)
- id must be int type (currently UUID, needs migration)

**Scale/Scope**:
- 100+ concurrent users
- 1000 messages per conversation max
- 90-day conversation retention
- Multi-user isolation enforced

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Required Technology Stack

- [x] **OpenAI Agents SDK** — Not yet integrated (Phase 0 research required)
- [x] **Official MCP SDK** — Not yet integrated (Phase 0 research required)
- [x] **FastAPI** — ✅ Already present (version 0.104.1)
- [ ] **OpenAI ChatKit** — Not yet integrated (frontend migration required)
- [x] **SQLModel ORM** — ✅ Already present (version 0.0.14)
- [x] **Neon Serverless PostgreSQL** — ✅ Already present
- [ ] **Better Auth** — Existing auth system present, compatibility needs verification

### Development Philosophy

- [x] **Spec created** — ✅ spec.md completed and validated
- [x] **Plan required** — ✅ This document (plan.md)
- [ ] **Tasks required** — Will be created via /sp.tasks after planning
- [ ] **Tool contracts spec-defined** — Will be defined in Phase 1 (contracts/)

### Architectural Mandates

- [ ] **Fully stateless backend** — Current implementation not verified as stateless
- [ ] **Conversation state in database only** — Conversation/Message models don't exist yet
- [ ] **MCP tools are stateless** — MCP tools not implemented yet
- [ ] **AI agent uses ONLY MCP tools** — AI layer not implemented yet
- [ ] **Single chat endpoint** — `/api/{user_id}/chat` not implemented yet
- [ ] **All requests independent** — Stateless execution cycle not implemented yet

### Folder Structure

- [x] **/frontend** — ✅ Exists (needs ChatKit migration)
- [x] **/backend** — ✅ Exists (needs AI integration)
- [x] **/specs** — ✅ Exists (this document)
- [ ] **/migrations** — Directory exists but needs new migrations for Conversation/Message models

### Database Schema Compliance

**Task Model**:
- [ ] **user_id (string)** — Currently UUID, needs migration to string
- [ ] **id (int)** — Currently UUID, needs migration to int
- [x] **title (string)** — ✅ Matches
- [x] **description (string, nullable)** — ✅ Matches
- [x] **completed (boolean)** — ✅ Matches
- [x] **created_at (datetime)** — ✅ Matches
- [x] **updated_at (datetime)** — ✅ Matches
- [ ] **Extra fields removed** — Current model has priority, due_date, category (not in constitution)

**Conversation Model**:
- [ ] **user_id (string)** — Not implemented
- [ ] **id (int)** — Not implemented
- [ ] **created_at (datetime)** — Not implemented
- [ ] **updated_at (datetime)** — Not implemented

**Message Model**:
- [ ] **user_id (string)** — Not implemented
- [ ] **id (int)** — Not implemented
- [ ] **conversation_id (int, FK)** — Not implemented
- [ ] **role (enum: user/assistant)** — Not implemented
- [ ] **content (string)** — Not implemented
- [ ] **created_at (datetime)** — Not implemented

### MCP Tool Contracts

- [ ] **add_task** — Not implemented
- [ ] **list_tasks** — Not implemented
- [ ] **complete_task** — Not implemented
- [ ] **delete_task** — Not implemented
- [ ] **update_task** — Not implemented

### Gate Summary

**Status**: ⚠️ **CONDITIONAL PASS WITH REQUIRED WORK**

**Passing Items** (7/7):
- Technology stack partially present (FastAPI, SQLModel, PostgreSQL)
- Spec-driven workflow followed
- Folder structure exists
- Baseline infrastructure present

**Required Work** (26 items):
1. Integrate OpenAI Agents SDK
2. Integrate MCP SDK
3. Migrate frontend to ChatKit UI
4. Verify Better Auth compatibility
5. Implement stateless backend architecture
6. Create Conversation model
7. Create Message model
8. Migrate Task model schema (UUID → int/string)
9. Remove extra Task fields (priority, due_date, category)
10. Implement chat endpoint
11. Implement stateless execution cycle
12. Create 5 MCP tools
13. Ensure AI uses only MCP tools (no direct DB access)
14. Create database migrations
15. Define tool contracts
16. Implement Phase Gates validation
17-26. (Additional implementation tasks)

**Justification**: This is a migration project that must bring existing Phase II code into Phase III constitutional compliance. All non-compliant items are explicitly scoped for correction in this plan.

## Project Structure

### Documentation (this feature)

```text
specs/001-constitution-alignment/
├── spec.md              # ✅ Feature specification (completed)
├── plan.md              # ✅ This file (in progress)
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
├── contracts/           # Phase 1 output (to be created)
│   ├── chat-api.yaml    # Chat endpoint OpenAPI spec
│   ├── add-task-tool.yaml
│   ├── list-tasks-tool.yaml
│   ├── complete-task-tool.yaml
│   ├── delete-task-tool.yaml
│   └── update-task-tool.yaml
├── checklists/          # ✅ Quality checklists
│   └── requirements.md  # ✅ Spec validation (completed)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

**Current Structure** (Phase II):
```text
backend/
├── src/
│   ├── api/              # ✅ Existing endpoints (auth, tasks, users, etc.)
│   ├── models/           # ✅ Existing models (task, user, todo_list)
│   ├── services/         # ✅ Existing services
│   ├── database/         # ✅ Database connection
│   ├── middleware/       # ✅ Existing middleware
│   └── main.py          # ✅ FastAPI app entry point
└── requirements.txt      # ✅ Python dependencies

frontend/
├── src/
│   ├── app/             # ✅ Next.js app router
│   ├── components/      # ✅ React components
│   ├── hooks/           # ✅ Custom hooks
│   ├── lib/             # ✅ Utilities
│   └── styles/          # ✅ Tailwind CSS
└── package.json         # ✅ Node dependencies

migrations/              # ✅ Database migrations directory
specs/                   # ✅ Specifications directory
```

**Required Additions** (Phase III):
```text
backend/
└── src/
    ├── agent/                    # NEW: AI agent integration
    │   ├── __init__.py
    │   ├── openai_agent.py       # OpenAI Agents SDK wrapper
    │   └── chat_handler.py       # Stateless chat request handler
    ├── mcp/                      # NEW: MCP tools
    │   ├── __init__.py
    │   ├── tools/
    │   │   ├── __init__.py
    │   │   ├── add_task.py
    │   │   ├── list_tasks.py
    │   │   ├── complete_task.py
    │   │   ├── delete_task.py
    │   │   └── update_task.py
    │   └── server.py             # MCP server setup
    ├── models/
    │   ├── conversation.py       # NEW: Conversation model
    │   └── message.py            # NEW: Message model
    └── api/
        └── chat.py               # NEW: Chat endpoint

frontend/
└── src/
    ├── components/
    │   ├── chat/                 # NEW: Chat UI components
    │   │   ├── ChatInterface.tsx
    │   │   ├── MessageList.tsx
    │   │   ├── MessageInput.tsx
    │   │   └── TypingIndicator.tsx
    │   └── figma/                # NEW: Figma design components
    └── lib/
        └── chatkit.ts            # NEW: ChatKit UI integration

migrations/
├── 003_add_conversation_model.sql   # NEW
├── 004_add_message_model.sql        # NEW
└── 005_migrate_task_to_constitution_schema.sql  # NEW
```

**Structure Decision**: Using existing "Web application" structure (backend + frontend). No structural changes needed, only additions and modifications to align with constitution. The existing folder layout already matches the constitutional requirement for `/backend`, `/frontend`, `/specs`, and `/migrations` directories.

## Complexity Tracking

> **No violations** - All constitution requirements will be met through planned implementation work. No deviations requested.

---

# Phase 0: Outline & Research

## Research Tasks

This phase resolves all technical unknowns before detailed design.

### R1: OpenAI Agents SDK Integration
**Question**: How to integrate OpenAI Agents SDK with FastAPI for stateless chat requests?
**Research Areas**:
- SDK installation and configuration
- Agent initialization and message handling
- Tool calling patterns
- Streaming vs non-streaming responses
- Error handling and retry logic
- Authentication with OpenAI API

**Deliverable**: Integration pattern for OpenAI Agents SDK in FastAPI context

---

### R2: MCP SDK Integration
**Question**: How to implement MCP tools and integrate with OpenAI Agents SDK?
**Research Areas**:
- Official MCP SDK installation
- Tool definition and registration
- Tool parameter validation
- Tool response format
- Integration with OpenAI tool calling
- Error handling in MCP tools

**Deliverable**: MCP tool implementation pattern and SDK integration approach

---

### R3: ChatKit UI Integration
**Question**: How to integrate OpenAI ChatKit UI with Next.js and apply Figma design?
**Research Areas**:
- ChatKit UI installation and setup
- Component customization
- Figma design token extraction
- Theming and styling approach
- Message rendering patterns
- Responsive design implementation

**Deliverable**: ChatKit UI integration approach with Figma design application

---

### R4: Stateless Execution Cycle Implementation
**Question**: How to implement the 8-step stateless execution cycle per constitution?
**Research Areas**:
- Database query patterns for conversation history
- Efficient message array building
- Transaction management for message storage
- Concurrent request handling
- Database connection pooling
- Performance optimization strategies

**Deliverable**: Stateless request processing architecture

---

### R5: Database Schema Migration Strategy
**Question**: How to migrate from UUID-based IDs to int/string IDs without data loss?
**Research Areas**:
- PostgreSQL UUID to int conversion approaches
- Data migration strategies (zero-downtime vs maintenance window)
- Foreign key handling during migration
- Rollback procedures
- Testing strategies for migrations

**Deliverable**: Safe database migration plan

---

### R6: Better Auth Compatibility
**Question**: Is existing Better Auth system compatible with stateless architecture and string user_id?
**Research Areas**:
- Current Better Auth implementation review
- User ID type compatibility
- JWT token structure
- Stateless authentication patterns
- Migration path if needed

**Deliverable**: Auth system compatibility assessment and migration plan (if needed)

---

