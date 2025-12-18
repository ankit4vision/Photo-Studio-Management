# Income & Expense Management Module - Planning Document

## 📋 Overview

This document outlines the plan for implementing an **Income & Expense Management** module for the Photo Studio Management system. This module will allow tracking and managing both business income (other income sources, 3rd party income) and expenses across branches, providing a complete financial overview.

---

## 🎯 Core Features

### 1. **Income Categories Management**
- Create, edit, delete income categories
- Categories like: Rental Income, Commission, Interest Income, Other Services, Investment Returns, etc.
- Category status (active/inactive)
- Category description

### 2. **Income Records Management**
- **CRUD Operations**: Create, Read, Update, Delete income records
- **Key Fields**:
  - Income date
  - Category (required)
  - Amount (required)
  - Description/Notes
  - Source/Client name (who paid)
  - Payment method (cash, upi, card, bank_transfer, cheque)
  - Branch (optional, for multi-branch tracking)
  - Status (pending, approved, rejected)
  - Approved by (user reference)
  - Created by (user reference)
  - Receipt/Invoice reference (text field for receipt number/URL - no file upload)

### 3. **Expense Categories Management**
- Create, edit, delete expense categories
- Categories like: Office Supplies, Utilities, Marketing, Travel, Equipment, Rent, Salaries, etc.
- Category status (active/inactive)
- Category description

### 4. **Expense Records Management**
- **CRUD Operations**: Create, Read, Update, Delete expenses
- **Key Fields**:
  - Expense date
  - Category (required)
  - Amount (required)
  - Description/Notes
  - Vendor/Supplier name
  - Payment method (cash, upi, card, bank_transfer, cheque)
  - Branch (optional, for multi-branch tracking)
  - Status (pending, approved, rejected)
  - Approved by (user reference)
  - Created by (user reference)
  - Receipt reference (text field for receipt number/URL - no file upload)

### 5. **Income Tracking & Reporting**
- List income records with server-side pagination, filtering, and searching
- Filter by:
  - Date range
  - Category
  - Status
  - Branch
  - Payment method
  - Amount range
- Search by:
  - Description
  - Source/Client name
  - Income number
- Sort by: Date, Amount, Category, Status

### 6. **Expense Tracking & Reporting**
- List expenses with server-side pagination, filtering, and searching
- Filter by:
  - Date range
  - Category
  - Status
  - Branch
  - Payment method
  - Amount range
- Search by:
  - Description
  - Vendor name
  - Expense number
- Sort by: Date, Amount, Category, Status

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

### 8. **Approval Workflow** (Optional - Phase 1 or Phase 2)
- Approve/Reject income and expenses
- Approval history
- Pending approvals list

---

## 🗄️ Database Schema

### Table 1: `income_categories`
```sql
- id (bigint, primary key)
- name (varchar(255), unique, not null) - e.g., "Rental Income"
- description (text, nullable)
- status (enum: 'active', 'inactive', default: 'active')
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp) - soft delete
```

**Indexes:**
- PRIMARY KEY (`id`)
- UNIQUE (`name`)
- INDEX (`status`)

### Table 2: `incomes`
```sql
- id (bigint, primary key)
- income_number (varchar(255), unique, not null) - Auto-generated: #INC001, #INC002
- income_date (date, not null)
- category_id (bigint, foreign key → income_categories.id, not null)
- amount (decimal(12,2), not null)
- description (text, nullable)
- source_name (varchar(255), nullable) - Source/Client who paid
- payment_method (enum: 'cash', 'upi', 'card', 'bank_transfer', 'cheque', default: 'cash')
- branch_id (bigint, foreign key → branches.id, nullable)
- status (enum: 'pending', 'approved', 'rejected', default: 'pending')
- approved_by (bigint, foreign key → users.id, nullable)
- approved_at (timestamp, nullable)
- created_by (bigint, foreign key → users.id, not null)
- receipt_reference (varchar(500), nullable) - Receipt/Invoice number or URL
- notes (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp) - soft delete
```

**Foreign Keys:**
- `category_id` → `income_categories.id` (ON DELETE RESTRICT)
- `branch_id` → `branches.id` (ON DELETE SET NULL)
- `created_by` → `users.id` (ON DELETE RESTRICT)
- `approved_by` → `users.id` (ON DELETE SET NULL)

