# Deploy Frontend to Vercel - Complete Guide

## Prerequisites Checklist
- [x] Backend deployed at: https://sheeba0321-hackathon-2-phase-2.hf.space
- [x] Frontend builds successfully (`npm run build` passes)
- [ ] DATABASE_URL fixed in Hugging Face Spaces (see `backend/FIX_DATABASE_URL.md`)
- [ ] GitHub repository up-to-date
- [ ] Vercel account created

## Method 1: Deploy via Vercel Dashboard (Recommended for First Deployment)

### Step 1: Push Latest Changes to GitHub
```bash
cd D:\from-phase-2
git add .
git commit -m "Configure frontend for production deployment"
git push origin main
```

### Step 2: Import Project to Vercel
1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select your GitHub account and repository:
   - Repository: `SheebaZaim/Hackathon-2-phase-2`
4. Click **"Import"**

### Step 3: Configure Project Settings

**Framework Preset:**
- Select: **Next.js** (should auto-detect)

**CRITICAL - Root Directory:**
- Click **"Edit"** next to Root Directory
- Set to: `frontend`
- This tells Vercel your Next.js app is in the `frontend` folder

**Build Settings:**
- Build Command: `npm run build` (auto-detected)
- Output Directory: `.next` (auto-detected)
- Install Command: `npm install --legacy-peer-deps`
  - Click "Override" and paste this command

**Environment Variables:**
Click **"Add Environment Variable"** and add:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | `https://sheeba0321-hackathon-2-phase-2.hf.space` | Production |

### Step 4: Deploy
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `https://hackathon-2-phase-2-xyz.vercel.app`

### Step 5: Update Backend CORS (CRITICAL)
After getting your Vercel URL, update the backend's `FRONTEND_URL` in Hugging Face Spaces:

1. Go to: https://huggingface.co/spaces/sheeba0321/Hackathon-2-phase-2/settings
2. Repository secrets → Add/Edit `FRONTEND_URL`
3. Value: Your Vercel URL (e.g., `https://hackathon-2-phase-2-xyz.vercel.app`)
4. Click "Factory reboot" to restart the Space

### Step 6: Verify Deployment
```bash
# Test frontend is live
curl -I https://your-vercel-url.vercel.app

# Test backend health
curl https://sheeba0321-hackathon-2-phase-2.hf.space/health

# Test CORS (should not get CORS errors)
curl -H "Origin: https://your-vercel-url.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://sheeba0321-hackathon-2-phase-2.hf.space/api/auth/login
```

---

## Method 2: Deploy via Vercel CLI (Alternative)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
# Follow browser authentication flow
```

### Step 3: Deploy from Frontend Directory
```bash
cd D:\from-phase-2\frontend

# First deployment (interactive)
vercel

# Answer prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? hackathon-2-phase-2 (or your choice)
# - Directory? ./ (current directory)
# - Override settings? N
```

### Step 4: Add Environment Variables
```bash
# Add production environment variable
vercel env add NEXT_PUBLIC_BACKEND_URL production

# When prompted, paste:
# https://sheeba0321-hackathon-2-phase-2.hf.space
```

### Step 5: Deploy to Production
```bash
# Deploy to production domain
vercel --prod
```

---

## Method 3: Automated Deployments (After Initial Setup)

### Enable Automatic Deployments
Once connected to GitHub, Vercel will automatically:
- Deploy **preview** builds for every pull request
- Deploy **production** builds when you push to `main` branch

### How to Deploy Updates
```bash
# Make changes to your code
git add .
git commit -m "Your changes"
git push origin main

# Vercel automatically deploys in 2-3 minutes
# Check status at: https://vercel.com/your-username/hackathon-2-phase-2
```

---

## Troubleshooting

### Build Fails with "No Build Output"
**Problem:** Vercel can't find the Next.js app

**Solution:**
1. Go to Vercel Dashboard → Your Project → Settings
2. General → Root Directory
3. Set to: `frontend`
4. Redeploy

### Build Fails with Peer Dependency Errors
**Problem:** React 19 peer dependency conflicts

**Solution:**
1. Vercel Dashboard → Settings → General
2. Build & Development Settings → Install Command
3. Override with: `npm install --legacy-peer-deps`
4. Redeploy

### Frontend Can't Connect to Backend
**Problem:** CORS errors or network failures

**Solutions:**
1. Check `NEXT_PUBLIC_BACKEND_URL` is set in Vercel env vars
2. Verify backend is running: `curl https://sheeba0321-hackathon-2-phase-2.hf.space/health`
3. Check CORS settings in `backend/src/main.py` include your Vercel domain
4. Ensure `FRONTEND_URL` is set in Hugging Face Spaces secrets

### Environment Variables Not Working
**Problem:** `process.env.NEXT_PUBLIC_BACKEND_URL` is undefined

**Solutions:**
1. Ensure variable name starts with `NEXT_PUBLIC_`
2. Redeploy after adding env vars (they don't apply retroactively)
3. Check deployment logs for the value being set

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Frontend accessible at Vercel URL
- [ ] Backend health check shows `"database":"connected"`
- [ ] Can register a new user
- [ ] Can login with credentials
- [ ] Can create a task
- [ ] Can view tasks in dashboard
- [ ] Can update task status
- [ ] Can delete a task
- [ ] No CORS errors in browser console
- [ ] SSL certificate is active (https://)

---

## Deployment URLs

Once deployed, save these URLs:

**Frontend (Vercel):**
- Production: `https://your-app.vercel.app`
- Preview: `https://your-app-git-branch.vercel.app`

**Backend (Hugging Face):**
- Production: `https://sheeba0321-hackathon-2-phase-2.hf.space`
- API Docs: `https://sheeba0321-hackathon-2-phase-2.hf.space/docs`
- Health: `https://sheeba0321-hackathon-2-phase-2.hf.space/health`

**Repository:**
- GitHub: `https://github.com/SheebaZaim/Hackathon-2-phase-2`

---

## Custom Domain (Optional)

To add a custom domain:

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `todo.yourdomain.com`)
3. Follow DNS configuration instructions
4. Update `FRONTEND_URL` in Hugging Face Spaces to your custom domain

---

## Monitoring & Logs

**Vercel Logs:**
- Dashboard → Your Project → Deployments → Click deployment → View Logs

**Backend Logs:**
- https://huggingface.co/spaces/sheeba0321/Hackathon-2-phase-2/logs

**Real-time Monitoring:**
- Vercel Analytics (free tier includes basic metrics)
- Add to `next.config.js`: `analytics: { enabled: true }`

---

## Cost Estimate

**Vercel (Hobby/Free Tier):**
- 100 GB bandwidth/month
- Unlimited deployments
- Unlimited serverless function executions
- Free SSL certificates
- **Cost: $0/month**

**Upgrade to Pro if needed ($20/month):**
- 1 TB bandwidth
- Advanced analytics
- Team collaboration
- Password protection

**Total Monthly Cost: $0** (using free tiers)

---

## Need Help?

**Deployment Issues:**
- Check build logs in Vercel dashboard
- Review `backend/FIX_DATABASE_URL.md` for backend issues
- Run verification script: `bash verify-deployment.sh`

**Code Issues:**
- Frontend logs: Browser DevTools → Console
- Backend logs: HF Space logs tab
- API testing: Use `/docs` endpoint for interactive testing

**Support Resources:**
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- HF Spaces: https://huggingface.co/docs/hub/spaces
