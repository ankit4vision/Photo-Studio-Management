# Database Cleanup Analysis - Column Identification

## Overview
This document identifies redundant and calculated columns that should be removed from each table. These columns create unnecessary complexity in business logic and can be derived from relationships instead.

---

## Table-by-Table Analysis

### 1. `customers` Table

#### ✅ KEEP (Customer Profile Fields)
| Column | Reason |
|--------|--------|
| `id` | Primary key |
| `customer_code` | Unique identifier (should be auto-generated) |
| `first_name` | Customer name |
| `last_name` | Customer name |
| `email` | Contact info |
| `phone` | Contact info |
| `mobile` | Contact info |
| `address` | Address info |
| `city` | Address info |
| `state` | Address info |
| `postal_code` | Address info |
| `country` | Address info |
| `branch_id` | Relationship to branch |
| `status` | Customer status (active/inactive) |
| `dob` | Personal info |
| `anniversary_date` | Personal info |
| `notes` | Additional notes |
| `preferences` | Customer preferences (JSON) |
| `avatar` | Profile picture |
| `created_at` | Timestamp |
| `updated_at` | Timestamp |
| `deleted_at` | Soft delete |

#### ❌ REMOVE (Calculated/Redundant Fields)
| Column | Can Be Derived From | Calculation |
|--------|---------------------|-------------|
| `total_orders` | `orders` table | `COUNT(orders WHERE customer_id = id)` |
| `total_services` | `order_items` table | `SUM(order_items.quantity WHERE order.customer_id = id)` |
| `total_amount` | `orders` table | `SUM(orders.total_amount WHERE customer_id = id)` |
| `paid_amount` | `payments` table | `SUM(payments.amount WHERE customer_id = id AND payment_type = 'credit') - SUM(payments.amount WHERE customer_id = id AND payment_type = 'debit')` |
| `remaining_amount` | `orders` + `payments` | `total_amount - paid_amount` (calculated) |
| `wallet_balance` | `payments` table | Same as `paid_amount` (redundant) |
| `last_order_date` | `orders` table | `MAX(orders.order_date WHERE customer_id = id)` |

**Impact:**
- Remove `recalculateStats()` method from Customer model
- Remove all model event hooks that update customer stats
- Calculate these values on-the-fly using relationships or accessors

---

### 2. `orders` Table

#### ✅ KEEP (Order Core Fields)
| Column | Reason |
|--------|--------|
| `id` | Primary key |
| `order_number` | Unique order identifier (should be auto-generated) |
| `customer_id` | Relationship to customer |
| `branch_id` | Relationship to branch |
| `order_date` | Order date |
| `due_date` | Due/completion date |
| `subtotal` | Sum of order items (can be calculated, but useful to store) |
| `discount` | Discount amount |
| `total_amount` | Final amount (subtotal - discount) |
| `status` | Order status (pending/processing/completed/cancelled) |
| `payment_status` | Payment status (pending/paid/partial/refunded) |
| `payment_method` | Payment method (if paid upfront) |
| `notes` | Order notes |
| `timeline` | Order status timeline (JSON) |
| `created_at` | Timestamp |
| `updated_at` | Timestamp |
| `deleted_at` | Soft delete |

#### ❌ REMOVE (Calculated/Redundant Fields)
| Column | Can Be Derived From | Calculation |
|--------|---------------------|-------------|
| `paid_amount` | `payments` table | `SUM(payments.amount WHERE order_id = id AND payment_type = 'credit') - SUM(payments.amount WHERE order_id = id AND payment_type = 'debit')` |
| `remaining_amount` | `total_amount` - `paid_amount` | `total_amount - paid_amount` (calculated) |

**Note on `subtotal`:**
- `subtotal` can be calculated from `order_items`, but it's reasonable to keep it for performance
- However, it should be auto-calculated when order items change, not manually set

**Impact:**
- Remove `recalculateRemainingAmount()` method
- Remove `recalculatePaymentStatus()` method (or simplify to only update `payment_status`)
- `payment_status` should be calculated based on payments relationship
- Remove `paid_amount` and `remaining_amount` from fillable array

---

### 3. `order_items` Table

#### ✅ KEEP (All Fields - No Redundancy)
| Column | Reason |
|--------|--------|
| `id` | Primary key |
| `order_id` | Relationship to order |
| `package_id` | Relationship to package |
| `quantity` | Quantity ordered |
| `unit_price` | Price at time of order |
| `total_price` | Calculated: `quantity × unit_price` |
| `package_name` | Snapshot of package name (for historical reference) |
| `package_type` | Snapshot of package type (for historical reference) |
| `created_at` | Timestamp |
| `updated_at` | Timestamp |

