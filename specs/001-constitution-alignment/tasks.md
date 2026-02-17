# Tasks: Phase III Constitution Alignment - AI Chat Todo Manager

**Input**: Design documents from `/specs/001-constitution-alignment/` + User request for modern UI based on template.png
**Prerequisites**: plan.md (✅), spec.md (✅), research.md (✅), data-model.md (✅), contracts/ (✅)
**Design Reference**: template.png + https://www.figma.com/community/file/1243994932810853146

**Tests**: Tests are OPTIONAL and NOT included per feature specification

**Organization**: Tasks grouped by user story for independent implementation and testing

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3)
- File paths included in descriptions

---

## Phase 1: Setup (Shared Infrastructure) ✅ COMPLETE

**Purpose**: Project initialization and environment configuration

- [X] T001 Install OpenAI Agents SDK in backend/requirements.txt
- [X] T002 Install Official MCP SDK in backend/requirements.txt
- [X] T003 [P] Configure OPENAI_API_KEY environment variable in backend/.env
- [X] T004 [P] Verify existing Better Auth compatibility with string user_id type
- [X] T005 Create database backup before schema migration in migrations/backup/

---

## Phase 2: Foundational (Blocking Prerequisites) ✅ COMPLETE

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Schema Migration

- [X] T006 Create migration script for Task model ID changes in migrations/006_migrate_tasks_to_constitution_schema.sql
- [X] T007 Create Conversation model in backend/src/models/conversation.py
- [X] T008 Create Message model with MessageRole enum in backend/src/models/message.py
- [X] T009 Create migration for Conversation table in migrations/004_add_conversations_table.sql
- [X] T010 Create migration for Message table in migrations/005_add_messages_table.sql
- [X] T011 Execute all migrations and verify schema compliance with constitution
- [X] T012 Update User model to use string user_id in backend/src/models/user.py

### MCP Tools Infrastructure

- [X] T013 Create MCP server setup in backend/src/mcp/server.py
- [X] T014 [P] Create add_task MCP tool in backend/src/mcp/tools/add_task.py
- [X] T015 [P] Create list_tasks MCP tool in backend/src/mcp/tools/list_tasks.py
- [X] T016 [P] Create complete_task MCP tool in backend/src/mcp/tools/complete_task.py
- [X] T017 [P] Create delete_task MCP tool in backend/src/mcp/tools/delete_task.py
- [X] T018 [P] Create update_task MCP tool in backend/src/mcp/tools/update_task.py
- [X] T019 Register all 5 MCP tools with MCP server in backend/src/mcp/__init__.py

### AI Agent Integration

- [X] T020 Create OpenAI Agents SDK wrapper in backend/src/agent/openai_agent.py
- [X] T021 Create stateless chat handler implementing 8-step execution cycle in backend/src/agent/chat_handler.py
- [X] T022 Implement conversation history retrieval for context building in backend/src/agent/chat_handler.py
- [X] T023 Implement tool execution logging per constitution in backend/src/agent/chat_handler.py

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Chat with AI to Manage Tasks (Priority: P1) 🎯 MVP ✅ COMPLETE

**Goal**: Enable users to manage tasks through natural language conversation with AI assistant

**Independent Test**: User sends "remind me to buy groceries" → AI creates task and confirms → User sees task in conversation

### Backend Implementation for User Story 1

- [X] T024 [US1] Create chat API endpoint POST /api/{user_id}/chat in backend/src/api/chat.py
- [X] T025 [US1] Implement request validation for chat messages in backend/src/api/chat.py
- [X] T026 [US1] Integrate OpenAI agent with chat endpoint in backend/src/api/chat.py
- [X] T027 [US1] Implement stateless message processing (fetch history → process → save) in backend/src/api/chat.py
- [X] T028 [US1] Add error handling for AI service failures in backend/src/api/chat.py
- [X] T029 [US1] Add authentication middleware to chat endpoint in backend/src/middleware/auth.py
- [X] T030 [US1] Implement user isolation (only access own tasks) in backend/src/mcp/tools/

