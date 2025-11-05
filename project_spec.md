# 📸 Photo Studio Admin Management System

**Tech Stack:**

* Frontend: React + Vite + JSX 
* Backend: PHP Laravel (REST API)
* Auth: JWT
* Architecture: Multi-Branch, Role-Based Access


## 🧩 MODULES OVERVIEW

### 1. Authentication & Roles

**Purpose:** Secure access with user roles (Admin, Manager, Staff)

**Frontend Pages:**

* `/login`
* `/profile`
* `/users/list`
* `/users/form`

**Backend API Endpoints:**

| Method | Endpoint       | Description          |
| ------ | -------------- | -------------------- |
| POST   | `/auth/login`  | Login and return JWT |
| POST   | `/auth/logout` | Logout user          |
| GET    | `/auth/me`     | Fetch logged-in user |
| GET    | `/users`       | List users           |
| POST   | `/users`       | Create user          |
| PUT    | `/users/{id}`  | Update user          |
| DELETE | `/users/{id}`  | Delete user          |

**User Fields:**
`id`, `name`, `email`, `mobile`, `password`, `role` (admin/manager/staff), `branch_id`, `status`, `created_at`

---

### 2. Branch Management

**Frontend Pages:**

* `/branches/list`
* `/branches/form`

**Backend API Endpoints:**

| Method | Endpoint         | Description   |
| ------ | ---------------- | ------------- |
| GET    | `/branches`      | List branches |
| POST   | `/branches`      | Add branch    |
| PUT    | `/branches/{id}` | Update branch |
| DELETE | `/branches/{id}` | Delete branch |

**Fields:**
`id`, `branch_name`, `branch_code`, `address`, `city`, `contact_number`, `email`, `status`

---

### 3. Customer Management

**Frontend Pages:**

* `/customers/list`
* `/customers/form`
* `/customers/view/{id}`

**Backend API Endpoints:**

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| GET    | `/customers`      | List all customers    |
| POST   | `/customers`      | Create customer       |
| GET    | `/customers/{id}` | View customer details |
| PUT    | `/customers/{id}` | Update customer       |
| DELETE | `/customers/{id}` | Delete customer       |

**Fields:**
`id`, `branch_id`, `name`, `mobile`, `email`, `address`, `dob`, `anniversary_date`, `wallet_balance`, `total_orders`, `status`, `created_by`, `created_at`

**Extra Functionality:**

* Customer ledger view (orders + transactions)
* Wallet summary

---

### 4. Package Management

**Frontend Pages:**

* `/packages/list`
* `/packages/form`

**Backend API Endpoints:**

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/packages`      | List all packages |
| POST   | `/packages`      | Add package       |
| PUT    | `/packages/{id}` | Update package    |
| DELETE | `/packages/{id}` | Delete package    |

**Fields:**
`id`, `package_name`, `package_type` (Album / PhotoShoot / Editing / Video), `default_price`, `description`, `status`

---

### 5. Order Management

**Frontend Pages:**

* `/orders/list`
* `/orders/form`
* `/orders/view/{id}`

**Backend API Endpoints:**

| Method | Endpoint       | Description      |
| ------ | -------------- | ---------------- |
| GET    | `/orders`      | List orders      |
| POST   | `/orders`      | Create new order |
| GET    | `/orders/{id}` | View order       |
| PUT    | `/orders/{id}` | Update order     |
| DELETE | `/orders/{id}` | Delete order     |

**Order Fields:**
`id`, `customer_id`, `branch_id`, `order_date`, `due_date`, `flat_discount`, `total_amount`, `paid_amount`, `balance_amount`, `status`

**Order Items (Multiple Packages):**

| Field          | Description                    |
| -------------- | ------------------------------ |
| `id`           | Primary key                    |
| `order_id`     | Linked order                   |
| `package_id`   | Selected package               |
| `package_name` | Auto-filled                    |
| `price`        | Default from package, editable |
| `qty`          | Quantity                       |
| `amount`       | Calculated (price × qty)       |

**Logic:**

* Selecting a package auto-fills its price but allows editing
* Supports multiple packages per order
* Flat discount applies to total bill

---

### 6. Transactions (Wallet / Credit-Debit)

**Frontend Pages:**

* `/transactions/list`
* `/transactions/form`
* `/customers/{id}/wallet`

**Backend API Endpoints:**

| Method | Endpoint             | Description        |
| ------ | -------------------- | ------------------ |
| GET    | `/transactions`      | List transactions  |
| POST   | `/transactions`      | Add transaction    |
| GET    | `/transactions/{id}` | View transaction   |
| PUT    | `/transactions/{id}` | Update transaction |

**Fields:**
`id`, `customer_id`, `order_id (nullable)`, `branch_id`, `transaction_date`, `type` (`credit` or `debit`), `amount`, `remarks`, `created_by`

**Logic:**

* Credit = Money In (advance, payment received)
* Debit = Money Out (order, refund, due)
* Auto-created on order/payment actions
* Manual add option for adjustments

---

### 7. Payment Management

**Linked to Transactions**

**Features:**

* Partial / full payments
* Advance balance handling
* Payment methods: Cash / UPI / Card

**Endpoints:**

| Method | Endpoint                     | Description              |
| ------ | ---------------------------- | ------------------------ |
| POST   | `/payments`                  | Record payment for order |
| GET    | `/payments/order/{order_id}` | View order payments      |

---

### 8. Reports

**Frontend Pages:**

* `/reports/sales`
* `/reports/ledger`
* `/reports/branch`
* `/reports/staff`

**Reports:**

* Branch-wise Sales Summary
* Customer Ledger
* Order Summary
* Income vs Due
* Staff Performance

---

### 9. Settings

* `/settings/general`
* `/settings/branches`
* `/settings/invoice`

**Global Settings Fields:**
`currency`, `tax_percentage`, `company_name`, `logo`, `invoice_prefix`

---

## 💰 Wallet Logic

**Wallet Formula:**

```
wallet_balance = total_credit - total_debit
```

**Examples:**

* Order Created → Debit = order_amount
* Payment Received → Credit = paid_amount
* Advance Added → Credit = amount
* Refund → Debit = amount

---

## 🔄 Example Workflow

1. Admin adds **Branches** and **Users**
2. Staff adds **Packages**
3. Customer registered under branch
4. Create **Order** → Select multiple packages → Adjust price → Apply flat discount
5. Record **Payment** → Auto-creates transaction
6. View **Customer Wallet / Ledger** anytime
