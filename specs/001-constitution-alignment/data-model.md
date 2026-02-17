# Data Model: Phase III Constitution Alignment

**Feature**: 001-constitution-alignment
**Date**: 2026-02-15
**Status**: Design Complete

This document defines all database models required for Phase III, aligned with constitution schemas.

---

## Model Overview

Phase III requires 3 core models (per constitution):
1. **Task** - Todo items (modified from Phase II)
2. **Conversation** - Chat sessions (NEW)
3. **Message** - Chat messages (NEW)

Plus existing:
4. **User** - Authentication and ownership (existing, modified)

---

## Constitution-Compliant Schemas

### Task Model

**Purpose**: Represents a todo item managed through AI conversation.

**Schema** (per constitution):
```
id              INTEGER PRIMARY KEY AUTO_INCREMENT
user_id         VARCHAR(255) NOT NULL
title           VARCHAR(255) NOT NULL
description     TEXT NULL
completed       BOOLEAN DEFAULT FALSE
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

**Relationships**:
- Belongs to User (many-to-one via user_id)
- Created and managed via MCP tools only

**Validation Rules**:
- `title` must be 1-255 characters
- `user_id` must match authenticated user
- `completed` defaults to false
- Timestamps auto-managed

**SQLModel Definition**:
```python
from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Task(SQLModel, table=True):
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(max_length=255, nullable=False, index=True)
    title: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None)
    completed: bool = Field(default=False, nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**State Transitions**:
```
Created → [completed=false]
Completed → [completed=true]
Reopened → [completed=false]  (via update_task tool)
Deleted → [removed from database]
```

**Migration from Phase II**:
- Change `id` from UUID to INTEGER (auto-increment)
- Change `user_id` from UUID to VARCHAR(255)
- Remove fields: `priority`, `due_date`, `category`
- Data migration: Fresh start (users recreate tasks)

---

### Conversation Model

**Purpose**: Represents a chat session between user and AI assistant.

**Schema** (per constitution):
```
id              INTEGER PRIMARY KEY AUTO_INCREMENT
user_id         VARCHAR(255) NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

**Relationships**:
- Belongs to User (many-to-one via user_id)
- Has many Messages (one-to-many)

**Validation Rules**:
- `user_id` must match authenticated user
- Timestamps auto-managed
- Conversation persists for 90 days (application-level archival)

**SQLModel Definition**:
```python
class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(max_length=255, nullable=False, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**Lifecycle**:
```
Created → First user message in new session
Active → Contains messages, can be resumed
Archived → After 90 days or 1000 messages
```

**Indexing**:
- Primary key on `id`
- Index on `user_id` for fast user conversation lookup
- Compound index on `(user_id, updated_at)` for recent conversations query

---

### Message Model

**Purpose**: Represents a single message in a conversation (user or AI assistant).

**Schema** (per constitution):
```
id              INTEGER PRIMARY KEY AUTO_INCREMENT
user_id         VARCHAR(255) NOT NULL
conversation_id INTEGER NOT NULL FOREIGN KEY → conversations(id)
role            VARCHAR(20) CHECK (role IN ('user', 'assistant'))
content         TEXT NOT NULL
created_at      TIMESTAMP DEFAULT NOW()
```

**Relationships**:
- Belongs to Conversation (many-to-one via conversation_id)
- Belongs to User (many-to-one via user_id)

**Validation Rules**:
- `role` must be "user" or "assistant"
- `content` required, max length enforced at application level
- `conversation_id` must exist (foreign key constraint)
- `user_id` must match conversation's user_id
- Timestamps auto-managed

**SQLModel Definition**:
```python
from enum import Enum

class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"

class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(max_length=255, nullable=False, index=True)
    conversation_id: int = Field(foreign_key="conversations.id", nullable=False)
    role: MessageRole = Field(nullable=False)
    content: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

**Message Flow**:
```
User types message → Store as role="user"
AI processes → Store as role="assistant"
```

**Indexing**:
- Primary key on `id`
- Index on `conversation_id` for fast message retrieval
- Index on `user_id` for user isolation
- Compound index on `(conversation_id, created_at)` for ordered message history

---

### User Model (Modified)

**Purpose**: User authentication and task/conversation ownership.

**Schema**:
```
id              VARCHAR(255) PRIMARY KEY  (changed from UUID)
email           VARCHAR(255) UNIQUE NOT NULL
password_hash   VARCHAR(255) NOT NULL
first_name      VARCHAR(100) NULL
last_name       VARCHAR(100) NULL
created_at      TIMESTAMP DEFAULT NOW()
updated_at      TIMESTAMP DEFAULT NOW()
```

**Modifications from Phase II**:
- `id` type changed from UUID to VARCHAR(255)
- Maintain string representation for constitution compliance
- Existing fields preserved (email, password_hash, names, timestamps)

**SQLModel Definition**:
```python
class User(SQLModel, table=True):
    __tablename__ = "users"

    id: str = Field(primary_key=True, max_length=255)  # Changed from UUID
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255, nullable=False)
    first_name: Optional[str] = Field(default=None, max_length=100)
    last_name: Optional[str] = Field(default=None, max_length=100)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

**Relationships**:
- Has many Tasks (one-to-many)
- Has many Conversations (one-to-many)
- Has many Messages (one-to-many)

---

## Entity Relationships

```
User (1) ──────< (∞) Task
  │
  └────< (∞) Conversation
               │
               └────< (∞) Message
```

**Key Constraints**:
- User isolation: All queries filtered by `user_id`
- Referential integrity: Messages must belong to valid Conversation
- Conversation ownership: Conversation.user_id must match Message.user_id
- Cascade deletes: Deleting Conversation cascades to Messages

---

## Database Indexes

**Performance-Critical Indexes**:

```sql
-- Task indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);

-- Conversation indexes
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated ON conversations(user_id, updated_at DESC);

-- Message indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at ASC);
CREATE INDEX idx_messages_user_id ON messages(user_id);

-- User indexes
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

**Rationale**:
- `user_id` indexes enable fast user isolation
- `conversation_id` index enables fast message retrieval for conversation history
- Compound indexes optimize common queries (user's tasks by status, recent conversations, ordered messages)

---

## Data Migration Strategy

**Phase II → Phase III Migration**:

1. **Users**: Modify `id` type from UUID to string representation
   - Generate string IDs for existing users
   - Update auth system to use string IDs

2. **Tasks**: Fresh start (per spec out-of-scope for data migration)
   - Create new `tasks` table with constitution schema
   - Optionally rename old table to `tasks_phase2` for backup
   - Users recreate tasks via AI chat

3. **Conversations & Messages**: New tables
   - No migration needed (new feature)

**Migration Scripts**:
```
migrations/003_add_conversation_model.sql
migrations/004_add_message_model.sql
migrations/005_migrate_task_to_constitution_schema.sql
migrations/006_update_user_id_to_string.sql
```

---

## Validation & Constraints

**Application-Level Validation**:
- Task title: 1-255 characters
- Message content: Max 10,000 characters
- Conversation: Max 1000 messages
- User email: Valid email format

**Database-Level Constraints**:
- Foreign keys enforce referential integrity
- CHECK constraints on enum fields (Message.role)
- NOT NULL constraints on required fields
- UNIQUE constraints on user email

---

## Access Patterns

**Common Queries**:

1. **Get user's pending tasks**:
   ```sql
   SELECT * FROM tasks WHERE user_id = ? AND completed = false ORDER BY created_at DESC
   ```

2. **Get conversation with messages**:
   ```sql
   SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC
   ```

3. **Get user's recent conversations**:
   ```sql
   SELECT * FROM conversations WHERE user_id = ? ORDER BY updated_at DESC LIMIT 10
   ```

4. **Create task via MCP tool**:
   ```sql
   INSERT INTO tasks (user_id, title, description, completed, created_at, updated_at)
   VALUES (?, ?, ?, false, NOW(), NOW())
   ```

**Performance Targets**:
- Task queries: <50ms
- Conversation message retrieval: <100ms
- Task creation: <100ms
- Index-supported queries only

---

## Model Summary

| Model | Purpose | Status | Key Changes |
|-------|---------|--------|-------------|
| Task | Todo items | Modified | UUID→int id, UUID→string user_id, remove extra fields |
| Conversation | Chat sessions | New | Constitution-compliant schema |
| Message | Chat messages | New | Constitution-compliant schema |
| User | Authentication | Modified | UUID→string id |

**Constitution Compliance**: ✅ **ALL SCHEMAS MATCH CONSTITUTION EXACTLY**

**Ready for Implementation**: ✅ Schemas defined, migrations planned, indexes specified
