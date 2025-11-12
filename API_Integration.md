# API Integration Documentation - Photo Studio Management

## 📋 Table of Contents
1. [Overview](#overview)
2. [Authentication APIs](#authentication-apis)
3. [User Management APIs](#user-management-apis)
4. [Role Management APIs](#role-management-apis)
5. [Permission Management APIs](#permission-management-apis)
6. [Branch Management APIs](#branch-management-apis)
7. [Settings Management APIs](#settings-management-apis)
8. [API Response Format](#api-response-format)
9. [Error Handling](#error-handling)
10. [Frontend Integration Points](#frontend-integration-points)

---

## 🔍 Overview

यह document Photo Studio Management system में सभी API endpoints और उनके frontend integration points को document करता है।

### API Base URL
- **Development**: `http://localhost:8000/api`
- **Production**: Environment variable से configure होता है

### Authentication
- सभी protected routes के लिए `Authorization: Bearer {token}` header required है
- Token `localStorage` में `access_token` key में store होता है

---

## 🔐 Authentication APIs

### 1. **POST /api/auth/login**
**Description**: User login करने के लिए

**Backend Controller**: `AuthController@login`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com",
    "roles": [...],
    "permissions": [...]
  },
  "permissions": [...],
  "permissionsByModule": {...}
}
```

**Frontend Integration**:
- **Service**: `src/services/authService.js`
- **Method**: `authService.login(credentials)`
- **Used In**:
  - `src/pages/Auth/Login.jsx` - Login page में form submit पर
  - `src/context/AuthContext.jsx` - Authentication context में login function

**Usage Example**:
```javascript
import authService from '../services/authService'

const handleLogin = async (email, password) => {
  const result = await authService.login({ email, password })
  if (result.success) {
    // Token और user localStorage में save हो जाता है
    navigate('/dashboard')
  }
}
```

---

### 2. **POST /api/auth/logout**
**Description**: User logout करने के लिए

**Backend Controller**: `AuthController@logout`

**Request**: No body required (token header से automatically detect होता है)

**Response**:
```json
{
  "message": "Logged out successfully"
}
```

**Frontend Integration**:
- **Service**: `src/services/authService.js`
- **Method**: `authService.logout()`
- **Used In**:
  - `src/context/AuthContext.jsx` - Logout function में
  - `src/components/layout/header/AppHeaderDropdown.jsx` - Header dropdown में logout button

**Usage Example**:
```javascript
import authService from '../services/authService'

const handleLogout = async () => {
  await authService.logout()
  // localStorage clear हो जाता है
  navigate('/login')
}
```

---

### 3. **GET /api/auth/user**
**Description**: Current authenticated user की information fetch करने के लिए

**Backend Controller**: `AuthController@user`

**Response**:
```json
{
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "user@example.com",
    "roles": [...],
    "permissions": [...]
  },
  "permissions": [...],
  "permissionsByModule": {...}
}
```

**Frontend Integration**:
- **Service**: `src/services/authService.js`
- **Method**: `authService.fetchCurrentUser()`
- **Used In**:
  - `src/context/AuthContext.jsx` - App load पर user fetch करने के लिए
  - `src/layout/PrivateRoute.jsx` - Route protection में user verify करने के लिए

**Usage Example**:
```javascript
import authService from '../services/authService'

const fetchUser = async () => {
  const result = await authService.fetchCurrentUser()
  if (result.success) {
    setUser(result.data)
  }
}
```

---

### 4. **POST /api/auth/forgot-password**
**Description**: Password reset email भेजने के लिए (uses database email settings and web_url from App Settings)

**Backend Controller**: `AuthController@forgotPassword`

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password reset link has been sent to your email address."
}
```

**Backend Implementation**:
- Uses `web_url` from "App Settings" section for reset password link
- Fallback to `config('app.frontend_url')` if setting not found
- Final fallback to `http://localhost:5173` for development
- Reset URL format: `{web_url}/#/reset-password?token={token}&email={email}`

**Frontend Integration**:
- **Service**: `src/services/authService.js`
- **Method**: `authService.forgotPassword(email)`
- **Used In**:
  - `src/pages/Auth/ForgotPassword.jsx` - Forgot password page में

**Usage Example**:
```javascript
import authService from '../services/authService'

const handleForgotPassword = async (email) => {
  const result = await authService.forgotPassword(email)
  if (result.success) {
    toast.success('Password reset email sent')
  }
}
```

---

### 5. **POST /api/auth/reset-password**
**Description**: Password reset करने के लिए (token के साथ)

**Backend Controller**: `AuthController@resetPassword`

**Request Body**:
```json
{
  "token": "reset_token_here",
  "email": "user@example.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password has been reset successfully."
}
```

**Frontend Integration**:
- **Service**: `src/services/authService.js`
- **Method**: `authService.resetPassword(data)`
- **Used In**:
  - `src/pages/Auth/ResetPassword.jsx` - Reset password page में

---

### 6. **PUT /api/auth/change-password**
**Description**: Authenticated user का password change करने के लिए

**Backend Controller**: `AuthController@changePassword`

**Request Body**:
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123",
  "new_password_confirmation": "newpassword123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Frontend Integration**:
- **Service**: `src/services/profileService.js`
- **Method**: `profileService.changePassword(passwordData)`
- **Used In**:
  - `src/views/users/Profile.jsx` - Profile page में change password modal

---

## 👥 User Management APIs

### 1. **GET /api/users**
**Description**: Users की list fetch करने के लिए (paginated, sortable)

**Backend Controller**: `UserController@index`

**Query Parameters**:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `search` - Search term (name, email में search)
- `status` - Filter by status (active/inactive)
- `role` - Filter by role
- `sort_by` - Sort column (name, email, created_at)
- `sort_direction` - Sort direction (asc/desc)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "status": "active",
      "roles": [...],
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false,
    "sortBy": "created_at",
    "sortDirection": "desc"
  }
}
```

**Permission Required**: `view_user`

**Frontend Integration**:
- **Service**: `src/services/userService.js`
- **Method**: `userService.getUsers(params)`
- **Used In**:
  - `src/views/users/UsersList.jsx` - Users list page में table data load करने के लिए

**Usage Example**:
```javascript
import userService from '../services/userService'

const loadUsers = async (page, limit, search, sortBy, sortDirection) => {
  const result = await userService.getUsers({
    page,
    limit,
    search,
    sortBy,
    sortDirection
  })
  
  if (result.success) {
    setUsers(result.data)
    setMeta(result.meta)
  }
}
```

---

### 2. **GET /api/users/{user}**
**Description**: Specific user की details fetch करने के लिए

**Backend Controller**: `UserController@show`

**Response**:
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "status": "active",
  "roles": [...],
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

**Permission Required**: `view_user`

**Frontend Integration**:
- **Service**: `src/services/userService.js` (indirectly through getUsers)
- **Used In**:
  - User details modal में
  - Edit user form में data pre-fill करने के लिए

---

### 3. **POST /api/users**
**Description**: New user create करने के लिए

**Backend Controller**: `UserController@store`

**Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "status": "active",
  "roles": [1, 2]
}
```

**Response**:
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "status": "active",
  "roles": [...],
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

**Permission Required**: `create_user`

**Frontend Integration**:
- **Service**: `src/services/userService.js`
- **Method**: `userService.createUser(userData)`
- **Used In**:
  - `src/components/pages/users/UserForm.jsx` - Create user form में
  - `src/views/users/UsersList.jsx` - Add user button click पर

**Usage Example**:
```javascript
import userService from '../services/userService'

const handleCreateUser = async (formData) => {
  const result = await userService.createUser({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
    roleId: formData.roleId
  })
  
  if (result.success) {
    toast.success('User created successfully')
    // Refresh users list
  }
}
```

---

### 4. **PUT /api/users/{user}**
**Description**: Existing user update करने के लिए

**Backend Controller**: `UserController@update`

**Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "status": "active",
  "roles": [1, 2]
}
```

**Response**:
```json
{
  "id": 1,
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "status": "active",
  "roles": [...],
  "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

**Permission Required**: `edit_user`

**Frontend Integration**:
- **Service**: `src/services/userService.js`
- **Method**: `userService.updateUser(userId, userData)`
- **Used In**:
  - `src/components/pages/users/UserForm.jsx` - Edit user form में
  - `src/views/users/UsersList.jsx` - Edit user button click पर

**Usage Example**:
```javascript
import userService from '../services/userService'

const handleUpdateUser = async (userId, formData) => {
  const result = await userService.updateUser(userId, {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    roleId: formData.roleId
  })
  
  if (result.success) {
    toast.success('User updated successfully')
    // Refresh users list
  }
}
```

---

### 5. **DELETE /api/users/{user}**
**Description**: User delete करने के लिए

**Backend Controller**: `UserController@destroy`

**Response**:
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Permission Required**: `delete_user`

**Frontend Integration**:
- **Service**: `src/services/userService.js`
- **Method**: `userService.deleteUser(userId)`
- **Used In**:
  - `src/views/users/UsersList.jsx` - Delete user button click पर

**Usage Example**:
```javascript
import userService from '../services/userService'

const handleDeleteUser = async (userId) => {
  if (window.confirm('Are you sure you want to delete this user?')) {
    const result = await userService.deleteUser(userId)
    if (result.success) {
      toast.success('User deleted successfully')
      // Refresh users list
    }
  }
}
```

---

### 6. **GET /api/users/profile**
**Description**: Current authenticated user की profile fetch करने के लिए

**Backend Controller**: `UserController@profile`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip_code": "10001",
    "country": "USA",
    "bio": "User bio",
    "date_of_birth": "1990-01-01",
    "gender": "male",
    "avatar": "avatars/user_1_1234567890.jpeg",
    "avatar_url": "http://localhost:8000/storage/avatars/user_1_1234567890.jpeg"
  }
}
```

**Frontend Integration**:
- **Service**: `src/services/profileService.js`
- **Method**: `profileService.getProfile()`
- **Used In**:
  - `src/views/users/Profile.jsx` - Profile page में data load करने के लिए

---

### 7. **PUT /api/users/profile**
**Description**: Current authenticated user की profile update करने के लिए

**Backend Controller**: `UserController@updateProfile`

**Request Body**:
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip_code": "10001",
  "country": "USA",
  "bio": "User bio",
  "date_of_birth": "1990-01-01",
  "gender": "male",
  "avatar": "data:image/jpeg;base64,..."
}
```

**Response**:
```json
{
  "success": true,
  "data": {...},
  "message": "Profile updated successfully"
}
```

**Frontend Integration**:
- **Service**: `src/services/profileService.js`
- **Method**: `profileService.updateProfile(profileData)`
- **Used In**:
  - `src/views/users/Profile.jsx` - Profile update करने के लिए
  - `src/components/pages/users/PersonalInfoSection.jsx` - Personal info save
  - `src/components/pages/users/AddressSection.jsx` - Address save
  - `src/components/pages/users/ProfilePictureSection.jsx` - Avatar upload

**Note**: Avatar base64 format में send होता है, backend automatically local storage में save करता है

---

## 🎭 Role Management APIs

### 1. **GET /api/roles**
**Description**: Roles की list fetch करने के लिए (paginated, sortable)

**Backend Controller**: `RoleController@index`

**Query Parameters**:
- `page` - Page number
- `limit` - Items per page
- `search` - Search term
- `active` - Filter by active status (true/false)
- `sort_by` - Sort column
- `sort_direction` - Sort direction

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "admin",
      "description": "Administrator role",
      "is_active": true,
      "permissions": [...],
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false,
    "sortBy": "created_at",
    "sortDirection": "desc"
  }
}
```

**Permission Required**: `view_role`

**Frontend Integration**:
- **Service**: `src/services/roleService.js`
- **Method**: `roleService.getRoles(params)`
- **Used In**:
  - `src/views/roles/RolesList.jsx` - Roles list page में

**Usage Example**:
```javascript
import roleService from '../services/roleService'

const loadRoles = async () => {
  const result = await roleService.getRoles({
    page: 1,
    limit: 20
  })
  
  if (result.success) {
    setRoles(result.data)
  }
}
```

---

### 2. **GET /api/roles/{role}**
**Description**: Specific role की details fetch करने के लिए

**Backend Controller**: `RoleController@show`

**Response**:
```json
{
  "id": 1,
  "name": "admin",
  "description": "Administrator role",
  "is_active": true,
  "permissions": [
    {
      "id": 1,
      "name": "view_user",
      "description": "View users",
      "module": "users",
      "submodule": "management"
    }
  ],
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

**Permission Required**: `view_role`

**Frontend Integration**:
- **Service**: `src/services/roleService.js`
- **Method**: `roleService.getRoleById(id)`
- **Used In**:
  - `src/components/pages/roles/RoleForm.jsx` - Edit role form में data load करने के लिए

---

### 3. **POST /api/roles**
**Description**: New role create करने के लिए

**Backend Controller**: `RoleController@store`

**Request Body**:
```json
{
  "name": "manager",
  "description": "Manager role",
  "is_active": true,
  "permissions": [1, 2, 3]
}
```

**Response**:
```json
{
  "id": 2,
  "name": "manager",
  "description": "Manager role",
  "is_active": true,
  "permissions": [...],
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

**Permission Required**: `create_role`

**Frontend Integration**:
- **Service**: `src/services/roleService.js`
- **Method**: `roleService.createRole(roleData)`
- **Used In**:
  - `src/components/pages/roles/RoleForm.jsx` - Create role form में

**Usage Example**:
```javascript
import roleService from '../services/roleService'

const handleCreateRole = async (formData) => {
  const result = await roleService.createRole({
    name: formData.name,
    description: formData.description,
    isActive: formData.isActive,
    permissions: formData.permissions // Array of permission IDs
  })
  
  if (result.success) {
    toast.success('Role created successfully')
  }
}
```

---

### 4. **PUT /api/roles/{role}**
**Description**: Existing role update करने के लिए

**Backend Controller**: `RoleController@update`

**Request Body**:
```json
{
  "name": "manager",
  "description": "Updated manager role",
  "is_active": true
}
```

**Response**:
```json
{
  "id": 2,
  "name": "manager",
  "description": "Updated manager role",
  "is_active": true,
  "permissions": [...],
  "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

**Permission Required**: `edit_role`

**Frontend Integration**:
- **Service**: `src/services/roleService.js`
- **Method**: `roleService.updateRole(roleId, roleData)`
- **Used In**:
  - `src/components/pages/roles/RoleForm.jsx` - Edit role form में

---

### 5. **PUT /api/roles/{role}/permissions**
**Description**: Role के permissions update करने के लिए

**Backend Controller**: `RoleController@updatePermissions`

**Request Body**:
```json
{
  "permissions": [1, 2, 3, 4, 5]
}
```

**Response**:
```json
{
  "id": 2,
  "name": "manager",
  "permissions": [
    {
      "id": 1,
      "name": "view_user",
      "description": "View users"
    }
  ]
}
```

**Permission Required**: `edit_role`

**Frontend Integration**:
- **Service**: `src/services/roleService.js`
- **Method**: `roleService.updateRolePermissions(roleId, permissions)`
- **Used In**:
  - `src/components/pages/roles/RoleForm.jsx` - Role form में permissions assign करने के लिए

**Usage Example**:
```javascript
import roleService from '../services/roleService'

const handleUpdatePermissions = async (roleId, selectedPermissions) => {
  const result = await roleService.updateRolePermissions(
    roleId,
    selectedPermissions // Array of permission IDs
  )
  
  if (result.success) {
    toast.success('Permissions updated successfully')
  }
}
```

---

### 6. **DELETE /api/roles/{role}**
**Description**: Role delete करने के लिए (soft delete)

**Backend Controller**: `RoleController@destroy`

**Response**:
```json
{
  "success": true,
  "message": "Role deleted successfully"
}
```

**Permission Required**: `delete_role`

**Frontend Integration**:
- **Service**: `src/services/roleService.js`
- **Method**: `roleService.deleteRole(roleId)`
- **Used In**:
  - `src/views/roles/RolesList.jsx` - Delete role button click पर

---

## 🔑 Permission Management APIs

### 1. **GET /api/permissions**
**Description**: Permissions की list fetch करने के लिए

**Backend Controller**: `PermissionController@index`

**Query Parameters**:
- `module` - Filter by module
- `submodule` - Filter by submodule
- `active` - Filter by active status
- `group_by_module` - Group permissions by module (1/0)
- `page` - Page number
- `limit` - Items per page
- `search` - Search term
- `sort_by` - Sort column
- `sort_direction` - Sort direction

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "view_user",
      "description": "View users",
      "module": "users",
      "submodule": "management",
      "type": "read",
      "is_active": true
    }
  ],
  "meta": {...}
}
```

**Permission Required**: `view_permission`

**Frontend Integration**:
- **Service**: `src/services/permissionService.js`
- **Method**: `permissionService.getPermissions(options)`
- **Used In**:
  - `src/components/pages/roles/RoleForm.jsx` - Role form में permissions list load करने के लिए
  - Permission management UI में

**Usage Example**:
```javascript
import permissionService from '../services/permissionService'

