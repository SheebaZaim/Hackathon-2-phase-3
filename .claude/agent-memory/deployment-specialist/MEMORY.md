# Deployment Specialist Memory

## Project Details
- **Project**: Todo App (Hackathon II)
- **Frontend**: Next.js 14+ with TypeScript
- **Backend**: FastAPI (deployed at https://sheeba0321-hackathon-2-phase-2.hf.space)
- **Repository**: https://github.com/SheebaZaim/Hackathon-2-phase-2

## Deployment Configuration

### Vercel Frontend Deployment
- **Root Directory**: `frontend` (CRITICAL - must be set in Vercel dashboard/CLI)
- **Framework**: Next.js (auto-detected)
- **Config File**: `frontend/vercel.json` with build settings
- **Install Command**: Uses `.npmrc` with `legacy-peer-deps=true` for peer dependencies
- **Environment Variable**: `NEXT_PUBLIC_BACKEND_URL=https://sheeba0321-hackathon-2-phase-2.hf.space`
  - Must be prefixed with `NEXT_PUBLIC_` for client-side access
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Deployment Docs**:
  - Quick Reference: `DEPLOYMENT_CHECKLIST.md`
  - Detailed Guide: `VERCEL_DEPLOYMENT_GUIDE.md`
  - Verification Script: `verify-deployment.sh`

### Hugging Face Backend Deployment
- **Platform**: Hugging Face Spaces
- **URL**: https://sheeba0321-hackathon-2-phase-2.hf.space
- **Port**: 7860 (HF Spaces default)
- **Dockerfile**: Custom Dockerfile for Python 3.11
- **Database**: Neon PostgreSQL (serverless)
- **Required Secrets**:
  - `DATABASE_URL`: Neon PostgreSQL connection string with `?sslmode=require`
  - `BETTER_AUTH_SECRET`: JWT secret (min 32 chars)
  - `FRONTEND_URL`: Vercel deployment URL for CORS

## Common Issues & Solutions

### Issue: 500 Internal Server Error on Auth Endpoints
**Symptom**: Login/register returns 500, health check shows `"database":"disconnected"`

**Root Cause**: DATABASE_URL not set in Hugging Face Space secrets

**Solution**:
1. Go to HF Space Settings → Repository secrets
2. Add DATABASE_URL with format: `postgresql://user:pass@host/db?sslmode=require`
3. Add BETTER_AUTH_SECRET (generate with: `openssl rand -hex 32`)
4. Add FRONTEND_URL (your Vercel URL)
5. Restart the Space (factory reboot or auto-restart)

**Verification**:
```bash
curl https://sheeba0321-hackathon-2-phase-2.hf.space/health
# Should return: {"status":"healthy","database":"connected"}
```

**Reference**: See `backend/DEPLOYMENT_FIX.md` for detailed guide

### TypeScript Build Errors
1. **Missing Type Imports**: Ensure all types used in files are imported
   - Fixed: `TaskListResponse` was used but not imported in `api-client.ts`
   - Solution: Added `TaskListResponse` to import statement from `./types`

### Build Process
- Next.js 16.1.6 with Turbopack
- TypeScript checks run after compilation
- Static page generation for all routes (/, /dashboard, /login, /register)

## Deployment Workflow
1. Fix code errors locally
2. Run `npm run build` in frontend directory to verify
3. Commit changes to git
4. Push to main branch
5. Vercel auto-deploys on push to main

## Security Notes
- JWT authentication handled via localStorage
- Token stored as `auth_token`
- Backend API uses Bearer token authentication
- CORS configured to allow Vercel deployments via regex

## Database Notes
- Neon PostgreSQL requires `?sslmode=require` in connection string
- Auto-pauses after inactivity - may need to wake up
- Tables auto-created on first startup via `init_db()`
- Connection pooling configured (pool_size=5, max_overflow=10)

## Diagnostic Tools
- Health endpoint: `/health` - shows database connection status
- Test script: `backend/test_db_connection.py` - verifies DB connection
- Deployment guide: `backend/DEPLOYMENT_FIX.md` - comprehensive troubleshooting
- Verification script: `verify-deployment.sh` - automated deployment testing
- Deployment checklist: `DEPLOYMENT_CHECKLIST.md` - quick reference

## CORS Configuration
- Backend location: `backend/src/main.py` lines 25-38
- Allows: `https://*.vercel.app` via regex pattern `r"https://.*\.vercel\.app"`
- Also allows: localhost:3000 for development
- Supports: credentials, all methods, all headers
- Exposes: Authorization header for JWT tokens
