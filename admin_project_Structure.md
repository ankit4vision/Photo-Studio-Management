# NZ Grocery Admin - Project Structure & Development Guidelines

## 📁 Project Folder Structure

```
admin/
├── 📁 backup/                          # Backup files
│   ├── Charts.jsx                      # Backup chart component
│   ├── Colors.jsx                      # Backup color component
│   ├── Page404.jsx                    # Backup 404 page
│   ├── Page500.jsx                    # Backup 500 page
│   ├── README.md                       # Backup documentation
│   └── Typography.jsx                 # Backup typography component
│
├── 📁 dist/                            # Build output directory
│   ├── 📁 assets/                      # Compiled assets
│   ├── favicon.ico                     # Site favicon
│   ├── index.html                      # Built HTML
│   ├── manifest.json                   # PWA manifest
│   └── vite.svg                        # Vite logo
│
├── 📁 public/                          # Static assets
│   ├── favicon.ico                     # Site favicon
│   ├── manifest.json                   # PWA manifest
│   └── vite.svg                        # Vite logo
│
├── 📁 src/                             # Source code
│   ├── 📁 assets/                      # Static assets
│   │   ├── 📁 brand/                  # Brand assets
│   │   │   ├── logo.jsx               # Logo component
│   │   │   └── sygnet.jsx             # Sygnet component
│   │   ├── 📁 images/                 # Image assets
│   │   │   ├── 📁 avatars/            # User avatars (1-9.jpg)
│   │   │   ├── angular.jpg            # Framework images
│   │   │   ├── components.webp        # Components image
│   │   │   ├── icons.webp             # Icons image
│   │   │   ├── react.jpg              # Framework images
│   │   │   └── vue.jpg                # Framework images
│   │   ├── 📁 logo/                   # Logo assets
│   │   │   └── logo-transprant.png    # Main logo (transparent)
│   │   ├── login-background.png       # Auth background
│   │   └── react.svg                  # React logo
│   │
│   ├── 📁 components/                 # Reusable components
│   │   ├── 📁 common/                 # Common/shared components
│   │   │   ├── Button.jsx             # Reusable button component
│   │   │   ├── Card.jsx               # Reusable card component
│   │   │   ├── FormFields.jsx         # Form input components
│   │   │   ├── FormModal.jsx          # Modal for forms
│   │   │   ├── GlobalSpinner.jsx      # Global loading spinner
│   │   │   ├── ImageUpload.jsx        # Drag-and-drop image upload component
│   │   │   ├── Modal.jsx              # Reusable modal component
│   │   │   ├── ScrollToTop.jsx        # Scroll to top component
│   │   │   ├── StepIndicator.jsx      # Multi-step form progress indicator
│   │   │   ├── Table.jsx              # Advanced data table with sorting/pagination
│   │   │   ├── ThemeToggle.jsx        # Theme switching component (light/dark)
│   │   │   └── ToastProvider.jsx      # Toast notifications
│   │   │
│   │   ├── 📁 docs/                   # Documentation components
│   │   │   ├── DocsComponents.jsx     # Component documentation
│   │   │   ├── DocsExample.jsx        # Example documentation
│   │   │   ├── DocsIcons.jsx          # Icon documentation
│   │   │   └── DocsLink.jsx           # Link documentation
│   │   │
│   │   ├── 📁 layout/                 # Layout components
│   │   │   ├── AppBreadcrumb.jsx      # Breadcrumb navigation
│   │   │   ├── AppContent.jsx         # Main content wrapper
│   │   │   ├── AppFooter.jsx          # Application footer
│   │   │   ├── AppHeader.jsx          # Application header
│   │   │   ├── AppSidebar.jsx         # Application sidebar (CoreUI)
│   │   │   ├── AppSidebarNav.jsx      # Sidebar navigation
│   │   │   ├── PermissionRoute.jsx    # Route permission wrapper
│   │   │   └── 📁 header/             # Header sub-components
│   │   │       ├── AppHeaderDropdown.jsx
│   │   │       └── index.jsx
│   │   │
│   │   ├── 📁 pages/                  # Page-specific components
│   │   │   ├── 📁 branches/           # Branch management
│   │   │   │   └── BranchForm.jsx     # Branch form component
│   │   │   ├── 📁 customers/          # Customer management
│   │   │   │   ├── CustomerDetailsModal.jsx # Customer details modal component
│   │   │   │   ├── CustomerForm.jsx   # Customer form component
│   │   │   │   ├── README.md          # Customer components documentation
│   │   │   │   └── SuspendCustomerModal.jsx # Customer suspension modal
│   │   │   ├── 📁 orders/             # Order management
│   │   │   │   ├── OrderDetailsModal.jsx # Order details modal component
│   │   │   │   ├── OrderForm.jsx      # Order form component
│   │   │   │   └── README.md          # Order components documentation
│   │   │   ├── 📁 packages/           # Package management
│   │   │   │   └── PackageForm.jsx    # Package form component
│   │   │   ├── 📁 payments/            # Payment management
│   │   │   │   └── PaymentForm.jsx    # Payment form component
│   │   │   ├── 📁 roles/              # Role management
│   │   │   │   └── RoleForm.jsx       # Role form component
│   │   │   ├── 📁 transactions/       # Transaction management
│   │   │   │   ├── TransactionDetailsModal.jsx # Transaction details modal
│   │   │   │   └── TransactionForm.jsx # Transaction form component
│   │   │   └── 📁 users/              # User management
│   │   │       ├── 📁 __tests__/      # User component tests
│   │   │       │   └── ProfileForm.test.js
│   │   │       ├── AddressSection.jsx # Address form section
│   │   │       ├── PersonalInfoSection.jsx # Personal info section
│   │   │       ├── ProfileForm.jsx    # Complete profile form
│   │   │       ├── ProfilePictureSection.jsx # Profile picture section
│   │   │       └── UserForm.jsx       # User form component
│   │   │
│   │   ├── index.jsx                  # Component exports
│   │   └── README.md                  # Components documentation
│   │
│   ├── 📁 config/                      # Configuration files
│   │   └── apiClient.js                # API client configuration
│   │
│   ├── 📁 constants/                   # Application constants
│   │   ├── api.js                      # API endpoint constants
│   │   ├── permissions.js              # Permission constants
│   │   └── README.md                   # Constants documentation
│   │
│   ├── 📁 context/                    # React Context providers
│   │   ├── AuthContext.jsx            # Authentication context
│   │   └── README.md                  # Context documentation
│   │
│   ├── 📁 hooks/                       # Custom React hooks
│   │   ├── index.jsx                   # Hook exports
│   │   └── README.md                   # Hooks documentation
│   │
│   ├── 📁 layout/                      # Layout components
│   │   ├── DefaultLayout.jsx          # Default page layout
│   │   └── PrivateRoute.jsx           # Protected route wrapper
│   │
│   ├── 📁 mock/                       # Mock data for development
│   │   ├── branches.json              # Mock branch data
│   │   ├── customers.json             # Mock customer data
│   │   ├── orders.json                # Mock order data
│   │   ├── packages.json              # Mock package data
│   │   ├── photographers.json         # Mock photographer data
│   │   ├── profile.json               # Mock profile data
│   │   ├── roles.json                 # Mock role data
│   │   ├── settings.json              # Mock settings data
│   │   ├── transactions.json          # Mock transaction data
│   │   └── users.json                 # Mock user data
│   │
│   ├── 📁 pages/                      # Page components
│   │   └── 📁 Auth/                   # Authentication pages
│   │       ├── ForgotPassword.jsx     # Forgot password page
│   │       ├── Login.jsx              # Login page
│   │       └── ResetPassword.jsx      # Reset password page
│   │
│   ├── 📁 scss/                       # SCSS stylesheets
│   │   ├── examples.scss              # Example styles
│   │   ├── style.scss                 # Main stylesheet
│   │   └── 📁 vendors/                # Third-party styles
│   │       └── simplebar.scss         # SimpleBar styles
│   │
│   ├── 📁 services/                   # API service layer
│   │   ├── authService.js             # Authentication API service
│   │   ├── branchService.js           # Branch API service
│   │   ├── customerService.js         # Customer API service
│   │   ├── orderService.js            # Order API service
│   │   ├── packageService.js          # Package API service
│   │   ├── paymentService.js          # Payment API service
│   │   ├── profileService.js          # Profile API service
│   │   ├── README.md                  # Services documentation
│   │   ├── reportService.js           # Report API service
│   │   ├── roleService.js             # Role API service
│   │   ├── settingsService.js         # Settings API service
│   │   ├── transactionService.js      # Transaction API service
│   │   └── userService.js             # User API service
│   │
│   ├── 📁 styles/                     # Additional styles
│   │   └── auth.css                   # Authentication styles
│   │
│   ├── 📁 utils/                      # Utility functions
│   │   ├── errorHandler.js            # Error handling utilities
│   │   ├── pdfExport.js               # PDF export utilities
│   │   └── responseHandler.js         # Response handling utilities
│   │
│   ├── 📁 views/                      # Main view components
│   │   ├── 📁 branches/               # Branch management views
│   │   │   ├── BranchesList.jsx       # Branches list view
│   │   │   └── BranchFormView.jsx     # Branch form view
│   │   ├── 📁 customers/              # Customer management views
│   │   │   ├── CustomersList.jsx      # Customers list view
│   │   │   ├── CustomerFormView.jsx   # Customer form view
│   │   │   ├── CustomerLedgerView.jsx # Customer ledger view
│   │   │   └── CustomerWalletView.jsx # Customer wallet view
│   │   ├── 📁 dashboard/              # Dashboard views
│   │   │   ├── Dashboard.jsx         # Main dashboard
│   │   │   └── MainChart.jsx          # Dashboard chart component
│   │   ├── 📁 orders/                 # Order management views
│   │   │   ├── OrdersList.jsx         # Orders list view
│   │   │   └── OrderFormView.jsx      # Order form view
│   │   ├── 📁 packages/               # Package management views
│   │   │   ├── PackagesList.jsx       # Packages list view
│   │   │   └── PackageFormView.jsx    # Package form view
│   │   ├── 📁 payments/               # Payment management views
│   │   │   ├── PaymentsList.jsx       # Payments list view
│   │   │   └── PaymentFormView.jsx    # Payment form view
│   │   ├── 📁 reports/                # Report views
│   │   │   ├── BranchReport.jsx       # Branch report view
│   │   │   ├── LedgerReport.jsx       # Ledger report view
│   │   │   ├── SalesReport.jsx        # Sales report view
│   │   │   └── StaffReport.jsx        # Staff report view
│   │   ├── 📁 roles/                  # Role management views
│   │   │   └── RolesList.jsx          # Roles list view
│   │   ├── 📁 settings/               # Settings views
│   │   │   └── Settings.jsx           # Settings page
│   │   ├── 📁 transactions/           # Transaction management views
│   │   │   ├── TransactionsList.jsx   # Transactions list view
│   │   │   └── TransactionFormView.jsx # Transaction form view
│   │   └── 📁 users/                  # User management views
│   │       ├── Profile.jsx            # User profile view
│   │       └── UsersList.jsx          # Users list view
│   │
│   ├── _nav.jsx                       # Navigation configuration
│   ├── api.js                         # Mock API service setup
│   ├── App.css                        # Main app styles
│   ├── App.jsx                        # Main app component
│   ├── config.js                      # App configuration
│   ├── main.jsx                       # App entry point
│   ├── routes.jsx                    # Route definitions (lazy loading)
│   ├── routesConfig.jsx               # Route configuration
│   ├── store.jsx                      # Redux store configuration
│   └── utils.js                       # Utility functions
│
├── 📁 styles/                         # Global styles
│   └── theme.css                      # Theme styles (CoreUI overrides)
│
├── env.example                        # Environment variables example
├── eslint.config.js                   # ESLint configuration
├── index.html                         # HTML template
├── package.json                       # Dependencies and scripts
├── package-lock.json                  # Dependency lock file
├── README.md                          # Project documentation
└── vite.config.js                     # Vite build configuration
```

