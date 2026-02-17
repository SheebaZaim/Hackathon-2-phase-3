# Phase III: Todo AI Chatbot — Spec-Driven Development Constitution

<!--
Sync Impact Report (2026-02-14):
- Version change: [INITIAL] → 1.0.0
- New constitution created for Phase III Todo AI Chatbot project
- Principles defined: 4 core principles + System Specifications + Phase Gates
- Templates requiring updates:
  ✅ Constitution created
  ⚠ Templates will be validated for alignment (.specify/templates/plan-template.md, spec-template.md, tasks-template.md)
- Follow-up TODOs: None (all placeholders filled)
-->

## Core Principles

### I. Core Objective — Technology Stack

Build an AI-powered Todo chatbot using the following **REQUIRED** stack:

- **OpenAI Agents SDK** — AI orchestration layer
- **Official MCP SDK** — Tool integration protocol
- **FastAPI** — Backend framework
- **OpenAI ChatKit** — Frontend UI
- **SQLModel ORM** — Database modeling
- **Neon Serverless PostgreSQL** — Database
- **Better Auth** — Authentication system

**Rationale**: This stack ensures modern, scalable, and maintainable architecture with AI-native tool integration via MCP. The chatbot MUST manage todos via natural language using MCP tools exclusively.

### II. Development Philosophy (MANDATORY)

This project MUST follow the Spec-Driven Development workflow:

```
Write spec → Generate plan → Break into tasks → Implement via Claude Code
```

**Non-Negotiable Rules**:

- ❌ **PROHIBITED**: Manual coding without spec
- ❌ **PROHIBITED**: Skipping specification phase
- ❌ **PROHIBITED**: Skipping planning phase
- ❌ **PROHIBITED**: Direct implementation without tasks
- ✅ **REQUIRED**: All features must originate from specification
- ✅ **REQUIRED**: All code must be generated via Claude Code
- ✅ **REQUIRED**: All tool contracts must be spec-defined before implementation

**Rationale**: Spec-driven development ensures architectural coherence, prevents scope creep, and maintains traceability from requirements through implementation. All work MUST be traceable to specifications.

### III. Architectural Mandates — Stateless Backend

The backend MUST enforce these architectural constraints:

1. **Fully stateless backend server** — No in-memory session state
2. **Conversation state stored ONLY in database** — Database is source of truth
3. **MCP tools are stateless** — Each tool call is independent
4. **AI agent interacts ONLY through MCP tools** — No direct database access from agent
5. **Single chat endpoint** — `/api/{user_id}/chat`
6. **All requests independent and reproducible** — Request contains full context

**Rationale**: Stateless architecture ensures horizontal scalability, simplifies debugging, prevents state synchronization issues, and makes the system resilient to restarts. Every request must be self-contained and reproducible.

### IV. Folder Structure Requirement

The project MUST maintain this exact folder structure:

```
/frontend       → ChatKit UI
/backend        → FastAPI + Agents SDK + MCP
/specs          → Agent + MCP tool specs
/migrations     → Database migration scripts
README.md       → Project documentation
```

**No deviation allowed** unless approved via constitution amendment.

**Rationale**: Consistent folder structure ensures all contributors can navigate the codebase efficiently and aligns with spec-driven development practices where specifications live in dedicated `/specs` directory.

## System Specifications (Formal Contracts)

### Database Models — Authoritative Schema Contract

These schemas are **AUTHORITATIVE**. No additional fields allowed unless specified via spec update and constitution amendment.

#### Task Model
```
user_id       (string, required)
id            (int, primary key, auto-increment)
title         (string, required)
description   (string, nullable)
completed     (boolean, default: false)
created_at    (datetime, auto)
updated_at    (datetime, auto)
```

#### Conversation Model
```
user_id       (string, required)
id            (int, primary key, auto-increment)
created_at    (datetime, auto)
updated_at    (datetime, auto)
```

#### Message Model
```
user_id         (string, required)
id              (int, primary key, auto-increment)
conversation_id (int, foreign key → Conversation.id)
role            (enum: "user" | "assistant")
content         (string, required)
created_at      (datetime, auto)
```

### Chat API Contract

**Endpoint**: `POST /api/{user_id}/chat`

**Request Payload**:
```json
{
  "conversation_id": <int | null>,  // Optional: null creates new conversation
  "message": <string>                // Required: User message
}
```

**Response Payload**:
```json
{
  "conversation_id": <int>,
  "response": <string>,
  "tool_calls": <array>              // MCP tool invocations
}
```

### MCP Tool Contracts — Strict Interface Enforcement

All MCP tools MUST implement these exact schemas:

