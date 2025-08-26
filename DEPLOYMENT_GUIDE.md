# 🚀 MedCHAIN HealthHub Deployment Guide

This guide will help you deploy your MedCHAIN HealthHub application to Render (backend) and Vercel (frontend).

## 📋 Prerequisites

- ✅ Node.js 18+ and npm
- ✅ Python 3.11+
- ✅ Git
- ✅ Render account (free tier available)
- ✅ Vercel account (free tier available)
- ✅ API keys for various services

## 🔑 Required API Keys

### Backend API Keys (Render Environment Variables)
```
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
SESSION_SECRET=your_session_secret
YOUTUBE_API_KEY=your_youtube_api_key
POSTGRES_HOST=your_postgres_host
POSTGRES_PORT=5432
POSTGRES_DB=medchain
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
MONGO_URI=your_mongo_uri
REDIS_HOST=your_redis_host
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
```

### Frontend API Keys (Vercel Environment Variables)
```
VITE_API_URL=https://your-backend-url.onrender.com
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## 🎯 Step-by-Step Deployment

### Step 1: Backend Deployment (Render)

1. **Go to Render Dashboard**
   - Visit [https://dashboard.render.com](https://dashboard.render.com)
   - Sign in or create an account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

3. **Configure the Service**
   - **Name**: `fullstack-med-backend`
   - **Environment**: `Python 3`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (use root)
   - **Build Command**: `pip install -r codezilla_spider/backend/requirements.txt`
   - **Start Command**: `cd codezilla_spider/backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Set Environment Variables**
   - In the Render dashboard, go to your service
   - Click "Environment" tab
   - Add all the backend API keys listed above
   - Click "Save Changes"

5. **Deploy**
   - Click "Create Web Service"
   - Wait for the build to complete (5-10 minutes)
   - Note your backend URL (e.g., `https://fullstack-med-backend.onrender.com`)

### Step 2: Frontend Deployment (Vercel)

1. **Go to Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in or create an account

2. **Create New Project**
   - Click "New Project"
   - Import your GitHub repository

3. **Configure the Project**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `codezilla_spider`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   - In the Vercel dashboard, go to your project
   - Click "Settings" → "Environment Variables"
   - Add all the frontend API keys listed above
   - **Important**: Set `VITE_API_URL` to your Render backend URL
   - Click "Save"

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (2-5 minutes)
   - Your frontend will be available at the provided URL

## 🔧 Post-Deployment Configuration

### 1. Update Google OAuth Settings

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to "APIs & Services" → "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add your Vercel domain to "Authorized JavaScript origins":
   ```
   https://your-app.vercel.app
   ```
5. Add redirect URIs:
   ```
   https://your-app.vercel.app/auth/callback
   https://your-app.vercel.app/signup
   https://your-app.vercel.app/login
   ```

### 2. Test Your Application

1. **Test Backend Health**
   - Visit: `https://your-backend-url.onrender.com/health`
   - Should return a health status

2. **Test Frontend**
   - Visit your Vercel URL
   - Test all major features:
     - User registration/login
     - AI medicine recommendations
     - Dashboard functionality
     - Mobile responsiveness

### 3. Monitor Performance

1. **Render Monitoring**
   - Check Render dashboard for backend performance
   - Monitor logs for any errors

2. **Vercel Analytics**
   - Enable Vercel Analytics for frontend monitoring
   - Check Core Web Vitals

## 🚨 Troubleshooting

### Common Issues

#### Backend Issues
- **Build fails**: Check Python version and dependencies
- **Environment variables not working**: Verify all variables are set in Render
- **Database connection errors**: Check database credentials and connectivity

#### Frontend Issues
- **Build fails**: Check Node.js version and dependencies
- **API calls failing**: Verify `VITE_API_URL` is correct
- **Authentication not working**: Check Firebase configuration and OAuth settings

#### Performance Issues
- **Slow loading**: Consider code splitting and optimization
- **Large bundle size**: Use dynamic imports for heavy components
- **API timeouts**: Check backend performance and database queries

### Debug Commands

```bash
# Test backend locally
cd codezilla_spider/backend
uvicorn main:app --reload --port 8000

# Test frontend locally
cd codezilla_spider
npm run dev

# Check build
npm run build

# Check types
npx tsc --noEmit
```

## 📱 Mobile Optimization

Your application is already optimized for mobile devices with:
- ✅ Responsive design
- ✅ Touch-friendly interfaces
- ✅ PWA capabilities
- ✅ Mobile-specific navigation
- ✅ Optimized images and assets

## 🔒 Security Checklist

- ✅ Environment variables properly configured
- ✅ API keys not exposed in code
- ✅ CORS properly configured
- ✅ Authentication working
- ✅ HTTPS enabled (automatic on Vercel/Render)
- ✅ Input validation implemented

## 📊 Performance Optimization

### Frontend
- ✅ Code splitting implemented
- ✅ Lazy loading for heavy components
- ✅ Optimized images and assets
- ✅ Efficient state management

### Backend
- ✅ Database connection pooling
- ✅ Caching implemented
- ✅ Efficient API endpoints
- ✅ Error handling

## 🎉 Success!

Once deployed, your MedCHAIN HealthHub will be available at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review Render and Vercel logs
3. Test locally to isolate issues
4. Check environment variables
5. Verify API keys and configurations

---

**Happy Deploying! 🚀**
