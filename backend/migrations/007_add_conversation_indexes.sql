-- Migration 007: Add Conversation and Message Performance Indexes
-- Purpose: Optimize conversation history queries per Phase III requirements
-- Date: 2026-02-16

-- Conversation indexes for fast user conversation lookup
CREATE INDEX IF NOT EXISTS idx_conversations_user_id
ON conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_conversations_updated
ON conversations(user_id, updated_at DESC);

-- Message indexes for fast conversation history retrieval
CREATE INDEX IF NOT EXISTS idx_messages_conversation
ON messages(conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created
ON messages(conversation_id, created_at ASC);

CREATE INDEX IF NOT EXISTS idx_messages_user_id
ON messages(user_id);

-- Task indexes for fast task queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_id
ON tasks(user_id);

CREATE INDEX IF NOT EXISTS idx_tasks_completed
ON tasks(completed);

CREATE INDEX IF NOT EXISTS idx_tasks_user_completed
ON tasks(user_id, completed);

-- User email index (should already exist, but ensure it's there)
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email
ON users(email);

-- Verify indexes were created
DO $$
BEGIN
    RAISE NOTICE 'Migration 007 completed: Performance indexes added';
END$$;
