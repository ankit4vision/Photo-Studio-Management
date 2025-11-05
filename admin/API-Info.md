# 📋 CoreUI React Template - API Information Document

## 🎯 **Project Overview**

This document provides comprehensive API information for the CoreUI React Template project, designed to help backend developers understand the required API endpoints, data structures, and functionality needed to integrate with the frontend application.

**Project Type:** Admin Dashboard Template  
**Frontend Framework:** React 18 + CoreUI  
**State Management:** React Context + Local State  
**API Integration:** RESTful APIs with Mock Data Support  

---

## 🏗️ **Module Structure & API Endpoints**

### **1. Authentication Module** 🔐

#### **Base Endpoint:** `/auth`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/auth/login` | User login | `{ email, password }` | `{ success, user, token }` |
| POST | `/auth/register` | User registration | `{ firstName, lastName, email, password, role }` | `{ success, user, token }` |
| POST | `/auth/logout` | User logout | `{}` | `{ success, message }` |
| POST | `/auth/refresh` | Refresh token | `{ refreshToken }` | `{ success, token }` |
| POST | `/auth/forgot-password` | Forgot password | `{ email }` | `{ success, message }` |
| POST | `/auth/reset-password` | Reset password | `{ token, password }` | `{ success, message }` |
| POST | `/auth/verify-email` | Email verification | `{ token }` | `{ success, message }` |
| PUT | `/auth/change-password` | Change password | `{ currentPassword, newPassword }` | `{ success, message }` |

#### **Authentication Data Structures:**

```json
// Login Request
{
  "email": "admin@example.com",
  "password": "admin123"
}

// Login Response
{
  "success": true,
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin",
    "permissions": ["user:read", "user:write", "user:delete"],
    "avatar": "https://ui-avatars.com/api/?name=Admin+User",
    "isActive": true,
    "department": "IT",
    "lastLogin": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here"
}

// User Registration Request
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "phone": "+1-555-0101",
  "department": "Sales"
}
```

---

### **2. User Management Module** 👥

#### **Base Endpoint:** `/users`

| Method | Endpoint | Description | Query Parameters | Request Body | Response |
|--------|----------|-------------|------------------|--------------|----------|
| GET | `/users` | Get all users | `page, limit, search, role, status, sortBy, sortOrder, department` | - | `{ success, data, pagination, filters }` |
| GET | `/users/{id}` | Get user by ID | - | - | `{ success, data }` |
| POST | `/users` | Create new user | - | User object | `{ success, data, message }` |
| PUT | `/users/{id}` | Update user | - | User object | `{ success, data, message }` |
| DELETE | `/users/{id}` | Delete user | - | - | `{ success, message }` |
| POST | `/users/bulk-delete` | Bulk delete users | - | `{ userIds: [] }` | `{ success, message }` |
| GET | `/users/export` | Export users | `format, filters` | - | File download |
| POST | `/users/import` | Import users | - | FormData with file | `{ success, data, message }` |
| POST | `/users/search` | Search users | - | `{ query, filters }` | `{ success, data }` |
| GET | `/users/profile` | Get current user profile | - | - | `{ success, data }` |
| PUT | `/users/profile` | Update current user profile | - | Profile object | `{ success, data, message }` |
| POST | `/users/avatar` | Upload user avatar | - | FormData with file | `{ success, data, message }` |
| DELETE | `/users/avatar` | Delete user avatar | - | - | `{ success, message }` |
| PATCH | `/users/{id}/status` | Change user status | - | `{ status: boolean }` | `{ success, message }` |
| POST | `/users/{id}/reset-password` | Reset user password | - | `{ password }` | `{ success, message }` |
| GET | `/users/{id}/activity-logs` | Get user activity logs | `page, limit, startDate, endDate` | - | `{ success, data }` |
| GET | `/users/stats` | Get user statistics | - | - | `{ success, data }` |

#### **User Data Structure:**

