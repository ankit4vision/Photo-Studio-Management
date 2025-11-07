# 📸 Photo Studio Admin Management System — Implementation Snapshot

This document replaces the legacy specification with an up-to-date view of the codebase as it exists **January 2026**. It focuses on actual behaviour, data sources, and the gaps that still need integration work.

---

## 🧱 Platform Overview

| Layer        | Details                                                                 |
|--------------|-------------------------------------------------------------------------| 
| Frontend     | React 18 + Vite, React-Bootstrap, CoreUI components, FontAwesome icons  |
| State        | Local component state, React Context for auth, mock JSON data fallback  |
| Backend      | Laravel REST API planned; only auth endpoints currently wired           |
| Auth         | JWT stored in `localStorage`; enhanced error toasts & logging           |
| PDF Export   | Custom HTML → `window.print()` utilities in `src/utils/pdfExport.js`    |

### Data Sources
- **Auth**: points to configured API (expects `/auth/login`).
- **Customers / Orders / Branches / Packages**: default to mock JSON in `src/mock/` with service-layer fallbacks when the API call fails.
- **New orders**: stored in-memory inside `ordersMockData` for the current session (no persistence across refreshes).

---

## 🚦 Module Health Snapshot

| Module            | Status | Notes |
|-------------------|--------|-------|
| Authentication    | 🟡  | Login wired to API with robust error handling. Role management UI not implemented. |
| Photographer Mgmt (Customers) | 🟢  | Complete UI overhaul for photographers, list + modal + PDF export. Uses mock data. |
| Orders            | 🟡  | Create + edit (multi-package) working with mock data. Needs real API wiring. |
| Branches          | 🟡  | Statistics built from photographer dataset. CRUD still mock-only. |
| Packages          | 🟡  | Mock package catalogue, exposed in orders form. CRUD calls fall back to mock. |
| Payments/Transactions | 🟡  | Create/Edit/view flows implemented with mock data, wallet maths auto-sync; needs real API persistence. |
| Reports / Settings | 🔴  | Stubs / legacy CoreUI pages. Not aligned with current data model. |

Legend: 🟢 Complete (mock OK) · 🟡 Functional but awaiting real API · 🔴 Needs implementation.

---

## 🔍 Detailed Module Notes

### 1. Authentication & Roles
- **UX**: Improved login feedback (`ToastProvider`, descriptive toasts, troubleshooting tips).
- **State**: JWT retained in `localStorage` via `AuthContext`.
- **Gaps**: Role-based routing placeholders exist (`PermissionRoute`) but role data not populated from backend.

### 2. Photographer Management (Customers)
- **List View** (`views/customers/CustomersList.jsx`):
  - Converted from customers to photographers with compact layout, responsive table, branch indicator (L/V).
  - Columns show Total/Paid/Remaining amounts, Services count, joined date.
  - PDF exports: full list + single photographer (beautified HTML-based design).
- **Details Modal**: Handles photographer stats, cards for Total/Paid/Remaining amounts, safe null checks.
- **Data**: `photographers.json` + `customerService` mock create/update flows.

### 3. Orders
- **List** (`OrdersList.jsx`):
  - Actions: View, **new** Edit, PDF export (invoice-style).
  - Customer names now resolved (`customer_name` stored on order, fallback via `customer` object).
- **Form** (`OrderForm.jsx` + `OrderFormView.jsx`):
  - Multi-select package picker, automatic price/qty population.
  - Supports single add and bulk add modes.
  - Edit flow now normalises legacy mock structure → pre-fills customer/branch/dates/items.
  - Validation ensures customer/branch/date and at least one item.
- **Service layer** (`orderService.js`):
  - API call with graceful mock fallback.
  - `createOrder` augments order with customer info, updates `ordersMockData`, and increments customer totals (services count respects number of items).
  - **TODO**: Persist new order to backend once endpoints exist; update stats dashboard accordingly.

