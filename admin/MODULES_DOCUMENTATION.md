# Photo Studio Management App - Modules Documentation

## 📋 Module Overview

This document outlines all modules, their functionality, API endpoints, and implementation status for the Photo Studio Management App.

---

## 1. Authentication & Roles Module

### Status: ✅ Complete (Needs Testing)

### Features:
- Login with JWT authentication
- User profile management
- Role-based access control (Admin, Manager, Staff)
- Password reset functionality
- User management (CRUD operations)

### Frontend Pages:
- `/login` - Login page
- `/profile` - User profile
- `/users/list` - Users list
- `/users/form` - User create/edit form

### Backend API Endpoints:
- `POST /auth/login` - Login and return JWT
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Fetch logged-in user
- `GET /users` - List users
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### User Fields:
`id`, `name`, `email`, `mobile`, `password`, `role` (admin/manager/staff), `branch_id`, `status`, `created_at`

### Implementation Tasks:
- [x] Login page
- [x] User list view
- [x] User form component
- [x] Profile page
- [x] Role management
- [ ] Branch assignment in user form
- [ ] Role-based route protection
- [ ] Testing

---

## 2. Branch Management Module

### Status: 🟡 In Progress (List View Only)

### Features:
- CRUD operations for branches
- Branch status management
- Branch filtering and search

### Frontend Pages:
- `/branches/list` - Branches list ✅
- `/branches/form` - Branch create/edit form ❌
- `/branches/view/{id}` - Branch details ❌

### Backend API Endpoints:
- `GET /branches` - List branches
- `POST /branches` - Add branch
- `PUT /branches/{id}` - Update branch
- `DELETE /branches/{id}` - Delete branch

### Branch Fields:
`id`, `branch_name`, `branch_code`, `address`, `city`, `contact_number`, `email`, `status`

### Implementation Tasks:
- [x] Branches list view
- [x] Branch service
- [ ] Branch create/edit form
- [ ] Branch form validation
- [ ] Branch details view
- [ ] Branch status management
- [ ] Testing

---

## 3. Customer Management Module

### Status: 🟡 Partial (Needs Wallet Features)

### Features:
- Customer CRUD operations
- Customer wallet balance tracking
- Customer ledger view (orders + transactions)
- Customer details with wallet summary

### Frontend Pages:
- `/customers/list` - Customers list ✅
- `/customers/form` - Customer create/edit form ❌
- `/customers/view/{id}` - Customer details ✅
- `/customers/{id}/wallet` - Customer wallet view ❌
- `/customers/{id}/ledger` - Customer ledger ❌

### Backend API Endpoints:
- `GET /customers` - List all customers
- `POST /customers` - Create customer
- `GET /customers/{id}` - View customer details
- `PUT /customers/{id}` - Update customer
- `DELETE /customers/{id}` - Delete customer
- `GET /customers/{id}/wallet` - Get wallet balance
- `GET /customers/{id}/ledger` - Get customer ledger

### Customer Fields:
`id`, `branch_id`, `name`, `mobile`, `email`, `address`, `dob`, `anniversary_date`, `wallet_balance`, `total_orders`, `status`, `created_by`, `created_at`

### Implementation Tasks:
- [x] Customers list view
- [x] Customer details modal
- [ ] Customer create/edit form
- [ ] Wallet balance display
- [ ] Customer ledger view component
- [ ] Wallet transaction history
- [ ] Customer wallet update functionality
- [ ] Testing

---

## 4. Package Management Module

### Status: 🟡 In Progress (List View Only)

### Features:
- CRUD operations for packages
- Package type management (Album, PhotoShoot, Editing, Video)
- Package pricing management
- Package status management

### Frontend Pages:
- `/packages/list` - Packages list ✅
- `/packages/form` - Package create/edit form ❌
- `/packages/view/{id}` - Package details ❌

### Backend API Endpoints:
- `GET /packages` - List all packages
- `POST /packages` - Add package
- `PUT /packages/{id}` - Update package
- `DELETE /packages/{id}` - Delete package