## 🎯 Development Rules & Guidelines

### 📋 Component Organization Rules

#### 1. **Component Location Rules**
- **Common Components**: Place in `src/components/common/`
- **Page-Specific Components**: Place in `src/components/pages/[feature]/`
- **Layout Components**: Place in `src/components/layout/`
- **View Components**: Place in `src/views/[feature]/`
- **Page Components**: Place in `src/pages/[feature]/`

#### 2. **Component Naming Rules**
- Use **PascalCase** for component names
- Use **descriptive names** that indicate purpose
- Use **suffixes** for clarity:
  - `Form.jsx` - Form components
  - `List.jsx` - List/table components
  - `Modal.jsx` - Modal components
  - `Section.jsx` - Section components
  - `Wizard.jsx` - Multi-step form components
  - `Step.jsx` - Individual step components

#### 3. **File Structure Rules**
- **One component per file**
- **Export default** the main component
- **Named exports** for sub-components or utilities
- **Index files** for clean imports

### 🎨 UI/UX Rules

#### 1. **UI Framework Rules**
- **Primary Framework**: React Bootstrap (for main content)
- **Sidebar Framework**: CoreUI React (for sidebar and navigation only)
- **Icon Library**: FontAwesome (free solid icons) + CoreUI Icons (sidebar only)
- **Styling**: Bootstrap classes + custom CSS + CoreUI overrides
- **Theme**: Custom white sidebar with green accents
- **Responsive Design**: Mobile-first approach

