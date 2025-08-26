# 🔧 White Screen Fix Guide

## ✅ **System Status - Both Servers Running**

- **✅ Backend API**: http://localhost:8002 (Working perfectly)
- **✅ Frontend**: http://localhost:3001 (Running)
- **✅ API Test**: Successful (promoter validation working)

## 🐛 **White Screen Issue - Common Causes & Solutions**

### **Step 1: Check Browser Console**
1. Open http://localhost:3001 in your browser
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for any **red error messages**

### **Step 2: Common White Screen Causes**

#### **Cause 1: JavaScript Errors**
- **Symptoms**: Red errors in console
- **Solution**: Check for TypeScript compilation errors

#### **Cause 2: Missing Dependencies**
- **Symptoms**: Module not found errors
- **Solution**: Run `npm install`

#### **Cause 3: React Component Errors**
- **Symptoms**: Component failed to render
- **Solution**: Check component imports

#### **Cause 4: Network Issues**
- **Symptoms**: API calls failing
- **Solution**: Verify backend is running

### **Step 3: Quick Fixes to Try**

#### **Fix 1: Clear Browser Cache**
1. Press **Ctrl + Shift + R** (hard refresh)
2. Or clear browser cache completely

#### **Fix 2: Check Network Tab**
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Refresh the page
4. Look for failed requests (red entries)

#### **Fix 3: Try Different Browser**
- Test in Chrome, Firefox, or Edge
- Sometimes browser extensions cause issues

#### **Fix 4: Check if Backend is Accessible**
1. Open: http://localhost:8002/health
2. Should show: `{"status": "healthy", ...}`

### **Step 4: Debug Steps**

#### **Step 4a: Test Basic Route**
1. Go to: http://localhost:3001/
2. Should show the main page

#### **Step 4b: Test GeneChain Route**
1. Go to: http://localhost:3001/genechain
2. Should show the Genetic Unified Page

#### **Step 4c: Check Console Logs**
Look for these debug messages:
```
handlePromoterUpload called with sequence: TATAAAATCGATCGATCG
Setting loading state to true
Validating sequence...
Preparing API request...
Calling API with request: {...}
```

### **Step 5: Manual API Test**

If frontend still shows white screen, test the API directly:

```bash
# Test health endpoint
curl http://localhost:8002/health

# Test promoter validation
curl -X POST http://localhost:8002/promoter/validate \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sequence=TATAAAATCGATCGATCG&patient_id=TEST001&analyst_id=TEST_ANALYST&user_role=Doctor"
```

### **Step 6: Restart Everything**

If nothing works:

1. **Stop all servers** (Ctrl+C in both terminals)
2. **Clear terminal**: `cls`
3. **Start backend**: `python backend/promoter_validation_api.py`
4. **Start frontend**: `npm run dev`
5. **Clear browser cache** and try again

### **Step 7: Check File Structure**

Make sure these files exist:
- ✅ `src/App.tsx`
- ✅ `src/main.tsx`
- ✅ `src/components/genechain-assist/UnifiedGeneChain.tsx`
- ✅ `src/services/promoterValidationService.ts`
- ✅ `backend/promoter_validation_api.py`

## 🎯 **Expected Behavior**

### **When Working Correctly:**
1. **Homepage**: http://localhost:3001/ shows main page
2. **GeneChain**: http://localhost:3001/genechain shows Genetic Unified Page
3. **Promoter Tab**: Click "Promoter Validation" in sidebar
4. **Button Test**: Click "Promoter Sequence" → "Run Promoter Analysis"

### **Successful API Response:**
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

If you're still seeing a white screen:

1. **Share the console errors** (F12 → Console tab)
2. **Share the network errors** (F12 → Network tab)
3. **Try a different browser**
4. **Check if you can access other routes** (like http://localhost:3001/dashboard)

## 📞 **Debug Information Needed**

When reporting the white screen issue, please include:
- Browser type and version
- Console error messages (screenshot or text)
- Network request failures
- Which URL you're trying to access
- Steps you followed

---

**🎯 The backend is working perfectly - let's get the frontend displaying correctly!**