```json
// User Object
{
  "id": 1,
  "email": "admin@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "role": "admin",
  "permissions": [
    "user:read",
    "user:write",
    "user:delete",
    "role:read",
    "role:write",
    "role:delete",
    "dashboard:read",
    "dashboard:write"
  ],
  "avatar": "https://ui-avatars.com/api/?name=Admin+User&background=007bff&color=ffffff&size=40",
  "isActive": true,
  "phone": "+1-555-0101",
  "department": "IT",
  "lastLogin": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}

// User Creation/Update Request
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user",
  "phone": "+1-555-0101",
  "department": "Sales",
  "isActive": true
}

// User List Response with Pagination
{
  "success": true,
  "data": [
    // Array of user objects
  ],
  "total": 1247,
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalPages": 125,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### **3. Role Management Module** 🛡️

#### **Base Endpoint:** `/roles`

| Method | Endpoint | Description | Query Parameters | Request Body | Response |
|--------|----------|-------------|------------------|--------------|----------|
| GET | `/roles` | Get all roles | `page, limit, search, isActive, isDefault, sortBy, sortOrder` | - | `{ success, data, pagination, filters }` |
| GET | `/roles/{id}` | Get role by ID | - | `{ success, data }` |
| POST | `/roles` | Create new role | Role object | `{ success, data, message }` |
| PUT | `/roles/{id}` | Update role | Role object | `{ success, data, message }` |
| DELETE | `/roles/{id}` | Delete role | - | `{ success, message }` |
| GET | `/roles/permissions` | Get all permissions | - | `{ success, data }` |
| POST | `/roles/{id}/permissions` | Assign permissions to role | `{ permissions: [] }` | `{ success, message }` |
| GET | `/roles/{id}/users` | Get users with specific role | - | `{ success, data }` |

#### **Role Data Structure:**

```json
// Role Object
{
  "id": 1,
  "name": "Super Admin",
  "description": "Full system access with all permissions",
  "permissions": [
    "user:read",
    "user:write",
    "user:delete",
    "role:read",
    "role:write",
    "role:delete",
    "dashboard:read",
    "dashboard:write",
    "settings:access",
    "reports:read",
    "reports:write"
  ],
  "isActive": true,
  "isDefault": false,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}

// Role Creation/Update Request
{
  "name": "Manager",
  "description": "Management level access with limited permissions",
  "permissions": [
    "user:read",
    "user:write",
    "dashboard:read",
    "reports:read"
  ],
  "isActive": true,
  "isDefault": false
}

// Permission Object
{
  "id": "user:read",
  "label": "Read Users",
  "category": "User Management"
}
```

---

### **4. Category Management Module** 📁

#### **Base Endpoint:** `/categories`

| Method | Endpoint | Description | Query Parameters | Request Body | Response |
|--------|----------|-------------|------------------|--------------|----------|
| GET | `/categories` | Get all categories | `page, limit, search, isActive, sortBy, sortOrder` | - | `{ success, data, pagination, filters }` |
| GET | `/categories/{id}` | Get category by ID | - | `{ success, data }` |
| POST | `/categories` | Create new category | Category object | `{ success, data, message }` |
| PUT | `/categories/{id}` | Update category | Category object | `{ success, data, message }` |
| DELETE | `/categories/{id}` | Delete category | - | `{ success, message }` |

#### **Category Data Structure:**

```json
// Category Object
{
  "id": 1,
  "name": "Electronics",
  "description": "Electronic devices and gadgets",
  "isActive": true,
  "subCategories": [
    {
      "id": 1,
      "name": "Smartphones",
      "description": "Mobile phones and accessories",
      "isActive": true
    },
    {
      "id": 2,
      "name": "Laptops",
      "description": "Portable computers and accessories",
      "isActive": true
    }
  ],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}

