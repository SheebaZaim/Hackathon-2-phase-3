---
id: 8
title: Deploy Next.js Frontend to Vercel
stage: general
date: 2026-02-19
surface: agent
model: claude-sonnet-4-6
feature: none
branch: main
user: SheebaZaim
command: Deploy Next.js 16 frontend to Vercel
labels: ["deployment", "vercel", "nextjs", "frontend", "environment-variables"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/vercel.json
  - frontend/next.config.js
  - frontend/.env.production
tests:
  - none
---

## Prompt

Deploy a Next.js 16 frontend to Vercel. The project is located at D:\hackathon-2-phase3\phase-3\frontend.

Context:
- Frontend: Next.js 16 with Turbopack, Tailwind CSS
- Backend: FastAPI deployed on HuggingFace Spaces (the user has an existing HuggingFace URL)
- Git repo: https://github.com/SheebaZaim/Hackathon-2-phase-3 (already pushed, main branch)
- The frontend config uses NEXT_PUBLIC_BACKEND_URL env variable to point to the backend

What needs to happen:
1. Check if Vercel CLI is installed, if not provide install instructions
2. Check the frontend environment variables - specifically NEXT_PUBLIC_BACKEND_URL in .env.local or similar files
3. Provide step-by-step instructions to deploy the frontend to Vercel via CLI or GitHub integration, set the NEXT_PUBLIC_BACKEND_URL environment variable in Vercel, and ensure the deployment works correctly.

## Response snapshot

Analyzed the frontend configuration and found:
- Vercel CLI is NOT installed on this machine
- The app uses NEXT_PUBLIC_BACKEND_URL (not NEXT_PUBLIC_API_URL) in src/lib/api-client.ts and src/lib/auth.ts
- frontend/vercel.json already has framework=nextjs, installCommand with --legacy-peer-deps, and a hardcoded NEXT_PUBLIC_BACKEND_URL value
- frontend/next.config.js passes through NEXT_PUBLIC_API_URL and NEXT_PUBLIC_BETTER_AUTH_URL but NOT NEXT_PUBLIC_BACKEND_URL (mismatch noted)
- frontend/.env.production already contains NEXT_PUBLIC_BACKEND_URL=https://sheeba0321-hackathon-2-phase-2.hf.space
- GitHub repo is already connected: https://github.com/SheebaZaim/Hackathon-2-phase-3

Recommended GitHub integration over CLI since Vercel is not installed. Provided full step-by-step guide covering:
1. Vercel CLI install (optional)
2. GitHub integration via vercel.com
3. Environment variable configuration (NEXT_PUBLIC_BACKEND_URL)
4. Root directory configuration (must set to "frontend")
5. Critical next.config.js fix for NEXT_PUBLIC_BACKEND_URL passthrough
6. Post-deployment verification steps

## Outcome

- Impact: User receives actionable deployment guide for Vercel GitHub integration with all required env variable settings
- Tests: none run
- Files: history/prompts/general/8-deploy-nextjs-frontend-to-vercel.general.prompt.md
- Next prompts: Verify deployment URL works, test auth flow against HuggingFace backend
- Reflection: Caught mismatch between next.config.js env passthrough list and actual env var name used in source code

## Evaluation notes (flywheel)

- Failure modes observed: none yet
- Graders run and results (PASS/FAIL): none
- Prompt variant (if applicable): none
- Next experiment: Test GitHub integration auto-deploy trigger