**Note:**
- `total_price` is calculated but should remain (auto-calculated on save)
- Package snapshots are important for historical data integrity

**No changes needed** ✅

---

### 4. `payments` Table

#### ✅ KEEP (All Fields - No Redundancy)
| Column | Reason |
|--------|--------|
| `id` | Primary key |
| `payment_number` | Unique payment identifier (should be auto-generated) |
| `order_id` | Relationship to order |
| `customer_id` | Relationship to customer |
| `branch_id` | Relationship to branch |
| `payment_date` | Payment date |
| `payment_type` | credit (payment) or debit (refund) |
| `amount` | Payment amount |
| `payment_method` | cash/upi/card/bank_transfer |
| `remarks` | Payment remarks |
| `created_at` | Timestamp |
| `updated_at` | Timestamp |
| `deleted_at` | Soft delete |

**Note:**
- `customer_id` and `branch_id` are redundant (can be derived from `order_id`)
- However, they might be useful for direct queries without joining orders
- **Decision needed:** Keep for performance or remove for normalization?

**Recommendation:** Keep `customer_id` and `branch_id` for query performance, but ensure they're always synced with the order.

**No major changes needed** ✅

---

### 5. `packages` Table

#### ✅ KEEP (All Fields - No Redundancy)
| Column | Reason |
|--------|--------|
| `id` | Primary key |
| `package_name` | Package name |
| `package_type` | Package type (Album/PhotoShoot/Editing/Video) |
| `default_price` | Default price |
| `description` | Package description |
| `status` | active/inactive |
| `created_at` | Timestamp |
| `updated_at` | Timestamp |
| `deleted_at` | Soft delete |

**No changes needed** ✅

---

### 6. `branches` Table

#### ✅ KEEP (All Fields - No Redundancy)
| Column | Reason |
|--------|--------|
| `id` | Primary key |
| `branch_code` | Unique branch code |
| `branch_name` | Branch name |
| `email` | Branch email |
| `contact_number` | Contact number |
| `address` | Address |
| `city` | City |
| `state` | State |
| `country` | Country |
| `postal_code` | Postal code |
| `status` | active/inactive |
| `created_at` | Timestamp |
| `updated_at` | Timestamp |
| `deleted_at` | Soft delete |

**No changes needed** ✅

---

### 7. `users` Table

#### ✅ KEEP (All Fields - No Redundancy)
| Column | Reason |
|--------|--------|
| `id` | Primary key |
| `first_name` | User name |
| `last_name` | User name |
| `email` | Login email |
| `email_verified_at` | Email verification |
| `password` | Hashed password |
| `phone` | Contact |
| `status` | User status |
| `address` | Address |
| `city` | City |
| `state` | State |
| `zip_code` | ZIP code |
| `country` | Country |
| `bio` | Biography |
| `avatar` | Avatar |
| `date_of_birth` | DOB |
| `gender` | Gender |
| `remember_token` | Remember me |
| `created_at` | Timestamp |
| `updated_at` | Timestamp |

**Note:**
- `status` should be converted to enum for data integrity

**Minor improvement needed:** Convert `status` to enum

---

### 8. `roles` Table

#### ✅ KEEP (All Fields)
| Column | Reason |
|--------|--------|
| `id` | Primary key |
| `name` | Role name |
| `description` | Description |
| `is_active` | Active status |
| `is_deleted` | Soft delete flag |
| `created_at` | Timestamp |
| `updated_at` | Timestamp |

**Note:**
- Should migrate to standard Laravel soft deletes (`deleted_at` timestamp)

**Improvement needed:** Migrate to standard soft deletes

---

### 9. `permissions` Table

#### ✅ KEEP (All Fields)
| Column | Reason |
|--------|--------|
| `id` | Primary key |
| `name` | Permission name |
| `description` | Description |
| `module` | Module name |
| `submodule` | Submodule name |
| `type` | Permission type |
| `is_active` | Active status |
| `is_deleted` | Soft delete flag |
| `created_at` | Timestamp |
| `updated_at` | Timestamp |

**Note:**
- Should migrate to standard Laravel soft deletes (`deleted_at` timestamp)

**Improvement needed:** Migrate to standard soft deletes

---

### 10. `settings` Table

#### ✅ KEEP (All Fields - No Redundancy)
| Column | Reason |
|--------|--------|
| `id` | Primary key |
| `key` | Setting key |
| `value` | Setting value |
| `group` | Setting group |
| `description` | Description |
| `created_at` | Timestamp |
| `updated_at` | Timestamp |

**No changes needed** ✅

---

### 11. `emails` Table