### Frontend Implementation for User Story 1

- [X] T031 [P] [US1] Create ChatInterface component in frontend/src/components/chat/ChatInterface.tsx
- [X] T032 [P] [US1] Create MessageInput component in frontend/src/components/chat/MessageInput.tsx
- [X] T033 [P] [US1] Create MessageList component in frontend/src/components/chat/MessageList.tsx
- [X] T034 [US1] Create chat page /app/chat/page.tsx in frontend/src/app/chat/page.tsx
- [X] T035 [US1] Implement message sending to backend API in frontend/src/lib/api-client.ts
- [X] T036 [US1] Implement real-time message display with auto-scroll in frontend/src/components/chat/MessageList.tsx
- [X] T037 [US1] Add loading states during AI processing in frontend/src/components/chat/ChatInterface.tsx
- [X] T038 [US1] Add error handling and user feedback in frontend/src/components/chat/ChatInterface.tsx

**Checkpoint**: User Story 1 fully functional - users can create/list/complete/update/delete tasks via chat

---

## Phase 4: User Story 2 - Persistent Conversation History (Priority: P2) ✅ COMPLETE

**Goal**: Enable users to continue previous conversations with full chat history preserved

**Independent Test**: Create conversation → close app → reopen → verify history preserved and can continue

### Backend Implementation for User Story 2

- [X] T039 [US2] Implement conversation creation endpoint in backend/src/api/chat.py
- [X] T040 [US2] Implement conversation retrieval by ID in backend/src/api/chat.py
- [X] T041 [US2] Implement conversation listing for user in backend/src/api/chat.py
- [X] T042 [US2] Add conversation archival after 90 days or 1000 messages in backend/src/services/conversation_service.py
- [X] T043 [US2] Optimize conversation history queries with database indexing in migrations/007_add_conversation_indexes.sql

### Frontend Implementation for User Story 2

- [X] T044 [P] [US2] Create conversation list component in frontend/src/components/chat/ConversationList.tsx
- [X] T045 [US2] Implement conversation switching in frontend/src/app/chat/page.tsx
- [X] T046 [US2] Add "New Conversation" button in frontend/src/components/chat/ChatInterface.tsx
- [X] T047 [US2] Persist active conversation ID in frontend state in frontend/src/app/chat/page.tsx
- [X] T048 [US2] Load conversation history on mount in frontend/src/app/chat/page.tsx

**Checkpoint**: User Stories 1 AND 2 both work independently - full conversation persistence enabled

---

## Phase 5: User Story 3 - Modern Chat Interface with Figma Design (Priority: P3)

**Goal**: Beautiful, modern UI matching Figma specifications from template.png with gradient backgrounds, card-based design, and responsive layout

**Independent Test**: Compare implemented UI against template.png and Figma specs - verify colors, typography, spacing, responsive behavior

### Design System Implementation ✅ COMPLETE

- [X] T049 [P] [US3] Extract design tokens from template.png (colors, spacing, typography) in frontend/src/styles/design-tokens.css
- [X] T050 [P] [US3] Implement gradient background (dark to light blue) in frontend/src/app/globals.css
- [X] T051 [P] [US3] Create card-based component styles with rounded corners in frontend/src/styles/components.css
- [X] T052 [P] [US3] Add soft shadow system matching Figma design in frontend/src/styles/design-tokens.css
- [X] T053 [P] [US3] Configure Tailwind CSS with Figma color palette in frontend/tailwind.config.js

### UI Components with Figma Design ✅ COMPLETE

- [X] T054 [P] [US3] Create modern navbar with DO IT branding in frontend/src/components/layout/Navbar.tsx
- [X] T055 [P] [US3] Style MessageBubble component matching template.png in frontend/src/components/chat/MessageBubble.tsx
- [X] T056 [P] [US3] Create TypingIndicator with animation in frontend/src/components/chat/TypingIndicator.tsx
- [X] T057 [P] [US3] Style input fields with full-width, rounded design in frontend/src/components/chat/MessageInput.tsx
- [X] T058 [P] [US3] Create task icons (📌, ✅, ⚡) matching flat/3D style in frontend/public/icons/
- [X] T059 [P] [US3] Create user profile avatar component in frontend/src/components/user/UserAvatar.tsx
- [X] T060 [P] [US3] Create calendar icon component in frontend/src/components/icons/CalendarIcon.tsx
- [X] T061 [P] [US3] Create settings icon component in frontend/src/components/icons/SettingsIcon.tsx

