-- Phase III Migration 005: Migrate Task Model to Constitution Schema
-- Date: 2026-02-15
-- Purpose: Recreate tasks table with constitution-compliant schema
-- WARNING: This migration uses FRESH START approach - existing task data will NOT be migrated

-- Step 1: Backup existing tasks table (rename to tasks_phase2)
ALTER TABLE IF EXISTS tasks RENAME TO tasks_phase2;

-- Step 2: Create new tasks table with constitution schema
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Step 3: Create indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_user_completed ON tasks(user_id, completed);

-- Step 4: Add comments for documentation
COMMENT ON TABLE tasks IS 'Todo tasks managed via AI chat (Phase III constitution-compliant)';
COMMENT ON COLUMN tasks.id IS 'Auto-incrementing task ID (changed from UUID)';
COMMENT ON COLUMN tasks.user_id IS 'String user ID (changed from UUID)';
COMMENT ON COLUMN tasks.title IS 'Task title (1-255 characters)';
COMMENT ON COLUMN tasks.description IS 'Task description (optional)';
COMMENT ON COLUMN tasks.completed IS 'Task completion status (default false)';
COMMENT ON COLUMN tasks.created_at IS 'Task creation timestamp';
COMMENT ON COLUMN tasks.updated_at IS 'Last update timestamp';

-- Note: Old tasks from Phase II are preserved in tasks_phase2 table for reference/backup
-- Users will recreate tasks via AI chat in Phase III