const loadPermissions = async () => {
  const result = await permissionService.getPermissions({
    groupByModule: true, // Group by module
    active: true // Only active permissions
  })
  
  if (result.success) {
    setPermissions(result.data)
    setGroupedPermissions(result.grouped)
  }
}
```

---

### 2. **GET /api/permissions/{permission}**
**Description**: Specific permission की details fetch करने के लिए

**Backend Controller**: `PermissionController@show`

**Response**:
```json
{
  "id": 1,
  "name": "view_user",
  "description": "View users",
  "module": "users",
  "submodule": "management",
  "type": "read",
  "is_active": true
}
```

**Permission Required**: `view_permission`

**Frontend Integration**:
- **Service**: `src/services/permissionService.js` (indirectly)
- **Used In**: Permission details view में

---

## 🏢 Branch Management APIs

### 1. **GET /api/branches**
**Description**: Branches की list fetch करने के लिए (paginated, sortable)

**Backend Controller**: `BranchController@index`

**Query Parameters**:
- `page` - Page number
- `limit` - Items per page
- `search` - Search term
- `status` - Filter by status
- `city` - Filter by city
- `sort_by` - Sort column
- `sort_direction` - Sort direction

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "branch_name": "Main Branch",
      "branch_code": "MB001",
      "address": "123 Main St",
      "city": "New York",
      "contact_number": "1234567890",
      "status": "active",
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

**Permission Required**: `view_branch`

**Frontend Integration**:
- **Service**: `src/services/branchService.js`
- **Method**: `branchService.getBranches(params)`
- **Used In**:
  - `src/views/branches/BranchesList.jsx` - Branches list page में
- **Mock Fallback**: API fail होने पर mock data use होता है

**Usage Example**:
```javascript
import branchService from '../services/branchService'

