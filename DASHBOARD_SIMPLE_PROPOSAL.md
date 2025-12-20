# Simple Dashboard Widgets Proposal

## 📊 Current Widgets (Keep These)
1. **KPI Summary Cards** (3 cards) - Revenue, Orders, Customers with period comparison
2. **Revenue Trends Chart** - Line chart with 7/30/90 day filters

---

## 🎯 New Simple Widgets (Easy Cards Style)

### **Row 1: Summary Cards (Easy Cards - Like Order Module)**

#### **Orders Summary Cards** (4 cards)
- **Total Orders** - Gradient Primary
- **Pending Orders** - Gradient Warning  
- **Processing Orders** - Gradient Info
- **Completed Orders** - Gradient Success

#### **Customers Summary Cards** (4 cards)
- **Total Customers** - Gradient Primary
- **Active Customers** - Gradient Success
- **New Customers (This Month)** - Gradient Info
- **VIP Customers** - Gradient Warning

#### **Income/Expense Summary Cards** (4 cards)
- **Total Income** - Gradient Success
- **Total Expenses** - Gradient Danger
- **Net Profit** - Gradient Primary
- **Profit Margin %** - Gradient Info

---

### **Row 2: Lists & Tables**

#### **Top Paid Customers List** (Left 6 cols)
- Table showing top 10 customers by total paid amount
- Columns: Customer Name, Total Paid, Total Orders, Last Payment Date
- Clickable: Link to customer details

#### **Upcoming Customer Events** (Right 6 cols)
- List of upcoming birthdays and anniversaries (next 30 days)
- Shows: Customer Name, Event Type (DOB/Anniversary), Date, Days Until
- Sorted by date (soonest first)
- Color coding: Red for < 7 days, Yellow for 7-14 days, Green for 15-30 days
- Purpose: Gift preparation reminder

---

### **Row 3: Orders & Chart**

#### **Upcoming Next 10 Orders** (Left 6 cols)
- Table showing next 10 orders by due date
- Columns: Order Number, Customer Name, Due Date, Status, Amount
- Shows order status badge
- Sorted by due date (soonest first)
- Clickable: Link to order details

#### **Combined Company Health Chart** (Right 6 cols)
- **Chart Type**: Multi-line or Multi-bar chart
- **Shows**: 
  - Orders Revenue (line/bar)
  - Income (line/bar)
  - Expenses (line/bar)
  - Company Profit (line/bar)
- **Time Range**: Last 12 months or selected date range
- **Similar to**: Report page financial overview
- **Purpose**: Visual representation of company health over time

---

## 📐 Proposed Layout

```
Row 1: [Revenue] [Orders] [Customers] [AOV] [Outstanding] [Collection Rate]
       (Keep existing 3 + add 3 more if needed)

Row 2: [Orders Summary Cards - 4 cards]
       Total Orders | Pending | Processing | Completed

Row 3: [Customers Summary Cards - 4 cards]
       Total Customers | Active | New This Month | VIP

Row 4: [Income/Expense Summary Cards - 4 cards]
       Total Income | Total Expenses | Net Profit | Profit Margin

Row 5: [Top Paid Customers (6 cols)] [Upcoming Events (6 cols)]

Row 6: [Upcoming Orders (6 cols)] [Company Health Chart (6 cols)]
```

---

## 📊 Backend Endpoints Needed

### **New Endpoints:**
1. `/api/dashboard/orders-summary` - Order status counts
2. `/api/dashboard/customers-summary` - Customer statistics
3. `/api/dashboard/financial-summary` - Income/expense totals
4. `/api/dashboard/top-paid-customers` - Top 10 customers by paid amount
5. `/api/dashboard/upcoming-events` - Customer DOB/Anniversary (next 30 days)
6. `/api/dashboard/upcoming-orders` - Next 10 orders by due date
7. `/api/dashboard/company-health-chart` - Combined chart data (orders, income, expenses, profit over time)

### **Existing Endpoints (Keep):**
- ✅ `/api/dashboard/summary` - KPI totals
- ✅ `/api/dashboard/revenue-trend` - Revenue chart

---

## 🎨 Widget Style (Easy Cards)

### **Summary Cards Style:**
```jsx
<Card className="bg-gradient-primary text-white border-0 shadow-sm">
  <Card.Body className="p-4">
    <div className="d-flex align-items-center">
      <div className="flex-grow-1">
        <h4 className="mb-0">{value}</h4>
        <p className="mb-0 opacity-75">{label}</p>
      </div>
      <FontAwesomeIcon icon={icon} className="fs-1 opacity-50" />
    </div>
  </Card.Body>
</Card>
```

### **Table Style:**
- Simple Bootstrap table
- Hover effects
- Clickable rows/links
- Status badges

### **Chart Style:**
- Multi-line chart (Chart.js)
- 4 datasets: Orders Revenue, Income, Expenses, Profit
- Color coded: Blue, Green, Red, Purple
- Time range selector (Last 3/6/12 months)

---

## ✅ Implementation Priority

1. ✅ Orders Summary Cards
2. ✅ Customers Summary Cards  
3. ✅ Income/Expense Summary Cards
4. ✅ Top Paid Customers List
5. ✅ Upcoming Customer Events
6. ✅ Upcoming Next 10 Orders
7. ✅ Combined Company Health Chart

---

**Last Updated**: December 2025