### Pages with Modern Design ✅ COMPLETE

- [X] T062 [US3] Create welcome/landing page with centered text and animation in frontend/src/app/page.tsx
- [X] T063 [US3] Redesign login page matching template.png card design in frontend/src/app/login/page.tsx
- [X] T064 [US3] Redesign signup page with centered layout in frontend/src/app/register/page.tsx
- [X] T065 [US3] Create verification page (if needed) in frontend/src/app/verify/page.tsx
- [X] T066 [US3] Create task details modal/page in frontend/src/components/tasks/TaskDetailsModal.tsx
- [X] T067 [US3] Create settings page in frontend/src/app/settings/page.tsx
- [X] T068 [US3] Create calendar view page in frontend/src/app/calendar/page.tsx

### Responsive Design & Mobile-First ✅ COMPLETE

- [X] T069 [US3] Implement mobile breakpoints (320px, 768px, 1024px) in frontend/tailwind.config.js
- [X] T070 [US3] Ensure chat interface is mobile-friendly (no horizontal scroll) in frontend/src/components/chat/ChatInterface.tsx
- [X] T071 [US3] Add touch-friendly button sizes (min 44px) in frontend/src/styles/components.css
- [X] T072 [US3] Test responsive layout on mobile, tablet, desktop sizes

### Visual Polish ✅ COMPLETE

- [X] T073 [P] [US3] Add primary color accent to buttons with hover effects in frontend/src/styles/components.css
- [X] T074 [P] [US3] Ensure consistent spacing (8px, 16px, 24px, 32px) across all pages in frontend/src/styles/design-tokens.css
- [X] T075 [P] [US3] Ensure consistent font sizes matching Figma in frontend/src/styles/typography.css
- [X] T076 [P] [US3] Add smooth transitions and micro-interactions in frontend/src/styles/animations.css
- [X] T077 [US3] Implement auto-scroll with smooth animation in frontend/src/components/chat/MessageList.tsx
- [X] T078 [US3] Add message send animation in frontend/src/components/chat/ChatInterface.tsx

**Checkpoint**: All 3 user stories complete - beautiful, functional AI chat todo manager

---

## Phase 6: Polish & Cross-Cutting Concerns ✅ COMPLETE

**Purpose**: Final touches, optimizations, and quality improvements

### Performance Optimization

- [X] T079 [P] Implement database connection pooling in backend/src/database/connection.py
- [X] T080 [P] Add conversation history pagination for long chats in backend/src/api/chat.py
- [X] T081 [P] Optimize message queries with proper indexes in migrations/008_optimize_message_queries.sql
- [X] T082 [P] Add frontend code splitting for faster page loads in frontend/next.config.js

### Security & Logging

- [X] T083 [P] Implement input sanitization to prevent injection in backend/src/api/chat.py
- [X] T084 [P] Add comprehensive logging for all tool executions in backend/src/agent/chat_handler.py
- [X] T085 [P] Add rate limiting to chat endpoint (100 requests/hour/user) in backend/src/middleware/rate_limit.py
- [X] T086 [P] Validate JWT tokens in chat requests in backend/src/middleware/auth.py

### Error Handling

- [X] T087 [P] Add graceful degradation when AI service is down in frontend/src/components/chat/ChatInterface.tsx
- [X] T088 [P] Add offline detection and user messaging in frontend/src/components/layout/OfflineIndicator.tsx
- [X] T089 [P] Add retry logic for failed AI requests in backend/src/agent/openai_agent.py
- [X] T090 [P] Add error boundary for React component crashes in frontend/src/app/error.tsx

