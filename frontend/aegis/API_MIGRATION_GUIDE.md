# API Configuration Migration Guide

## Overview
This guide explains how to use the new centralized API configuration system and fix the Vercel 404 error.

## What Has Been Done

### 1. Created Centralized API Configuration
- **File**: `src/config/api.config.js`
- **Purpose**: Single source of truth for all API URLs
- **Benefits**: 
  - Easy to change API URL for different environments
  - Supports environment variables
  - Type-safe endpoint definitions

### 2. Fixed Vercel 404 Error
- **File**: `vercel.json`
- **Issue**: Single Page Applications (SPAs) need all routes to point to index.html
- **Solution**: Added rewrite rules to handle client-side routing

### 3. Environment Variable Support
- **File**: `.env.example`
- **Usage**: Copy to `.env` and set your backend URL

## How to Use

### For Development

1. **Using Default (localhost:8000)**:
   - No configuration needed
   - Just run `npm run dev`

2. **Using Custom URL**:
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env and set your backend URL
   VITE_API_BASE_URL=http://localhost:3000
   ```

### For Production

#### Option 1: Using Environment Variable (Recommended)

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com`
   - Redeploy

2. **In Your Deployment Platform**:
   - Set environment variable: `VITE_API_BASE_URL=https://your-backend-url.onrender.com`

#### Option 2: Modify Config File

Edit `src/config/api.config.js`:
```javascript
if (import.meta.env.PROD) {
    // Replace with your actual backend URL
    return 'https://your-actual-backend.onrender.com';
}
```

## Migrating Existing Code

### Files Already Updated:
- ✅ `src/utils/eventService.js`
- ✅ `src/pages/Login.jsx`

### Files That Need Updating:
All files with hardcoded `http://localhost:8000` URLs should import and use the centralized config:

```javascript
// Before
const response = await fetch('http://localhost:8000/api/v1/student/profile');

// After
import { API_ENDPOINTS } from '../config/api.config.js';
const response = await fetch(API_ENDPOINTS.STUDENT.PROFILE);
```

### Quick Migration Pattern:

1. **Import the config**:
   ```javascript
   import { API_ENDPOINTS } from '../config/api.config.js';
   ```

2. **Replace hardcoded URLs**:
   - Find: `http://localhost:8000/api/v1/student/profile`
   - Replace with: `API_ENDPOINTS.STUDENT.PROFILE`

3. **For dynamic URLs**:
   ```javascript
   // Before
   `http://localhost:8000/api/v1/student/class/${classId}`
   
   // After
   API_ENDPOINTS.STUDENT.CLASS(classId)
   ```

## Files Requiring Manual Update

Run this search in your project to find all files with hardcoded URLs:
```bash
grep -r "http://localhost:8000" src/
```

### Common Files to Update:
- `src/pages/student/*.jsx` - All student pages
- `src/pages/faculty/*.jsx` - All faculty pages
- `src/pages/admin/*.jsx` - All admin pages
- `src/pages/authority/*.jsx` - All authority pages
- `src/pages/admin/components/*.jsx` - Admin components

## Vercel 404 Error - Explanation

### Why It Happens:
- Vercel serves your React app as static files
- When you navigate to `/student/dashboard`, Vercel looks for a file at that path
- Since it's a client-side route, the file doesn't exist → 404

### The Fix:
The `vercel.json` file tells Vercel to serve `index.html` for ALL routes, allowing React Router to handle routing.

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

## Testing

### Local Testing:
```bash
# Build the project
npm run build

# Preview the build
npm run preview

# Test different routes
# - Open browser to http://localhost:4173
# - Navigate to different pages
# - Refresh the page (should not 404)
```

### Production Testing:
1. Deploy to Vercel
2. Navigate to any route (e.g., `/student/dashboard`)
3. Refresh the page
4. Should load correctly without 404

## Troubleshooting

### Issue: Still getting 404 on Vercel
**Solution**: 
- Make sure `vercel.json` is in the root of your frontend project
- Redeploy after adding `vercel.json`
- Clear Vercel cache if needed

### Issue: API calls failing
**Solution**:
- Check if `VITE_API_BASE_URL` environment variable is set correctly
- Verify backend URL is accessible
- Check browser console for CORS errors

### Issue: Environment variable not working
**Solution**:
- Environment variables must start with `VITE_` for Vite to expose them
- Restart dev server after changing `.env`
- Redeploy after changing environment variables in Vercel

## Next Steps

1. **Update Remaining Files**: 
   - Update all files listed in the search results
   - Use the migration pattern above

2. **Set Backend URL**:
   - For local: Use default or create `.env`
   - For Vercel: Add environment variable in dashboard

3. **Test Deployment**:
   - Push changes to GitHub
   - Ensure Vercel auto-deploys
   - Test all routes on Vercel URL

4. **Verify**:
   - All API calls work
   - No 404 errors when refreshing pages
   - Environment switching works

## Additional Resources

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Vercel Deployment Configuration](https://vercel.com/docs/project-configuration)
- [React Router on Vercel](https://vercel.com/guides/deploying-react-with-vercel)