const loadBranches = async () => {
  const result = await branchService.getBranches({
    page: 1,
    limit: 20,
    search: searchTerm
  })
  
  if (result.success) {
    setBranches(result.data)
    setMeta(result.meta)
  }
}
```

---

### 2. **GET /api/branches/{branch}**
**Description**: Specific branch की details fetch करने के लिए

**Backend Controller**: `BranchController@show`

**Response**:
```json
{
  "id": 1,
  "branch_name": "Main Branch",
  "branch_code": "MB001",
  "address": "123 Main St",
  "city": "New York",
  "contact_number": "1234567890",
  "status": "active"
}
```

**Permission Required**: `view_branch`

**Frontend Integration**:
- **Service**: `src/services/branchService.js`
- **Method**: `branchService.getBranchById(id)`
- **Used In**:
  - `src/components/pages/branches/BranchForm.jsx` - Edit branch form में

---

### 3. **POST /api/branches**
**Description**: New branch create करने के लिए

**Backend Controller**: `BranchController@store`

**Request Body**:
```json
{
  "branch_name": "New Branch",
  "branch_code": "NB001",
  "address": "456 New St",
  "city": "Los Angeles",
  "contact_number": "0987654321",
  "status": "active"
}
```

**Response**:
```json
{
  "id": 2,
  "branch_name": "New Branch",
  "branch_code": "NB001",
  "address": "456 New St",
  "city": "Los Angeles",
  "contact_number": "0987654321",
  "status": "active",
  "created_at": "2024-01-01T00:00:00.000000Z"
}
```

**Permission Required**: `create_branch`

**Frontend Integration**:
- **Service**: `src/services/branchService.js`
- **Method**: `branchService.createBranch(branchData)`
- **Used In**:
  - `src/components/pages/branches/BranchForm.jsx` - Create branch form में

---

### 4. **PUT /api/branches/{branch}**
**Description**: Existing branch update करने के लिए

**Backend Controller**: `BranchController@update`

**Request Body**:
```json
{
  "branch_name": "Updated Branch",
  "address": "789 Updated St",
  "status": "active"
}
```

**Response**:
```json
{
  "id": 1,
  "branch_name": "Updated Branch",
  "branch_code": "MB001",
  "address": "789 Updated St",
  "city": "New York",
  "status": "active",
  "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

**Permission Required**: `edit_branch`

**Frontend Integration**:
- **Service**: `src/services/branchService.js`
- **Method**: `branchService.updateBranch(id, branchData)`
- **Used In**:
  - `src/components/pages/branches/BranchForm.jsx` - Edit branch form में

---

### 5. **DELETE /api/branches/{branch}**
**Description**: Branch delete करने के लिए

**Backend Controller**: `BranchController@destroy`

**Response**:
```json
{
  "success": true,
  "message": "Branch deleted successfully"
}
```

**Permission Required**: `delete_branch`

**Frontend Integration**:
- **Service**: `src/services/branchService.js`
- **Method**: `branchService.deleteBranch(id)`
- **Used In**:
  - `src/views/branches/BranchesList.jsx` - Delete branch button click पर

---

## ⚙️ Settings Management APIs

### 1. **GET /api/global-settings/**
**Description**: सभी settings fetch करने के लिए

**Backend Controller**: `SettingController@listAll`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "key": "app_name",
      "value": "Photo Studio",
      "section": "general",
      "type": "string",
      "description": "Application name"
    }
  ]
}
```

**Permission Required**: `view_setting`

**Frontend Integration**:
- **Service**: `src/services/settingsService.js`
- **Method**: `settingsService.getSettings()`
- **Used In**:
  - `src/views/settings/Settings.jsx` - Settings page में सभी settings load करने के लिए

---

### 2. **GET /api/global-settings/by-section**
**Description**: सभी sections और उनकी settings fetch करने के लिए

**Backend Controller**: `SettingController@listBySection`

**Response**:
```json
{
  "success": true,
  "data": {
    "general": {
      "app_name": {
        "id": 1,
        "key": "app_name",
        "value": "Photo Studio",
        "section": "general"
      }
    },
    "email": {
      "smtp_host": {
        "id": 2,
        "key": "smtp_host",
        "value": "smtp.example.com",
        "section": "email"
      }
    }
  }
}
```

**Permission Required**: `view_setting`

**Frontend Integration**:
- **Service**: `src/services/settingsService.js`
- **Method**: `settingsService.getAllSections()`
- **Used In**:
  - `src/views/settings/Settings.jsx` - Settings page में sections load करने के लिए

---

### 3. **GET /api/global-settings/by-section/{section}**
**Description**: Specific section की settings fetch करने के लिए

**Backend Controller**: `SettingController@getSection`

**Response**:
```json
{
  "success": true,
  "data": {
    "app_name": {
      "id": 1,
      "key": "app_name",
      "value": "Photo Studio",
      "section": "general"
    }
  }
}
```

**Permission Required**: `view_setting`

**Frontend Integration**:
- **Service**: `src/services/settingsService.js`
- **Method**: `settingsService.getSettingsBySection(section)`
- **Used In**:
  - `src/views/settings/Settings.jsx` - Specific section की settings load करने के लिए

---

### 4. **GET /api/global-settings/key/{key}**
**Description**: Specific setting key से value fetch करने के लिए

**Backend Controller**: `SettingController@showByKey`

**Query Parameters**:
- `section` - Optional section filter

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "app_name",
    "value": "Photo Studio",
    "section": "general",
    "type": "string"
  }
}
```

