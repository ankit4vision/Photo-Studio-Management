# API Security Testing Guide

## Overview
This guide helps you test the separation between **Public APIs** (for website frontend) and **Admin APIs** (secured with authentication).

---

## 1. Testing Public APIs (Should Work Without Auth)

### Test URLs (No Authentication Required)
These should work without any token or login:

```
GET http://localhost:8000/api/website/slider
GET http://localhost:8000/api/website/services
GET http://localhost:8000/api/website/projects
GET http://localhost:8000/api/website/home-gallery
GET http://localhost:8000/api/website/testimonials
GET http://localhost:8000/api/website/gallery
GET http://localhost:8000/api/website/gallery-videos
GET http://localhost:8000/api/website/albums
```

### What to Check:
✅ **Should Return 200 OK** with data
✅ **No authentication error**
✅ **Response should contain active items only**

### Testing Methods:

#### Method 1: Browser (Easiest)
1. Open browser
2. Go to: `http://localhost:8000/api/website/slider`
3. Should see JSON response with slider data

#### Method 2: Postman/Thunder Client
1. Create GET request
2. URL: `http://localhost:8000/api/website/slider`
3. **Don't add any Authorization header**
4. Send request
5. Should get 200 OK with data

#### Method 3: cURL (Terminal)
```bash
curl http://localhost:8000/api/website/slider
```

---

## 2. Testing Admin APIs (Should Require Auth)

### Test URLs (Authentication Required)
These should **FAIL** without authentication:

```
GET http://localhost:8000/api/admin/website/slider
POST http://localhost:8000/api/admin/website/slider
PUT http://localhost:8000/api/admin/website/slider/1
DELETE http://localhost:8000/api/admin/website/slider/1
```

### What to Check:

#### Test 1: Without Token (Should Fail)
1. Make request **without Authorization header**
2. **Expected Result**: `401 Unauthorized` or `403 Forbidden`
3. **Error Message**: Should say authentication required

#### Test 2: With Invalid Token (Should Fail)
1. Add Authorization header: `Bearer invalid_token_here`
2. **Expected Result**: `401 Unauthorized`
3. **Error Message**: Should say token is invalid

#### Test 3: With Valid Token (Should Work)
1. Login first to get token
2. Add Authorization header: `Bearer YOUR_TOKEN_HERE`
3. **Expected Result**: `200 OK` with data (if user has permission)

### Testing Methods:

#### Method 1: Postman/Thunder Client

**Step 1: Get Auth Token**
```
POST http://localhost:8000/api/auth/login
Body (JSON):
{
  "email": "admin@example.com",
  "password": "password"
}

Response will have:
{
  "token": "1|xxxxxxxxxxxxx",
  "user": {...}
}
```

**Step 2: Test Admin API with Token**
```
GET http://localhost:8000/api/admin/website/slider
Headers:
  Authorization: Bearer 1|xxxxxxxxxxxxx
  Accept: application/json
```

**Step 3: Test Admin API without Token (Should Fail)**
```
GET http://localhost:8000/api/admin/website/slider
(No Authorization header)

Expected: 401 Unauthorized
```

#### Method 2: Browser Console (JavaScript)
```javascript
// Test Public API (should work)
fetch('http://localhost:8000/api/website/slider')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test Admin API without token (should fail)
fetch('http://localhost:8000/api/admin/website/slider')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
// Expected: 401 Unauthorized

// Test Admin API with token (should work)
fetch('http://localhost:8000/api/admin/website/slider', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN_HERE',
    'Accept': 'application/json'
  }
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

#### Method 3: cURL (Terminal)

**Test Public API:**
```bash
curl http://localhost:8000/api/website/slider
```

**Test Admin API without token (should fail):**
```bash
curl http://localhost:8000/api/admin/website/slider
# Expected: 401 Unauthorized
```

**Test Admin API with token:**
```bash
# First, get token (replace credentials)
TOKEN=$(curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  | jq -r '.token')

# Then use token
curl http://localhost:8000/api/admin/website/slider \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

---

## 3. Testing Permissions

### What to Check:
Even with valid token, user needs **specific permissions** to access admin routes.

### Permission Requirements:
- `view_website_slider` - to view sliders
- `create_website_slider` - to create slider
- `edit_website_slider` - to update slider
- `delete_website_slider` - to delete slider
- Similar for other modules (services, projects, etc.)

### Test Scenario:
1. Login with a user that **doesn't have** `view_website_slider` permission
2. Try to access: `GET /api/admin/website/slider`
3. **Expected Result**: `403 Forbidden` (even with valid token)

---

## 4. Complete Test Checklist

