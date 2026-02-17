# Quickstart: Phase III Constitution Alignment

**Feature**: 001-constitution-alignment
**Date**: 2026-02-15
**Prerequisites**: Node.js 18+, Python 3.11+, PostgreSQL database

This guide helps you get started implementing the Phase III AI chat todo manager.

---

## Overview

Phase III transforms the traditional form-based todo app into an AI-powered conversational interface. Users manage tasks through natural language chat powered by OpenAI Agents SDK and MCP tools.

**What's Changing**:
- ✅ Backend: Add AI layer + MCP tools + stateless chat endpoint
- ✅ Frontend: Migrate to chat interface with Figma design
- ✅ Database: Add Conversation/Message models, update Task model schema

---

## Prerequisites Setup

### 1. Environment Variables

Create/update `.env` files:

**Backend** (`backend/.env`):
```bash
# Existing
DATABASE_URL=postgresql://user:pass@host/dbname?sslmode=require
BETTER_AUTH_SECRET=your-secret-key-here

# NEW for Phase III
OPENAI_API_KEY=sk-...  # Get from https://platform.openai.com/api-keys
OPENAI_MODEL=gpt-4-turbo-preview
MCP_SERVER_PORT=8001  # Optional, defaults to 8001
```

**Frontend** (`frontend/.env.local`):
```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v3  # NEW for Phase III
```

### 2. Install New Dependencies

**Backend**:
```bash
cd backend
pip install openai==1.10.0  # OpenAI Agents SDK
pip install mcp==0.1.0      # MCP SDK (check latest version)
pip install -r requirements.txt
```

**Frontend**:
```bash
cd frontend
npm install @chatscope/chat-ui-kit-react  # Or custom chat components
npm install
```

---

## Database Migration

### Step 1: Backup Existing Data

```bash
# Create backup before migration
pg_dump $DATABASE_URL > phase2_backup.sql
```

### Step 2: Run Migrations

```bash
cd backend/migrations

# Add Conversation model
python run_migration.py 003_add_conversation_model.sql

# Add Message model
python run_migration.py 004_add_message_model.sql

# Migrate Task model to constitution schema
python run_migration.py 005_migrate_task_to_constitution_schema.sql

# Update User model for string IDs
python run_migration.py 006_update_user_id_to_string.sql
```

### Step 3: Verify Schema

```sql
-- Check new tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Should see: tasks, conversations, messages, users

-- Verify Task model schema matches constitution
\d tasks
-- Should have: id (int), user_id (varchar), title, description, completed, created_at, updated_at
```

---

## Backend Implementation Order

### Phase 1: Database Models

**Files to create**:
- `backend/src/models/conversation.py`
- `backend/src/models/message.py`

**Files to modify**:
- `backend/src/models/task.py` (update to constitution schema)
- `backend/src/models/user.py` (change id to string type)

**Validation**:
```bash
# Test models can be imported
python -c "from src.models.conversation import Conversation; print('✓')"
python -c "from src.models.message import Message; print('✓')"
```

### Phase 2: MCP Tools

**Files to create** (follow contracts in `contracts/` directory):
- `backend/src/mcp/__init__.py`
- `backend/src/mcp/server.py`
- `backend/src/mcp/tools/__init__.py`
- `backend/src/mcp/tools/add_task.py`
- `backend/src/mcp/tools/list_tasks.py`
- `backend/src/mcp/tools/complete_task.py`
- `backend/src/mcp/tools/delete_task.py`
- `backend/src/mcp/tools/update_task.py`

**Validation**:
```bash
# Test tools can be imported and registered
python -c "from src.mcp.tools import add_task; print('✓')"
```

### Phase 3: OpenAI Agent Integration

**Files to create**:
- `backend/src/agent/__init__.py`
- `backend/src/agent/openai_agent.py`
- `backend/src/agent/chat_handler.py`

**Validation**:
```bash
# Test agent initialization
python -c "from src.agent.openai_agent import ChatAgent; print('✓')"
```

### Phase 4: Chat API Endpoint

**Files to create**:
- `backend/src/api/chat.py`

**Implementation follows** `contracts/chat-api.yaml` specification

**Validation**:
```bash
# Start backend
uvicorn src.main:app --reload

# Test chat endpoint
curl -X POST http://localhost:8000/api/test-user/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"conversation_id": null, "message": "hello"}'
```

---

## Frontend Implementation Order

### Phase 1: Chat Components

**Files to create**:
- `frontend/src/components/chat/ChatInterface.tsx`
- `frontend/src/components/chat/MessageList.tsx`
- `frontend/src/components/chat/MessageInput.tsx`
- `frontend/src/components/chat/TypingIndicator.tsx`

