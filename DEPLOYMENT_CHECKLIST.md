# Deployment Checklist - Todo App

Quick reference for deploying and troubleshooting the Todo App.

## Pre-Deployment Status

### Backend ✅
- **URL**: https://sheeba0321-hackathon-2-phase-2.hf.space
- **Status**: Running (API responding)
- **Database**: ⚠️ Currently disconnected (needs DATABASE_URL secret)
- **CORS**: Configured for Vercel (*.vercel.app)

### Frontend ⏳
- **Build**: ✅ Tested and working
- **Deployment**: Ready to deploy to Vercel
- **Environment**: Needs NEXT_PUBLIC_BACKEND_URL

## Quick Deploy - Frontend to Vercel

### Method 1: Vercel Dashboard (5 minutes)

1. **Go to**: https://vercel.com/new
2. **Import**: SheebaZaim/Hackathon-2-phase-2
3. **Configure**:
   - Root Directory: `frontend` ⚠️ **CRITICAL**
   - Framework: Next.js (auto)
   - Build Command: `npm run build` (auto)

4. **Environment Variables**:
   ```
   NEXT_PUBLIC_BACKEND_URL = https://sheeba0321-hackathon-2-phase-2.hf.space
   ```

5. **Deploy** → Wait 2-3 minutes

6. **Get your URL**: `https://[project-name].vercel.app`

### Method 2: Vercel CLI (3 minutes)

```bash
# Install CLI (if needed)
npm i -g vercel

# Deploy
cd frontend
vercel

# Add environment variable
vercel env add NEXT_PUBLIC_BACKEND_URL production
# Enter: https://sheeba0321-hackathon-2-phase-2.hf.space

# Deploy to production
vercel --prod
```

## Post-Deployment Verification

### 1. Backend Database Fix (REQUIRED)

The backend is running but database is disconnected. Fix this first:

```bash
# Go to: https://huggingface.co/spaces/sheeba0321/hackathon-2-phase-2/settings
# → Repository secrets → Add new secret

# Add these secrets:
DATABASE_URL = postgresql://user:pass@host/db?sslmode=require
BETTER_AUTH_SECRET = (generate with: openssl rand -hex 32)
FRONTEND_URL = https://[your-vercel-app].vercel.app
```

After adding secrets, restart the Space (Settings → Factory reboot).

**Verify**:
```bash
curl https://sheeba0321-hackathon-2-phase-2.hf.space/health
# Should return: "database":"connected"
```

### 2. Frontend Verification

Visit your Vercel URL:
- [ ] Home page loads
- [ ] No console errors (F12)
- [ ] Can navigate to /login
- [ ] Can navigate to /register

### 3. End-to-End Test

1. Register new user at `/register`
2. Login at `/login`
3. Should redirect to `/dashboard`
4. Check localStorage for `auth_token`
5. Create a todo task

## Common Issues & Quick Fixes

### Issue: "Failed to fetch" in frontend

**Cause**: Backend database not connected or CORS issue

**Fix**:
```bash
# 1. Check backend health
curl https://sheeba0321-hackathon-2-phase-2.hf.space/health

# 2. If database disconnected, add DATABASE_URL to HF Space secrets
# 3. Restart HF Space
```

### Issue: Build fails on Vercel

**Cause**: Peer dependency conflicts

**Fix**: Already handled by `.npmrc` in frontend folder
```
legacy-peer-deps=true
```

If still failing, check `vercel.json` has:
```json
{
  "installCommand": "npm install --legacy-peer-deps"
}
```

### Issue: Environment variable undefined

**Cause**: Not prefixed with `NEXT_PUBLIC_` or not redeployed

**Fix**:
1. Verify in Vercel: Settings → Environment Variables
2. Must be: `NEXT_PUBLIC_BACKEND_URL`
3. After adding, redeploy: Deployments → Redeploy

### Issue: CORS error

**Cause**: Vercel domain not matching regex

**Check**:
```bash
curl -H "Origin: https://your-app.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS -I \
  https://sheeba0321-hackathon-2-phase-2.hf.space/auth/login
```

**Current Config**: Backend allows `https://*.vercel.app` via regex

### Issue: 404 on refresh

**Cause**: SPA routing not configured

**Fix**: Next.js should handle this automatically. If not, add to `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Files Created

✅ `frontend/vercel.json` - Vercel configuration
✅ `VERCEL_DEPLOYMENT_GUIDE.md` - Detailed deployment guide
✅ `verify-deployment.sh` - Verification script
✅ `DEPLOYMENT_CHECKLIST.md` - This file (quick reference)

## Architecture

```
┌─────────────────┐
│  User Browser   │
└────────┬────────┘
         │ HTTPS
┌────────▼────────┐
│ Vercel Frontend │ (Next.js)
│ *.vercel.app    │
└────────┬────────┘
         │ HTTPS
┌────────▼────────────────────────┐
│ Hugging Face Space (Backend)    │
│ sheeba0321-hackathon-2-phase-2  │
│ Port 7860                        │
└────────┬─────────────────────────┘
         │ PostgreSQL (SSL)
┌────────▼────────┐
│ Neon Database   │
│ (Serverless)    │
└─────────────────┘
```

## Reference Documents

- **Detailed Deployment Guide**: `VERCEL_DEPLOYMENT_GUIDE.md`
- **Backend Fix Guide**: `backend/DEPLOYMENT_FIX.md`
- **Backend Config**: `backend/src/main.py` (CORS settings)
- **Frontend Config**: `frontend/vercel.json`

## Support Commands

```bash
# Test backend health
curl https://sheeba0321-hackathon-2-phase-2.hf.space/health

# Test auth endpoint
curl -X POST https://sheeba0321-hackathon-2-phase-2.hf.space/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Run verification script
./verify-deployment.sh https://your-app.vercel.app

# View Vercel logs
vercel logs [deployment-url]

# Check Vercel env vars
vercel env ls
```

## Next Steps

1. ✅ **Deploy Frontend**: Follow "Quick Deploy" section above
2. ⚠️ **Fix Backend Database**: Add DATABASE_URL to HF Space secrets
3. ✅ **Test End-to-End**: Register → Login → Create Task
4. 📝 **Optional**: Add custom domain in Vercel settings
5. 📊 **Monitor**: Use Vercel Analytics + HF Space logs

---

**Status**: Ready for deployment
**Last Updated**: 2026-02-14
**Deployment Time**: ~5-10 minutes (frontend + backend fix)
