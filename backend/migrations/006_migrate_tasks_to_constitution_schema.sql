-- Migration: Update tasks table to constitution schema
-- Purpose: Align with Phase III constitution requirements
--   - Change id from UUID to SERIAL (int)
--   - Change user_id from UUID to VARCHAR(255) (string)
--   - Remove priority, due_date, category fields
--   - Keep only: id, user_id, title, description, completed, created_at, updated_at

-- Step 1: Rename old tasks table to preserve Phase II data
ALTER TABLE IF EXISTS tasks RENAME TO tasks_phase2;

-- Step 2: Create new constitution-compliant tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);

-- Step 4: Add foreign key constraint to users table
ALTER TABLE tasks
ADD CONSTRAINT fk_tasks_user_id
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Note: Phase II task data is preserved in tasks_phase2 table
-- Users will recreate tasks via AI chat interface per constitution
