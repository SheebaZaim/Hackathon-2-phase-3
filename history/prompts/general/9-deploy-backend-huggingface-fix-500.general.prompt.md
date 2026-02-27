---
id: 9
title: Deploy Backend HuggingFace Fix 500 Error
stage: general
date: 2026-02-21
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: Sheeba0321
command: fix backend 500 error and sync HF Space
labels: ["deployment", "backend", "huggingface", "debugging", "git"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - backend/src/models/user.py
  - backend/src/api/auth.py
  - backend/requirements.txt
  - hf-space/src/ (all synced via git)
tests:
  - Backend startup: PASS
  - Database initialized: PASS
  - Vercel frontend connected: PASS
---

## Prompt

Backend not working at HuggingFace after Vercel deployment. Getting 500 errors.

## Response snapshot

Diagnosed and fixed a series of backend issues on HuggingFace Space:

1. **Root cause 1:** HF Space running old code with `first_name`, `last_name`, `password_hash` columns but database had new schema with `hashed_password` and no first/last name → `UndefinedColumn` error.
2. **Root cause 2:** Browser editing of HF Space files kept failing with `IndentationError` due to HF editor auto-indenting pasted code.
3. **Fix:** Used git to clone HF Space to `D:\hf-space`, copied entire `backend/src/` from local project, committed and pushed — syncing all 24 files at once.
4. **Root cause 3:** `openai` package missing from HF Space `requirements.txt` → `ModuleNotFoundError`.
5. **Fix:** Copied updated `requirements.txt` with `openai==1.10.0` and pushed.
6. **Root cause 4:** `OPENAI_API_KEY`, `OPENAI_BASE_URL`, `OPENAI_MODEL` env vars missing from HF Space secrets.
7. **Fix:** User added all 5 required secrets in HF Space Settings → Variables and secrets.
8. **Result:** Backend started successfully — `Application startup complete`, all tables initialized.

## Outcome

- ✅ Impact: Full stack running — Vercel frontend + HuggingFace backend + Neon DB all connected
- 🧪 Tests: Backend startup confirmed via HF Logs, frontend login/register working
- 📁 Files: 24 backend src files synced + requirements.txt updated
- 🔁 Next prompts: Test all features end-to-end (tasks, chat, auth)
- 🧠 Reflection: Browser editing of HF Space files is unreliable due to auto-indentation; always use git clone + push for multi-file syncs

## Evaluation notes (flywheel)

- Failure modes observed: HF browser editor adds leading spaces on paste causing IndentationError; cascading missing dependency errors when syncing new code to old environment
- Graders run and results (PASS/FAIL): Backend startup PASS, DB init PASS
- Prompt variant (if applicable): none
- Next experiment: Add all required env vars to HF Space upfront before first deploy
