# Vercel Deployment Guide - Todo App Frontend

This guide walks you through deploying the Next.js frontend to Vercel and connecting it to your deployed FastAPI backend.

## Prerequisites

- GitHub repository: https://github.com/SheebaZaim/Hackathon-2-phase-2
- Backend deployed at: https://sheeba0321-hackathon-2-phase-2.hf.space
- Vercel account (sign up at https://vercel.com)

## Current Status

✅ **Backend**: Deployed and running at https://sheeba0321-hackathon-2-phase-2.hf.space
✅ **CORS Configuration**: Already configured to allow Vercel domains (*.vercel.app)
✅ **Frontend Build**: Tested and working locally
⏳ **Frontend Deployment**: Ready to deploy

## Step-by-Step Deployment

### Option 1: Deploy via Vercel Dashboard (Recommended)

#### 1. Connect to GitHub

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your repository: `SheebaZaim/Hackathon-2-phase-2`
4. Click "Import"

#### 2. Configure Project Settings

On the import screen:

**Framework Preset**: Next.js (should auto-detect)

**Root Directory**: `frontend` ⚠️ **IMPORTANT**
- Click "Edit" next to Root Directory
- Enter: `frontend`
- This tells Vercel to build from the `/frontend` folder

**Build and Output Settings**:
- Build Command: `npm run build` (auto-detected)
- Output Directory: `.next` (auto-detected)
- Install Command: `npm install --legacy-peer-deps` (automatically uses .npmrc)

#### 3. Add Environment Variables

Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://sheeba0321-hackathon-2-phase-2.hf.space` |

**Important Notes**:
- Environment: Select "Production", "Preview", and "Development"
- The `NEXT_PUBLIC_` prefix is required for client-side access
- Do NOT include trailing slash in the URL

#### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete (2-3 minutes)
3. You'll get a deployment URL like: `https://your-project-name.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to project root
cd D:\from-phase-2

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel --cwd frontend

# When prompted:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? (accept default or customize)
# - Directory? ./frontend
# - Override settings? No

# Set production environment variable
vercel env add NEXT_PUBLIC_BACKEND_URL production
# Enter: https://sheeba0321-hackathon-2-phase-2.hf.space

# Deploy to production
vercel --cwd frontend --prod
```

## Verification Steps

After deployment, verify everything works:

### 1. Check Deployment Status

Visit your Vercel deployment URL and check:
- ✅ Home page loads
- ✅ No console errors in browser DevTools
- ✅ Login page accessible at `/login`
- ✅ Register page accessible at `/register`

### 2. Test Backend Connectivity

Open browser DevTools (F12) → Network tab, then:

1. Go to `/login` page
2. Try to sign in with test credentials
3. Check Network tab for API calls to `https://sheeba0321-hackathon-2-phase-2.hf.space/auth/login`
4. Verify response status (should be 200 for valid credentials, 401 for invalid)

### 3. Test Authentication Flow

**Register a new user**:
```bash
# Using curl to verify backend
curl -X POST https://sheeba0321-hackathon-2-phase-2.hf.space/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User"}'
```

**Login via frontend**:
1. Go to your Vercel URL + `/login`
2. Enter credentials
3. Should redirect to `/dashboard` on success
4. Check localStorage for `auth_token`

### 4. Verify CORS

If you see CORS errors in console:

```bash
# Test CORS from your Vercel domain
curl -H "Origin: https://your-app.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  https://sheeba0321-hackathon-2-phase-2.hf.space/auth/login
```

Should return headers including:
```
access-control-allow-origin: https://your-app.vercel.app
access-control-allow-methods: POST
```

## Troubleshooting

### Build Fails with "Cannot find module"

**Issue**: Missing dependencies
**Solution**: Vercel should auto-use `.npmrc` with `legacy-peer-deps=true`. If not, update `vercel.json`:

```json
{
  "installCommand": "npm install --legacy-peer-deps"
}
```

### Environment Variable Not Working

**Issue**: `NEXT_PUBLIC_BACKEND_URL` returns undefined
**Solutions**:
1. Verify it's prefixed with `NEXT_PUBLIC_`
2. Check it's set in Vercel dashboard: Settings → Environment Variables
3. Redeploy after adding variables: Deployments → Latest → Redeploy

### CORS Errors

**Issue**: "Access to fetch blocked by CORS policy"
**Current Backend CORS Config**:
```python
allow_origin_regex=r"https://.*\.vercel\.app"  # Allows all *.vercel.app
```

**If still blocked**:
1. Check exact error in console - may need to add specific domain
2. Update backend `src/main.py` CORS config if needed
3. Verify Hugging Face Space is running (check health endpoint)

### 404 on Page Routes

**Issue**: Direct navigation to `/dashboard` returns 404
**Solution**: Next.js should handle this automatically. If not, Vercel may need routing config:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Backend Connection Timeout

**Issue**: Requests to backend hang or timeout
**Checks**:
1. Verify backend is running: https://sheeba0321-hackathon-2-phase-2.hf.space/health
2. Check Hugging Face Space status (may be sleeping)
3. Verify DATABASE_URL is set in HF Space secrets

## Post-Deployment Configuration

### Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `FRONTEND_URL` in Hugging Face Space secrets to match

### Environment Management

**Development**:
- Uses `http://localhost:8000` (from `.env.local`)

**Production**:
- Uses `https://sheeba0321-hackathon-2-phase-2.hf.space` (from Vercel env vars)

### Monitoring

**Vercel Dashboard**:
- Analytics: View visitor stats
- Logs: Check runtime logs
- Speed Insights: Performance metrics

**Backend Health**:
```bash
# Regular health check
curl https://sheeba0321-hackathon-2-phase-2.hf.space/health
```

## Updating Deployment

### Update Frontend Code

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Vercel auto-deploys on push to main
```

### Update Environment Variables

```bash
# Via CLI
vercel env rm NEXT_PUBLIC_BACKEND_URL production
vercel env add NEXT_PUBLIC_BACKEND_URL production
# Enter new value

# Then redeploy
vercel --cwd frontend --prod
```

Or via Vercel dashboard:
1. Settings → Environment Variables
2. Edit or add variables
3. Deployments → Redeploy latest

## Architecture Overview

```
User Browser
    ↓
Vercel Frontend (Next.js)
    ↓ HTTPS
Hugging Face Space (FastAPI)
    ↓
Neon PostgreSQL (Database)
```

**Key URLs**:
- Frontend: `https://[your-project].vercel.app`
- Backend: `https://sheeba0321-hackathon-2-phase-2.hf.space`
- Database: Neon PostgreSQL (serverless)

## Security Checklist

✅ Environment variables not in git (`.env.local` in `.gitignore`)
✅ CORS restricted to specific domains
✅ HTTPS enforced on all connections
✅ JWT tokens stored securely (localStorage, httpOnly would be better)
✅ Database requires SSL (`sslmode=require`)
⚠️ Consider: Rate limiting, CSP headers, better token storage

## Support

**Common Issues**:
- See backend deployment guide: `backend/DEPLOYMENT_FIX.md`
- Check recent commits for fixes: `git log --oneline --grep="vercel"`
- Review CORS config: `backend/src/main.py` lines 25-38

**Useful Links**:
- Vercel Documentation: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Backend Health Check: https://sheeba0321-hackathon-2-phase-2.hf.space/health
- Backend API Docs: https://sheeba0321-hackathon-2-phase-2.hf.space/docs

---

**Last Updated**: 2026-02-14
**Backend Version**: 1.0.0
**Frontend Version**: 0.1.0