#### add_task
**Parameters**:
- `user_id` (string, required)
- `title` (string, required)
- `description` (string, optional)

**Returns**:
```json
{
  "task_id": <int>,
  "status": "created",
  "title": <string>
}
```

#### list_tasks
**Parameters**:
- `user_id` (string, required)
- `status` (enum: "all" | "pending" | "completed", required)

**Returns**:
```json
[
  {
    "task_id": <int>,
    "title": <string>,
    "description": <string | null>,
    "completed": <boolean>,
    "created_at": <ISO8601>,
    "updated_at": <ISO8601>
  }
]
```

#### complete_task
**Parameters**:
- `user_id` (string, required)
- `task_id` (int, required)

**Returns**:
```json
{
  "task_id": <int>,
  "status": "completed",
  "title": <string>
}
```

#### delete_task
**Parameters**:
- `user_id` (string, required)
- `task_id` (int, required)

**Returns**:
```json
{
  "task_id": <int>,
  "status": "deleted",
  "title": <string>
}
```

#### update_task
**Parameters**:
- `user_id` (string, required)
- `task_id` (int, required)
- `title` (string, optional)
- `description` (string, optional)

**Returns**:
```json
{
  "task_id": <int>,
  "status": "updated",
  "title": <string>
}
```

### Agent Behavioral Contract — Deterministic Behavior Rules

The AI agent MUST map user intent to MCP tools according to this table:

| User Intent              | Agent Action    |
|-------------------------|-----------------|
| Add/create/remember     | add_task        |
| Show/list               | list_tasks      |
| Done/complete           | complete_task   |
| Delete/remove           | delete_task     |
| Change/update/rename    | update_task     |

**Mandatory Requirements**:
- **Always confirm actions** — Provide clear feedback on tool execution
- **Graceful error handling** — Return user-friendly error messages
- **If ambiguous → ask clarification** — Never guess user intent
- **Tool-first reasoning** — Use MCP tools; never fabricate task state
- **Agent must never hallucinate task state** — All task data comes from database via MCP tools

### Stateless Execution Cycle — Request Processing

Every chat request MUST follow this cycle:

```
1. Receive message
2. Fetch conversation from DB (or create new)
3. Build agent message array from conversation history
4. Store user message in DB
5. Run agent with MCP tool access
6. Agent calls MCP tools (stateless)
7. Store assistant message in DB
8. Return response
```

**Server holds zero state**. No in-memory session storage allowed.

## Phase Execution Rules & Validation Gates

### Phase Gate 1 — Specification Freeze

**Before any coding begins**, the following MUST be complete:

- ✅ All MCP tools must be defined in `/specs`
- ✅ Agent spec must exist in `/specs`
- ✅ Database schema must be documented
- ✅ API contracts must be specified
- ✅ Folder structure must be created

**Enforcement**: No implementation work proceeds until all specifications are approved.

### Phase Gate 2 — Tool Verification

**Before agent integration**, each MCP tool MUST:

- ✅ Have unit tests passing
- ✅ Match exact schema defined in constitution
- ✅ Handle all error cases gracefully
- ✅ Return responses in specified format
- ✅ Be independently testable (no dependencies on agent)

**Enforcement**: Agent integration blocked until all MCP tools pass verification.

### Phase Gate 3 — Integration Validation

**Before deployment**, the system MUST:

- ✅ Pass end-to-end conversation tests
- ✅ Demonstrate stateless behavior (restart resilience)
- ✅ Handle concurrent requests correctly
- ✅ Validate all user inputs
- ✅ Log all tool executions for auditability

**Enforcement**: Deployment blocked until integration tests pass.

## Governance

### Amendment Procedure

Constitution amendments require:

1. **Specification** — Document proposed change with rationale
2. **Impact Analysis** — Identify affected components, templates, and code
3. **Migration Plan** — Define backward compatibility or migration steps
4. **Approval** — Review and approve before implementation
5. **Version Bump** — Increment version according to semantic versioning:
   - **MAJOR**: Backward-incompatible governance/principle changes
   - **MINOR**: New principles or materially expanded guidance
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements

### Compliance Review

All development work MUST:

- Verify compliance with this constitution before merging
- Reference constitution principles in PR descriptions
- Justify any deviations (must be approved as amendments)

### Versioning Policy

This constitution follows semantic versioning: `MAJOR.MINOR.PATCH`

### Runtime Development Guidance

For day-to-day development guidance aligned with these principles, consult `CLAUDE.md` in the project root.

---

**Version**: 1.0.0 | **Ratified**: 2026-02-14 | **Last Amended**: 2026-02-14
