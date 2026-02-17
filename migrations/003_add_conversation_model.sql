-- Phase III Migration 003: Add Conversation Model
-- Date: 2026-02-15
-- Purpose: Create conversations table per constitution schema

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated ON conversations(user_id, updated_at DESC);

-- Add comments for documentation
COMMENT ON TABLE conversations IS 'Chat sessions between user and AI assistant (Phase III)';
COMMENT ON COLUMN conversations.id IS 'Auto-incrementing conversation ID';
COMMENT ON COLUMN conversations.user_id IS 'String user ID (matches User.id)';
COMMENT ON COLUMN conversations.created_at IS 'Conversation creation timestamp';
COMMENT ON COLUMN conversations.updated_at IS 'Last update timestamp';