### Documentation

- [X] T091 [P] Update README with Phase III setup instructions in README.md
- [X] T092 [P] Create API documentation for chat endpoint in backend/docs/api.md
- [X] T093 [P] Document MCP tools usage in backend/docs/mcp-tools.md
- [X] T094 [P] Add deployment guide for Phase III in docs/DEPLOYMENT.md

---

## Dependencies (User Story Completion Order)

```
Phase 1 (Setup) → Phase 2 (Foundation) → MVP Ready

Then parallel user story implementation:

Phase 3 (US1: AI Chat)     → INDEPENDENT (MVP)
Phase 4 (US2: History)     → Depends on US1
Phase 5 (US3: Figma UI)    → Can run parallel to US1/US2

Phase 6 (Polish) → After US1+US2+US3
```

## Parallel Execution Examples

### During Phase 2 (Foundation):
- Tasks T014-T018 (MCP tools) can ALL run in parallel (different files)
- Task T013 (MCP server) must complete before tools
- Tasks T007-T008 (models) can run in parallel
- Tasks T009-T010 (migrations) can run in parallel after models

### During Phase 3 (US1):
- Tasks T031-T033 (frontend components) can ALL run in parallel
- Task T030 (backend isolation) can run parallel to T031-T038

### During Phase 5 (US3):
- Tasks T049-T053 (design system) can ALL run in parallel
- Tasks T054-T061 (UI components) can ALL run in parallel after design system
- Tasks T073-T076 (visual polish) can ALL run in parallel

### During Phase 6 (Polish):
- Tasks T079-T082 (performance) can ALL run in parallel
- Tasks T083-T086 (security) can ALL run in parallel
- Tasks T087-T090 (error handling) can ALL run in parallel
- Tasks T091-T094 (documentation) can ALL run in parallel

---

## Implementation Strategy

**MVP Scope** (Minimum Viable Product):
- Phase 1: Setup ✅
- Phase 2: Foundation ✅
- Phase 3: User Story 1 (AI Chat) ✅
- Deploy MVP → Get user feedback

**Incremental Delivery**:
1. MVP (US1) - Basic AI chat working
2. MVP + US2 - Add conversation persistence
3. Full Product (US1+US2+US3) - Add beautiful Figma UI
4. Polish (Phase 6) - Production-ready

**Parallel Work Opportunities**:
- US1 backend + US3 frontend design can run simultaneously
- US2 can start while US3 is in progress
- All Phase 6 tasks can run in parallel once US1+US2+US3 complete

---

## Task Summary

**Total Tasks**: 94
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundation): 18 tasks
- Phase 3 (US1 - AI Chat): 15 tasks
- Phase 4 (US2 - History): 10 tasks
- Phase 5 (US3 - Figma UI): 30 tasks
- Phase 6 (Polish): 16 tasks

**Parallelizable Tasks**: 54 tasks marked with [P]
**User Story Tasks**: 55 tasks (T024-T078)

**MVP Task Count**: 38 tasks (Phase 1 + Phase 2 + Phase 3)
**Full Product Task Count**: 78 tasks (MVP + US2 + US3)

---

## Validation Checklist

✅ All tasks follow format: `- [ ] [ID] [P?] [Story] Description with file path`
✅ Tasks organized by user story (US1, US2, US3)
✅ Each user story has independent test criteria
✅ Foundational tasks separated from user story tasks
✅ Dependencies clearly documented
✅ Parallel opportunities identified
✅ MVP scope defined (User Story 1)
✅ File paths included in all implementation tasks
✅ Constitution requirements addressed (stateless, MCP tools, schema)
✅ Figma design requirements addressed (template.png reference)

---

**Next Steps**:
1. Review and approve this tasks.md
2. Execute Phase 1 (Setup) - 5 tasks
3. Execute Phase 2 (Foundation) - 18 tasks
4. Execute Phase 3 (US1 MVP) - 15 tasks
5. Test MVP with users
6. Continue with US2 and US3 based on feedback
