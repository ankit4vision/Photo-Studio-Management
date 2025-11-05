# Photo Studio Management App - Implementation Tasks

## 🎯 Task Breakdown by Module

### Module 1: Branch Management ✅ → 🚀

#### Tasks:
- [x] Create BranchesList view
- [x] Create branchService
- [ ] Create BranchForm component
  - [ ] Form fields: branch_name, branch_code, address, city, contact_number, email, status
  - [ ] Form validation
  - [ ] Create mode
  - [ ] Edit mode
  - [ ] Success/error handling
- [ ] Add BranchForm route
- [ ] Update BranchesList with create/edit buttons
- [ ] Test branch CRUD operations

**Estimated Time:** 2-3 hours

---

### Module 2: Package Management ✅ → 🚀

#### Tasks:
- [x] Create PackagesList view
- [x] Create packageService
- [ ] Create PackageForm component
  - [ ] Form fields: package_name, package_type, default_price, description, status
  - [ ] Package type dropdown (Album, PhotoShoot, Editing, Video)
  - [ ] Price input with validation
  - [ ] Description textarea
  - [ ] Form validation
  - [ ] Create mode
  - [ ] Edit mode
  - [ ] Success/error handling
- [ ] Add PackageForm route
- [ ] Update PackagesList with create/edit buttons
- [ ] Test package CRUD operations

**Estimated Time:** 2-3 hours

---

### Module 3: Customer Management Enhancement 🟡 → 🚀

#### Tasks:
- [x] CustomersList view (exists)
- [x] CustomerDetailsModal (exists)
- [ ] Create CustomerForm component
  - [ ] Form fields: name, mobile, email, address, dob, anniversary_date, branch_id, status
  - [ ] Branch selection dropdown
  - [ ] Date pickers for dob and anniversary
  - [ ] Form validation
  - [ ] Create mode
  - [ ] Edit mode
  - [ ] Success/error handling
- [ ] Create CustomerWalletView component
  - [ ] Display wallet balance
  - [ ] Credit/Debit summary
  - [ ] Recent transactions list
  - [ ] Add transaction button
- [ ] Create CustomerLedgerView component
  - [ ] Orders list
  - [ ] Transactions list
  - [ ] Combined timeline view
  - [ ] Date range filter
  - [ ] Export functionality
- [ ] Add routes for wallet and ledger
- [ ] Update CustomersList with wallet link
- [ ] Test customer operations

**Estimated Time:** 4-5 hours

---

### Module 4: Order Management Enhancement 🟡 → 🚀

#### Tasks:
- [x] OrdersList view (exists)
- [x] OrderDetailsModal (exists)
- [ ] Create OrderForm component
  - [ ] Customer selection (with search)
  - [ ] Branch selection
  - [ ] Order date and due date pickers
  - [ ] Package selection (multiple)
    - [ ] Package dropdown with search
    - [ ] Auto-fill price from package
    - [ ] Editable price field
    - [ ] Quantity input
    - [ ] Amount calculation (price × qty)
    - [ ] Add/remove package items
  - [ ] Order items table
  - [ ] Subtotal calculation
  - [ ] Flat discount input
  - [ ] Total amount calculation
  - [ ] Form validation
  - [ ] Create mode
  - [ ] Edit mode
  - [ ] Success/error handling
- [ ] Update OrderDetailsModal to show multiple packages
- [ ] Add OrderForm route
- [ ] Update OrdersList with create button
- [ ] Auto-create debit transaction on order creation
- [ ] Test order operations

**Estimated Time:** 5-6 hours

---

### Module 5: Transactions Module ✅ → 🚀

#### Tasks:
- [x] TransactionsList view
- [x] Transaction service
- [ ] Create TransactionForm component
  - [ ] Customer selection (required)
  - [ ] Order selection (optional)
  - [ ] Branch selection (required)
  - [ ] Transaction type (Credit/Debit)
  - [ ] Transaction date picker
  - [ ] Amount input
  - [ ] Remarks textarea
  - [ ] Form validation
  - [ ] Success/error handling
- [ ] Add TransactionForm route
- [ ] Update TransactionsList with create button
- [ ] Add filter by customer
- [ ] Add filter by order
- [ ] Test transaction operations

**Estimated Time:** 2-3 hours

---

### Module 6: Payment Management ✅ → 🚀

#### Tasks:
- [x] PaymentsList view
- [x] Payment service
- [ ] Create PaymentForm component
  - [ ] Order selection (required)
  - [ ] Display order details
  - [ ] Display order balance
  - [ ] Amount input (max = balance)
  - [ ] Payment method selection (Cash, UPI, Card, Bank Transfer)
  - [ ] Payment date picker
  - [ ] Remarks textarea
  - [ ] Form validation
  - [ ] Success/error handling
- [ ] Create OrderPaymentsView component
  - [ ] Display all payments for an order
  - [ ] Payment history table
  - [ ] Total paid calculation
  - [ ] Balance calculation
- [ ] Add PaymentForm route
- [ ] Update PaymentsList with create button
- [ ] Auto-create credit transaction on payment
- [ ] Update order paid_amount and balance_amount
- [ ] Test payment operations

**Estimated Time:** 3-4 hours

---

### Module 7: Reports Module 🟡 → 🚀

#### Tasks:
- [x] Report pages structure
- [x] Report service
- [ ] Sales Report Implementation
  - [ ] Date range picker
  - [ ] Branch filter (optional)
  - [ ] Generate button
  - [ ] Sales summary cards (Total Sales, Orders Count, Avg Order Value)
  - [ ] Sales chart (line/bar chart)
  - [ ] Sales table (detailed breakdown)
  - [ ] Export to CSV/PDF
- [ ] Ledger Report Implementation
  - [ ] Customer selection
  - [ ] Date range picker
  - [ ] Generate button
  - [ ] Opening balance
  - [ ] Transaction list (credit/debit)
  - [ ] Closing balance
  - [ ] Export functionality
- [ ] Branch Report Implementation
  - [ ] Branch selection
  - [ ] Date range picker
  - [ ] Generate button
  - [ ] Branch performance metrics
  - [ ] Orders statistics
  - [ ] Revenue breakdown
  - [ ] Export functionality
- [ ] Staff Report Implementation
  - [ ] Staff selection
  - [ ] Branch filter
  - [ ] Date range picker
  - [ ] Generate button
  - [ ] Staff performance metrics
  - [ ] Orders handled count
  - [ ] Revenue generated
  - [ ] Export functionality
- [ ] Test all reports

**Estimated Time:** 6-8 hours

---

## 📋 Overall Implementation Plan

### Week 1: Core Forms
- Day 1-2: Branch & Package Forms
- Day 3-4: Customer Form & Wallet
- Day 5: Order Form (Multi-package)

### Week 2: Financial Modules
- Day 1: Transaction Form
- Day 2-3: Payment Form & Integration
- Day 4-5: Testing & Bug Fixes

### Week 3: Reports & Polish
- Day 1-2: Sales & Ledger Reports
- Day 3: Branch & Staff Reports
- Day 4: Settings Updates
- Day 5: Final Testing & Documentation

---

## ✅ Quick Wins (High Priority)
1. Branch Form - 2 hours
2. Package Form - 2 hours
3. Transaction Form - 2 hours
4. Payment Form - 3 hours

**Total: ~9 hours for basic CRUD operations**

---

*Last Updated: 2025-01-XX*
*Task Status: Planning Phase*