#### 2. **Component Structure Rules**
```jsx
// Standard Page Structure with React Bootstrap (Clean Layout - No Nested Cards)
<Container fluid>
  <Row>
    <Col xs={12}>
      {/* Page Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
        <h2 className="mb-0 text-dark">Page Title</h2>
        <div className="ms-auto">
          <Button variant="primary" onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white rounded-3 shadow-sm p-4">
        {/* Section with Clean Header */}
        <div className="mb-5">
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
            <FontAwesomeIcon icon={faIcon} className="me-3 text-success fs-4" />
            <h4 className="mb-0 text-success">Section Title</h4>
          </div>
          
          {/* Content */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Field Label</Form.Label>
                <FormControl className="border-2" />
              </Form.Group>
            </Col>
          </Row>
        </div>
      </div>
    </Col>
  </Row>
</Container>
```

#### 3. **Form Structure Rules**
```jsx
// Standard Form Structure with React Bootstrap (Enhanced Styling)
<Form>
  <Row>
    <Col xs={12} md={6}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="field" className="fw-semibold">Field Label</Form.Label>
        <Form.Control
          id="field"
          type="text"
          value={value}
          onChange={handleChange}
          required
          isInvalid={!!errors.field}
          className="border-2"
        />
        <Form.Control.Feedback type="invalid">
          {errors.field}
        </Form.Control.Feedback>
        <FormText className="text-muted">Helper text for the field.</FormText>
      </Form.Group>
    </Col>
  </Row>
</Form>
```

