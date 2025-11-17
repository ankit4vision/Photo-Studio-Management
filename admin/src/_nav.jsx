import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilSettings,
  cilHome,
  cilTag,
  cilCart,
  cilPeople,
  cilCog,
  cilBarChart,
  cilWallet,
  cilCreditCard,
  cilBuilding,
  cilLockLocked,
} from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'
import { PERMISSIONS } from './constants/permissions'

const _nav = [
  {
    component: CNavTitle,
    name: 'Main',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    permission: PERMISSIONS.DASHBOARD_READ,
  },
  {
    component: CNavTitle,
    name: 'Management',
  },
  {
    component: CNavItem,
    name: 'Branches',
    to: '/branches',
    icon: <CIcon icon={cilBuilding} customClassName="nav-icon" />,
    permission: PERMISSIONS.BRANCH_READ,
  },
  {
    component: CNavItem,
    name: 'Packages',
    to: '/packages',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
    permission: PERMISSIONS.PACKAGE_READ,
  },
  {
    component: CNavItem,
    name: 'Customers',
    to: '/customers',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    permission: PERMISSIONS.CUSTOMER_READ,
  },
  {
    component: CNavItem,
    name: 'Orders',
    to: '/orders',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
    permission: PERMISSIONS.ORDER_READ,
  },
  {
    component: CNavTitle,
    name: 'Financial',
  },
  {
    component: CNavItem,
    name: 'Transactions',
    to: '/transactions',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
    permission: PERMISSIONS.PAYMENT_READ,
  },
  {
    component: CNavItem,
    name: 'Payments',
    to: '/payments',
    icon: <CIcon icon={cilCreditCard} customClassName="nav-icon" />,
    permission: PERMISSIONS.PAYMENT_READ,
  },
  {
    component: CNavTitle,
    name: 'Reports',
  },
  {
    component: CNavItem,
    name: 'Sales Report',
    to: '/reports/sales',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    disabled: true,
  },
  {
    component: CNavItem,
    name: 'Ledger Report',
    to: '/reports/ledger',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    disabled: true,
  },
  {
    component: CNavItem,
    name: 'Branch Report',
    to: '/reports/branch',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    disabled: true,
  },
  {
    component: CNavItem,
    name: 'Staff Report',
    to: '/reports/staff',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    disabled: true,
  },
  {
    component: CNavTitle,
    name: 'System',
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    permission: PERMISSIONS.USER_READ,
  },
  {
    component: CNavItem,
    name: 'Roles & Permissions',
    to: '/roles',
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
    permission: PERMISSIONS.ROLE_READ,
  },
  {
    component: CNavItem,
    name: 'Settings',
    to: '/settings',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    permission: PERMISSIONS.SETTINGS_READ,
  },
]

export default _nav