// Category Creation/Update Request
{
  "name": "Electronics",
  "description": "Electronic devices and gadgets",
  "isActive": true
}
```

---

### **5. Sub-Category Management Module** 📂

#### **Base Endpoint:** `/subcategories`

| Method | Endpoint | Description | Query Parameters | Request Body | Response |
|--------|----------|-------------|------------------|--------------|----------|
| GET | `/subcategories` | Get all sub-categories | `page, limit, search, categoryId, isActive, sortBy, sortOrder` | - | `{ success, data, pagination, filters }` |
| GET | `/subcategories/{id}` | Get sub-category by ID | - | `{ success, data }` |
| GET | `/subcategories/category/{categoryId}` | Get sub-categories by category | `page, limit, search, isActive, sortBy, sortOrder` | - | `{ success, data, pagination, filters }` |
| POST | `/subcategories` | Create new sub-category | SubCategory object | `{ success, data, message }` |
| PUT | `/subcategories/{id}` | Update sub-category | SubCategory object | `{ success, data, message }` |
| DELETE | `/subcategories/{id}` | Delete sub-category | - | `{ success, message }` |

#### **Sub-Category Data Structure:**

```json
// Sub-Category Object
{
  "id": 1,
  "name": "Smartphones",
  "description": "Mobile phones and accessories",
  "categoryId": 1,
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}

// Sub-Category Creation/Update Request
{
  "name": "Smartphones",
  "description": "Mobile phones and accessories",
  "categoryId": 1,
  "isActive": true
}
```

---

### **6. Profile Management Module** 👤

#### **Base Endpoint:** `/users/profile`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/users/profile` | Get current user profile | - | `{ success, data }` |
| PUT | `/users/profile` | Update current user profile | Profile object | `{ success, data, message }` |
| PUT | `/users/profile/preferences` | Update user preferences | Preferences object | `{ success, data, message }` |
| GET | `/users/profile/activity` | Get user activity logs | Query params | `{ success, data }` |
| GET | `/users/profile/stats` | Get profile statistics | - | `{ success, data }` |
| GET | `/users/profile/export` | Export profile data | `format` query param | File download |

#### **Profile Data Structure:**

```json
// Profile Object
{
  "id": 1,
  "email": "admin@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "phone": "+1-555-0101",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "United States",
  "bio": "Experienced administrator with expertise in system management...",
  "dateOfBirth": "1985-06-15",
  "gender": "male",
  "avatar": "https://ui-avatars.com/api/?name=Admin+User&background=007bff&color=ffffff&size=200",
  "role": "admin",
  "permissions": [
    "user:read",
    "user:write",
    "user:delete",
    "role:read",
    "role:write",
    "role:delete",
    "dashboard:read",
    "dashboard:write",
    "profile:read",
    "profile:write"
  ],
  "isActive": true,
  "department": "IT",
  "lastLogin": "2024-01-15T10:30:00Z",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z",
  "preferences": {
    "theme": "light",
    "language": "en",
    "timezone": "America/New_York",
    "notifications": {
      "email": true,
      "push": true,
      "sms": false
    },
    "privacy": {
      "profileVisibility": "public",
      "showEmail": false,
      "showPhone": false
    }
  },
  "statistics": {
    "totalLogins": 156,
    "lastActivity": "2024-01-15T10:30:00Z",
    "profileViews": 23,
    "accountAge": "15 days"
  },
  "activityLogs": [
    {
      "id": 1,
      "activity": "profile_updated",
      "description": "Updated personal information",
      "timestamp": "2024-01-15T10:30:00Z",
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
  ]
}
```

---

### **7. Settings Management Module** ⚙️

#### **Base Endpoint:** `/settings`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/settings` | Get all settings | - | `{ success, data }` |
| PUT | `/settings/general` | Update general settings | General settings object | `{ success, data, message }` |
| PUT | `/settings/email` | Update email settings | Email settings object | `{ success, data, message }` |
| PUT | `/settings/aws` | Update AWS S3 settings | AWS settings object | `{ success, data, message }` |
| POST | `/settings/test-email` | Test email configuration | - | `{ success, message }` |
| POST | `/settings/test-aws` | Test AWS S3 configuration | - | `{ success, message }` |

#### **Settings Data Structure:**

