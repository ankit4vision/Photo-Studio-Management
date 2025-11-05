import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilSettings,
  cilUser,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useToast } from '../../common/ToastProvider'
import { useAuth } from '../../../context/AuthContext'

import avatar8 from '../../../assets/images/avatars/8.jpg'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const { success } = useToast()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      success('Logged out successfully!')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      success('Logged out successfully!')
      navigate('/login')
    }
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
          {user ? `${user.firstName} ${user.lastName}` : 'Admin User'}
        </CDropdownHeader>
        
        <CDropdownItem disabled style={{ cursor: 'not-allowed', opacity: 0.5 }}>
          <CIcon icon={cilUser} className="me-2" />
          My Profile
        </CDropdownItem>
        
        <CDropdownItem disabled style={{ cursor: 'not-allowed', opacity: 0.5 }}>
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        
        <CDropdownDivider />
        
        <CDropdownItem onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown

