# Service Catalog Troubleshooting Guide

## 🔍 Debugging Steps

### 1. Check Browser Console
Open browser developer tools (F12) and check the Console tab for any error messages.

### 2. Check Network Tab
In the Network tab, look for:
- Request to `/api/services`
- Response status (should be 200)
- Response data structure

### 3. Check Backend Status
Ensure your backend is running:
```bash
cd FIX-BACKEND
npm run dev
```

You should see:
```
🚀 Server is running at http://localhost:3001
📊 Environment: development
🌐 CORS Origin: http://localhost:5173
```

### 4. Check Database
Run the seed script to ensure services exist:
```bash
cd FIX-BACKEND
npm run seed
```

You should see:
```
Connected to MongoDB
Cleared existing services
Successfully seeded 11 services
✅ Services seeded successfully!
```

### 5. Test API Directly
Test the API endpoint directly in your browser:
```
http://localhost:3001/api/services
```

You should see JSON response like:
```json
{
  "success": true,
  "message": "Services retrieved successfully.",
  "data": [
    {
      "_id": "...",
      "name": "Appliance Repair",
      "description": "...",
      "baseFee": 75,
      "imageUrl": "..."
    }
  ]
}
```

## 🐛 Common Issues & Solutions

### Issue 1: "Failed to load services" Error
**Symptoms**: Service catalog shows error message
**Causes**:
- Backend not running
- Database not seeded
- CORS issues
- Network connectivity

**Solutions**:
1. Start backend: `cd FIX-BACKEND && npm run dev`
2. Seed database: `npm run seed`
3. Check CORS configuration
4. Verify network connection

### Issue 2: Empty Service List
**Symptoms**: Loading spinner shows, then empty list
**Causes**:
- Database empty
- API response structure mismatch
- Data parsing error

**Solutions**:
1. Run seed script: `npm run seed`
2. Check console logs for API response
3. Verify data structure in browser console

### Issue 3: CORS Error
**Symptoms**: Network error in browser console
**Causes**:
- Frontend/backend port mismatch
- CORS not configured properly

**Solutions**:
1. Check backend CORS origin: `http://localhost:5173`
2. Verify frontend is running on port 5173
3. Check environment variables

### Issue 4: MongoDB Connection Error
**Symptoms**: Backend fails to start or seed
**Causes**:
- MongoDB not running
- Wrong connection string
- Network issues

**Solutions**:
1. Start MongoDB service
2. Check MONGODB_URI in .env file
3. Verify MongoDB is accessible

## 🔧 Debug Console Logs

The updated code includes debug logs. Check your browser console for:

1. **API Request Log**:
```
Fetching services from: http://localhost:3001/api/services
```

2. **API Response Log**:
```
Services API response: { success: true, data: [...], message: "..." }
```

3. **Component Data Log**:
```
Services Response: { success: true, data: [...], message: "..." }
Services Array: [...]
```

## 📋 Environment Checklist

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_TIMEOUT=10000
```

### Backend (.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/handyman-app
CORS_ORIGIN=http://localhost:5173
```

## 🚀 Quick Fix Commands

If you're still having issues, run these commands in order:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Start MongoDB (if not running)

# 3. Start Backend
cd FIX-BACKEND
npm run dev

# 4. In new terminal - Seed Database
cd FIX-BACKEND
npm run seed

# 5. In new terminal - Start Frontend
cd FIX-FRONTEND
npm run dev

# 6. Test API
curl http://localhost:3001/api/services

# 7. Open browser
http://localhost:5173/client/service-catalog
```

## 📞 Still Having Issues?

If the problem persists:

1. **Check all console logs** (browser and terminal)
2. **Verify all environment variables** are set correctly
3. **Test API endpoint directly** in browser
4. **Check MongoDB connection** and data
5. **Restart all services** (frontend, backend, database)

The debug logs will help identify exactly where the issue is occurring. 