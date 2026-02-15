# Quick Start: API Configuration & Vercel Fix

## ✅ What's Been Fixed

### 1. Centralized API Configuration
All API URLs are now managed from ONE place: `src/config/api.config.js`

### 2. Vercel 404 Error Fixed
Added `vercel.json` to fix 404 errors when refreshing pages on Vercel.

## 🚀 Quick Setup

### For Local Development
```bash
# Option 1: Use default (localhost:8000) - No setup needed!
npm run dev

# Option 2: Use custom backend URL
# Edit .env file and change VITE_API_BASE_URL
npm run dev
```

### For Production Deployment on Vercel

**Method 1: Using Vercel Dashboard (Recommended)**
1. Go to your Vercel project → Settings → Environment Variables
2. Add new variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://your-backend-url.onrender.com`
3. Redeploy your app

**Method 2: Update .env file**
1. Edit `.env` file in your project
2. Set: `VITE_API_BASE_URL=https://your-backend-url.onrender.com`
3. Push to GitHub (Vercel will auto-deploy)

## 🎯 Current Configuration

Your backend URL is currently set to:
```
https://krish-parmar-krack-hack-web.onrender.com
```

**To change it:**
1. Edit the `.env` file, OR
2. Set environment variable in Vercel dashboard

## 📁 Files Created

- ✅ `src/config/api.config.js` - Centralized API configuration
- ✅ `vercel.json` - Fixes 404 errors on Vercel
- ✅ `.env` - Environment variables (backend URL)
- ✅ `.env.example` - Template for environment variables
- ✅ `API_MIGRATION_GUIDE.md` - Detailed migration guide
- ✅ `scripts/find-hardcoded-urls.js` - Helper script to find remaining hardcoded URLs

## 🔧 How to Update Remaining Files

Many files still have hardcoded URLs. To find them:

```bash
# Run the helper script
node scripts/find-hardcoded-urls.js
```

This will show you all files that still need updating.

### Migration Pattern:

**Before:**
```javascript
const response = await fetch('http://localhost:8000/api/v1/student/profile');
```

**After:**
```javascript
import { API_ENDPOINTS } from '../config/api.config.js';
const response = await fetch(API_ENDPOINTS.STUDENT.PROFILE);
```

## ⚡ Quick Test

After deployment:
1. Visit your Vercel URL
2. Navigate to any page (e.g., `/student/dashboard`)
3. **Refresh the page** ← Should work without 404!
4. Try logging in ← Should connect to your backend

## 🐛 Troubleshooting

### Still getting 404 on Vercel?
- Ensure `vercel.json` is committed and pushed
- Try redeploying on Vercel

### API calls not working?
- Check if `VITE_API_BASE_URL` is set correctly
- Verify your backend is running and accessible
- Check browser console for specific errors

### Build errors?
- Make sure to install dependencies: `npm install`
- Check that all imports are correct

## 📚 Next Steps

1. **Update remaining files** using the migration pattern above
2. **Set your backend URL** in Vercel environment variables
3. **Deploy and test** everything works
4. **Read** `API_MIGRATION_GUIDE.md` for detailed information

## 💡 Pro Tips

- The `.env` file is gitignored for security
- Always use `VITE_` prefix for environment variables in Vite
- Restart dev server after changing `.env`
- In Vercel, redeploy after changing environment variables

---

Need more details? Check `API_MIGRATION_GUIDE.md`
