# Income & Expense Management Module - Planning Document

## 📋 Overview

This document outlines the plan for implementing an **Income & Expense Management** module for the Photo Studio Management system. This module will allow tracking and managing both business income (other income sources, 3rd party income) and expenses across branches, providing a complete financial overview.

---

## 🎯 Core Features

### 1. **Unified Categories Management**
- Single category management page
- Create, edit, delete categories for both Income and Expense
- **Category Fields**:
  - Type (dropdown: "Income" or "Expense", required)
  - Category Title/Name (required)
  - Description (optional)
  - Status (active/inactive)
- Categories like:
  - **Income**: Rental Income, Commission, Interest Income, Other Services, Investment Returns, etc.
  - **Expense**: Office Supplies, Utilities, Marketing, Travel, Equipment, Rent, Salaries, etc.

### 2. **Unified Financial Transactions Management**
- Single entry page listing both Income and Expense records
- Single add/edit form for both Income and Expense
- **CRUD Operations**: Create, Read, Update, Delete financial transactions
- **Key Fields** (simplified form):
  - Transaction Type (dropdown: "Income" or "Expense", required)
  - Transaction Date (date picker, required)
  - Category (dropdown filtered by type, required)
  - Amount (number input, required)
  - Description/Notes (textarea, multiline, optional)
  - Created by (user reference - automatic, not a form field)

### 3. **Unified Tracking & Reporting**
- Single list page showing both Income and Expense records
- Filter by:
  - Transaction Type (Income/Expense/All)
  - Date range
  - Category (filtered by selected type)
  - Status
  - Branch
  - Payment method
  - Amount range
- Search by:
  - Description
  - Source/Vendor name
  - Transaction number
- Sort by: Date, Amount, Category, Type, Status
- Visual distinction: Income rows (green tint), Expense rows (red tint)

### 7. **Financial Statistics & Reports**
- **Income Statistics**:
  - Total income (by period)
  - Income by category
  - Income by branch
  - Monthly/Yearly income trends
  - Top income categories
- **Expense Statistics**:
  - Total expenses (by period)
  - Expenses by category
  - Expenses by branch
  - Monthly/Yearly expense trends
  - Top expense categories
- **Combined Financial Overview**:
  - Net Profit/Loss (Income - Expenses)
  - Income vs Expense comparison charts
  - Financial summary by period


---

## 🗄️ Database Schema

### Table 1: `financial_categories`
```sql
- id (bigint, primary key)
- type (enum: 'income', 'expense', not null) - Category type
- name (varchar(255), not null) - Category title/name
- description (text, nullable)
- status (enum: 'active', 'inactive', default: 'active')
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp) - soft delete
```

**Indexes:**
- PRIMARY KEY (`id`)
- UNIQUE (`type`, `name`) - Unique category name per type
- INDEX (`type`)
- INDEX (`status`)

**Notes:**
- Single table for both income and expense categories
- Type field distinguishes between income and expense categories
- Category name must be unique within the same type

### Table 2: `financial_transactions`
```sql
- id (bigint, primary key)
- transaction_number (varchar(255), unique, not null) - Auto-generated: #INC001, #EXP001, etc.
- transaction_type (enum: 'income', 'expense', not null) - Transaction type
- transaction_date (date, not null)
- category_id (bigint, foreign key → financial_categories.id, not null)
- amount (decimal(12,2), not null)
- description (text, nullable) - Description/Notes (multiline)
- created_by (bigint, foreign key → users.id, not null)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp) - soft delete
```

**Foreign Keys:**
- `category_id` → `financial_categories.id` (ON DELETE RESTRICT)
- `created_by` → `users.id` (ON DELETE RESTRICT)

**Indexes:**
- PRIMARY KEY (`id`)
- UNIQUE (`transaction_number`)
- INDEX (`transaction_type`)
- INDEX (`transaction_date`)
- INDEX (`category_id`)
- INDEX (`created_by`)
- INDEX (`created_at`)

**Notes:**
- Single table for both income and expense transactions
- Transaction number format: #INC001 for income, #EXP001 for expense
- Category must match transaction type (enforced at application level)
- Simplified schema - removed: payment_method, branch_id, status, approved_by, approved_at, receipt_reference, notes, source_vendor_name

---

## 🔐 Permissions

Following the existing pattern (unified permissions):

### Financial Transaction Permissions
- `view_financial_transaction` - View financial transactions list and details (both income & expense)
- `create_financial_transaction` - Create new financial transactions (both income & expense)
- `edit_financial_transaction` - Edit existing financial transactions
- `delete_financial_transaction` - Delete financial transactions