**Indexes:**
- PRIMARY KEY (`id`)
- UNIQUE (`income_number`)
- INDEX (`income_date`)
- INDEX (`category_id`)
- INDEX (`branch_id`)
- INDEX (`status`)
- INDEX (`created_by`)
- INDEX (`created_at`)

### Table 3: `expense_categories`
```sql
- id (bigint, primary key)
- name (varchar(255), unique, not null) - e.g., "Office Supplies"
- description (text, nullable)
- status (enum: 'active', 'inactive', default: 'active')
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp) - soft delete
```

**Indexes:**
- PRIMARY KEY (`id`)
- UNIQUE (`name`)
- INDEX (`status`)

### Table 4: `expenses`
```sql
- id (bigint, primary key)
- expense_number (varchar(255), unique, not null) - Auto-generated: #EXP001, #EXP002
- expense_date (date, not null)
- category_id (bigint, foreign key → expense_categories.id, not null)
- amount (decimal(12,2), not null)
- description (text, nullable)
- vendor_name (varchar(255), nullable)
- payment_method (enum: 'cash', 'upi', 'card', 'bank_transfer', 'cheque', default: 'cash')
- branch_id (bigint, foreign key → branches.id, nullable)
- status (enum: 'pending', 'approved', 'rejected', default: 'pending')
- approved_by (bigint, foreign key → users.id, nullable)
- approved_at (timestamp, nullable)
- created_by (bigint, foreign key → users.id, not null)
- receipt_reference (varchar(500), nullable) - Receipt number or URL
- notes (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)
- deleted_at (timestamp) - soft delete
```

**Foreign Keys:**
- `category_id` → `expense_categories.id` (ON DELETE RESTRICT)
- `branch_id` → `branches.id` (ON DELETE SET NULL)
- `created_by` → `users.id` (ON DELETE RESTRICT)
- `approved_by` → `users.id` (ON DELETE SET NULL)

**Indexes:**
- PRIMARY KEY (`id`)
- UNIQUE (`expense_number`)
- INDEX (`expense_date`)
- INDEX (`category_id`)
- INDEX (`branch_id`)
- INDEX (`status`)
- INDEX (`created_by`)
- INDEX (`created_at`)

---

## 🔐 Permissions

Following the existing pattern:

### Income Permissions
- `view_income` - View income list and details
- `create_income` - Create new income records
- `edit_income` - Edit existing income records
- `delete_income` - Delete income records
- `approve_income` - Approve/reject income records (optional)
- `view_income_category` - View income categories
- `create_income_category` - Create income categories
- `edit_income_category` - Edit income categories
- `delete_income_category` - Delete income categories

### Expense Permissions
- `view_expense` - View expenses list and details
- `create_expense` - Create new expenses
- `edit_expense` - Edit existing expenses
- `delete_expense` - Delete expenses
- `approve_expense` - Approve/reject expenses (optional)
- `view_expense_category` - View expense categories
- `create_expense_category` - Create expense categories
- `edit_expense_category` - Edit expense categories
- `delete_expense_category` - Delete expense categories

---

## 🌐 API Endpoints

### Income Categories

#### 1. **GET /api/income-categories**
- List all income categories (paginated, sortable)
- Query params: `page`, `limit`, `search`, `status`, `sort_by`, `sort_direction`
- **Permission**: `view_income_category`

#### 2. **GET /api/income-categories/{id}**
- Get category by ID
- **Permission**: `view_income_category`

#### 3. **POST /api/income-categories**
- Create new category
- **Permission**: `create_income_category`

#### 4. **PUT /api/income-categories/{id}**
- Update category
- **Permission**: `edit_income_category`

#### 5. **DELETE /api/income-categories/{id}**
- Delete category (soft delete)
- **Permission**: `delete_income_category`

### Incomes

#### 1. **GET /api/incomes**
- List incomes (paginated, sortable, filterable, searchable)
- Query params:
  - Pagination: `page`, `limit`
  - Filtering: `category_id`, `branch_id`, `status`, `payment_method`, `start_date`, `end_date`, `min_amount`, `max_amount`
  - Searching: `search` (description, source_name, income_number)
  - Sorting: `sort_by`, `sort_direction`
- **Permission**: `view_income`

#### 2. **GET /api/incomes/{id}**
- Get income by ID (with category, branch, created_by, approved_by details)
- **Permission**: `view_income`

