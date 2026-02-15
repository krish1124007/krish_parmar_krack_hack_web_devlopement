# 🚨 VERCEL 404 ERROR - IMMEDIATE FIX

## Current Issue
You're getting `404: NOT_FOUND` error on Vercel production.

## Why This Happens
Vercel needs to know:
1. Where your app's root is (aegis subdirectory)
2. How to handle client-side routing (SPA rewrites)
3. Where to build and deploy from

## ✅ IMMEDIATE FIX - Follow These Steps

### Step 1: Check Vercel Project Settings

Go to: https://vercel.com/dashboard → Your Project → Settings

#### A. Root Directory Setting
1. Go to **Settings → General**
2. Find **Root Directory** setting
3. Set it to: `frontend/aegis` (if deploying from monorepo)
   OR just `aegis` (if Vercel is already in the frontend folder)
4. Save

#### B. Build & Output Settings
1. Go to **Settings → Build & Output Settings**
2. Configure as follows:

```
Build Command:        npm run build
Output Directory:     dist
Install Command:      npm install
Development Command:  npm run dev
```

3. Make sure "Override" is checked if you're changing defaults
4. Save

### Step 2: Force Redeploy

After changing settings:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click the **⋯** menu (three dots)
4. Click **Redeploy**
5. Select "Use existing Build Cache: NO" (force fresh build)
6. Click **Redeploy**

### Step 3: Verify vercel.json Location

The `vercel.json` file should be in the SAME directory as your `package.json`.

**Check:**
```
frontend/aegis/package.json   ← Your package.json is here
frontend/aegis/vercel.json    ← vercel.json should be here too ✅
```

We've created TWO vercel.json files:
- `frontend/vercel.json` - For parent-level deployment
- `frontend/aegis/vercel.json` - For aegis subdirectory deployment

**Use the one that matches your Vercel root directory setting.**

### Step 4: Alternative Fix - Move Everything to Root

If the above doesn't work, the issue might be with subdirectory deployment.

**Option A: Set Vercel Root Directory**
- In Vercel → Settings → Root Directory
- Set to: `frontend/aegis`
- Redeploy

**Option B: Deploy from aegis directory** (Recommended)
Instead of deploying the `frontend` directory, deploy the `aegis` directory directly:

1. In Vercel dashboard, remove current project
2. Create new project
3. When importing from GitHub, select: `frontend/aegis` as the root
4. Vercel will auto-detect Vite
5. Deploy

## 🔍 Verification Steps

After redeploying:

1. **Check Build Logs**
   - Go to Deployments → Latest Deployment
   - Click on build logs
   - Look for errors
   - Verify it's building from correct directory

2. **Test the Routes**
   - Visit: `https://your-app.vercel.app/`
   - Navigate to: `/student/dashboard`
   - **Refresh the page** (Ctrl+R)
   - Should NOT get 404

3. **Check Environment Variables**
   - Go to Settings → Environment Variables
   - Verify `VITE_API_BASE_URL` is set
   - Should be: `https://krish-parmar-krack-hack-web.onrender.com`

## 🐛 Still Getting 404?

### Debug Checklist:

- [ ] vercel.json is in the same directory as package.json
- [ ] Vercel Root Directory is set correctly
- [ ] Redeployed after adding vercel.json
- [ ] Cleared browser cache
- [ ] Build completed successfully (check logs)
- [ ] Deployment shows "Ready" status

### Check These Files:

**1. Verify vercel.json content:**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**2. Check Vercel Configuration:**
- Go to Vercel → Settings → General
- Screenshot the "Root Directory" setting
- It should match where your package.json is

**3. Check Build Output:**
- Vercel should output files to `dist/` directory
- The `dist/index.html` should exist

## 💡 Common Issues & Solutions

### Issue 1: vercel.json Not Applied
**Solution:**
- Force redeploy (don't use cache)
- Make sure vercel.json is committed to git
- Wait 30 seconds after deployment

### Issue 2: Wrong Root Directory
**Solution:**
- Check Vercel Settings → Root Directory
- Should point to where package.json is
- Typical values: `frontend/aegis` or just `.` if Vercel is already in aegis

### Issue 3: Build Errors
**Solution:**
- Check deployment logs for errors
- Make sure all dependencies are installed
- Verify build command is `npm run build`

### Issue 4: Environment Variables Missing
**Solution:**
- Settings → Environment Variables
- Add: `VITE_API_BASE_URL`
- Redeploy

## 🎯 Quick Command to Commit Both Files

```bash
cd c:\Users\Krish\Desktop\krackhack\frontend

# Add both vercel.json files
git add vercel.json
git add aegis/vercel.json

# Commit
git commit -m "fix: add vercel.json for proper routing and subdirectory deployment"

# Push
git push
```

## 📞 Need More Help?

1. **Check Vercel Build Logs:**
   - Look for specific errors
   - See which directory it's building from

2. **Share the Log:**
   - If still having issues, check the deployment logs
   - Look for the error message

3. **Verify Structure:**
   ```
   frontend/
   ├── vercel.json           ← New file (for parent deployment)
   └── aegis/
       ├── vercel.json        ← Existing file (for aegis deployment)
       ├── package.json
       ├── vite.config.js
       └── src/
           └── ...
   ```

## ✅ Expected Behavior After Fix

1. Visit any route: `https://your-app.vercel.app/student/dashboard`
2. Page loads correctly
3. Refresh page (Ctrl+R)
4. **Still works - NO 404!**
5. Navigate to other routes
6. All routes work with refresh

---

**Last Updated:** 2026-02-15 18:50 IST
**Status:** Awaiting user to configure Vercel Root Directory and redeploy