**Permission Required**: `view_setting`

**Frontend Integration**:
- **Service**: `src/services/settingsService.js`
- **Method**: `settingsService.getSettingByKey(key, section)`
- **Used In**:
  - Specific setting value fetch करने के लिए

---

### 5. **POST /api/global-settings/**
**Description**: New setting create करने के लिए

**Backend Controller**: `SettingController@store`

**Request Body**:
```json
{
  "key": "new_setting",
  "value": "setting value",
  "section": "general",
  "type": "string",
  "description": "Setting description"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 10,
    "key": "new_setting",
    "value": "setting value",
    "section": "general",
    "type": "string"
  }
}
```

**Permission Required**: `edit_setting`

**Frontend Integration**:
- **Service**: `src/services/settingsService.js`
- **Method**: `settingsService.createSetting(settingData)`
- **Used In**:
  - `src/views/settings/Settings.jsx` - New setting add करने के लिए

---

### 6. **PUT /api/global-settings/{setting}**
**Description**: Existing setting update करने के लिए

**Backend Controller**: `SettingController@update`

**Request Body**:
```json
{
  "value": "updated value",
  "type": "string"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "app_name",
    "value": "updated value",
    "section": "general"
  }
}
```

**Permission Required**: `edit_setting`

**Frontend Integration**:
- **Service**: `src/services/settingsService.js`
- **Method**: `settingsService.updateSetting(id, settingData)`
- **Used In**:
  - `src/views/settings/Settings.jsx` - Setting update करने के लिए