#### 3. **POST /api/incomes**
- Create new income record
- Auto-generate `income_number` (#INC001 format)
- Set `created_by` to current user
- **Permission**: `create_income`

#### 4. **PUT /api/incomes/{id}**
- Update income record
- **Permission**: `edit_income`

#### 5. **DELETE /api/incomes/{id}**
- Delete income record (soft delete)
- **Permission**: `delete_income`

#### 6. **PUT /api/incomes/{id}/approve**
- Approve income record
- Set `status` to 'approved', `approved_by` to current user, `approved_at` to now
- **Permission**: `approve_income`

#### 7. **PUT /api/incomes/{id}/reject**
- Reject income record
- Set `status` to 'rejected', `approved_by` to current user, `approved_at` to now
- **Permission**: `approve_income`

#### 8. **GET /api/incomes/stats**
- Get income statistics
- Query params: `start_date`, `end_date`, `branch_id`, `category_id`
- Returns:
  - Total income
  - Income by category
  - Income by branch
  - Monthly trends
- **Permission**: `view_income`

#### 9. **GET /api/incomes/export-pdf** (Optional - Phase 2)
- Export income report as PDF
- **Permission**: `view_income`

### Expense Categories

#### 1. **GET /api/expense-categories**
- List all expense categories (paginated, sortable)
- Query params: `page`, `limit`, `search`, `status`, `sort_by`, `sort_direction`
- **Permission**: `view_expense_category`

#### 2. **GET /api/expense-categories/{id}**
- Get category by ID
- **Permission**: `view_expense_category`

#### 3. **POST /api/expense-categories**
- Create new category
- **Permission**: `create_expense_category`

#### 4. **PUT /api/expense-categories/{id}**
- Update category
- **Permission**: `edit_expense_category`

#### 5. **DELETE /api/expense-categories/{id}**
- Delete category (soft delete)
- **Permission**: `delete_expense_category`

### Expenses

#### 1. **GET /api/expenses**
- List expenses (paginated, sortable, filterable, searchable)
- Query params:
  - Pagination: `page`, `limit`
  - Filtering: `category_id`, `branch_id`, `status`, `payment_method`, `start_date`, `end_date`, `min_amount`, `max_amount`
  - Searching: `search` (description, vendor_name, expense_number)
  - Sorting: `sort_by`, `sort_direction`
- **Permission**: `view_expense`

#### 2. **GET /api/expenses/{id}**
- Get expense by ID (with category, branch, created_by, approved_by details)
- **Permission**: `view_expense`

#### 3. **POST /api/expenses**
- Create new expense
- Auto-generate `expense_number` (#EXP001 format)
- Set `created_by` to current user
- **Permission**: `create_expense`

#### 4. **PUT /api/expenses/{id}**
- Update expense
- **Permission**: `edit_expense`

#### 5. **DELETE /api/expenses/{id}**
- Delete expense (soft delete)
- **Permission**: `delete_expense`

#### 6. **PUT /api/expenses/{id}/approve**
- Approve expense
- Set `status` to 'approved', `approved_by` to current user, `approved_at` to now
- **Permission**: `approve_expense`

#### 7. **PUT /api/expenses/{id}/reject**
- Reject expense
- Set `status` to 'rejected', `approved_by` to current user, `approved_at` to now
- **Permission**: `approve_expense`

#### 8. **GET /api/expenses/stats**
- Get expense statistics
- Query params: `start_date`, `end_date`, `branch_id`, `category_id`
- Returns:
  - Total expenses
  - Expenses by category
  - Expenses by branch
  - Monthly trends
- **Permission**: `view_expense`

#### 9. **GET /api/expenses/export-pdf** (Optional - Phase 2)
- Export expense report as PDF
- **Permission**: `view_expense`

### Combined Financial Endpoints

#### 1. **GET /api/financial/summary**
- Get combined income and expense summary
- Query params: `start_date`, `end_date`, `branch_id`
- Returns:
  - Total income
  - Total expenses
  - Net profit/loss
  - Income by category
  - Expenses by category
  - Branch-wise breakdown
- **Permission**: `view_income` AND `view_expense`

#### 2. **GET /api/financial/export-pdf** (Optional - Phase 2)
- Export combined financial report as PDF
- **Permission**: `view_income` AND `view_expense`

---

## 🎨 Frontend Structure

### Files to Create:

#### Views
- `admin/src/views/financial/FinancialOverview.jsx` - Combined income & expense overview (optional)
- `admin/src/views/incomes/IncomesList.jsx` - Main income records list page
- `admin/src/views/incomes/IncomeCategoriesList.jsx` - Income categories management (optional)
- `admin/src/views/expenses/ExpensesList.jsx` - Main expenses list page
- `admin/src/views/expenses/ExpenseCategoriesList.jsx` - Expense categories management (optional)

#### Components
- `admin/src/components/pages/incomes/IncomeForm.jsx` - Create/Edit income form
- `admin/src/components/pages/incomes/IncomeDetailsModal.jsx` - Income details modal
- `admin/src/components/pages/incomes/IncomeCategoryForm.jsx` - Income category form
- `admin/src/components/pages/expenses/ExpenseForm.jsx` - Create/Edit expense form
- `admin/src/components/pages/expenses/ExpenseDetailsModal.jsx` - Expense details modal
- `admin/src/components/pages/expenses/ExpenseCategoryForm.jsx` - Expense category form

#### Services
- `admin/src/services/incomeService.js` - Income API service
- `admin/src/services/incomeCategoryService.js` - Income category API service (or combine in incomeService)
- `admin/src/services/expenseService.js` - Expense API service
- `admin/src/services/expenseCategoryService.js` - Expense category API service (or combine in expenseService)
- `admin/src/services/financialService.js` - Combined financial API service (optional)

#### Constants
- Add income & expense permissions to `admin/src/constants/permissions.js`
- Add income & expense API endpoints to `admin/src/constants/api.js`

#### Navigation
- Add "Income & Expenses" menu item to `admin/src/_nav.jsx` (with sub-items: Incomes, Expenses, Financial Overview)
- Add routes to `admin/src/routes.jsx`

---

## 🎯 UI/UX Design

### Financial Overview Page (Optional - Combined View)
- **Header Section**:
  - Page title: "Financial Overview"
  - Tabs: "Income", "Expenses", "Summary"
  - Date range filter
  - Branch filter

- **Summary Cards**:
  - Total Income (green)
  - Total Expenses (red)
  - Net Profit/Loss (blue/green if profit, red if loss)
  - This Month Income
  - This Month Expenses

- **Charts**:
  - Income vs Expense trend chart
  - Income by category pie chart
  - Expenses by category pie chart

### Incomes List Page
- **Header Section**:
  - Page title: "Income Management"
  - Add Income button (if has permission)
  - Filter section (date range, category, status, branch, payment method)
  - Search bar
  - Export button (optional)

- **Statistics Cards** (Top):
  - Total Income (current period)
  - Pending Approvals (if approval workflow enabled)
  - This Month Income
  - Top Category

- **Table Columns**:
  - Income Number (#INC001)
  - Date
  - Category (badge)
  - Description
  - Source/Client
  - Amount (formatted currency, green)
  - Payment Method (badge)
  - Branch (if multi-branch)
  - Status (badge: pending/approved/rejected)
  - Actions (View, Edit, Delete, Approve/Reject)

- **Features**:
  - Server-side pagination
  - Sortable columns
  - Row actions dropdown
  - Status color coding:
    - Pending: Yellow/Orange
    - Approved: Green
    - Rejected: Red

### Income Form Modal
- **Fields**:
  - Income Date (date picker, required)
  - Category (dropdown, required)
  - Amount (number input, required, min: 0.01)
  - Description (textarea)
  - Source/Client Name (text input)
  - Payment Method (dropdown: cash, upi, card, bank_transfer, cheque)
  - Branch (dropdown, optional)
  - Receipt/Invoice Reference (text input, optional)
  - Notes (textarea, optional)

- **Validation**:
  - All required fields
  - Amount must be positive
  - Date cannot be future date (or allow with warning)

### Income Details Modal
- **Sections**:
  - Basic Information (income number, date, category, amount)
  - Payment Details (payment method, source/client, receipt reference)
  - Branch Information (if applicable)
  - Status & Approval (status, approved by, approved at)
  - Notes
  - Created/Updated timestamps

### Expenses List Page
- **Header Section**:
  - Page title: "Expense Management"
  - Add Expense button (if has permission)
  - Filter section (date range, category, status, branch, payment method)
  - Search bar
  - Export button (optional)

- **Statistics Cards** (Top):
  - Total Expenses (current period)
  - Pending Approvals (if approval workflow enabled)
  - This Month Expenses
  - Top Category

- **Table Columns**:
  - Expense Number (#EXP001)
  - Date
  - Category (badge)
  - Description
  - Vendor
  - Amount (formatted currency)
  - Payment Method (badge)
  - Branch (if multi-branch)
  - Status (badge: pending/approved/rejected)
  - Actions (View, Edit, Delete, Approve/Reject)

- **Features**:
  - Server-side pagination
  - Sortable columns
  - Row actions dropdown
  - Status color coding:
    - Pending: Yellow/Orange
    - Approved: Green
    - Rejected: Red

### Expense Form Modal
- **Fields**:
  - Expense Date (date picker, required)
  - Category (dropdown, required)
  - Amount (number input, required, min: 0.01)
  - Description (textarea)
  - Vendor Name (text input)
  - Payment Method (dropdown: cash, upi, card, bank_transfer, cheque)
  - Branch (dropdown, optional)
  - Receipt Reference (text input, optional)
  - Notes (textarea, optional)

- **Validation**:
  - All required fields
  - Amount must be positive
  - Date cannot be future date (or allow with warning)

### Expense Details Modal
- **Sections**:
  - Basic Information (expense number, date, category, amount)
  - Payment Details (payment method, vendor, receipt reference)
  - Branch Information (if applicable)
  - Status & Approval (status, approved by, approved at)
  - Notes
  - Created/Updated timestamps

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
1. ✅ Database migrations (income_categories, incomes, expense_categories, expenses)
2. ✅ Backend models (IncomeCategory, Income, ExpenseCategory, Expense)
3. ✅ Backend controllers (IncomeCategoryController, IncomeController, ExpenseCategoryController, ExpenseController)
4. ✅ Backend routes and permissions
5. ✅ Frontend service layer (income & expense services)
6. ✅ Frontend list pages (incomes & expenses)
7. ✅ Frontend form components (income & expense forms)
8. ✅ Frontend details modals (income & expense details)
9. ✅ Navigation and routing
10. ✅ Category management (income & expense categories)

### Phase 2: Advanced Features
1. ⏳ Approval workflow (income & expenses)
2. ⏳ Financial statistics endpoints
3. ⏳ Combined financial overview page
4. ⏳ PDF export (income & expense reports)
5. ⏳ Dashboard integration (income, expense, net profit/loss)
6. ⏳ Financial summary reports

---

## ❓ Questions for Discussion

1. **Module Structure**:
   - Should Income and Expenses be in separate menu items or combined under "Financial Management"?
   - Should we have a combined "Financial Overview" page showing both?

2. **Approval Workflow**: 
   - Should we implement approval workflow in Phase 1 or Phase 2?
   - Who can approve income/expenses? (All users with permission or specific roles?)
   - Should income and expenses have the same approval workflow?

3. **Categories**:
   - Should categories be managed in separate pages or inline in the forms?
   - Should we have predefined categories seeded for both income and expenses?
   - Should income and expense categories be managed together or separately?

4. **Receipt Handling**:
   - Since file upload is removed, should we just use a text field for receipt reference/URL?
   - Or should we add receipt upload back just for income & expenses?

5. **Branch Association**:
   - Should income and expenses be required to have a branch, or optional?
   - Should we show branch-wise financial reports?

6. **Number Format**:
   - Income: Use #INC001 format?
   - Expense: Use #EXP001 format (like orders #ORD001, payments #PAY001)?
   - Or different formats?

7. **Status Management**:
   - Should users be able to change status directly, or only through approve/reject?
   - Should there be a "draft" status for income/expenses being created?

8. **Amount Validation**:
   - Should we allow negative amounts (for refunds/adjustments)?
   - Or keep it positive only for both income and expenses?

9. **Dashboard Integration**:
   - Should income & expenses appear in dashboard in Phase 1 or Phase 2?
   - Should we show net profit/loss on dashboard?

10. **Income Source Field**:
    - Should "source_name" be a simple text field or a dropdown with existing customers/clients?
    - Or should it be free text to allow any source (3rd party, etc.)?

---

## 📝 Next Steps

1. **Discuss and finalize** the questions above
2. **Start with Frontend** (as requested):
   - Create service files (income & expense services)
   - Create list pages (incomes & expenses)
   - Create form components (income & expense forms)
   - Create details modals (income & expense details)
   - Add navigation (Income & Expenses menu)
3. **Then Backend**:
   - Create migrations
   - Create models
   - Create controllers
   - Create routes
   - Add permissions

---

**Ready to discuss and start implementation!** 🚀