### Package Fields:
`id`, `package_name`, `package_type` (Album / PhotoShoot / Editing / Video), `default_price`, `description`, `status`

### Implementation Tasks:
- [x] Packages list view
- [x] Package service
- [ ] Package create/edit form
- [ ] Package type selection
- [ ] Package pricing input
- [ ] Package description editor
- [ ] Package details view
- [ ] Testing

---

## 5. Order Management Module

### Status: 🟡 Partial (Needs Multi-Package Support)

### Features:
- Create orders with multiple packages
- Order status management
- Order payment tracking
- Order items management
- Flat discount support
- Order details view

### Frontend Pages:
- `/orders/list` - Orders list ✅
- `/orders/form` - Order create/edit form ❌
- `/orders/view/{id}` - Order details ✅

### Backend API Endpoints:
- `GET /orders` - List orders
- `POST /orders` - Create new order
- `GET /orders/{id}` - View order
- `PUT /orders/{id}` - Update order
- `DELETE /orders/{id}` - Delete order

### Order Fields:
`id`, `customer_id`, `branch_id`, `order_date`, `due_date`, `flat_discount`, `total_amount`, `paid_amount`, `balance_amount`, `status`

### Order Items Fields:
`id`, `order_id`, `package_id`, `package_name`, `price`, `qty`, `amount`

### Implementation Tasks:
- [x] Orders list view
- [x] Order details modal
- [ ] Order create form with multiple packages
- [ ] Package selection with auto-price fill
- [ ] Editable package prices
- [ ] Quantity management
- [ ] Flat discount input
- [ ] Order total calculation
- [ ] Order items management (add/remove)
- [ ] Order edit functionality
- [ ] Testing

---

## 6. Transactions Module (Wallet/Credit-Debit)

### Status: 🟡 In Progress (List View Only)

### Features:
- Credit transactions (Money In: advance, payment received)
- Debit transactions (Money Out: order, refund, due)
- Auto-created transactions on order/payment
- Manual transaction entry
- Transaction history by customer
- Transaction history by order

### Frontend Pages:
- `/transactions/list` - Transactions list ✅
- `/transactions/form` - Transaction create form ❌
- `/transactions/view/{id}` - Transaction details ❌

### Backend API Endpoints:
- `GET /transactions` - List transactions
- `POST /transactions` - Add transaction
- `GET /transactions/{id}` - View transaction
- `PUT /transactions/{id}` - Update transaction
- `GET /transactions/customer/{customer_id}` - Customer transactions
- `GET /transactions/order/{order_id}` - Order transactions

### Transaction Fields:
`id`, `customer_id`, `order_id` (nullable), `branch_id`, `transaction_date`, `type` (credit/debit), `amount`, `remarks`, `created_by`

### Implementation Tasks:
- [x] Transactions list view
- [x] Transaction service
- [ ] Transaction create form
- [ ] Credit/Debit type selection
- [ ] Customer selection
- [ ] Order linking (optional)
- [ ] Amount input with validation
- [ ] Remarks field
- [ ] Auto-create on order payment
- [ ] Auto-create on order creation
- [ ] Transaction edit functionality
- [ ] Testing

---

## 7. Payment Management Module

### Status: 🟡 In Progress (List View Only)

### Features:
- Record payments for orders
- Partial/full payment support
- Multiple payment methods (Cash, UPI, Card, Bank Transfer)
- Advance balance handling
- Payment history by order

### Frontend Pages:
- `/payments/list` - Payments list ✅
- `/payments/form` - Payment create form ❌
- `/payments/order/{order_id}` - Order payments ❌

### Backend API Endpoints:
- `POST /payments` - Record payment for order
- `GET /payments/order/{order_id}` - View order payments
- `GET /payments/{id}` - View payment details

### Payment Fields:
`id`, `order_id`, `amount`, `payment_method` (Cash/UPI/Card/Bank Transfer), `payment_date`, `remarks`, `created_by`

