import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// Import components
const Dashboard = React.lazy(() => import('../../views/dashboard/Dashboard'))

// User Management Components
const UsersList = React.lazy(() => import('../../views/users/UsersList'))
const Profile = React.lazy(() => import('../../views/users/Profile'))
const RolesList = React.lazy(() => import('../../views/roles/RolesList'))

// Settings Components
const Settings = React.lazy(() => import('../../views/settings/Settings'))

// Branch Management Components
const BranchesList = React.lazy(() => import('../../views/branches/BranchesList'))
const BranchFormView = React.lazy(() => import('../../views/branches/BranchFormView'))

// Package Management Components
const PackagesList = React.lazy(() => import('../../views/packages/PackagesList'))
const PackageFormView = React.lazy(() => import('../../views/packages/PackageFormView'))

// Order Management Components
const OrdersList = React.lazy(() => import('../../views/orders/OrdersList'))
const OrderFormView = React.lazy(() => import('../../views/orders/OrderFormView'))

// Customer Management Components
const CustomersList = React.lazy(() => import('../../views/customers/CustomersList'))
const CustomerFormView = React.lazy(() => import('../../views/customers/CustomerFormView'))
const CustomerWalletView = React.lazy(() => import('../../views/customers/CustomerWalletView'))
const CustomerLedgerView = React.lazy(() => import('../../views/customers/CustomerLedgerView'))

// Transaction Components
const TransactionsList = React.lazy(() => import('../../views/transactions/TransactionsList'))
const TransactionFormView = React.lazy(() => import('../../views/transactions/TransactionFormView'))

// Payment Components
const PaymentsList = React.lazy(() => import('../../views/payments/PaymentsList'))
const PaymentFormView = React.lazy(() => import('../../views/payments/PaymentFormView'))

// Report Components
const SalesReport = React.lazy(() => import('../../views/reports/SalesReport'))
const LedgerReport = React.lazy(() => import('../../views/reports/LedgerReport'))
const BranchReport = React.lazy(() => import('../../views/reports/BranchReport'))
const StaffReport = React.lazy(() => import('../../views/reports/StaffReport'))

const AppContent = () => {
  return (
    <div className="app-content">
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* User Management Routes */}
          <Route path="/users" element={<UsersList />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/roles" element={<RolesList />} />
          
          {/* Settings Routes */}
          <Route path="/settings" element={<Settings />} />
          
          {/* Branch Management Routes */}
          <Route path="/branches" element={<BranchesList />} />
          <Route path="/branches/create" element={<BranchFormView />} />
          <Route path="/branches/edit/:id" element={<BranchFormView />} />
          
          {/* Package Management Routes */}
          <Route path="/packages" element={<PackagesList />} />
          <Route path="/packages/create" element={<PackageFormView />} />
          <Route path="/packages/edit/:id" element={<PackageFormView />} />
          
          {/* Order Management Routes */}
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/orders/create" element={<OrderFormView />} />
          <Route path="/orders/edit/:id" element={<OrderFormView />} />
          
          {/* Customer Management Routes */}
          <Route path="/customers" element={<CustomersList />} />
          <Route path="/customers/create" element={<CustomerFormView />} />
          <Route path="/customers/edit/:id" element={<CustomerFormView />} />
          <Route path="/customers/:id/wallet" element={<CustomerWalletView />} />
          <Route path="/customers/:id/ledger" element={<CustomerLedgerView />} />
          
          {/* Transaction Routes */}
          <Route path="/transactions" element={<TransactionsList />} />
          <Route path="/transactions/create" element={<TransactionFormView />} />
          <Route path="/transactions/edit/:id" element={<TransactionFormView />} />
          
          {/* Payment Routes */}
          <Route path="/payments" element={<PaymentsList />} />
          <Route path="/payments/create" element={<PaymentFormView />} />
          
          {/* Report Routes */}
          <Route path="/reports/sales" element={<SalesReport />} />
          <Route path="/reports/ledger" element={<LedgerReport />} />
          <Route path="/reports/branch" element={<BranchReport />} />
          <Route path="/reports/staff" element={<StaffReport />} />
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default React.memo(AppContent)