```json
// Settings Object
{
  "general": {
    "appName": "Photo Studio Management App",
    "businessName": "Photo Studio Management",
    "businessAddress": "",
    "contactInfo": "",
    "email": "admin@photostudio.com",
    "theme": "light",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "email": {
    "smtpHost": "smtp.gmail.com",
    "smtpPort": "587",
    "smtpUsername": "noreply@photostudio.com",
    "smtpPassword": "encrypted_password_here",
    "fromEmail": "noreply@photostudio.com",
    "fromName": "Photo Studio Management App",
    "encryption": "tls",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "aws": {
    "accessKeyId": "AKIAIOSFODNN7EXAMPLE",
    "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    "bucketName": "photostudio-storage",
    "region": "us-east-1",
    "endpoint": "",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### **8. Dashboard Module** 📊

#### **Base Endpoint:** `/dashboard`

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/dashboard/stats` | Get dashboard statistics | `{ success, data }` |
| GET | `/dashboard/charts` | Get chart data | `{ success, data }` |
| GET | `/dashboard/activities` | Get recent activities | `{ success, data }` |
| GET | `/dashboard/quick-actions` | Get quick actions | `{ success, data }` |

#### **Dashboard Data Structure:**

```json
// Dashboard Stats
{
  "success": true,
  "data": {
    "totalUsers": 1247,
    "totalRevenue": 45678,
    "totalOrders": 892,
    "activeUsers": 856,
    "userGrowth": "+12%",
    "revenueGrowth": "+8%",
    "orderGrowth": "+15%",
    "activeUserGrowth": "+5%"
  }
}

// Chart Data
{
  "success": true,
  "data": {
    "labels": ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    "datasets": [
      {
        "label": "Users",
        "data": [65, 59, 80, 81, 56, 55],
        "borderColor": "rgb(75, 192, 192)",
        "backgroundColor": "rgba(75, 192, 192, 0.2)"
      }
    ]
  }
}

// Recent Activities
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user": "John Doe",
      "action": "Created new user",
      "timestamp": "2024-01-15T10:30:00Z",
      "type": "user_creation"
    },
    {
      "id": 2,
      "user": "Jane Smith",
      "action": "Updated profile",
      "timestamp": "2024-01-15T09:15:00Z",
      "type": "profile_update"
    }
  ]
}
```

---

## 📊 **Sorting & Pagination Standards**

### **Query Parameters for Listing APIs:**

All listing endpoints support the following standard query parameters:

| Parameter | Type | Description | Example | Default |
|-----------|------|-------------|---------|---------|
| `page` | integer | Page number (1-based) | `?page=2` | `1` |
| `limit` | integer | Items per page | `?limit=20` | `10` |
| `search` | string | Search term (searches across relevant fields) | `?search=john` | - |
| `sortBy` | string | Field to sort by | `?sortBy=firstName` | `createdAt` |
| `sortOrder` | string | Sort direction (`asc` or `desc`) | `?sortOrder=desc` | `desc` |

### **Sorting Support by Module:**

#### **Users API (`/users`)**
- **Sortable Fields:** `firstName`, `lastName`, `email`, `role`, `isActive`, `createdAt`, `updatedAt`, `lastLogin`
- **Default Sort:** `createdAt` DESC
- **Search Fields:** `firstName`, `lastName`, `email`, `phone`, `department`

#### **Roles API (`/roles`)**
- **Sortable Fields:** `name`, `description`, `isActive`, `isDefault`, `createdAt`, `updatedAt`
- **Default Sort:** `name` ASC
- **Search Fields:** `name`, `description`

#### **Categories API (`/categories`)**
- **Sortable Fields:** `name`, `description`, `isActive`, `createdAt`, `updatedAt`
- **Default Sort:** `name` ASC
- **Search Fields:** `name`, `description`

#### **Sub-Categories API (`/subcategories`)**
- **Sortable Fields:** `name`, `description`, `categoryId`, `isActive`, `createdAt`, `updatedAt`
- **Default Sort:** `name` ASC
- **Search Fields:** `name`, `description`