### Implementation Tasks:
- [x] Payments list view
- [x] Payment service
- [ ] Payment create form
- [ ] Order selection
- [ ] Payment method selection
- [ ] Amount input with validation
- [ ] Partial payment calculation
- [ ] Balance calculation
- [ ] Payment history display
- [ ] Auto-create transaction on payment
- [ ] Testing

---

## 8. Reports Module

### Status: 🟡 Basic Structure Only

### Features:
- Sales Report (branch-wise, date range)
- Ledger Report (customer-wise)
- Branch Report (branch performance)
- Staff Report (staff performance)
- Report export functionality

### Frontend Pages:
- `/reports/sales` - Sales report ✅ (Basic)
- `/reports/ledger` - Ledger report ✅ (Basic)
- `/reports/branch` - Branch report ✅ (Basic)
- `/reports/staff` - Staff report ✅ (Basic)

### Backend API Endpoints:
- `GET /reports/sales` - Sales report
- `GET /reports/ledger` - Ledger report
- `GET /reports/branch` - Branch report
- `GET /reports/staff` - Staff report
- `GET /reports/{type}/export` - Export report

### Implementation Tasks:
- [x] Report pages structure
- [x] Report service
- [ ] Sales report implementation
  - [ ] Date range filter
  - [ ] Branch filter
  - [ ] Sales summary cards
  - [ ] Sales chart/graph
  - [ ] Sales table
  - [ ] Export functionality
- [ ] Ledger report implementation
  - [ ] Customer filter
  - [ ] Date range filter
  - [ ] Transaction history
  - [ ] Balance summary
  - [ ] Export functionality
- [ ] Branch report implementation
  - [ ] Branch selection
  - [ ] Date range filter
  - [ ] Branch performance metrics
  - [ ] Order statistics
  - [ ] Revenue statistics
  - [ ] Export functionality
- [ ] Staff report implementation
  - [ ] Staff selection
  - [ ] Date range filter
  - [ ] Staff performance metrics
  - [ ] Orders handled
  - [ ] Revenue generated
  - [ ] Export functionality
- [ ] Testing

---

## 9. Settings Module

### Status: ✅ Complete (Needs Photo Studio Specific Updates)

### Features:
- General settings (currency, tax, company info)
- Business information
- Email configuration
- System settings

### Frontend Pages:
- `/settings` - Settings page ✅

### Implementation Tasks:
- [x] Settings page structure
- [ ] Update settings for Photo Studio
- [ ] Invoice settings
- [ ] Branch settings
- [ ] Testing

---

## 📊 Implementation Priority

### Phase 1: Core Modules (Essential for MVP)
1. **Branch Management** - Create/Edit forms
2. **Package Management** - Create/Edit forms
3. **Customer Management** - Wallet and Ledger features
4. **Order Management** - Multi-package support

### Phase 2: Financial Modules
5. **Transactions** - Create/Edit forms
6. **Payment Management** - Create form and order integration

### Phase 3: Reporting & Analytics
7. **Reports** - Full implementation of all reports

### Phase 4: Polish & Testing
8. **Settings** - Photo Studio specific updates
9. **Testing** - Complete module testing
10. **Documentation** - User guides and API docs

---

## 🔄 Module Dependencies

```
Authentication → Users → Roles
    ↓
Branches → Users, Customers, Orders
    ↓
Packages → Orders
    ↓
Customers → Orders, Transactions, Payments
    ↓
Orders → Order Items, Payments, Transactions
    ↓
Transactions → Customers, Orders
    ↓
Payments → Orders, Transactions
    ↓
Reports → All Modules
```

---

## 📝 Notes

- All modules use JWT authentication
- Branch-based filtering where applicable
- Role-based access control for all operations
- Wallet balance = total_credit - total_debit
- Orders support multiple packages with individual pricing
- Flat discount applies to total order amount
- Transactions auto-created on order/payment actions

---

*Last Updated: 2025-01-XX*
*Document Version: 1.0*

