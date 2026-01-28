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
  cilBuilding,
  cilLockLocked,
  cilDollar,
  cilListRich,
  cilImage,
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
    name: 'Customer & Orders',
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
    component: CNavItem,
    name: 'Transactions',
    to: '/transactions',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
    permission: PERMISSIONS.PAYMENT_READ,
  },
  {
    component: CNavTitle,
    name: 'Financial',
  },
  {
    component: CNavItem,
    name: 'Income & Expenses',
    to: '/financial/transactions',
    icon: <CIcon icon={cilDollar} customClassName="nav-icon" />,
    permission: PERMISSIONS.FINANCIAL_TRANSACTION_READ,
  },
  {
    component: CNavItem,
    name: 'Financial Categories',
    to: '/financial/categories',
    icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
    permission: PERMISSIONS.FINANCIAL_CATEGORY_READ,
  },
  {
    component: CNavTitle,
    name: 'Reports',
  },
  {
    component: CNavItem,
    name: 'Company Health',
    to: '/reports/company-health',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
    permission: PERMISSIONS.REPORT_READ,
  },
  {
    component: CNavTitle,
    name: 'Masters',
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
  {
    component: CNavTitle,
    name: 'Website CMS',
  },
  {
    component: CNavItem,
    name: 'Hero Slider',
    to: '/website/slider',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
    permission: PERMISSIONS.WEBSITE_SLIDER_READ,
  },
  {
    component: CNavItem,
    name: 'Services',
    to: '/website/services',
    icon: <CIcon icon={cilCog} customClassName="nav-icon" />,
    permission: PERMISSIONS.WEBSITE_SERVICE_READ,
  },
  {
    component: CNavItem,
    name: 'Projects',
    to: '/website/projects',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
    permission: PERMISSIONS.WEBSITE_PROJECT_READ,
  },
  {
    component: CNavItem,
    name: 'Home Gallery',
    to: '/website/home-gallery',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
    permission: PERMISSIONS.WEBSITE_HOME_GALLERY_READ,
  },
  {
    component: CNavItem,
    name: 'Testimonials',
    to: '/website/testimonials',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
    permission: PERMISSIONS.WEBSITE_TESTIMONIAL_READ,
  },
  {
    component: CNavItem,
    name: 'Gallery Images',
    to: '/website/gallery',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
    permission: PERMISSIONS.WEBSITE_GALLERY_READ,
  },
  {
    component: CNavItem,
    name: 'Gallery Videos',
    to: '/website/gallery-videos',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
    permission: PERMISSIONS.WEBSITE_GALLERY_VIDEO_READ,
  },
  {
    component: CNavItem,
    name: 'Albums',
    to: '/website/albums',
    icon: <CIcon icon={cilImage} customClassName="nav-icon" />,
    permission: PERMISSIONS.WEBSITE_ALBUM_READ,
  },
]

export default _nav