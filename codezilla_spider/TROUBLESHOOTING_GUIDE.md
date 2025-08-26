# Troubleshooting Guide - Run Promoter Analysis Button

## 🚀 System Status

✅ **Backend API**: Running on http://localhost:8002
✅ **Frontend**: Running on http://localhost:3001
✅ **API Health**: Working (tested successfully)
✅ **Promoter Validation**: Working (tested successfully)

## 🔧 How to Test the Run Promoter Analysis Button

### Step 1: Access the Application
1. Open your browser
2. Go to: http://localhost:3001
3. Navigate to "Promoter Validation" tab in the sidebar

### Step 2: Input a DNA Sequence
You have three options:

#### Option A: Use Sample Sequences
1. Click on "Promoter Sequence" button (contains TATA box)
2. This will automatically fill the text area with: `TATAAAATCGATCGATCG`

#### Option B: Paste Your Own Sequence
1. Click in the text area
2. Paste a DNA sequence (only A, T, C, G characters)
3. Example: `ATCGATCGATCGATCGATCG`

#### Option C: Upload FASTA File
1. Click "Choose File" in the upload section
2. Select a .fasta or .txt file with DNA sequence

### Step 3: Run the Analysis
1. Make sure you see green checkmarks in the "Pre-validation Check" section
2. Click the "Run Promoter Analysis" button
3. The button should show "Analyzing..." with a spinner
4. After a few seconds, it should switch to the "ML Prediction" tab

## 🐛 If the Button Doesn't Work

### Check 1: Button State
- **Button is grayed out**: Make sure you have entered a sequence
- **Button shows "Analyzing..."**: Wait for the process to complete
- **Button is clickable but nothing happens**: Check browser console

### Check 2: Browser Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for any error messages
4. You should see debug logs like:
   ```
   handlePromoterUpload called with sequence: TATAAAATCGATCGATCG
   Setting loading state to true
   Validating sequence...
   Preparing API request...
   Calling API with request: {...}
   ```

### Check 3: Network Tab
1. Open browser developer tools (F12)
2. Go to Network tab
3. Click "Run Promoter Analysis"
4. Look for a request to `http://localhost:8002/promoter/validate`
5. Check if the request succeeds (200 status)

### Check 4: Sequence Validation
Make sure your sequence:
- Contains only A, T, C, G characters
- Is at least 10 nucleotides long
- Shows green checkmarks in validation section

## 🔍 Common Issues and Solutions

### Issue 1: "Button is disabled"
**Solution**: Enter a valid DNA sequence (minimum 10 characters, only ATCG)

### Issue 2: "API Error" in console
**Solution**: 
1. Make sure backend is running: `python backend/promoter_validation_api.py`
2. Test API directly: `python test_api.py`

### Issue 3: "CORS Error" in console
**Solution**: The backend CORS is configured for localhost:3001, make sure you're using the correct URL

### Issue 4: "Network Error" in console
**Solution**: 
1. Check if backend is running on port 8002
2. Test with: `curl http://localhost:8002/health`

## 🧪 Manual API Testing

If the frontend button still doesn't work, you can test the API directly:

```bash
# Test health endpoint
curl http://localhost:8002/health

# Test promoter validation
curl -X POST http://localhost:8002/promoter/validate \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sequence=TATAAAATCGATCGATCG&patient_id=TEST001&analyst_id=TEST_ANALYST&user_role=Doctor"
```

## 📱 Expected Behavior

### When Button Works Correctly:
1. ✅ Button shows "Run Promoter Analysis"
2. ✅ Click button → shows "Analyzing..." with spinner
3. ✅ After 2-3 seconds → switches to "ML Prediction" tab
4. ✅ Shows prediction results (Promoter/Non-Promoter)
5. ✅ Shows confidence score (0-100%)
6. ✅ Shows detected motifs
7. ✅ Shows "Log Validation to Blockchain" button

### Sample Successful Response:
```json
{
  "prediction": "promoter",
  "probability": 0.61,
  "motifs_found": [
    {"name": "TATA Box", "found": true},
    {"name": "CAAT Box", "found": false}
  ]
}
```

## 🆘 Still Not Working?

If the button still doesn't work after following these steps:

1. **Check browser console** for specific error messages
2. **Test API directly** using the curl commands above
3. **Restart both servers**:
   ```bash
   # Restart backend
   python backend/promoter_validation_api.py
   
   # Restart frontend
   npm run dev
   ```
4. **Clear browser cache** and try again
5. **Try a different browser** (Chrome, Firefox, Edge)

## 📞 Debug Information

When reporting issues, please include:
- Browser type and version
- Console error messages
- Network request details
- Steps you followed
- Expected vs actual behavior

---

**🎯 The system is fully functional - let's get it working for you!**