---

### 7. **PUT /api/global-settings/key/{key}**
**Description**: Setting key से directly update करने के लिए

**Backend Controller**: `SettingController@updateByKey`

**Request Body**:
```json
{
  "value": "updated value"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "key": "app_name",
    "value": "updated value"
  }
}
```

**Permission Required**: `edit_setting`

**Frontend Integration**:
- **Service**: `src/services/settingsService.js`
- **Method**: `settingsService.updateSettingByKey(key, value, section)`
- **Used In**:
  - `src/views/settings/Settings.jsx` - Quick setting update करने के लिए

---

### 8. **POST /api/settings/{group}**
**Description**: Settings group (section) को bulk update करने के लिए

**Backend Controller**: `SettingController@updateGroup`

**Request Body**:
```json
{
  "app_name": "Photo Studio",
  "app_version": "1.0.0",
  "timezone": "UTC"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "data": {
    "app_name": {...},
    "app_version": {...},
    "timezone": {...}
  }
}
```

**Permission Required**: `edit_setting`

**Frontend Integration**:
- **Service**: `src/services/settingsService.js`
- **Method**: `settingsService.updateSettingsGroup(section, settings)`
- **Used In**:
  - `src/views/settings/Settings.jsx` - Settings section save करने के लिए

**Usage Example**:
```javascript
import settingsService from '../services/settingsService'

const handleSaveSettings = async (section, settingsData) => {
  const result = await settingsService.updateSettingsGroup(section, settingsData)
  
  if (result.success) {
    toast.success('Settings saved successfully')
  }
}
```