### 4. Branches
- **BranchesList**: uses photographer dataset to compute revenue, customers, and services per branch. Cards + table reflect mock data.
- **Branch service**: CRUD methods fall back to `branches.json` when API fails.

### 5. Packages
- Mock dataset (`packages.json`) includes 20 photographer-centric services.
- Package service delivers fallback CRUD to maintain UI functionality.
- Orders form consumes packages to auto-populate pricing.

### 6. Payments & Transactions
- **TransactionsList**:
  - Action column now offers View, Edit, and PDF export (receipt-style) buttons.
  - Transaction details modal surfaces customer info, amounts, remarks with credit/debit badges.
- **TransactionForm**:
  - Customer selection auto-loads Total / Received / Remaining amounts derived from orders + transactions.
  - Amount/type changes instantly preview remaining balance before save.
  - Edit mode pre-fills data and recalculates wallet totals safely.
- **Service layer** (`transactionService.js`):
  - Fallback mock create/update/delete now re-compute customer wallet stats via `recalculateCustomerAmounts` (combines orders + payments).
  - Ready to swap to Laravel endpoints once exposed.

### 7. PDF Utilities (`utils/pdfExport.js`)
- `exportPhotographersToPDF`, `exportSinglePhotographerToPDF`, `exportOrderToPDF`, `exportTransactionToPDF` deliver polished printable documents.
- Based on HTML templates + `window.print()` (no external dependency yet). Conversion to jsPDF remains optional future work.

### 8. Miscellaneous Improvements
- Enhanced logging & error handling around Axios client (`config/apiClient.js`).
- Toast system centralised in `ToastProvider.jsx` with success/error helpers.
- Mock service pattern standardised (try API → fallback to mock generator → return structured `{ success, data }`).

---

## 🧪 Known Limitations & Next Steps

1. **API Integration**
   - Wire `orderService`, `customerService`, `branchService`, etc., to Laravel endpoints once available.
   - Persist order creation and updates server-side.

2. **State Synchronisation**
   - Orders created during a session live only in-memory; consider local storage or optimistic UI strategy until backend is ready.

3. **Payments & Transactions**
   - Wire mock flows to backend endpoints for persistence and reporting once available.
   - Consider transaction history pagination / filters when API is ready.

4. **Role-Based Access**
   - Implement role fetch (`/auth/me`) and adjust menu visibility / routing accordingly.

5. **Testing**
   - No unit/integration tests yet. Introduce vitest/react-testing-library for critical flows (auth, orders form, PDF utils).

6. **Design Consistency**
   - Some legacy CoreUI pages remain untouched (reports, settings). Align styling with new sections when those modules are addressed.

---

## 🚀 Developer Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Lint (optional)
npm run lint
```

Environment variables live in `admin/env.example`. Update API base URL to point to the Laravel backend when ready.

---

## 📦 Mock Data Cheat Sheet

| File | Purpose |
|------|---------|
| `src/mock/photographers.json` | Primary dataset for photographer management + branch stats |
| `src/mock/orders.json`        | Seed orders list & supports order edit normalisation       |
| `src/mock/packages.json`      | Package catalogue used in order form multi-select          |
| `src/mock/branches.json`      | Branch fallback data                                       |

Use `customerService.*` and `orderService.*` helpers to generate consistent mock responses in new modules.

---

## 📈 Recent Highlights
- Photographer table redesigned: compact actions, no horizontal scroll, branch indicator integrated into name column.
- Customer modal displays Total/Paid/Remaining and gracefully handles missing data.
- Orders form robust multi-select with automatic price/qty, pre-filling edits, and PDF invoice export.
- Transactions module now supports view/edit/PDF export plus live wallet calculations tied to orders.
- Order creation updates linked customer statistics (services count, amounts, last order date).

---

This document should be treated as the authoritative snapshot of the current frontend implementation. Update after major feature work or when real API integration replaces mock fallbacks.
