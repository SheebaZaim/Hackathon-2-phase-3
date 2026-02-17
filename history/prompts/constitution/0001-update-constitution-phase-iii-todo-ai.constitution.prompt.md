---
id: 0001
title: Update constitution Phase III Todo AI
stage: constitution
date: 2026-02-14
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: developer
command: /sp.constitution
labels: ["constitution", "phase-3", "ai-chatbot", "mcp-tools", "spec-driven-development"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - none
---

## Prompt

update  constitution file with this (Project: Phase III – Todo AI Chatbot, Hackathon II)

STEP 1 — Define Governance & Development Constraints

Instruction to Agent:

Create an sp.constitution file for a project named:

Phase III: Todo AI Chatbot — Spec-Driven Development

The constitution must enforce the following non-negotiable governance rules:

1. Core Objective

Build an AI-powered Todo chatbot using:
- OpenAI Agents SDK
- Official MCP SDK
- FastAPI backend
- OpenAI ChatKit frontend
- SQLModel ORM
- Neon Serverless PostgreSQL
- Better Auth

The chatbot must manage todos via natural language using MCP tools.

2. Development Philosophy (MANDATORY)

This project must follow:
Write spec → Generate plan → Break into tasks → Implement via Claude Code

Rules:
❌ No manual coding
❌ No skipping specification phase
❌ No skipping planning phase
❌ No direct implementation without tasks
✅ All features must originate from specification
✅ All code must be generated via Claude Code
✅ All tool contracts must be spec-defined before implementation

3. Architectural Mandates

The constitution must enforce:
- Fully stateless backend server
- Conversation state stored only in database
- MCP tools are stateless
- AI agent interacts ONLY through MCP tools
- No direct DB access from agent
- Single chat endpoint
- All requests independent and reproducible

4. Folder Structure Requirement

The constitution must require:
/frontend     → ChatKit UI
/backend      → FastAPI + Agents SDK + MCP
/specs        → Agent + MCP tool specs
/migrations   → Database migration scripts
README.md

STEP 2 — Define System Specifications (Formal System Contracts)

1. Database Models (Authoritative Schema Contract)
- Task: user_id, id, title, description, completed, created_at, updated_at
- Conversation: user_id, id, created_at, updated_at
- Message: user_id, id, conversation_id, role, content, created_at

2. Chat API Contract
- Endpoint: POST /api/{user_id}/chat
- Request: conversation_id (optional), message (required)
- Response: conversation_id, response, tool_calls

3. MCP Tool Contracts (add_task, list_tasks, complete_task, delete_task, update_task)

4. Agent Behavioral Contract - Deterministic intent-to-action mapping

5. Stateless Execution Cycle - 8-step request processing cycle

STEP 3 — Define Phase Execution Rules & Validation Gates

- Phase Gate 1 — Specification Freeze
- Phase Gate 2 — Tool Verification
- Phase Gate 3 — Integration Validation

## Response snapshot

Created comprehensive Phase III Todo AI Chatbot constitution (v1.0.0) with:

**Core Principles:**
1. Technology Stack Mandate - Required AI/MCP stack with 7 core technologies
2. Development Philosophy - Strict spec-driven workflow (spec→plan→tasks→implement)
3. Architectural Mandates - 6 stateless backend requirements
4. Folder Structure - Non-negotiable 4-directory structure

**System Specifications:**
- 3 database models with exact field definitions (Task, Conversation, Message)
- Chat API contract with request/response schemas
- 5 MCP tool contracts (add_task, list_tasks, complete_task, delete_task, update_task)
- Agent behavioral contract with intent-to-action mapping table
- Stateless execution cycle (8-step request processing)

**Phase Gates:**
- Gate 1: Specification Freeze (pre-coding checklist)
- Gate 2: Tool Verification (pre-integration checklist)
- Gate 3: Integration Validation (pre-deployment checklist)

**Governance:**
- Amendment procedure with 5-step process
- Semantic versioning (MAJOR.MINOR.PATCH)
- Compliance review requirements

Constitution ratified: 2026-02-14, Version: 1.0.0

Templates validated: plan-template.md, spec-template.md, tasks-template.md all align with generic constitution structure.

## Outcome

- ✅ Impact: New constitution established project-wide governance for Phase III AI chatbot development. All future work must follow spec-driven workflow and adhere to stateless architecture.
- 🧪 Tests: No tests required (documentation artifact)
- 📁 Files: Created/updated .specify/memory/constitution.md with complete Phase III governance
- 🔁 Next prompts: `/sp.specify` to create first feature specification following new constitution principles
- 🧠 Reflection: Constitution successfully captures all user requirements including tech stack, MCP tool contracts, database schemas, and validation gates. Templates are generic enough to support new constitution without modification.

## Evaluation notes (flywheel)

- Failure modes observed: None. Constitution creation successful on first attempt with all placeholders filled.
- Graders run and results (PASS/FAIL): Manual validation PASS - No unexplained placeholders, semantic versioning applied, all required sections present, templates aligned.
- Prompt variant (if applicable): Standard constitution creation from detailed user requirements
- Next experiment (smallest change to try): Test constitution enforcement by running `/sp.specify` and validating that spec follows constitutional principles (e.g., MCP tool contracts defined before implementation)