#### 4. **Modal Structure Rules**
```jsx
// Standard Modal Structure with React Bootstrap
<Modal show={visible} onHide={onClose}>
  <Modal.Header closeButton>
    <Modal.Title>Modal Title</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {/* Modal content */}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
    <Button variant="primary" onClick={onConfirm}>Confirm</Button>
  </Modal.Footer>
</Modal>
```

#### 5. **Sidebar & Navigation Rules (CoreUI Only)**
```jsx
// Navigation Configuration (_nav.jsx) - CoreUI Components
const _nav = [
  {
    component: CNavTitle,
    name: 'Main',
  },
  {
    component: CNavGroup,
    name: 'Dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Admin Dashboard',
        to: '/dashboard',
        badge: {
          color: 'success',
          text: '●',
        },
      },
    ],
  },
]

// Sidebar Structure (AppSidebar.jsx) - CoreUI Components Only
<CSidebar className="sidebar-custom" colorScheme="dark">
  <CSidebarHeader className="border-bottom">
    <CSidebarBrand to="/" className="sidebar-brand-custom">
      <img src={logoImg} alt="NZ Grocery Admin" className="sidebar-brand-logo-full" />
    </CSidebarBrand>
    <CCloseButton className="d-lg-none" dark />
  </CSidebarHeader>
  <AppSidebarNav items={navigation} />
</CSidebar>
```

