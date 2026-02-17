-- Migration 008: Add priority, due_date, category columns to tasks table
-- These columns were added to the Task model but not to the database schema.
-- This migration adds the missing columns to fix the UndefinedColumn error.
-- Applied: 2026-02-17

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'medium';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS due_date VARCHAR(100);
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS category VARCHAR(100);
