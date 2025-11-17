# Database Columns - Final Review

## Quick Summary

| Table | Total Columns | Keep | Remove | Status |
|-------|--------------|------|--------|--------|
| `customers` | 28 | 21 | 7 | ⚠️ Needs cleanup |
| `orders` | 18 | 16 | 2 | ⚠️ Needs cleanup |
| `order_items` | 9 | 9 | 0 | ✅ Clean |
| `payments` | 13 | 13 | 0 | ✅ Clean |
| `packages` | 9 | 9 | 0 | ✅ Clean |
| `branches` | 12 | 12 | 0 | ✅ Clean |
| `users` | 20 | 20 | 0 | ✅ Clean |
| `roles` | 7 | 7 | 0 | ✅ Clean |
| `permissions` | 9 | 9 | 0 | ✅ Clean |
| `settings` | 6 | 6 | 0 | ✅ Clean |
| `emails` | 11 | 11 | 0 | ✅ Clean |

**Total Columns to Remove: 9**

---

## Detailed Column Lists

### 📋 `customers` Table - Final Columns

#### ✅ KEEP (21 columns)
```
id
customer_code
first_name
last_name
email
phone
mobile
address
city
state
postal_code
country
branch_id
status
dob
anniversary_date
notes
preferences
avatar
created_at
updated_at
deleted_at
```

#### ❌ REMOVE (7 columns)
```
total_orders          → Calculate: COUNT(orders)
total_services        → Calculate: SUM(order_items.quantity)
total_amount          → Calculate: SUM(orders.total_amount)
paid_amount           → Calculate: SUM(payments WHERE payment_type='credit') - SUM(payments WHERE payment_type='debit')
remaining_amount      → Calculate: total_amount - paid_amount
wallet_balance        → Same as paid_amount (redundant)
last_order_date       → Calculate: MAX(orders.order_date)
```

---

### 📋 `orders` Table - Final Columns

#### ✅ KEEP (16 columns)
```
id
order_number
customer_id
branch_id
order_date
due_date
subtotal
discount
total_amount
status
payment_status
payment_method
notes
timeline
created_at
updated_at
deleted_at
```

#### ❌ REMOVE (2 columns)
```
paid_amount           → Calculate: SUM(payments WHERE payment_type='credit') - SUM(payments WHERE payment_type='debit')
remaining_amount      → Calculate: total_amount - paid_amount
```

**Note on `subtotal`:**
- Keep `subtotal` but ensure it's auto-calculated from `order_items`
- Keep `total_amount` (subtotal - discount)

**Note on `payment_status`:**
- Keep `payment_status` but calculate it based on payments relationship
- Logic: `paid` if paid_amount >= total_amount, `partial` if paid_amount > 0, `pending` otherwise

---

### 📋 `order_items` Table - Final Columns

#### ✅ KEEP (9 columns) - No Changes
```
id
order_id
package_id
quantity
unit_price
total_price
package_name
package_type
created_at
updated_at
```

**All columns are necessary** ✅

---

### 📋 `payments` Table - Final Columns

#### ✅ KEEP (13 columns) - No Changes
```
id
payment_number
order_id
customer_id
branch_id
payment_date
payment_type
amount
payment_method
remarks
created_at
updated_at
deleted_at
```

**All columns are necessary** ✅

**Note:** `customer_id` and `branch_id` are redundant but kept for query performance.

---

### 📋 `packages` Table - Final Columns

#### ✅ KEEP (9 columns) - No Changes
```
id
package_name
package_type
default_price
description
status
created_at
updated_at
deleted_at
```

**All columns are necessary** ✅

---

### 📋 `branches` Table - Final Columns

#### ✅ KEEP (12 columns) - No Changes
```
id
branch_code
branch_name
email
contact_number
address
city
state
country
postal_code
status
created_at
updated_at
deleted_at
```

**All columns are necessary** ✅

---

### 📋 `users` Table - Final Columns

#### ✅ KEEP (20 columns) - No Changes
```
id
first_name
last_name
email
email_verified_at
password
phone
status
address
city
state
zip_code
country
bio
avatar
date_of_birth
gender
remember_token
created_at
updated_at
```

**All columns are necessary** ✅

**Note:** Consider converting `status` to enum for data integrity.

---

### 📋 `roles` Table - Final Columns

#### ✅ KEEP (7 columns) - No Changes
```
id
name
description
is_active
is_deleted
created_at
updated_at
```

**All columns are necessary** ✅

**Note:** Consider migrating to standard Laravel soft deletes (`deleted_at`).

---

### 📋 `permissions` Table - Final Columns

#### ✅ KEEP (9 columns) - No Changes
```
id
name
description
module
submodule
type
is_active
is_deleted
created_at
updated_at
```

**All columns are necessary** ✅

**Note:** Consider migrating to standard Laravel soft deletes (`deleted_at`).

---

### 📋 `settings` Table - Final Columns

#### ✅ KEEP (6 columns) - No Changes
```
id
key
value
group
description
created_at
updated_at
```

**All columns are necessary** ✅

---

### 📋 `emails` Table - Final Columns

#### ✅ KEEP (11 columns) - No Changes
```
id
to_email
from_email
type
subject
body
send_status
response_message
related_id
related_type
sent_at
created_at
updated_at
```

**All columns are necessary** ✅

---

## Data Flow After Cleanup

```
Customer (Profile Only)
    ↓
    ├──→ Orders (Order Details)
    │       ├──→ OrderItems (Selected Packages)
    │       └──→ Payments (Payment Records)
    │
    └──→ Payments (Direct Customer Payments)
```

**Key Principle:**
- **Customer** = Profile data only
- **Order** = Order details + calculated totals from items
- **Payment** = Source of truth for all payment data
- All statistics calculated on-the-fly via relationships

---

## Calculation Logic

### Customer Statistics (via Accessors)

```php
// Customer Model Accessors
total_orders      = $customer->orders()->count()
total_services     = $customer->orders->sum(fn($o) => $o->items->sum('quantity'))
total_amount      = $customer->orders()->sum('total_amount')
paid_amount       = $customer->payments()->where('payment_type', 'credit')->sum('amount') 
                    - $customer->payments()->where('payment_type', 'debit')->sum('amount')
remaining_amount  = total_amount - paid_amount
last_order_date   = $customer->orders()->max('order_date')
```

### Order Statistics (via Accessors)

```php
// Order Model Accessors
paid_amount       = $order->payments()->where('payment_type', 'credit')->sum('amount')
                    - $order->payments()->where('payment_type', 'debit')->sum('amount')
remaining_amount  = total_amount - paid_amount
payment_status    = (paid_amount >= total_amount) ? 'paid' 
                    : ((paid_amount > 0) ? 'partial' : 'pending')
```

---

## Final Decision Checklist

- [ ] Review all columns listed above
- [ ] Confirm removal of 9 columns (7 from customers, 2 from orders)
- [ ] Approve calculation logic via accessors
- [ ] Approve keeping `subtotal` in orders (auto-calculated)
- [ ] Approve keeping `customer_id` and `branch_id` in payments (for performance)
- [ ] Finalize and proceed with implementation

---

*Ready for Review and Finalization*

