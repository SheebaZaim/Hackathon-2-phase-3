-- Migration: Update users table for Phase III constitution
-- Purpose: Change id from UUID to VARCHAR(255) for constitution compliance

-- Step 1: Rename old users table to preserve Phase II data
ALTER TABLE IF EXISTS users RENAME TO users_phase2;

-- Step 2: Create new constitution-compliant users table
CREATE TABLE users (
    id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Step 3: Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Note: Phase II user data is preserved in users_phase2 table
-- Users will re-register for Phase III per constitution requirements
