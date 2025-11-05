import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  const currentYear = new Date().getFullYear()

  return (
    <CFooter className="px-4 py-3">
      <div>
        <span className="text-muted small">
          &copy; {currentYear} Photo Studio Management App. All rights reserved.
        </span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