**Start with basic functionality**, apply Figma design later.

### Phase 2: Chat Page

**Files to create**:
- `frontend/src/app/chat/page.tsx`

**Validation**:
```bash
npm run dev
# Visit http://localhost:3000/chat
```

### Phase 3: Figma Design Application

**Reference**: https://www.figma.com/community/file/1243994932810853146

**Steps**:
1. Extract design tokens (colors, spacing, typography)
2. Update `tailwind.config.ts` with design tokens
3. Apply styles to chat components
4. Test responsive behavior

---

## Testing Strategy

### Backend Tests

```bash
cd backend

# Test MCP tools
pytest tests/mcp/test_add_task.py
pytest tests/mcp/test_list_tasks.py

# Test chat endpoint
pytest tests/api/test_chat.py

# Test stateless execution cycle
pytest tests/integration/test_stateless_chat.py
```

### Frontend Tests

```bash
cd frontend

# Test chat components
npm test -- ChatInterface.test.tsx

# Test chat API integration
npm test -- chat-api.test.ts
```

---

## Development Workflow

### 1. Start Services

**Terminal 1 - Backend**:
```bash
cd backend
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

**Terminal 3 - Database** (if running locally):
```bash
psql $DATABASE_URL
```

### 2. Test End-to-End Flow

1. **Create account** (existing Phase II endpoint still works)
2. **Login** (get JWT token)
3. **Send chat message**: `POST /api/{user_id}/chat`
4. **Verify task created**: Check database or use list_tasks tool
5. **Continue conversation**: Send follow-up message with `conversation_id`

### 3. Monitor Logs

**Backend logs** show:
- Incoming chat requests
- MCP tool executions
- AI agent interactions
- Database queries

**Frontend console** shows:
- Chat API calls
- Message rendering
- Error handling

---

## Common Issues & Solutions

### Issue: OpenAI API Key Invalid
**Solution**: Verify `OPENAI_API_KEY` in `.env` starts with `sk-`

### Issue: Database Migration Fails
**Solution**: Restore backup and review migration scripts for errors

### Issue: MCP Tools Not Found
**Solution**: Ensure MCP SDK is installed and tools are registered in `mcp/server.py`

### Issue: Chat Endpoint Returns 500
**Solution**: Check backend logs for AI agent errors, verify conversation exists

### Issue: Frontend Can't Connect to Backend
**Solution**: Verify `NEXT_PUBLIC_BACKEND_URL` matches backend URL, check CORS settings

---

## Performance Optimization

### Backend
- Connection pooling already configured (SQLModel default)
- Add indexes on `conversation_id` and `user_id` (see data-model.md)
- Implement OpenAI response caching for common queries

### Frontend
- Use React.memo for chat message components
- Implement virtual scrolling for long conversations
- Debounce message input for better UX

---

## Security Checklist

- [ ] OpenAI API key stored in environment variable (not committed to git)
- [ ] JWT validation on chat endpoint
- [ ] User ID validation (ensure user_id matches authenticated user)
- [ ] Task ownership verification in MCP tools
- [ ] Input sanitization on user messages
- [ ] Rate limiting on chat endpoint (prevent abuse)
- [ ] Database queries use parameterized statements (prevent SQL injection)

---

## Next Steps

After completing implementation:

1. **Run `/sp.tasks`** to generate detailed task breakdown
2. **Execute tasks** in dependency order
3. **Test against acceptance criteria** from spec.md
4. **Run Phase Gates** to verify constitution compliance
5. **Deploy** to staging environment
6. **User acceptance testing**

---

## Resources

- **Specification**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Research Findings**: [research.md](./research.md)
- **Data Models**: [data-model.md](./data-model.md)
- **API Contracts**: [contracts/](./contracts/)
- **Constitution**: [../../.specify/memory/constitution.md](../../.specify/memory/constitution.md)
- **Figma Design**: https://www.figma.com/community/file/1243994932810853146
- **OpenAI Agents SDK**: https://platform.openai.com/docs/assistants/overview
- **MCP Documentation**: https://modelcontextprotocol.io/introduction

---

## Support

If you encounter issues:
1. Check this quickstart guide
2. Review spec.md for requirements clarity
3. Consult constitution.md for architectural rules
4. Check API contracts for correct schemas
5. Review research.md for technical decisions

**Remember**: This is a migration project. Phase II code remains for reference. Focus on building Phase III features incrementally while maintaining working Phase II as fallback.
