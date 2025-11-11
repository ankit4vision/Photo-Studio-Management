import React, { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav.jsx'

// Replace CoreUI SVG logo with custom image logo
import logoImg from 'src/assets/logo/logo-transprant.png'

// sidebar nav config
import navigation from '../../_nav.jsx'
import { usePermissions } from '../../hooks'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { hasPermission } = usePermissions()

  const filterNavItems = (items = []) => {
    return items
      .map((item) => {
        if (item.items) {
          const filteredChildren = filterNavItems(item.items)
          if (filteredChildren.length === 0) {
            return null
          }
          return { ...item, items: filteredChildren }
        }

        if (item.permission && hasPermission && !hasPermission(item.permission)) {
          return null
        }

        return item
      })
      .filter(Boolean)
  }

  const filteredNavigation = useMemo(() => filterNavItems(navigation), [navigation, hasPermission])

  return (
    <CSidebar
      className="sidebar-custom"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/" className="sidebar-brand-custom">
          <img
            src={logoImg}
            alt="Photo Studio Management App"
            className="sidebar-brand-logo-full"
          />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      
      {/* Navigation */}
      <AppSidebarNav items={filteredNavigation} />
      
    </CSidebar>
  )
}

export default React.memo(AppSidebar)