### Financial Category Permissions
- `view_financial_category` - View financial categories (both income & expense)
- `create_financial_category` - Create financial categories
- `edit_financial_category` - Edit financial categories
- `delete_financial_category` - Delete financial categories

---

## 🌐 API Endpoints

### Financial Categories

#### 1. **GET /api/financial-categories**
- List all financial categories (paginated, sortable)
- Query params: `page`, `limit`, `search`, `type` (income/expense), `status`, `sort_by`, `sort_direction`
- **Permission**: `view_financial_category`

#### 2. **GET /api/financial-categories/{id}**
- Get category by ID
- **Permission**: `view_financial_category`

#### 3. **POST /api/financial-categories**
- Create new category
- Request body must include `type` (income/expense)
- **Permission**: `create_financial_category`

#### 4. **PUT /api/financial-categories/{id}**
- Update category
- **Permission**: `edit_financial_category`

#### 5. **DELETE /api/financial-categories/{id}**
- Delete category (soft delete)
- **Permission**: `delete_financial_category`

### Financial Transactions

#### 1. **GET /api/financial-transactions**
- List financial transactions (paginated, sortable, filterable, searchable)
- Query params:
  - Pagination: `page`, `limit`
  - Filtering: `transaction_type` (income/expense), `category_id`, `start_date`, `end_date`, `min_amount`, `max_amount`
  - Searching: `search` (description, transaction_number)
  - Sorting: `sort_by`, `sort_direction`
- **Permission**: `view_financial_transaction`

#### 2. **GET /api/financial-transactions/{id}**
- Get transaction by ID (with category, branch, created_by, approved_by details)
- **Permission**: `view_financial_transaction`