---

### 9. **POST /api/settings/test-s3**
**Description**: S3 connection test करने के लिए

**Backend Controller**: `SettingController@testS3`

**Request Body**:
```json
{
  "aws_access_key_id": "AKIA...",
  "aws_secret_access_key": "secret...",
  "aws_default_region": "us-east-1",
  "aws_bucket": "bucket-name"
}
```

**Response**:
```json
{
  "success": true,
  "message": "S3 connection successful"
}
```

**Permission Required**: `edit_setting`

**Frontend Integration**:
- **Service**: `src/services/settingsService.js`
- **Method**: `settingsService.testS3Connection(s3Config)`
- **Used In**:
  - `src/views/settings/Settings.jsx` - S3 settings में test connection button

---

### 10. **POST /api/settings/test-email**
**Description**: Email configuration test करने के लिए (uses database email settings)

**Backend Controller**: `SettingController@testEmail`

**Request Body**:
```json
{
  "email": "test@example.com"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Test email sent successfully to test@example.com"
}
```

**Permission Required**: `edit_setting`

**Frontend Integration**:
- **Service**: `src/services/settingsService.js`
- **Method**: `settingsService.sendTestEmail(email)`
- **Used In**:
  - `src/views/settings/Settings.jsx` - Email settings में test email button

**Note**: Email settings database से load होती हैं, test email भेजने से पहले settings configure करें

