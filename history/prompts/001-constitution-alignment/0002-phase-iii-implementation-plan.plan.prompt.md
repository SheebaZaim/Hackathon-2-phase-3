---
id: 0002
title: Phase III implementation plan
stage: plan
date: 2026-02-15
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-constitution-alignment
branch: 001-constitution-alignment
user: developer
command: /sp.plan
labels: ["plan", "phase-3", "ai-chatbot", "migration", "mcp-tools", "openai-agents"]
links:
  spec: specs/001-constitution-alignment/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-constitution-alignment/plan.md
  - specs/001-constitution-alignment/research.md
  - specs/001-constitution-alignment/data-model.md
  - specs/001-constitution-alignment/quickstart.md
  - specs/001-constitution-alignment/contracts/chat-api.yaml
  - specs/001-constitution-alignment/contracts/add-task-tool.yaml
  - specs/001-constitution-alignment/contracts/list-tasks-tool.yaml
  - specs/001-constitution-alignment/contracts/complete-task-tool.yaml
  - specs/001-constitution-alignment/contracts/delete-task-tool.yaml
  - specs/001-constitution-alignment/contracts/update-task-tool.yaml
tests:
  - none
---

## Prompt

/sp.plan

## Response snapshot

Created comprehensive implementation plan for Phase III Constitution Alignment:

**Planning Artifacts Created**:

1. **plan.md** - Implementation plan with:
   - Technical context (Python 3.11, FastAPI, Next.js 14, OpenAI Agents SDK, MCP SDK)
   - Constitution compliance check (26 items requiring work)
   - Project structure (backend + frontend additions)
   - Phase 0 research tasks (6 research areas)

2. **research.md** - Research findings for all technical unknowns:
   - R1: OpenAI Agents SDK integration (use OpenAI Python SDK v1.x with Assistants API)
   - R2: MCP SDK integration (official MCP SDK with function calling)
   - R3: ChatKit UI (custom React components per Figma design)
   - R4: Stateless execution cycle (8-step cycle per constitution)
   - R5: Database migration (fresh start approach for Phase III users)
   - R6: Better Auth compatibility (compatible with string user_id modifications)

3. **data-model.md** - Constitution-compliant database schemas:
   - Task model (modified: UUID→int id, UUID→string user_id, removed extra fields)
   - Conversation model (new: user_id, id, timestamps)
   - Message model (new: user_id, id, conversation_id, role, content, timestamp)
   - User model (modified: UUID→string id)
   - Indexes, relationships, migration strategy

4. **contracts/** - API and tool specifications:
   - chat-api.yaml (POST /api/{user_id}/chat endpoint)
   - add-task-tool.yaml (create task MCP tool)
   - list-tasks-tool.yaml (retrieve tasks MCP tool)
   - complete-task-tool.yaml (mark task complete MCP tool)
   - delete-task-tool.yaml (delete task MCP tool)
   - update-task-tool.yaml (update task MCP tool)

5. **quickstart.md** - Implementation getting started guide:
   - Prerequisites setup
   - Database migration steps
   - Backend implementation order (models → MCP tools → agent → chat API)
   - Frontend implementation order (components → page → Figma design)
   - Testing strategy
   - Development workflow

**Key Decisions**:
- Fresh start for Phase III users (no Phase II data migration)
- OpenAI Python SDK v1.x with Assistants API
- Custom React chat components styled per Figma
- Stateless backend with database-only state
- Constitution-compliant schemas (int ids, string user_ids)

**Constitution Compliance Status**: ⚠️ Conditional pass with 26 required work items identified

## Outcome

- ✅ Impact: Created complete implementation plan for Phase II → Phase III migration. All technical unknowns researched and resolved. Constitution compliance gaps identified with clear remediation path.
- 🧪 Tests: No tests required (planning artifacts). Test strategy defined in quickstart.md.
- 📁 Files: 10 files created (plan, research, data-model, quickstart, 6 contracts)
- 🔁 Next prompts: `/sp.tasks` to generate task breakdown, or review existing Phase II codebase for implementation planning
- 🧠 Reflection: Planning successfully bridges Phase II (form-based) to Phase III (AI chat). Research resolved all technical questions (OpenAI SDK, MCP, stateless architecture, database migration). Constitution check identified exact schema mismatches requiring migration. Ready for task generation.

## Evaluation notes (flywheel)

- Failure modes observed: None. Planning completed successfully with all Phase 0 research and Phase 1 design artifacts.
- Graders run and results (PASS/FAIL): Manual validation PASS - All research questions answered, data models align with constitution, contracts complete, quickstart comprehensive.
- Prompt variant (if applicable): Standard planning workflow with constitution compliance focus
- Next experiment (smallest change to try): Validate Phase II codebase review completeness - may need deeper dive into existing auth system and database connection handling
