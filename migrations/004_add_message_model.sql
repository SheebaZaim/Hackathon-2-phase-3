-- Phase III Migration 004: Add Message Model
-- Date: 2026-02-15
-- Purpose: Create messages table per constitution schema

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);

-- Add comments for documentation
COMMENT ON TABLE messages IS 'Chat messages in conversations (Phase III)';
COMMENT ON COLUMN messages.id IS 'Auto-incrementing message ID';
COMMENT ON COLUMN messages.user_id IS 'String user ID (must match conversation.user_id)';
COMMENT ON COLUMN messages.conversation_id IS 'Foreign key to conversations table';
COMMENT ON COLUMN messages.role IS 'Message sender: user or assistant';
COMMENT ON COLUMN messages.content IS 'Message content (natural language)';
COMMENT ON COLUMN messages.created_at IS 'Message creation timestamp';