---

## 📱 App Settings

### App Settings Section
**Description**: Application-level settings (Web URL for reset password links)

**Settings Available**:
- **web_url** - Web URL for the application (used in reset password email links)

**Frontend Integration**:
- **Service**: `src/services/settingsService.js`
- **Component**: `src/views/settings/Settings.jsx`
- **Section**: App Settings (with cog icon)
- **Auto-save**: Enabled on blur

**Backend Usage**:
- `AuthController@forgotPassword` uses `web_url` from "App Settings" section
- Fallback chain: Database setting → Config file → Default value
- Used to generate reset password email links

**Usage Example**:
```javascript
// Frontend - Settings page automatically handles this
// Backend - Automatically used in forgot password flow
$webUrl = Setting::get('web_url', 'App Settings');
```

---

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false,
    "sortBy": "name",
    "sortDirection": "asc"
  }
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": {
    "field_name": ["Error message for field"]
  }
}
```

### HTTP Status Codes
- `200` - Success (GET, PUT, PATCH)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Server Error

---

## ⚠️ Error Handling

### Frontend Error Handling Pattern

सभी services में consistent error handling pattern use होता है:

```javascript
import { handleApiError } from '../utils/errorHandler'

try {
  const response = await apiClient.get('/endpoint')
  return {
    success: true,
    data: response.data
  }
} catch (error) {
  return handleApiError(error)
}
```

### Error Handler Utility

`src/utils/errorHandler.js` में `handleApiError` function:

```javascript
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response
    return {
      success: false,
      message: data?.message || 'An error occurred',
      errors: data?.errors || {},
      status
    }
  } else if (error.request) {
    // Request made but no response
    return {
      success: false,
      message: 'Network error. Please check your connection.'
    }
  } else {
    // Something else happened
    return {
      success: false,
      message: error.message || 'An unexpected error occurred'
    }
  }
}
```

---

## 🔗 Frontend Integration Points

### Service Layer Structure

सभी API calls service layer के through होते हैं:

```
Component → Service → API Client → Backend API
```

### Service Files Location
- `src/services/authService.js` - Authentication APIs
- `src/services/userService.js` - User Management APIs
- `src/services/roleService.js` - Role Management APIs
- `src/services/permissionService.js` - Permission Management APIs
- `src/services/branchService.js` - Branch Management APIs
- `src/services/settingsService.js` - Settings Management APIs

### API Client Configuration

`src/config/apiClient.js` में Axios client configured है:

```javascript
import axios from 'axios'
import config from '../config'