#### 3. **POST /api/financial-transactions**
- Create new financial transaction
- Auto-generate `transaction_number` (#INC001 for income, #EXP001 for expense)
- Set `created_by` to current user
- Request body must include `transaction_type` (income/expense)
- **Permission**: `create_financial_transaction`

#### 4. **PUT /api/financial-transactions/{id}**
- Update financial transaction
- **Permission**: `edit_financial_transaction`

#### 5. **DELETE /api/financial-transactions/{id}**
- Delete financial transaction (soft delete)
- **Permission**: `delete_financial_transaction`

#### 6. **GET /api/financial-transactions/stats**
- Get financial statistics
- Query params: `start_date`, `end_date`, `category_id`, `transaction_type`
- Returns:
  - Total income
  - Total expenses
  - Net profit/loss
  - Income by category
  - Expenses by category
  - Monthly trends
- **Permission**: `view_financial_transaction`

#### 7. **GET /api/financial-transactions/export-pdf** (Optional - Phase 2)
- Export financial report as PDF
- **Permission**: `view_financial_transaction`


---

## 🎨 Frontend Structure

### Files to Create:

#### Views
- `admin/src/views/financial/FinancialTransactionsList.jsx` - Unified list page for both Income & Expense
- `admin/src/views/financial/FinancialCategoriesList.jsx` - Unified categories management page

#### Components
- `admin/src/components/pages/financial/FinancialTransactionForm.jsx` - Unified form for Create/Edit (handles both Income & Expense)
- `admin/src/components/pages/financial/FinancialTransactionDetailsModal.jsx` - Unified details modal
- `admin/src/components/pages/financial/FinancialCategoryForm.jsx` - Category form (with type dropdown)

#### Services
- `admin/src/services/financialService.js` - Unified financial transactions API service
- `admin/src/services/financialCategoryService.js` - Financial categories API service (or combine in financialService)

#### Constants
- Add financial permissions to `admin/src/constants/permissions.js`
- Add financial API endpoints to `admin/src/constants/api.js`

#### Navigation
- Add "Financial Management" menu item to `admin/src/_nav.jsx` (with sub-items: Transactions, Categories)
- Add routes to `admin/src/routes.jsx`

---

## 🎯 UI/UX Design

### Financial Transactions List Page (Unified)
- **Header Section**:
  - Page title: "Financial Transactions"
  - Add Transaction button (if has permission)
  - Filter section:
    - Transaction Type (dropdown: All/Income/Expense)
    - Date range
    - Category (dropdown, filtered by selected type)
  - Search bar
  - Export button (optional)

- **Statistics Cards** (Top):
  - Total Income (green card, current period)
  - Total Expenses (red card, current period)
  - Net Profit/Loss (blue/green if profit, red if loss)

- **Table Columns**:
  - Transaction Number (#INC001 / #EXP001)
  - Type (badge: Income/Expense - green for income, red for expense)
  - Date
  - Category (badge)
  - Description
  - Amount (formatted currency, green for income, red for expense)
  - Created By (user name)
  - Actions (View, Edit, Delete)

- **Features**:
  - Server-side pagination
  - Sortable columns
  - Row actions dropdown
  - Visual distinction: Income rows (light green background), Expense rows (light red background)

### Financial Transaction Form Modal (Unified)
- **Fields** (simplified form):
  - Transaction Type (dropdown: Income/Expense, required) - **First field, determines form behavior**
  - Transaction Date (date picker, required)
  - Category (dropdown, required) - **Filtered by selected transaction type**
  - Amount (number input, required, min: 0.01)
  - Description/Notes (textarea, multiline, optional)

- **Dynamic Behavior**:
  - When "Income" is selected: Category dropdown shows only income categories
  - When "Expense" is selected: Category dropdown shows only expense categories
  - Form validation ensures category type matches transaction type
  - Created by is automatically set to current user (not a form field)

- **Validation**:
  - Transaction Type is required
  - Transaction Date is required
  - Category is required
  - Amount is required and must be positive (min: 0.01)
  - Date cannot be future date (or allow with warning)
  - Category must match transaction type

### Financial Transaction Details Modal (Unified)
- **Sections**:
  - Basic Information (transaction number, type, date, category, amount)
  - Description/Notes (if provided)
  - Created By (user name)
  - Created/Updated timestamps

### Financial Categories List Page
- **Header Section**:
  - Page title: "Financial Categories"
  - Add Category button (if has permission)
  - Filter section:
    - Type (dropdown: All/Income/Expense)
    - Status (active/inactive)
  - Search bar

- **Table Columns**:
  - Type (badge: Income/Expense - green for income, red for expense)
  - Category Name
  - Description
  - Status (badge: active/inactive)
  - Created At
  - Actions (View, Edit, Delete)

- **Features**:
  - Server-side pagination
  - Sortable columns
  - Row actions dropdown
  - Visual distinction: Income categories (light green), Expense categories (light red)

### Financial Category Form Modal
- **Fields**:
  - Type (dropdown: Income/Expense, required) - **First field**
  - Category Title/Name (text input, required)
  - Description (textarea, optional)
  - Status (dropdown: active/inactive, default: active)

- **Validation**:
  - Type is required
  - Category name is required
  - Category name must be unique within the same type

---

## 📊 Integration Points

### Dashboard Integration
- Add financial statistics to dashboard:
  - Monthly income total
  - Monthly expense total
  - Net profit/loss
  - Income vs Expense trend chart
  - Recent income records
  - Recent expenses

### Reports Integration (Future)
- Expense reports by category
- Expense reports by branch
- Expense vs Revenue comparison

---

## 🚀 Implementation Phases

### Phase 1: Core Functionality
1. ✅ Database migrations (financial_categories, financial_transactions)
2. ✅ Backend models (FinancialCategory, FinancialTransaction)
3. ✅ Backend controllers (FinancialCategoryController, FinancialTransactionController)
4. ✅ Backend routes and permissions
5. ✅ Frontend service layer (financial services)
6. ✅ Frontend unified list page (financial transactions)
7. ✅ Frontend unified form component (handles both income & expense)
8. ✅ Frontend unified details modal
9. ✅ Frontend categories management page
10. ✅ Navigation and routing

### Phase 2: Advanced Features
1. ⏳ Financial statistics endpoints
2. ⏳ Combined financial overview page
3. ⏳ PDF export (income & expense reports)
4. ⏳ Dashboard integration (income, expense, net profit/loss)
5. ⏳ Financial summary reports

---

## ❓ Questions for Discussion

1. **Categories**:
   - Should we have predefined categories seeded for both income and expenses?

2. **Number Format**:
   - Income: Use #INC001 format?
   - Expense: Use #EXP001 format (like orders #ORD001, payments #PAY001)?
   - Or different formats?

3. **Amount Validation**:
   - Should we allow negative amounts (for refunds/adjustments)?
   - Or keep it positive only for both income and expenses?

4. **Dashboard Integration**:
   - Should financial transactions appear in dashboard in Phase 1 or Phase 2?
   - Should we show net profit/loss on dashboard?

---

## 📝 Next Steps

1. **Discuss and finalize** the questions above
2. **Start with Frontend** (as requested):
   - Create service files (financialService.js, financialCategoryService.js)
   - Create unified list page (FinancialTransactionsList.jsx)
   - Create unified form component (FinancialTransactionForm.jsx)
   - Create unified details modal (FinancialTransactionDetailsModal.jsx)
   - Create categories management page (FinancialCategoriesList.jsx)
   - Add navigation (Financial Management menu)
3. **Then Backend**:
   - Create migrations
   - Create models
   - Create controllers
   - Create routes
   - Add permissions

---

**Ready to discuss and start implementation!** 🚀
