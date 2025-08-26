# Fix Render Deployment Issue

## Problem
Your existing `Fullstack_med-1` service on Render is configured to run frontend commands (`npm run build && npx serve`) instead of backend commands. This is causing the deployment to fail.

## Solution

### Option 1: Update Existing Service (Recommended)

1. **Go to your Render Dashboard**
   - Visit: https://dashboard.render.com
   - Find your `Fullstack_med-1` service

2. **Update Service Settings**
   - Click on `Fullstack_med-1`
   - Go to **Settings** tab
   - Update the following:

   **Environment:** Change to `Python 3`
   
   **Build Command:** 
   ```
   pip install --upgrade pip && pip install -r codezilla_spider/backend/requirements.txt
   ```
   
   **Start Command:**
   ```
   cd codezilla_spider/backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1
   ```

3. **Add Environment Variables**
   - Go to **Environment** tab
   - Add these variables:
     - `PYTHONPATH`: `/opt/render/project/src/codezilla_spider/backend`
     - `OPENAI_API_KEY`: (your actual key)
     - `ELEVENLABS_API_KEY`: (your actual key)
     - `SESSION_SECRET`: (your secret)
     - `YOUTUBE_API_KEY`: (your actual key)
     - Database variables (if using external databases)

4. **Redeploy**
   - Go to **Manual Deploy** tab
   - Click **Deploy latest commit**

### Option 2: Create New Service (Alternative)

1. **Delete the old service**
   - Go to `Fullstack_med-1` settings
   - Scroll to bottom and click **Delete Service**

2. **Create new service using Blueprint**
   - Go to your Render dashboard
   - Click **New +** → **Blueprint**
   - Connect your GitHub repository
   - Render will automatically use the `render.yaml` configuration
   - This will create a new service called `fullstack-med-backend`

### Option 3: Manual Service Creation

1. **Create New Web Service**
   - Go to Render dashboard
   - Click **New +** → **Web Service**
   - Connect your GitHub repository

2. **Configure Service**
   - **Name**: `fullstack-med-backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install --upgrade pip && pip install -r codezilla_spider/backend/requirements.txt`
   - **Start Command**: `cd codezilla_spider/backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1`

3. **Add Environment Variables**
   - Same as Option 1

## Verification

After fixing, your service should:
- ✅ Build successfully (green checkmark)
- ✅ Start without errors
- ✅ Show logs like: "Uvicorn running on http://0.0.0.0:8000"
- ✅ Respond to health checks

## Next Steps

Once the backend is working:
1. Deploy frontend to Vercel
2. Update frontend API URL to point to your Render backend
3. Test the complete application

## Troubleshooting

If you still see errors:
1. Check the build logs for specific error messages
2. Verify all environment variables are set
3. Ensure the `codezilla_spider/backend/` directory structure is correct
4. Check that `main.py` exists in the backend directory