const apiClient = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Request interceptor - Token add करता है
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - Error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - Clear session
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
```

### Component Integration Examples

#### 1. UsersList Component
```javascript
// src/views/users/UsersList.jsx
import { useEffect, useState } from 'react'
import userService from '../../services/userService'

const UsersList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState({})

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async (page = 1, limit = 20) => {
    setLoading(true)
    const result = await userService.getUsers({ page, limit })
    if (result.success) {
      setUsers(result.data)
      setMeta(result.meta)
    }
    setLoading(false)
  }

  return (
    // Component JSX
  )
}
```

#### 2. RoleForm Component
```javascript
// src/components/pages/roles/RoleForm.jsx
import roleService from '../../../services/roleService'
import permissionService from '../../../services/permissionService'

const RoleForm = ({ roleId, onSave }) => {
  const [role, setRole] = useState({})
  const [permissions, setPermissions] = useState([])

  useEffect(() => {
    if (roleId) {
      loadRole()
    }
    loadPermissions()
  }, [roleId])

  const loadRole = async () => {
    const result = await roleService.getRoleById(roleId)
    if (result.success) {
      setRole(result.data)
    }
  }

  const loadPermissions = async () => {
    const result = await permissionService.getPermissions({
      groupByModule: true
    })
    if (result.success) {
      setPermissions(result.data)
    }
  }

  const handleSubmit = async (formData) => {
    if (roleId) {
      await roleService.updateRole(roleId, formData)
    } else {
      await roleService.createRole(formData)
    }
    onSave()
  }
}
```

#### 3. Settings Component
```javascript
// src/views/settings/Settings.jsx
import settingsService from '../../services/settingsService'

const Settings = () => {
  const [sections, setSections] = useState({})

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const result = await settingsService.getAllSections()
    if (result.success) {
      setSections(result.data)
    }
  }

  const handleSaveSection = async (section, settings) => {
    const result = await settingsService.updateSettingsGroup(section, settings)
    if (result.success) {
      toast.success('Settings saved successfully')
    }
  }

  const handleTestS3 = async (s3Config) => {
    const result = await settingsService.testS3Connection(s3Config)
    if (result.success) {
      toast.success('S3 connection successful')
    }
  }

  const handleTestEmail = async (emailConfig) => {
    const result = await settingsService.testEmailConfiguration(emailConfig)
    if (result.success) {
      toast.success('Test email sent successfully')
    }
  }
}
```

---

## 📝 Summary

### Implemented APIs
✅ Authentication (Login, Logout, Get User, Forgot Password, Reset Password, Change Password)
✅ User Management (CRUD operations)
✅ User Profile (Get/Update Profile, Avatar Upload, Change Password)
✅ Role Management (CRUD + Permissions)
✅ Permission Management (List, Get)
✅ Branch Management (CRUD operations)
✅ Settings Management (Full CRUD + Email Test + S3 Test + App Settings with Web URL)

### Frontend Integration Status
- ✅ **AuthService** - Fully integrated in Login, AuthContext, PrivateRoute, ForgotPassword, ResetPassword
- ✅ **UserService** - Fully integrated in UsersList, UserForm
- ✅ **ProfileService** - Fully integrated in Profile page (PersonalInfo, Address, Avatar, Change Password)
- ✅ **RoleService** - Fully integrated in RolesList, RoleForm
- ✅ **PermissionService** - Fully integrated in RoleForm
- ✅ **BranchService** - Integrated in BranchesList (with mock fallback)
- ✅ **SettingsService** - Fully integrated in Settings page (Business Info, Invoice, Email Settings with test, App Settings with Web URL, Currency & Regional, S3 Settings)

### Mock Data Fallback
- Branch Service में mock data fallback implemented है
- API fail होने पर automatically mock data use होता है
- Development के लिए useful है जब backend unavailable हो

---

**Last Updated**: January 2025
**Version**: 1.0.0

