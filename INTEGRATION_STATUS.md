# 📊 API Integration Status - Photo Studio Management System

**Last Updated:** 2025-01-28  
**Backend URL:** `http://52.62.1.66:8000`

---

## 🎯 **Integration Summary**

| Module | Status | API Type | Files |
|--------|--------|----------|-------|
| **Authentication** | ✅ **REAL API** | `apiClient` | `authService.js` |
| **Settings** | ✅ **REAL API** | `apiClient` | `settingsService.js` |
| **Branch Management** | ⚠️ **MOCK DATA** | `apiService` | `branchService.js` |
| **Customer Management** | ⚠️ **MOCK DATA** | Direct mock | `customerService.js` |
| **Order Management** | ⚠️ **MOCK DATA** | `apiService` | `orderService.js` |
| **User Management** | ⚠️ **MOCK DATA** | `apiService` | `userService.js` |
| **Package Management** | ⚠️ **MOCK DATA** | `apiService` | `packageService.js` |
| **Payment Management** | ⚠️ **MOCK DATA** | `apiService` | `paymentService.js` |
| **Transaction/Wallet** | ⚠️ **MOCK DATA** | `apiService` | `transactionService.js` |
| **Reports** | ⚠️ **MOCK DATA** | `apiService` | `reportService.js` |
| **Role Management** | ⚠️ **MOCK DATA** | Direct mock | `roleService.js` |
| **Profile** | ⚠️ **MOCK DATA** | Direct mock | `profileService.js` |

**Legend:**
- ✅ **REAL API** = Connected to backend server (`apiClient`)
- ⚠️ **MOCK DATA** = Using mock data (`apiService` or direct mock)

---

## ✅ **COMPLETED INTEGRATIONS (Real API)**

### 1. **Authentication Module** ✅

**Status:** ✅ **FULLY INTEGRATED**  
**Service:** `admin/src/services/authService.js`  
**API Client:** `apiClient` (Real Backend)