### ✅ Public APIs (No Auth)
- [ ] `/api/website/slider` - Returns 200 OK without token
- [ ] `/api/website/services` - Returns 200 OK without token
- [ ] `/api/website/projects` - Returns 200 OK without token
- [ ] `/api/website/home-gallery` - Returns 200 OK without token
- [ ] `/api/website/testimonials` - Returns 200 OK without token
- [ ] `/api/website/gallery` - Returns 200 OK without token
- [ ] `/api/website/gallery-videos` - Returns 200 OK without token
- [ ] `/api/website/albums` - Returns 200 OK without token

### ✅ Admin APIs (Auth Required)
- [ ] `/api/admin/website/slider` - Returns 401 without token
- [ ] `/api/admin/website/slider` - Returns 200 with valid token + permission
- [ ] `POST /api/admin/website/slider` - Returns 401 without token
- [ ] `POST /api/admin/website/slider` - Returns 201 with valid token + permission
- [ ] `PUT /api/admin/website/slider/1` - Returns 401 without token
- [ ] `DELETE /api/admin/website/slider/1` - Returns 401 without token

### ✅ Media Upload (Auth Required)
- [ ] `POST /api/admin/website/media/upload` - Returns 401 without token
- [ ] `POST /api/admin/website/media/upload` - Returns 200 with valid token + permission

---

## 5. Quick Test Script

Save this as `test-api-security.js` and run with Node.js:

```javascript
const BASE_URL = 'http://localhost:8000';

// Test Public API
async function testPublicAPI() {
  console.log('Testing Public API (no auth)...');
  try {
    const response = await fetch(`${BASE_URL}/api/website/slider`);
    const data = await response.json();
    console.log('✅ Public API works:', response.status, data.success);
  } catch (error) {
    console.error('❌ Public API failed:', error.message);
  }
}

// Test Admin API without token
async function testAdminAPIWithoutToken() {
  console.log('Testing Admin API without token...');
  try {
    const response = await fetch(`${BASE_URL}/api/admin/website/slider`);
    const data = await response.json();
    if (response.status === 401 || response.status === 403) {
      console.log('✅ Admin API correctly rejected:', response.status);
    } else {
      console.log('❌ Admin API should require auth but returned:', response.status);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Test Admin API with token
async function testAdminAPIWithToken() {
  console.log('Testing Admin API with token...');
  
  // First login
  const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@example.com', // Replace with your admin email
      password: 'password' // Replace with your admin password
    })
  });
  
  const loginData = await loginResponse.json();
  const token = loginData.token;
  
  if (!token) {
    console.log('❌ Login failed:', loginData);
    return;
  }
  
  // Then test admin API
  const response = await fetch(`${BASE_URL}/api/admin/website/slider`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  const data = await response.json();
  if (response.status === 200) {
    console.log('✅ Admin API works with token:', response.status);
  } else {
    console.log('❌ Admin API failed:', response.status, data);
  }
}

// Run tests
(async () => {
  await testPublicAPI();
  await testAdminAPIWithoutToken();
  await testAdminAPIWithToken();
})();
```

---

## 6. Expected Results Summary

| Endpoint | Without Token | With Invalid Token | With Valid Token + Permission |
|----------|---------------|-------------------|-------------------------------|
| `/api/website/slider` | ✅ 200 OK | ✅ 200 OK | ✅ 200 OK |
| `/api/admin/website/slider` | ❌ 401 Unauthorized | ❌ 401 Unauthorized | ✅ 200 OK |
| `POST /api/admin/website/slider` | ❌ 401 Unauthorized | ❌ 401 Unauthorized | ✅ 201 Created |
| `POST /api/admin/website/media/upload` | ❌ 401 Unauthorized | ❌ 401 Unauthorized | ✅ 200 OK |

---

## 7. Common Issues & Solutions

### Issue 1: Public API returns 401
**Solution**: Check routes file - public routes should be OUTSIDE `auth:sanctum` middleware group.

### Issue 2: Admin API works without token
**Solution**: Check routes file - admin routes should be INSIDE `auth:sanctum` middleware group.

### Issue 3: Admin API returns 403 even with valid token
**Solution**: User doesn't have required permission. Assign permission to user's role.

### Issue 4: CORS errors in browser
**Solution**: Check `config/cors.php` - ensure frontend URL is allowed.

---

## 8. Testing in Frontend

### Website Frontend (Public)
The website frontend should use public APIs:
```javascript
// In website_react
const response = await fetch('http://localhost:8000/api/website/slider');
// Should work without any token
```

### Admin Panel (Secured)
The admin panel should use admin APIs with token:
```javascript
// In admin panel
const response = await fetch('http://localhost:8000/api/admin/website/slider', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
});
// Requires authentication
```

---

## Notes
- Replace `localhost:8000` with your actual backend URL
- Replace `admin@example.com` with your actual admin credentials
- Make sure backend server is running
- Make sure database is seeded with test data

