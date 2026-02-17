# URGENT: Fix Hugging Face Spaces DATABASE_URL

## Problem
Your backend is running but **database is disconnected** because the `DATABASE_URL` secret in Hugging Face Spaces has **spaces in the hostname**.

**Current Status:**
```
Backend: https://sheeba0321-hackathon-2-phase-2.hf.space
Health Check: {"status":"healthy","database":"disconnected"}
```

## Root Cause
The DATABASE_URL secret in your Hugging Face Space has the hostname formatted as:
- **WRONG**: `...@ep-raspy-king-aen4resw-pooler.c-2.us-east-2.aws.ne  on.tech/...` (note the spaces)
- **CORRECT**: `...@ep-raspy-king-aen4resw-pooler.c-2.us-east-2.aws.neon.tech/...` (no spaces)

## Solution: Update Secrets in Hugging Face UI

### Step 1: Access Your Hugging Face Space Settings
1. Go to: https://huggingface.co/spaces/sheeba0321/Hackathon-2-phase-2
2. Click the **"Settings"** tab at the top
3. Scroll down to **"Repository secrets"** section

### Step 2: Update DATABASE_URL
1. Find the `DATABASE_URL` secret
2. Click **"Edit"** (pencil icon)
3. **COPY THIS EXACT VALUE** (from your local .env file):
   ```
   postgresql://neondb_owner:npg_NfkYIG5hUuy9@ep-raspy-king-aen4resw-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   ```
4. **Paste it carefully** - ensure no extra spaces, newlines, or formatting
5. Click **"Update secret"**

### Step 3: Verify Other Required Secrets
Make sure these secrets are also set (add if missing):

**BETTER_AUTH_SECRET:**
```
supersecretdevelopmentkeythatissafeforlocaltestinganddevelopment
```

**FRONTEND_URL** (will be updated after Vercel deployment):
```
https://your-app-name.vercel.app
```

### Step 4: Restart Your Space
After updating secrets:
1. Go to the **"Settings"** tab
2. Scroll to bottom
3. Click **"Factory reboot"** button
4. Wait 1-2 minutes for the Space to restart

### Step 5: Verify Database Connection
After restart, check health endpoint:
```bash
curl https://sheeba0321-hackathon-2-phase-2.hf.space/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-14T...",
  "database": "connected"  ← Should say "connected"!
}
```

## Alternative: Use Hugging Face CLI (Advanced)

If you have the HF CLI installed:
```bash
# Install if needed
pip install huggingface-hub

# Login
huggingface-cli login

# Add secret
huggingface-cli repo secrets set \
  --repo sheeba0321/Hackathon-2-phase-2 \
  --repo-type space \
  DATABASE_URL "postgresql://neondb_owner:npg_NfkYIG5hUuy9@ep-raspy-king-aen4resw-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

## Troubleshooting

### If database still shows "disconnected" after fix:
1. Check Neon console to ensure database is active (not paused)
2. Verify the password hasn't changed in Neon
3. Check Space logs for connection errors:
   - Go to your Space → "Logs" tab
   - Look for PostgreSQL connection errors

### If you see SSL/TLS errors:
- Ensure `?sslmode=require` is at the end of the URL
- Neon requires SSL connections

## Next Steps
After fixing the database connection:
1. Continue with Vercel frontend deployment
2. Update FRONTEND_URL secret to your Vercel URL
3. Test the full application end-to-end

## Need Help?
- Check Space logs at: https://huggingface.co/spaces/sheeba0321/Hackathon-2-phase-2/logs
- Neon dashboard: https://console.neon.tech/
- Backend source: `D:\from-phase-2\backend\`