#### **Activity Logs API (`/users/{id}/activity-logs`)**
- **Sortable Fields:** `timestamp`, `activity`, `description`
- **Default Sort:** `timestamp` DESC
- **Search Fields:** `activity`, `description`

### **Pagination Response Format:**

```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 1247,
    "totalPages": 125,
    "hasNext": true,
    "hasPrev": false,
    "nextPage": 2,
    "prevPage": null
  },
  "filters": {
    "search": "john",
    "sortBy": "firstName",
    "sortOrder": "asc",
    "appliedFilters": {
      "role": "user",
      "status": "active"
    }
  },
  "message": "Data fetched successfully"
}
```

### **Advanced Filtering Examples:**

#### **Users with Advanced Filters:**
```
GET /users?page=1&limit=20&search=john&role=user&status=active&sortBy=lastLogin&sortOrder=desc
```

#### **Categories with Status Filter:**
```
GET /categories?page=1&limit=15&isActive=true&sortBy=name&sortOrder=asc
```

#### **Sub-Categories by Category:**
```
GET /subcategories?categoryId=1&page=1&limit=10&sortBy=name&sortOrder=asc
```

#### **Activity Logs with Date Range:**
```
GET /users/1/activity-logs?page=1&limit=25&startDate=2024-01-01&endDate=2024-01-31&sortBy=timestamp&sortOrder=desc
```

### **Search Implementation:**

- **Text Search:** Case-insensitive partial matching
- **Multiple Fields:** Search across multiple relevant fields simultaneously
- **Special Characters:** Handle special characters and spaces properly
- **Performance:** Consider implementing full-text search for large datasets

### **Backend Implementation Guidelines:**

1. **Default Values:** Always provide sensible defaults for pagination
2. **Max Limits:** Implement maximum page size limits (e.g., max 100 items per page)
3. **Validation:** Validate sort fields against allowed fields list
4. **Indexing:** Ensure database indexes on commonly sorted fields
5. **Performance:** Use efficient pagination techniques (offset/limit or cursor-based)

---

## 🔐 **Permission System**

### **Available Permissions:**

```javascript
const PERMISSIONS = {
  // User Management
  USER_READ: 'user:read',
  USER_WRITE: 'user:write',
  USER_DELETE: 'user:delete',
  USER_MANAGE: 'user:manage',

  // Role Management
  ROLE_READ: 'role:read',
  ROLE_WRITE: 'role:write',
  ROLE_DELETE: 'role:delete',
  ROLE_MANAGE: 'role:manage',

  // Dashboard
  DASHBOARD_READ: 'dashboard:read',
  DASHBOARD_WRITE: 'dashboard:write',

  // Reports
  REPORT_READ: 'report:read',
  REPORT_EXPORT: 'report:export',

  // Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',

  // Profile
  PROFILE_READ: 'profile:read',
  PROFILE_WRITE: 'profile:write',

  // Admin
  ADMIN_ACCESS: 'admin:access',
  SYSTEM_CONFIG: 'system:config'
}
```

### **Role-Permission Mapping:**

```javascript
const ROLE_PERMISSIONS = {
  'super_admin': [
    // All permissions
    ...Object.values(PERMISSIONS)
  ],
  'admin': [
    'user:read', 'user:write', 'user:delete',
    'role:read', 'role:write',
    'dashboard:read', 'dashboard:write',
    'report:read', 'report:export',
    'settings:read', 'settings:write',
    'profile:read', 'profile:write'
  ],
  'manager': [
    'user:read', 'user:write',
    'dashboard:read', 'dashboard:write',
    'report:read', 'report:export',
    'profile:read', 'profile:write'
  ],
  'user': [
    'dashboard:read',
    'profile:read', 'profile:write'
  ],
  'guest': [
    'dashboard:read'
  ]
}
```

---

## 📝 **API Response Standards**

### **Standard Response Format:**

```json
// Success Response
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check your input and try again",
    "details": {
      "email": "Email is required",
      "password": "Password must be at least 6 characters"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}

// Paginated Response
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 1247,
    "totalPages": 125,
    "hasNext": true,
    "hasPrev": false
  },
  "message": "Data fetched successfully"
}
```