**Endpoints:**
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/register` - Register user
- `POST /auth/forgot-password` - Forgot password
- `POST /auth/reset-password` - Reset password
- `POST /auth/refresh` - Refresh token

**Used In:**
- `admin/src/pages/Auth/Login.jsx` ✅
- `admin/src/context/AuthContext.jsx` ✅
- `admin/src/layout/PrivateRoute.jsx` ✅

**Features:**
- ✅ JWT token management
- ✅ Auto-redirect on 401
- ✅ Token storage in localStorage
- ✅ Error handling
- ✅ Different API response format support

---

### 2. **Settings Module** ✅

**Status:** ✅ **FULLY INTEGRATED**  
**Service:** `admin/src/services/settingsService.js`  
**API Client:** `apiClient` (Real Backend)

**Endpoints:**
- `GET /global-settings/` - List all settings
- `GET /global-settings/by-section/{section}` - Get settings by section
- `GET /global-settings/{setting_id}` - Get setting by ID
- `GET /global-settings/key/{key}` - Get setting by key
- `POST /global-settings/` - Create setting
- `PUT /global-settings/{setting_id}` - Update setting
- `PUT /global-settings/key/{key}` - Update setting by key
- `DELETE /global-settings/{setting_id}` - Delete setting

**Used In:**
- `admin/src/views/settings/Settings.jsx` ✅

**Features:**
- ✅ Auto-save on blur
- ✅ Section-based organization
- ✅ Create/update logic
- ✅ Error handling

---

## ⚠️ **PENDING INTEGRATIONS (Mock Data)**

### 3. **Branch Management** ⚠️

**Status:** ⚠️ **MOCK DATA**  
**Service:** `admin/src/services/branchService.js`  
**API Type:** `apiService` (Mock)

**Current Implementation:**
- Uses `apiService` from `admin/src/api.js`
- Mock data responses

**Endpoints (Ready for Integration):**
- `GET /branches` - List branches
- `GET /branches/{id}` - Get branch by ID
- `POST /branches` - Create branch
- `PUT /branches/{id}` - Update branch
- `DELETE /branches/{id}` - Delete branch

**Used In:**
- `admin/src/views/branches/BranchesList.jsx` ⚠️
- `admin/src/views/branches/BranchFormView.jsx` ⚠️

**To Integrate:**
1. Replace `apiService` with `apiClient` in `branchService.js`
2. Update error handling
3. Test with real backend

---

### 4. **Customer Management** ⚠️

**Status:** ⚠️ **MOCK DATA**  
**Service:** `admin/src/services/customerService.js`  
**API Type:** Direct mock (from `customers.json`)

**Current Implementation:**
- Directly imports `customers.json`
- Simulated API delays
- No real API calls

**Endpoints (Ready for Integration):**
- `GET /customers` - List customers
- `GET /customers/{id}` - Get customer by ID
- `POST /customers` - Create customer
- `PUT /customers/{id}` - Update customer
- `DELETE /customers/{id}` - Delete customer
- `GET /customers/{id}/wallet` - Get wallet balance
- `GET /customers/{id}/ledger` - Get customer ledger

**Used In:**
- `admin/src/views/customers/CustomersList.jsx` ⚠️
- `admin/src/views/customers/CustomerFormView.jsx` ⚠️
- `admin/src/views/customers/CustomerWalletView.jsx` ⚠️
- `admin/src/views/customers/CustomerLedgerView.jsx` ⚠️

**To Integrate:**
1. Replace mock data with `apiClient` calls
2. Update all CRUD operations
3. Add wallet and ledger endpoints
4. Test with real backend

---

### 5. **Order Management** ⚠️

**Status:** ⚠️ **MOCK DATA**  
**Service:** `admin/src/services/orderService.js`  
**API Type:** `apiService` (Mock)

**Current Implementation:**
- Uses `apiService` from `admin/src/api.js`
- Mock data responses

**Endpoints (Ready for Integration):**
- `GET /orders` - List orders
- `GET /orders/{id}` - Get order by ID
- `POST /orders` - Create order
- `PUT /orders/{id}` - Update order
- `DELETE /orders/{id}` - Delete order
- `PATCH /orders/{id}/status` - Update order status
- `PATCH /orders/{id}/payment-status` - Update payment status

**Used In:**
- `admin/src/views/orders/OrdersList.jsx` ⚠️
- `admin/src/views/orders/OrderFormView.jsx` ⚠️

**To Integrate:**
1. Replace `apiService` with `apiClient`
2. Update order items handling
3. Add payment status updates
4. Test with real backend

---

### 6. **User Management** ⚠️

**Status:** ⚠️ **MOCK DATA**  
**Service:** `admin/src/services/userService.js`  
**API Type:** `apiService` (Mock)

**Current Implementation:**
- Uses `apiService` from `admin/src/api.js`
- Mock data responses

**Endpoints (Ready for Integration):**
- `GET /users` - List users
- `GET /users/{id}` - Get user by ID
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update profile

**Used In:**
- `admin/src/views/users/UsersList.jsx` ⚠️
- `admin/src/views/users/Profile.jsx` ⚠️

**To Integrate:**
1. Replace `apiService` with `apiClient`
2. Add role management
3. Add permission handling
4. Test with real backend

---

### 7. **Package Management** ⚠️

**Status:** ⚠️ **MOCK DATA**  
**Service:** `admin/src/services/packageService.js`  
**API Type:** `apiService` (Mock)

**Current Implementation:**
- Uses `apiService` from `admin/src/api.js`
- Mock data responses

**Endpoints (Ready for Integration):**
- `GET /packages` - List packages
- `GET /packages/{id}` - Get package by ID
- `POST /packages` - Create package
- `PUT /packages/{id}` - Update package
- `DELETE /packages/{id}` - Delete package

**Used In:**
- `admin/src/views/packages/PackagesList.jsx` ⚠️
- `admin/src/views/packages/PackageFormView.jsx` ⚠️

**To Integrate:**
1. Replace `apiService` with `apiClient`
2. Add package type handling
3. Test with real backend

---

### 8. **Payment Management** ⚠️

**Status:** ⚠️ **MOCK DATA**  
**Service:** `admin/src/services/paymentService.js`  
**API Type:** `apiService` (Mock)

**Current Implementation:**
- Uses `apiService` from `admin/src/api.js`
- Mock data responses

**Endpoints (Ready for Integration):**
- `POST /payments` - Create payment
- `GET /payments/{id}` - Get payment by ID
- `GET /payments/order/{order_id}` - Get payments by order

**Used In:**
- `admin/src/views/payments/PaymentsList.jsx` ⚠️
- `admin/src/views/payments/PaymentFormView.jsx` ⚠️

**To Integrate:**
1. Replace `apiService` with `apiClient`
2. Add payment method handling
3. Test with real backend

---

### 9. **Transaction/Wallet Management** ⚠️

**Status:** ⚠️ **MOCK DATA**  
**Service:** `admin/src/services/transactionService.js`  
**API Type:** `apiService` (Mock)

**Current Implementation:**
- Uses `apiService` from `admin/src/api.js`
- Mock data responses

**Endpoints (Ready for Integration):**
- `GET /transactions` - List transactions
- `GET /transactions/{id}` - Get transaction by ID
- `POST /transactions` - Create transaction
- `PUT /transactions/{id}` - Update transaction
- `GET /transactions/order/{order_id}` - Get transactions by order

**Used In:**
- `admin/src/views/transactions/TransactionsList.jsx` ⚠️
- `admin/src/views/transactions/TransactionFormView.jsx` ⚠️

**To Integrate:**
1. Replace `apiService` with `apiClient`
2. Add credit/debit handling
3. Add wallet balance updates
4. Test with real backend

---

### 10. **Reports** ⚠️

**Status:** ⚠️ **MOCK DATA**  
**Service:** `admin/src/services/reportService.js`  
**API Type:** `apiService` (Mock)

**Current Implementation:**
- Uses `apiService` from `admin/src/api.js`
- Mock data responses

**Endpoints (Ready for Integration):**
- `GET /reports/sales` - Sales report
- `GET /reports/ledger` - Ledger report
- `GET /reports/branch` - Branch report
- `GET /reports/staff` - Staff report

**Used In:**
- `admin/src/views/reports/SalesReport.jsx` ⚠️
- `admin/src/views/reports/LedgerReport.jsx` ⚠️
- `admin/src/views/reports/BranchReport.jsx` ⚠️
- `admin/src/views/reports/StaffReport.jsx` ⚠️

**To Integrate:**
1. Replace `apiService` with `apiClient`
2. Add date range filters
3. Add export functionality
4. Test with real backend

---

### 11. **Role Management** ⚠️

**Status:** ⚠️ **MOCK DATA**  
**Service:** `admin/src/services/roleService.js`  
**API Type:** Direct mock (from `roles.json`)

**Current Implementation:**
- Directly imports `roles.json`
- Simulated API delays
- No real API calls

**Endpoints (Ready for Integration):**
- `GET /roles` - List roles
- `GET /roles/{id}` - Get role by ID
- `POST /roles` - Create role
- `PUT /roles/{id}` - Update role
- `DELETE /roles/{id}` - Delete role

**Used In:**
- `admin/src/views/roles/RolesList.jsx` ⚠️

**To Integrate:**
1. Replace mock data with `apiClient` calls
2. Add permission management
3. Test with real backend

---

### 12. **Profile Management** ⚠️

**Status:** ⚠️ **MOCK DATA**  
**Service:** `admin/src/services/profileService.js`  
**API Type:** Direct mock (from `profile.json`)

**Current Implementation:**
- Directly imports `profile.json`
- Real API calls are commented out
- Mock data responses

**Endpoints (Ready for Integration):**
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update profile
- `POST /users/profile/avatar` - Upload avatar
- `PUT /users/profile/password` - Change password

**Used In:**
- `admin/src/views/users/Profile.jsx` ⚠️

**To Integrate:**
1. Uncomment real API calls
2. Replace mock data with `apiClient`
3. Add avatar upload
4. Test with real backend

---

## 📁 **File Structure**

### **Real API Services (apiClient)**
```
admin/src/services/
├── authService.js          ✅ Uses apiClient
└── settingsService.js      ✅ Uses apiClient
```

### **Mock Data Services (apiService or Direct Mock)**
```
admin/src/services/
├── branchService.js        ⚠️ Uses apiService
├── customerService.js      ⚠️ Direct mock
├── orderService.js         ⚠️ Uses apiService
├── userService.js          ⚠️ Uses apiService
├── packageService.js       ⚠️ Uses apiService
├── paymentService.js       ⚠️ Uses apiService
├── transactionService.js   ⚠️ Uses apiService
├── reportService.js        ⚠️ Uses apiService
├── roleService.js          ⚠️ Direct mock
└── profileService.js       ⚠️ Direct mock
```

---

## 🔄 **Integration Pattern**

### **For Real API (apiClient):**
```javascript
import apiClient from '../config/apiClient'
import { handleApiError } from '../utils/errorHandler'

