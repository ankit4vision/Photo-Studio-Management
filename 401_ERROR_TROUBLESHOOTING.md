# 🔧 401 Unauthorized Error - Troubleshooting Guide

**Error:** `Failed to load resource: the server responded with a status of 401 (Unauthorized)`

---

## 📋 **What This Error Means**

A **401 Unauthorized** error means:
- ✅ Backend server is **running and accessible**
- ❌ Backend server **rejected the login credentials**
- ❌ Authentication **failed** for the provided email/password

---

## 🔍 **Possible Causes**

### 1. **User Does Not Exist in Backend Database**
- The email `admin@example.com` might not be registered in the backend database
- Backend has a different user than the mock data

**Solution:**
- Check backend database for existing users
- Create user in backend with correct credentials
- Or use credentials that exist in backend

### 2. **Wrong Password**
- Password might be different in backend
- Backend might use hashed passwords

**Solution:**
- Verify password in backend database
- Check if password is hashed (bcrypt, etc.)
- Try password reset if available

### 3. **Backend API Format Mismatch**
- Backend expects different request format
- Backend returns different response format

**Solution:**
- Check backend API documentation
- Verify request body format matches backend expectations
- Check if backend expects different field names (e.g., `username` instead of `email`)

### 4. **CORS Issues**
- Backend might not allow requests from frontend origin
- CORS headers not configured properly

**Solution:**
- Check browser console for CORS errors
- Configure backend CORS settings
- Add frontend origin to allowed origins in backend

---

## 🛠️ **How to Debug**

### **Step 1: Check Browser Console**

Open browser console (F12) and look for:

```
[API Error] {
  url: "/auth/login",
  status: 401,
  data: {...},
  message: "..."
}

[401 Unauthorized] {
  endpoint: "/auth/login",
  baseURL: "http://52.62.1.66:8000",
  requestData: {...},
  responseData: {...}
}
```

### **Step 2: Check Network Tab**

1. Open **Developer Tools** (F12)
2. Go to **Network** tab
3. Try to login
4. Find the failed request (red status)
5. Check:
   - **Request URL:** Should be `http://52.62.1.66:8000/auth/login`
   - **Request Method:** Should be `POST`
   - **Request Payload:** Should contain `{ email: "...", password: "..." }`
   - **Response Status:** 401
   - **Response Body:** Check what backend returned

### **Step 3: Verify Backend is Running**

```bash
# Test if backend is accessible
curl http://52.62.1.66:8000/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"test123"}'
```

### **Step 4: Check Backend Database**

Check if user exists in backend:
- Connect to backend database
- Check `users` table
- Verify email and password hash

---

## 🔧 **Solutions**

### **Solution 1: Create User in Backend**

If backend is accessible, create a user:

```sql
-- Example SQL (adjust based on your backend schema)
INSERT INTO users (email, password, role, status) 
VALUES ('admin@example.com', 'hashed_password_here', 'admin', 'active');
```

Or use backend API to create user:
```bash
POST /users
{
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```

### **Solution 2: Use Existing Backend Credentials**

If backend has different users, use those credentials:

1. Check backend documentation
2. Ask backend developer for test credentials
3. Update login page with correct credentials

### **Solution 3: Use Mock Data for Development**

If backend is not ready, temporarily use mock data:

1. Modify `AuthContext.jsx`:
   ```javascript
   // Change from:
   const response = await authService.login({...})
   
   // To:
   const response = await apiService.login({...})
   ```

2. Import apiService:
   ```javascript
   import apiService from '../api'
   ```

### **Solution 4: Fix Backend API Format**

If backend expects different format:

**Update `authService.js`:**
```javascript
async login(credentials) {
  try {
    // Backend might expect different field names
    const response = await apiClient.post('/auth/login', {
      username: credentials.email,  // or email
      password: credentials.password
    })
    // ... rest of code
  }
}
```

---

## 📊 **Expected vs Actual**

### **Frontend Sends:**
```json
POST /auth/login
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### **Backend Should Return (Success):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin",
    ...
  }
}
```

### **Backend Returns (401 Error):**
```json
{
  "detail": "Invalid credentials"
}
// or
{
  "message": "Unauthorized"
}
// or
{
  "error": "Invalid email or password"
}
```

---

## ✅ **Quick Fixes**

### **Fix 1: Check Backend URL**

Make sure `.env.local` file exists with correct backend URL:

```env
VITE_API_BASE_URL=http://52.62.1.66:8000
```

### **Fix 2: Verify Credentials**

Try these common test credentials:
- `admin@example.com` / `admin123`
- `admin@admin.com` / `admin`
- `test@test.com` / `test123`

### **Fix 3: Test Backend Directly**

```bash
# Test with curl
curl -X POST http://52.62.1.66:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

---

## 📝 **Next Steps**

1. **Check browser console** for detailed error
2. **Check Network tab** for request/response details
3. **Verify backend is running** and accessible
4. **Check backend database** for user existence
5. **Contact backend developer** if backend format is different
6. **Use mock data** temporarily if backend is not ready

---

## 🔗 **Related Files**

- `admin/src/services/authService.js` - Authentication service
- `admin/src/context/AuthContext.jsx` - Auth context
- `admin/src/config/apiClient.js` - API client configuration
- `admin/src/pages/Auth/Login.jsx` - Login page
- `admin/src/api.js` - Mock API service (fallback option)

---

## 📞 **Support**

If issue persists:
1. Check browser console for detailed logs
2. Check Network tab for request details
3. Verify backend server status
4. Contact backend developer for API documentation

---

**Last Updated:** 2025-01-28

