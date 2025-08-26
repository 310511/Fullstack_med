# 🔧 White Screen Troubleshooting Guide

## ✅ **System Status - All Servers Running**

- **✅ Backend API**: http://localhost:8002 (Working perfectly)
- **✅ Frontend**: http://localhost:3001 (Running)
- **✅ Dependencies**: Installed successfully
- **✅ Build**: Successful (no TypeScript errors)

## 🐛 **White Screen Issue - Step by Step Fix**

### **Step 1: Browser Console Check (CRITICAL)**

1. **Open Browser**: Go to http://localhost:3001/
2. **Press F12**: Open Developer Tools
3. **Go to Console Tab**: Look for **red error messages**
4. **Share any errors** you see

### **Step 2: Network Tab Check**

1. **Press F12** → **Network** tab
2. **Refresh the page** (F5)
3. **Look for red entries** (failed requests)
4. **Check if any files failed to load**

### **Step 3: Clear Browser Cache**

#### **Method 1: Hard Refresh**
- Press **Ctrl + Shift + R** (Windows/Linux)
- Press **Cmd + Shift + R** (Mac)

#### **Method 2: Clear All Cache**
1. **Press F12** → **Application** tab
2. **Click "Clear storage"** → **Clear site data**
3. **Refresh the page**

#### **Method 3: Incognito/Private Mode**
- Open browser in **incognito/private mode**
- Go to http://localhost:3001/

### **Step 4: Try Different Browsers**

Test in these browsers:
- **Chrome**
- **Firefox**
- **Edge**
- **Safari**

### **Step 5: Check Specific URLs**

Try these URLs in order:

1. **Homepage**: http://localhost:3001/
2. **GeneChain**: http://localhost:3001/genechain
3. **Dashboard**: http://localhost:3001/dashboard
4. **API Health**: http://localhost:8002/health

### **Step 6: Common White Screen Causes**

#### **Cause 1: JavaScript Errors**
- **Symptoms**: Red errors in console
- **Solution**: Check console and fix errors

#### **Cause 2: Missing Dependencies**
- **Symptoms**: Module not found errors
- **Solution**: Run `npm install`

#### **Cause 3: React Component Errors**
- **Symptoms**: Component failed to render
- **Solution**: Check component imports

#### **Cause 4: Network Issues**
- **Symptoms**: API calls failing
- **Solution**: Verify backend is running

#### **Cause 5: Browser Extensions**
- **Symptoms**: Works in incognito mode
- **Solution**: Disable extensions temporarily

### **Step 7: Manual Debug Steps**

#### **Check if React is Loading**
1. **Press F12** → **Console**
2. **Type**: `React`
3. **Should show**: React object (not undefined)

#### **Check if Components are Loading**
1. **Press F12** → **Console**
2. **Look for**: Component error messages
3. **Check**: Import statements

#### **Check Network Requests**
1. **Press F12** → **Network**
2. **Filter by**: JS, CSS, HTML
3. **Look for**: 404 errors

### **Step 8: Emergency Fixes**

#### **Fix 1: Restart Everything**
```bash
# Stop all servers (Ctrl+C)
# Clear terminal
cls

# Restart backend
python backend/promoter_validation_api.py

# Restart frontend (new terminal)
npm run dev
```

#### **Fix 2: Clear Node Modules**
```bash
rm -rf node_modules
npm install
npm run dev
```

#### **Fix 3: Check Port Conflicts**
```bash
# Check what's using port 3001
netstat -ano | findstr :3001
```

### **Step 9: Debug Information Needed**

When reporting the white screen issue, please provide:

1. **Browser type and version**
2. **Console error messages** (screenshot or text)
3. **Network tab errors** (screenshot or text)
4. **Which URL you're trying to access**
5. **Steps you followed**

### **Step 10: Expected Behavior**

#### **When Working Correctly:**
1. **Homepage loads** with navigation menu
2. **GeneChain page** shows sidebar with "Promoter Validation" tab
3. **Promoter Validation tab** shows sequence input
4. **"Run Promoter Analysis" button** works

#### **Successful API Response:**
```json
{
  "prediction": "promoter",
  "probability": 0.61,
  "motifs_found": [
    {"name": "TATA Box", "found": true}
  ]
}
```

## 🆘 **Still White Screen?**

### **Quick Diagnostic Questions:**

1. **Can you access** http://localhost:8002/health ?
2. **What do you see** in browser console (F12)?
3. **Does it work** in incognito mode?
4. **What browser** are you using?
5. **Any error messages** in terminal?

### **Last Resort:**
If nothing works, please share:
- **Screenshot of browser console**
- **Screenshot of network tab**
- **Exact error messages**
- **Terminal output**

---

## 🎯 **Success Indicators:**

✅ **Backend**: `{"status": "healthy", "ml_models": "loaded"}`
✅ **Frontend**: Shows navigation menu
✅ **GeneChain**: Shows sidebar with tabs
✅ **Promoter Validation**: Shows sequence input
✅ **Button Test**: "Run Promoter Analysis" works

**The backend is working perfectly - let's get the frontend displaying correctly!** 🚀

