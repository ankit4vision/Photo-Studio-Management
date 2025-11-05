# Customer Management Components

This directory contains the customer management components for the Photo Studio Management App.

## Components

### CustomerDetailsModal.jsx
A modal component that displays detailed information about a customer.

**Features:**
- Customer profile with avatar (initials)
- Contact information (email, phone, location)
- Order statistics (total orders, total spent)
- Account status with color-coded badges
- Address information
- Customer preferences
- Notes section
- Action buttons (Suspend/Activate)

**Props:**
- `visible` (boolean): Controls modal visibility
- `onClose` (function): Callback when modal is closed
- `customer` (object): Customer data to display
- `onSuspend` (function): Callback for suspend action
- `onActivate` (function): Callback for activate action

### SuspendCustomerModal.jsx
A detailed modal component for suspending customer accounts with comprehensive suspension management.

**Features:**
- Customer profile display with avatar
- Suspension reason selection
- Duration configuration (temporary/permanent)
- Additional notes field
- Notification options (email, support team, support ticket)
- Account impact information
- Form validation
- Preview functionality

**Props:**
- `visible` (boolean): Controls modal visibility
- `onClose` (function): Callback when modal is closed
- `customer` (object): Customer data to suspend
- `onSuspend` (function): Callback when suspension is confirmed
- `loading` (boolean): Loading state

**Form Fields:**
- **Reason for Suspension**: Dropdown with predefined reasons
- **Duration Type**: Temporary or Permanent
- **Duration Value/Unit**: For temporary suspensions (days, weeks, months)
- **Additional Notes**: Free text field
- **Notification Options**: Email, support team, support ticket checkboxes


## Usage

### SuspendCustomerModal
```jsx
import SuspendCustomerModal from './components/pages/customers/SuspendCustomerModal'

<SuspendCustomerModal
  visible={showSuspendModal}
  onClose={() => setShowSuspendModal(false)}
  customer={selectedCustomer}
  onSuspend={handleSuspendCustomer}
  loading={isLoading}
/>
```

### CustomerDetailsModal
```jsx
import CustomerDetailsModal from './components/pages/customers/CustomerDetailsModal'

<CustomerDetailsModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  customer={selectedCustomer}
  onSuspend={handleSuspendCustomer}
  onActivate={handleActivateCustomer}
/>
```

## Styling

The components follow the project's design guidelines:
- Green theme colors (`text-success`, `border-success`)
- Bootstrap classes with custom enhancements
- Consistent spacing and typography
- Responsive design
- Clean layout without nested cards

## Dependencies

- React Bootstrap for UI components
- FontAwesome for icons
- React hooks for state management
- Form validation and error handling

## Data Structure

### Customer Object
```javascript
{
  id: number,
  customerId: string, // e.g., "#12345"
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: {
    street: string,
    city: string,
    state: string,
    postalCode: string,
    country: string
  },
  location: {
    city: string,
    country: string
  },
  status: 'active' | 'suspended' | 'pending',
  totalOrders: number,
  totalSpent: number,
  joinedDate: string, // ISO date string
  lastOrderDate: string, // ISO date string
  avatar: string,
  notes: string,
  preferences: {
    newsletter: boolean,
    smsNotifications: boolean,
    preferredDeliveryTime: 'morning' | 'afternoon' | 'evening',
    dietaryRestrictions: string[]
  },
  suspensionDetails?: {
    reason: string,
    durationType: 'temporary' | 'permanent',
    durationValue?: string,
    durationUnit?: 'day' | 'week' | 'month',
    notes?: string,
    suspendedAt: string, // ISO date string
    suspendedBy: string,
    suspendedUntil?: string, // ISO date string (for temporary suspensions)
    activatedAt?: string, // ISO date string
    activatedBy?: string,
    notifications: {
      emailSent: boolean,
      supportNotified: boolean,
      supportTicketCreated: boolean
    }
  },
  createdAt: string, // ISO date string
  updatedAt: string // ISO date string
}
```

## Integration

These components are integrated with:
- Customer service API layer
- Mock data for development
- Main customer list view
- Navigation system
- Routing configuration