async getItems() {
  try {
    const response = await apiClient.get('/endpoint')
    return {
      success: true,
      data: response.data,
      message: 'Success'
    }
  } catch (error) {
    return handleApiError(error)
  }
}
```

### **For Mock Data (apiService):**
```javascript
import apiService from '../api'

async getItems() {
  return apiService.get('/endpoint')
}
```

---

## 🎯 **Next Steps for Integration**

### **Priority 1: Core Business Modules**
1. **Customer Management** - High priority
2. **Order Management** - High priority
3. **Package Management** - High priority
4. **Payment Management** - High priority

### **Priority 2: Supporting Modules**
5. **Branch Management** - Medium priority
6. **Transaction/Wallet** - Medium priority
7. **User Management** - Medium priority

### **Priority 3: Reports & Analytics**
8. **Reports** - Low priority (can work with mock data)
9. **Role Management** - Low priority
10. **Profile Management** - Low priority

---

## 📊 **Integration Progress**

**Completed:** 2/12 modules (16.7%)  
**Pending:** 10/12 modules (83.3%)

---

## 🔧 **How to Integrate a Module**

1. **Replace Import:**
   ```javascript
   // Change from:
   import apiService from '../api'
   
   // To:
   import apiClient from '../config/apiClient'
   import { handleApiError } from '../utils/errorHandler'
   ```

2. **Update Methods:**
   ```javascript
   // Change from:
   async getItems() {
     return apiService.get('/endpoint')
   }
   
   // To:
   async getItems() {
     try {
       const response = await apiClient.get('/endpoint')
       return {
         success: true,
         data: response.data,
         message: 'Success'
       }
     } catch (error) {
       return handleApiError(error)
     }
   }
   ```

3. **Test with Real Backend:**
   - Verify endpoints match backend API
   - Test all CRUD operations
   - Check error handling
   - Verify response format

---

**Last Updated:** 2025-01-28