### **HTTP Status Codes:**

| Code | Description | Usage |
|------|-------------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request data |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists |
| 422 | Validation Error | Invalid input data |
| 500 | Internal Server Error | Server error |

---

## 🔧 **File Upload Configuration**

### **Supported File Types:**

```javascript
const FILE_UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  },
  MAX_FILES: 5
}
```

### **File Upload Endpoints:**

| Method | Endpoint | Description | Content-Type |
|--------|----------|-------------|--------------|
| POST | `/files/upload` | Upload single file | `multipart/form-data` |
| POST | `/users/avatar` | Upload user avatar | `multipart/form-data` |
| POST | `/users/import` | Import users from file | `multipart/form-data` |

---

## 🚀 **Implementation Guidelines**

### **1. Authentication Flow:**

1. **Login:** POST `/auth/login` with credentials
2. **Token Storage:** Store JWT token in localStorage
3. **API Requests:** Include `Authorization: Bearer {token}` header
4. **Token Refresh:** Use refresh token when access token expires
5. **Logout:** Clear tokens and call `/auth/logout`

### **2. Permission-Based Access:**

1. **Check Permissions:** Verify user permissions before API calls
2. **Role Validation:** Ensure user has required role for operations
3. **Route Protection:** Implement middleware for protected routes
4. **UI Rendering:** Show/hide UI elements based on permissions

### **3. Error Handling:**

1. **Standard Errors:** Use consistent error response format
2. **Validation Errors:** Return detailed field-level errors
3. **Authentication Errors:** Handle 401/403 responses
4. **Network Errors:** Implement retry logic for failed requests

### **4. Data Validation:**

1. **Input Validation:** Validate all request data on backend
2. **Type Checking:** Ensure correct data types
3. **Required Fields:** Check for required fields
4. **Format Validation:** Validate email, phone, date formats

---

## 📋 **Required Backend Features**

### **Core Features:**
- ✅ JWT Authentication with refresh tokens
- ✅ Role-based access control (RBAC)
- ✅ User management with CRUD operations
- ✅ Role and permission management
- ✅ Profile management with file uploads
- ✅ Settings management
- ✅ Dashboard statistics and analytics
- ✅ Activity logging and audit trails
- ✅ File upload and management
- ✅ Data export/import functionality

### **Security Features:**
- ✅ Password hashing and validation
- ✅ Input sanitization and validation
- ✅ SQL injection prevention
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Request logging
- ✅ Error handling and logging

### **Performance Features:**
- ✅ Database indexing
- ✅ Query optimization
- ✅ Caching strategies
- ✅ Pagination for large datasets
- ✅ File compression
- ✅ API response optimization

---

## 🔗 **Integration Notes**

### **Frontend-Backend Integration:**

1. **API Base URL:** Configure `config.js` with backend URL
2. **CORS:** Enable CORS for frontend domain
3. **Authentication:** Implement JWT token handling
4. **Error Handling:** Use consistent error response format
5. **File Uploads:** Support multipart/form-data uploads
6. **Real-time Updates:** Consider WebSocket integration for live updates

### **Database Schema Recommendations:**

1. **Users Table:** Store user information with role relationships
2. **Roles Table:** Store role definitions and permissions
3. **Permissions Table:** Store available permissions
4. **Categories/SubCategories:** Hierarchical category structure
5. **Settings Table:** Store application settings
6. **Activity Logs:** Track user activities and system events
7. **File Storage:** Store file metadata and references

---

## 📞 **Support & Documentation**

For additional support or questions about the API integration:

- **Project Repository:** [CoreUI React Template]
- **Documentation:** Check `PROJECT_STRUCTURE.md` for detailed project structure
- **Mock Data:** Reference mock data files in `/src/mock/` directory
- **Service Examples:** Check service files in `/src/services/` directory

---

**Last Updated:** January 2024  
**Version:** 1.0.0  
**Compatibility:** React 18+, CoreUI 4+
