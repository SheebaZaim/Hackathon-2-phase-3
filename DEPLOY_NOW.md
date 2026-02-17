# 🚀 Complete Deployment Guide - Todo App

## Current Status
- ✅ Frontend: Build successful, ready to deploy
- ⚠️ Backend: Running but database disconnected (needs DATABASE_URL fix)

---

## STEP 1: Fix Backend Database (5 minutes)

### The Problem
Your DATABASE_URL in Hugging Face Spaces has **extra spaces** in the hostname:
- ❌ Current: `ep-raspy-king-aen4resw-pooler.c-2.us-east-2.aws.ne  on.tech` (spaces in "ne  on")
- ✅ Should be: `ep-raspy-king-aen4resw-pooler.c-2.us-east-2.aws.neon.tech` (no spaces)

### The Fix

1. **Open Hugging Face Settings**
   - Go to: https://huggingface.co/spaces/Sheeba0321/hackathon-2-phase-2/settings
   - Scroll to **"Repository secrets"**

2. **Delete Old DATABASE_URL**
   - Find `DATABASE_URL` secret
   - Click **"Delete"**
   - Confirm deletion

3. **Add New DATABASE_URL (CAREFULLY!)**
   - Click **"New secret"**
   - **Name**: `DATABASE_URL` (exactly, case-sensitive)
   - **Value**: Copy this ENTIRE line as ONE block:

   ```
   postgresql://neondb_owner:npg_NfkYIG5hUuy9@ep-raspy-king-aen4resw-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

   **CRITICAL**:
   - Select the ENTIRE URL in one go (don't select parts)
   - Paste as ONE continuous line (no line breaks)
   - Verify "neon.tech" appears correctly (not "ne on")

4. **Add BETTER_AUTH_SECRET**
   - Click **"New secret"**
   - **Name**: `BETTER_AUTH_SECRET`
   - **Value**:
   ```
   supersecretdevelopmentkeythatissafeforlocaltestinganddevelopment
   ```

5. **Wait for Restart**
   - Space restarts automatically (1-2 minutes)
   - Watch the logs until you see "Application startup complete"

6. **Verify Backend Works**
   - Open: https://sheeba0321-hackathon-2-phase-2.hf.space/health
   - Should show: `"database": "connected"` ✅
   - If still disconnected, check if "neon.tech" has spaces in the logs

---

## STEP 2: Deploy Frontend to Vercel (3 minutes)

### Option A: Deploy via Vercel Web UI (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com/new
   - Login with your GitHub account

2. **Import Repository**
   - Click **"Import Git Repository"**
   - Select: `SheebaZaim/Hackathon-2-phase-2`
   - Click **"Import"**

3. **Configure Project**

   **Framework Preset**: Next.js (should auto-detect)

   **Root Directory**:
   - Click **"Edit"** next to Root Directory
   - Type: `frontend`
   - ⚠️ THIS IS CRITICAL - must be set to `frontend`

   **Build Settings** (leave as default):
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

   **Environment Variables**:
   - Click **"Add Environment Variable"**
   - **Name**: `NEXT_PUBLIC_BACKEND_URL`
   - **Value**: `https://sheeba0321-hackathon-2-phase-2.hf.space`
   - Click **"Add"**

4. **Deploy**
   - Click **"Deploy"** button
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://your-app-name.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

When prompted:
- Set up and deploy: **Y**
- Which scope: Select your account
- Link to existing project: **N**
- Project name: `todo-app` (or any name)
- Directory: `.` (current)
- Override settings: **N**

---

## STEP 3: Verify Complete Deployment

### Test Backend
```bash
# Health check
curl https://sheeba0321-hackathon-2-phase-2.hf.space/health

# Should return:
# {"status":"healthy","database":"connected","timestamp":"..."}
```

### Test Frontend
1. Open your Vercel URL: `https://your-app.vercel.app`
2. Click **"Get Started"** or **"Login"**
3. Try to register a new account
4. Login with the account
5. Create a task
6. Mark task as complete
7. Delete task

### Test Full Integration
1. Open browser DevTools (F12) → Network tab
2. Try to login
3. Check Network requests:
   - Should see POST to `https://sheeba0321-hackathon-2-phase-2.hf.space/auth/login`
   - Should return 200 status with token
   - Should NOT return 500 error

---

## Common Issues & Solutions

### ❌ Backend: Database Still Disconnected
**Cause**: DATABASE_URL still has spaces or typos
**Solution**:
1. Check HF Spaces logs for exact hostname being used
2. Delete and re-add DATABASE_URL secret very carefully
3. Copy URL from this file, not from other sources

### ❌ Frontend: Can't Connect to Backend (CORS Error)
**Cause**: Backend not allowing Vercel domain
**Solution**: Already fixed! Backend allows `*.vercel.app` domains

### ❌ Frontend: 404 Not Found
**Cause**: Root directory not set to `frontend`
**Solution**:
1. Go to Vercel project settings
2. Set Root Directory: `frontend`
3. Redeploy

### ❌ Frontend: Build Failed
**Cause**: TypeScript errors or missing dependencies
**Solution**: Already tested - build works! If fails, check:
```bash
cd frontend
npm install --legacy-peer-deps
npm run build
```

---

## Quick Reference

### URLs
- **Backend**: https://sheeba0321-hackathon-2-phase-2.hf.space
- **Backend Health**: https://sheeba0321-hackathon-2-phase-2.hf.space/health
- **Backend Docs**: https://sheeba0321-hackathon-2-phase-2.hf.space/docs
- **Frontend**: (Will be provided after Vercel deployment)
- **HF Settings**: https://huggingface.co/spaces/Sheeba0321/hackathon-2-phase-2/settings

### Environment Variables Needed

**Hugging Face Spaces:**
```
DATABASE_URL=postgresql://neondb_owner:npg_NfkYIG5hUuy9@ep-raspy-king-aen4resw-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
BETTER_AUTH_SECRET=supersecretdevelopmentkeythatissafeforlocaltestinganddevelopment
```

**Vercel:**
```
NEXT_PUBLIC_BACKEND_URL=https://sheeba0321-hackathon-2-phase-2.hf.space
```

---

## What to Do Right Now

1. ✅ **Fix Backend** (Step 1) - Takes 5 minutes
   - Fix DATABASE_URL in HF Spaces
   - Verify database connects

2. ✅ **Deploy Frontend** (Step 2) - Takes 3 minutes
   - Deploy to Vercel
   - Set environment variable

3. ✅ **Test Everything** (Step 3) - Takes 2 minutes
   - Test login/signup
   - Create/edit/delete tasks

Total Time: **~10 minutes** 🎯

---

## Success Criteria

You'll know everything works when:
- ✅ Backend health shows `"database": "connected"`
- ✅ Frontend deploys successfully to Vercel
- ✅ You can register a new account
- ✅ You can login
- ✅ You can create, edit, and delete tasks
- ✅ No 500 errors in browser console

---

## Need Help?

If you get stuck:
1. Check the backend logs on Hugging Face Spaces
2. Check the browser console for frontend errors
3. Verify all environment variables are set correctly
4. Make sure DATABASE_URL has no spaces in the hostname

**Ready to deploy? Start with Step 1!** 🚀
