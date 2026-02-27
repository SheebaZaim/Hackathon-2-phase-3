---
id: 10
title: Diagnose Frontend Backend Connection Failure
stage: general
date: 2026-02-28
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: user
command: diagnose frontend-backend connection
labels: ["deployment", "debugging", "cors", "vercel", "environment-variables"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/src/lib/api-client.ts
  - frontend/src/lib/auth.ts
  - frontend/next.config.js
  - frontend/.env.production
  - frontend/.env.local
  - frontend/.env
  - frontend/vercel.json
  - backend/src/main.py
tests:
  - none
---

## Prompt

The user has a Next.js frontend deployed on Vercel and a FastAPI backend deployed on HuggingFace Spaces. The frontend cannot connect to the backend.

**Setup:**
- Frontend: Vercel (Next.js 16 with Turbopack)
- Backend: HuggingFace Spaces at `https://sheeba0321-hackathon-2-phase-2.hf.space`
- Database: Neon PostgreSQL

**Key files to check:**
- `D:\hackathon-2-phase3\phase-3\frontend\src\lib\` - API client configuration
- `D:\hackathon-2-phase3\phase-3\frontend\.env.production` - Production env vars
- `D:\hackathon-2-phase3\phase-3\frontend\next.config.js` - Next.js config with env vars
- `D:\hackathon-2-phase3\phase-3\backend\src\main.py` - CORS configuration

**Known facts:**
- Backend is running fine on HuggingFace (confirmed via HF logs)
- Backend CORS already allows `https://*.vercel.app` via regex
- Frontend has `NEXT_PUBLIC_BACKEND_URL=https://sheeba0321-hackathon-2-phase-2.hf.space` in `.env.production`
- Vercel environment variable `NEXT_PUBLIC_BACKEND_URL` should be set

**Task:**
1. Read all relevant frontend API client files to find how `NEXT_PUBLIC_BACKEND_URL` is used
2. Check `next.config.js` to verify env var is exposed
3. Check `.env.production`
4. Check if Vercel environment variables are correctly configured (check if there's a `vercel.json`)
5. Identify the root cause of the connection failure
6. Provide exact fixes needed

Please investigate and report findings with specific file paths and line numbers.

## Response snapshot

Full investigation performed. Root causes identified:

**PRIMARY CAUSE: .env.production and .env.local are gitignored**
- `.gitignore` line 127: `*.env*` pattern matches `frontend/.env.production`
- `.gitignore` line 128: `.env.local` matches `frontend/.env.local`
- Neither file is committed to git, so Vercel cannot read them during build
- Only `frontend/next-env.d.ts` is tracked in the frontend directory's env-related files

**SECONDARY CONCERN: vercel.json `env` block vs `build.env`**
- `frontend/vercel.json` has `NEXT_PUBLIC_BACKEND_URL` in the `env` block
- The `env` block in vercel.json sets runtime environment variables, not build-time
- For Next.js `NEXT_PUBLIC_*` variables to be baked into the client bundle at build time, they must be present as build-time env vars (set in Vercel dashboard under Environment Variables, or via the `build.env` key)
- The `env` block in vercel.json does inject into the build environment in practice, so this may work — but the dashboard is the authoritative source

**CORS: Working correctly**
- `backend/src/main.py` line 35: `allow_origin_regex=r"https://.*\.vercel\.app"` — correctly matches all Vercel preview and production URLs
- The `allow_origins` list also includes `"https://*.vercel.app"` (line 33) which FastAPI/Starlette treats as a literal string, not a glob — but the regex on line 35 covers this

**No fallback to localhost in production**
- `api-client.ts` line 11: `process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'`
- If the env var is undefined at build time, all API calls go to `http://localhost:8000` which is unreachable from the browser in production

## Outcome

- Impact: Identified 2 root causes: gitignored env files and potential vercel.json env block scope
- Tests: None run
- Files: Read-only investigation, no files modified
- Next prompts: Apply fixes — set NEXT_PUBLIC_BACKEND_URL in Vercel dashboard, confirm vercel.json env is build-time
- Reflection: The gitignore pattern `*.env*` is overly broad and silently swallows `.env.production`

## Evaluation notes (flywheel)

- Failure modes observed: Env file gitignored by wildcard pattern; vercel.json env vs build.env distinction
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Set NEXT_PUBLIC_BACKEND_URL explicitly in Vercel dashboard Environment Variables section