#### 6. **Theme & Styling Rules**
- **Main Content**: React Bootstrap components with standard Bootstrap styling
- **Sidebar**: CoreUI components with custom white background and subtle shadows
- **Navigation**: CoreUI navigation with dark text and proper contrast on white background
- **Icons**: FontAwesome for main content, CoreUI icons for sidebar only
- **Colors**: Purple/Violet primary color (#8b5cf6) - creative & artistic theme for Photo Studio
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent padding and margins throughout

#### 6.1. **Dark Theme System**
- **Theme Toggle**: `ThemeToggle` component with light/dark modes
- **State Management**: Redux store with localStorage persistence
- **CoreUI Integration**: Uses `useColorModes` hook for theme switching
- **CSS Architecture**: Theme-responsive selectors using `html[data-coreui-theme="dark"]`
- **Component Coverage**: All components support both light and dark themes
- **Authentication Pages**: Complete dark theme support for login/forgot/reset pages
- **Sidebar Adaptation**: Sidebar changes color scheme based on theme
- **Form Elements**: All inputs, buttons, and modals adapt to theme
- **Chart Components**: Dashboard charts and visualizations are theme-aware

#### 6.2. **Theme Implementation Guidelines**

##### **Theme Toggle Component Usage**
```jsx
// Import ThemeToggle component
import { ThemeToggle } from '../components'

// Use in header or any component
<ThemeToggle />
```

##### **Theme-Aware CSS Patterns**
```css
/* Light Theme (Default) */
.component {
  background: #ffffff;
  color: #1f2937;
  border: 1px solid #e5e7eb;
}

/* Dark Theme Override */
html[data-coreui-theme="dark"] .component {
  background: #374151 !important;
  color: #f9fafb !important;
  border: 1px solid #4b5563 !important;
}
```

##### **Theme Color Palette**
```css
/* Light Theme Colors */
--light-bg-primary: #ffffff;
--light-bg-secondary: #f8fafc;
--light-text-primary: #1f2937;
--light-text-secondary: #6b7280;
--light-border: #e5e7eb;
--light-accent: #8b5cf6; /* Purple/Violet for Photo Studio */

/* Dark Theme Colors */
--dark-bg-primary: #1f2937;
--dark-bg-secondary: #374151;
--dark-text-primary: #f9fafb;
--dark-text-secondary: #d1d5db;
--dark-border: #4b5563;
--dark-accent: #a78bfa; /* Brighter violet for dark mode */
```

##### **Theme File Organization**
```
styles/
├── theme.css              # Main theme styles (CoreUI overrides)
├── auth.css               # Authentication page styles
└── components/            # Component-specific theme styles
    ├── buttons/
    ├── forms/
    ├── modals/
    └── tables/
```

##### **Theme State Management**
```jsx
// Redux Store Configuration
const initialState = {
  sidebarShow: true,
  theme: getInitialTheme(), // 'light' or 'dark'
}

// Theme Toggle Handler
const handleThemeChange = (themeKey) => {
  dispatch({ type: 'set', theme: themeKey })
  setColorMode(themeKey)
  localStorage.setItem('theme', themeKey)
}
```

##### **Theme Best Practices**
- **Always use `!important`** for dark theme overrides to ensure they take precedence
- **Test both themes** during development to ensure proper contrast and readability
- **Use semantic color names** instead of hardcoded hex values
- **Maintain consistent spacing** across both themes
- **Consider accessibility** - ensure WCAG contrast ratios are met
- **Test with real content** to verify theme works with actual data
- **Use CSS custom properties** for theme-specific values when possible
- **Document theme-specific styles** with clear comments
- **Test theme switching** during user interactions (modals, dropdowns, etc.)
- **Validate responsive behavior** in both themes across all breakpoints

#### 7. **Gradient System & CSS Variables**
```css
/* Theme-based Gradient Variables - Light & Subtle (Purple/Violet Theme) */
--gradient-primary: linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%) !important;
--gradient-success: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%) !important;
--gradient-info: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%) !important;
--gradient-warning: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%) !important;
--gradient-danger: linear-gradient(135deg, #fca5a5 0%, #f87171 100%) !important;

/* Card Gradient Backgrounds - Light & Subtle */
--card-gradient-primary: linear-gradient(135deg, #c4b5fd 0%, #a78bfa 100%) !important;
--card-gradient-success: linear-gradient(135deg, #6ee7b7 0%, #34d399 100%) !important;
--card-gradient-info: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%) !important;
--card-gradient-warning: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%) !important;

/* Logo-Inspired Purple-Blue Gradient */
--card-gradient-logo: linear-gradient(135deg, #c4b5fd 0%, #b8d7fd 100%) !important;
--card-gradient-logo-alt: linear-gradient(135deg, #a78bfa 0%, #fbffbb 100%) !important;
```

#### 8. **Gradient Utility Classes**
```css
/* Gradient Utility Classes */
.bg-gradient-primary { background: var(--card-gradient-primary) !important; }
.bg-gradient-success { background: var(--card-gradient-success) !important; }
.bg-gradient-info { background: var(--card-gradient-info) !important; }
.bg-gradient-warning { background: var(--card-gradient-warning) !important; }
.bg-gradient-logo { background: var(--card-gradient-logo) !important; }
.bg-gradient-logo-alt { background: var(--card-gradient-logo-alt) !important; }
.bg-gradient-light { background: var(--bg-gradient-light) !important; }
.bg-gradient-primary-subtle { background: var(--bg-gradient-primary-subtle) !important; }
```

#### 9. **Section Header Design Pattern**
```jsx
// Standard Section Header with Purple/Violet Theme
<div className="d-flex align-items-center mb-4 pb-3 border-bottom border-primary border-2">
  <FontAwesomeIcon icon={faIcon} className="me-3 text-primary fs-4" />
  <h4 className="mb-0 text-primary">Section Title</h4>
</div>
```

#### 10. **Multi-Step Form Guidelines**
- **Step Indicator**: Use `StepIndicator` component for visual progress
- **Step Navigation**: Allow navigation to completed steps and next step only
- **Form Validation**: Validate each step before allowing progression
- **Data Persistence**: Maintain form data across step navigation
- **Step Components**: Create individual step components in `steps/` folder
- **Wizard Container**: Use main wizard component to manage step state
- **Navigation Buttons**: Consistent Previous/Next/Save Draft/Create buttons

#### 11. **Clean Layout Guidelines**
- **Avoid Nested Cards**: Use single container with subtle shadow instead of card-in-card
- **Section Separation**: Use border-bottom dividers with purple/violet theme
- **Visual Hierarchy**: Clear typography hierarchy with proper font weights
- **Consistent Spacing**: Use `mb-5` for section spacing, `mb-4` for internal spacing
- **Enhanced Inputs**: Use `border-2` class for better input visibility
- **Theme Consistency**: Apply purple/violet color (`text-primary`, `border-primary`) consistently
- **Primary Buttons**: Always use `text-white` class for better contrast

#### 12. **Component Reusability Guidelines**
- **Dual-Mode Components**: Create components that support both create and edit modes
- **Mode Detection**: Use URL parameters or props to determine component mode
- **Dynamic UI Updates**: Update titles, buttons, and descriptions based on mode
- **Data Pre-population**: Load existing data for edit mode with proper loading states
- **Single Source of Truth**: Reuse complex components instead of creating duplicates
- **Consistent UX**: Maintain same user experience across create and edit flows

#### 13. **Custom Table Component Guidelines**
- **Always Use Custom Table**: Use the project's custom Table component instead of basic Bootstrap tables
- **Column Definitions**: Define columns with proper key, header, and render functions
- **Sortable Columns**: Specify which columns should be sortable in sortableColumns array
- **Pagination Integration**: Use built-in pagination with currentPage, pageSize, and totalItems
- **Loading States**: Leverage built-in loading states and empty message handling
- **Consistent Styling**: Inherit responsive design and proper table styling automatically


### 🔧 State Management Rules

#### 1. **State Management Strategy**
- **Local State**: Use `useState` for component-specific state
- **Global State**: Use Redux for application-wide state
- **Context**: Use React Context for theme, auth, etc.
- **Server State**: Use custom hooks for API calls

#### 2. **State Naming Rules**
- Use **descriptive names** for state variables
- Use **camelCase** for state variables
- Use **boolean prefixes**: `is`, `has`, `can`, `should`
- Use **array suffixes**: `List`, `Items`, `Data`

#### 3. **State Update Rules**
- **Immutable updates** for objects and arrays
- **Functional updates** for state that depends on previous state
- **Batch updates** when possible

### 🌐 API Service Rules

#### 1. **Service Organization**
- **One service per feature** (e.g., `userService.js`)
- **Consistent naming** for service methods
- **Error handling** in all service methods
- **TypeScript interfaces** for request/response types

#### 2. **Service Method Naming**
```javascript
// Standard Service Method Names
const userService = {
  getUsers: () => {},           // GET /users
  getUserById: (id) => {},      // GET /users/:id
  createUser: (data) => {},     // POST /users
  updateUser: (id, data) => {}, // PUT /users/:id
  deleteUser: (id) => {},       // DELETE /users/:id
}
```

#### 3. **Error Handling Rules**
- **Consistent error format** across all services
- **User-friendly error messages**
- **Logging** for debugging purposes
- **Fallback values** for failed requests

### 🎯 Code Quality Rules

#### 1. **Code Style Rules**
- **ESLint configuration** must be followed
- **Prettier formatting** for consistent code style
- **Meaningful variable names**
- **Consistent indentation** (2 spaces)
- **Trailing commas** in objects and arrays

#### 2. **Component Rules**
- **Functional components** only
- **Hooks** for state and lifecycle
- **PropTypes** for prop validation
- **Default props** where appropriate
- **Memoization** for expensive operations

#### 3. **Performance Rules**
- **Lazy loading** for large components
- **Code splitting** for better performance
- **Memoization** for expensive calculations
- **Debouncing** for search inputs
- **Virtualization** for large lists

### 🔐 Security Rules

#### 1. **Authentication Rules**
- **JWT tokens** for authentication
- **Token refresh** mechanism
- **Protected routes** for sensitive pages
- **Role-based access control**

#### 2. **Data Validation Rules**
- **Client-side validation** for UX
- **Server-side validation** for security
- **Input sanitization** for all user inputs
- **XSS protection** for all outputs

#### 3. **API Security Rules**
- **HTTPS only** in production
- **CORS configuration** for API access
- **Rate limiting** for API endpoints
- **Input validation** on all endpoints

### 📱 Responsive Design Rules

#### 1. **Breakpoint Rules**
- **Mobile First**: Design for mobile, enhance for desktop
- **Bootstrap Breakpoints**: xs, sm, md, lg, xl, xxl
- **Consistent spacing** across all screen sizes
- **Touch-friendly** interface elements

#### 2. **Layout Rules**
- **Grid system** for consistent layouts
- **Flexbox** for component alignment
- **Responsive images** with proper sizing
- **Accessible navigation** on all devices

### 🧪 Testing Rules

#### 1. **Testing Strategy**
- **Unit tests** for utility functions
- **Component tests** for UI components
- **Integration tests** for user flows
- **E2E tests** for critical paths

#### 2. **Test Organization**
- **Test files** alongside source files
- **Descriptive test names**
- **Arrange-Act-Assert** pattern
- **Mock external dependencies**

### 📚 Documentation Rules

#### 1. **Code Documentation**
- **JSDoc comments** for functions and components
- **README files** for each major feature
- **Inline comments** for complex logic
- **API documentation** for all endpoints

#### 2. **Component Documentation**
- **PropTypes** with descriptions
- **Usage examples** in comments
- **Default values** documented
- **Dependencies** listed

### 🚀 Deployment Rules

#### 1. **Environment Configuration**
- **Environment-specific** configurations
- **Secure secrets** management
- **Build optimization** for production
- **Error tracking** in production

#### 2. **Build Rules**
- **Code splitting** for optimal loading
- **Asset optimization** for performance
- **Source maps** for debugging
- **Version management** for releases

### 🔄 Version Control Rules

#### 1. **Git Workflow**
- **Feature branches** for new features
- **Descriptive commit messages**
- **Pull request reviews** before merging
- **Semantic versioning** for releases

#### 2. **Code Review Rules**
- **Peer review** for all changes
- **Automated testing** before merge
- **Code quality checks** in CI/CD
- **Documentation updates** with code changes

---

## 📝 Additional Guidelines

### 🎨 Design System
- Follow **Bootstrap design principles**
- Use **consistent color palette**
- Maintain **typography hierarchy**
- Ensure **accessibility compliance**

### 🔧 Development Tools
- **Vite** for build tooling with Rolldown optimization
- **ESLint** for code linting
- **Prettier** for code formatting
- **React DevTools** for debugging
- **React Router DOM** for routing with lazy loading
- **Redux** for state management
- **React Context** for authentication and theme

### 📦 Key Dependencies
- **React 19** - Latest React version
- **React Bootstrap** - Primary UI component library for main content
- **CoreUI React** - UI component library for sidebar and navigation only
- **React Router DOM** - Client-side routing
- **Redux** - State management
- **FontAwesome** - Icon library for main content
- **CoreUI Icons** - Icon library for sidebar only
- **SimpleBar** - Custom scrollbars
- **Axios** - HTTP client for API calls

### 🧩 Component Library
- **StepIndicator** - Multi-step form progress indicator
- **ImageUpload** - Drag-and-drop image upload component
- **FormModal** - Modal wrapper for forms
- **Table** - Data table with sorting and pagination
- **ThemeToggle** - Theme switching component (light/dark modes)
- **ToastProvider** - Global notification system
- **Button** - Reusable button component
- **Card** - Reusable card component
- **FormFields** - Form input components
- **Modal** - Reusable modal component
- **GlobalSpinner** - Global loading spinner
- **ScrollToTop** - Scroll to top component

### 📊 Performance Monitoring
- **Bundle size** monitoring
- **Runtime performance** tracking
- **User experience** metrics
- **Error rate** monitoring

### 🛠️ Maintenance
- **Regular dependency updates**
- **Security patch** management
- **Performance optimization**
- **Code refactoring** as needed

---

## 🚀 Current Project Status

### 🎯 Navigation Structure
- **Main Section**: Dashboard groups with multiple dashboard options
- **Branch Management**: Branch list, branch form, branch operations
- **Package Management**: Packages list, package form, package operations
- **Order Management**: Orders list, order details, order form, order history
- **Customer Management**: Customers list, customer form, customer ledger, customer wallet
- **Payment Management**: Payments list, payment form, payment operations
- **Transaction Management**: Transactions list, transaction form, transaction details
- **Report Management**: Branch reports, ledger reports, sales reports, staff reports
- **User Management**: Users and role & permission management
- **Account Section**: Profile and settings

### 🔧 Technical Implementation
- **CoreUI Components**: Proper use of CSidebar, CSidebarHeader, CSidebarBrand
- **Custom Styling**: theme.css with CoreUI overrides
- **State Management**: Redux for sidebar state (unfoldable, visible) and theme management
- **Routing**: React Router with lazy loading for performance
- **Authentication**: JWT-based auth with role-based access control
- **Theme System**: Complete dark/light theme support with ThemeToggle component
- **Theme Persistence**: localStorage integration for theme preference
- **Clean Layout Pattern**: Single container with shadow, no nested cards
- **Purple/Violet Theme System**: Consistent use of purple/violet primary color (#8b5cf6) for Photo Studio creative theme
- **Enhanced Forms**: Better input styling with border-2 and fw-semibold labels
- **Gradient System**: CSS variables and utility classes for theme-based gradients
- **Logo-Inspired Gradients**: Purple-blue gradient variants matching brand colors
- **Branch Management**: Complete CRUD operations for branch management
- **Package Management**: Complete CRUD operations for package management
- **Order Management**: Complete order tracking with status management, customer details, and timeline
- **Customer Management**: Complete customer management with ledger and wallet views
- **Payment Management**: Complete payment tracking and management
- **Transaction Management**: Complete transaction tracking with details modal
- **Report Management**: Comprehensive reporting system with branch, ledger, sales, and staff reports
- **Custom Table Component**: Reusable table with sorting, pagination, and loading states
- **Multi-Step Forms**: StepIndicator component with wizard pattern for complex forms
- **Image Management**: Drag-and-drop upload with primary image selection
- **Form Validation**: Step-by-step validation with error handling
- **Mock Data System**: JSON-based mock data for development and testing
- **Image Handling**: Fallback system with icon display for missing product images
- **Order Details Modal**: Comprehensive order view with timeline, customer info, and quick actions
- **Authentication Pages**: Complete dark theme support for login, forgot password, and reset password
- **Sidebar Theme Adaptation**: Sidebar changes color scheme based on selected theme

---

*This document should be updated as the project evolves and new patterns emerge.*