#### ✅ KEEP (All Fields - No Redundancy)
| Column | Reason |
|--------|--------|
| `id` | Primary key |
| `to_email` | Recipient |
| `from_email` | Sender |
| `type` | Email type |
| `subject` | Subject |
| `body` | Body |
| `send_status` | Status |
| `response_message` | Response |
| `related_id` | Polymorphic relation |
| `related_type` | Polymorphic relation |
| `sent_at` | Sent timestamp |
| `created_at` | Timestamp |
| `updated_at` | Timestamp |

**No changes needed** ✅

---

## Summary of Changes

### Columns to Remove

#### `customers` Table (7 columns)
1. ❌ `total_orders`
2. ❌ `total_services`
3. ❌ `total_amount`
4. ❌ `paid_amount`
5. ❌ `remaining_amount`
6. ❌ `wallet_balance`
7. ❌ `last_order_date`

#### `orders` Table (2 columns)
1. ❌ `paid_amount`
2. ❌ `remaining_amount`

### Total Columns to Remove: **9 columns**

---

## How to Calculate Removed Fields

### Customer Statistics (Accessors/Computed Properties)

```php
// In Customer Model
public function getTotalOrdersAttribute()
{
    return $this->orders()->count();
}

public function getTotalServicesAttribute()
{
    return $this->orders()
        ->with('items')
        ->get()
        ->sum(fn($order) => $order->items->sum('quantity'));
}

public function getTotalAmountAttribute()
{
    return $this->orders()->sum('total_amount');
}

public function getPaidAmountAttribute()
{
    return $this->payments()
        ->where('payment_type', 'credit')
        ->sum('amount') 
        - $this->payments()
            ->where('payment_type', 'debit')
            ->sum('amount');
}

public function getRemainingAmountAttribute()
{
    return $this->total_amount - $this->paid_amount;
}

public function getLastOrderDateAttribute()
{
    return $this->orders()->max('order_date');
}
```

### Order Statistics (Accessors/Computed Properties)

```php
// In Order Model
public function getPaidAmountAttribute()
{
    return $this->payments()
        ->where('payment_type', 'credit')
        ->sum('amount') 
        - $this->payments()
            ->where('payment_type', 'debit')
            ->sum('amount');
}

public function getRemainingAmountAttribute()
{
    return max(0, $this->total_amount - $this->paid_amount);
}

public function getPaymentStatusAttribute()
{
    $paid = $this->paid_amount;
    $total = $this->total_amount;
    
    if ($paid >= $total) {
        return 'paid';
    } elseif ($paid > 0) {
        return 'partial';
    }
    return 'pending';
}
```

---

## Benefits of This Cleanup

1. **Simplified Business Logic**
   - No more complex recalculation methods
   - No more model event hooks for stats updates
   - Single source of truth (payments table for payment data)

2. **Data Integrity**
   - No risk of cached values getting out of sync
   - Always accurate calculations from source data

3. **Easier Maintenance**
   - Less code to maintain
   - Clearer data flow: Customer → Order → OrderItem → Payment

4. **Better Performance (with proper indexing)**
   - Can add database indexes on foreign keys
   - Can use database views for complex queries
   - Can cache computed values at API level if needed

5. **Cleaner API**
   - Controllers don't need to worry about updating stats
   - Resources can use accessors transparently

---

## Migration Strategy

1. **Phase 1: Add Accessors**
   - Add computed property accessors to models
   - Test that they return correct values

2. **Phase 2: Update API Resources**
   - Ensure resources use accessors (they already do via `$this->attribute`)
   - Test API responses

3. **Phase 3: Remove Model Hooks**
   - Remove `recalculateStats()` calls
   - Remove model event hooks
   - Remove `updateCustomerStats()` calls

4. **Phase 4: Create Migration**
   - Create migration to drop columns
   - Test in development environment

5. **Phase 5: Deploy**
   - Deploy to production
   - Monitor for any issues

---

## Performance Considerations

### Potential Performance Impact
- Calculating stats on-the-fly requires database queries
- For large datasets, this could be slower

### Solutions
1. **Database Views** - Create views for common queries
2. **Caching** - Cache computed values at API level (Redis/Memcached)
3. **Eager Loading** - Use eager loading for relationships
4. **Indexes** - Ensure proper indexes on foreign keys
5. **Materialized Views** - For very large datasets (PostgreSQL)

### Recommended Approach
- Start with accessors (simplest)
- Add caching if performance becomes an issue
- Use database views for complex reporting queries

---

## Next Steps

1. ✅ Review this analysis
2. ⏳ Finalize column list
3. ⏳ Create accessors in models
4. ⏳ Remove model hooks
5. ⏳ Create migration to drop columns
6. ⏳ Test thoroughly
7. ⏳ Deploy

---

*Last Updated: 2025-01-XX*

