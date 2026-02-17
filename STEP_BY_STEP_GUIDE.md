# Step-by-Step Deployment Guide

## PART 1: Fix Backend Database (Hugging Face Spaces)

### Step 1: Open Settings Page
- Click: https://huggingface.co/spaces/Sheeba0321/hackathon-2-phase-2/settings
- Scroll down to find "Repository secrets" section

### Step 2: Delete Old DATABASE_URL
- Find the secret named `DATABASE_URL`
- Click the "Delete" button (trash icon) next to it
- Confirm deletion if asked

### Step 3: Add New DATABASE_URL
- Click "New secret" button
- Fill in:
  - **Name**: `DATABASE_URL` (exactly as shown)
  - **Value**: Copy this ENTIRE line as ONE block:
    ```
    postgresql://neondb_owner:npg_NfkYIG5hUuy9@ep-raspy-king-aen4resw-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require
    ```
- Click "Add secret" button

### Step 4: Add BETTER_AUTH_SECRET
- Click "New secret" button again
- Fill in:
  - **Name**: `BETTER_AUTH_SECRET`
  - **Value**:
    ```
    supersecretdevelopmentkeythatissafeforlocaltestinganddevelopment
    ```
- Click "Add secret" button

### Step 5: Wait for Restart
- The Space will automatically restart (watch the logs)
- Wait about 1-2 minutes
- Look for "Application startup complete" in the logs

### Step 6: Verify Backend Works
- Open: https://sheeba0321-hackathon-2-phase-2.hf.space/health
- Should show: `"database": "connected"` ✅

---

## PART 2: Deploy Frontend (Vercel)

### Step 1: Go to Vercel
- Open: https://vercel.com/new
- Login with your GitHub account if needed

### Step 2: Import Repository
- Click "Import Git Repository" or "Add New Project"
- Select: `SheebaZaim/Hackathon-2-phase-2`
- Click "Import"

### Step 3: Configure Project
**Framework Preset**: Next.js (auto-detected)

**Root Directory**:
- Click "Edit" next to "Root Directory"
- Type: `frontend`
- This is CRITICAL!

**Environment Variables**:
- Click "Environment Variables" section
- Add variable:
  - **Key**: `NEXT_PUBLIC_BACKEND_URL`
  - **Value**: `https://sheeba0321-hackathon-2-phase-2.hf.space`
- Click "Add"

### Step 4: Deploy
- Click the "Deploy" button
- Wait 2-3 minutes for build
- You'll get a URL like: `https://your-app.vercel.app`

### Step 5: Test Your App
- Click the Vercel URL
- Try to register a new account
- Login
- Create a task
- Success! 🎉

---

## Verification Commands

### Check Backend:
```bash
curl https://sheeba0321-hackathon-2-phase-2.hf.space/health
```

Should return: `{"status":"healthy","database":"connected"}`

### Check Frontend:
- Open your Vercel URL in browser
- Open DevTools (F12) → Console
- Should see no errors
- Should be able to register/login

---

## Troubleshooting

### Database still disconnected?
- Check DATABASE_URL in HF Spaces settings
- Make sure "neon.tech" has NO spaces
- Check logs for exact error

### Frontend can't connect?
- Check NEXT_PUBLIC_BACKEND_URL is set in Vercel
- Check browser console for CORS errors
- Verify backend is running

### Build fails on Vercel?
- Make sure Root Directory is set to `frontend`
- Check Vercel build logs for errors
