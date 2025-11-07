/**
 * PDF Export Utility
 * Uses jsPDF library to export data to PDF
 */

// Simple PDF export using browser's print functionality
// For full PDF generation, install jspdf: npm install jspdf jspdf-autotable

export const exportToPDF = (data, columns, title = 'Export', filename = 'export.pdf') => {
  try {
    // Create a temporary table element
    const table = document.createElement('table')
    table.style.borderCollapse = 'collapse'
    table.style.width = '100%'
    table.style.fontSize = '12px'
    
    // Create header row
    const thead = document.createElement('thead')
    const headerRow = document.createElement('tr')
    headerRow.style.backgroundColor = '#f8f9fa'
    headerRow.style.borderBottom = '2px solid #dee2e6'
    
    columns.forEach(col => {
      const th = document.createElement('th')
      th.textContent = col.label || col.key
      th.style.padding = '8px'
      th.style.border = '1px solid #dee2e6'
      th.style.textAlign = 'left'
      headerRow.appendChild(th)
    })
    
    thead.appendChild(headerRow)
    table.appendChild(thead)
    
    // Create body rows
    const tbody = document.createElement('tbody')
    data.forEach((item, index) => {
      const row = document.createElement('tr')
      row.style.borderBottom = '1px solid #dee2e6'
      
      columns.forEach(col => {
        const td = document.createElement('td')
        td.style.padding = '8px'
        td.style.border = '1px solid #dee2e6'
        
        if (col.render) {
          // For render functions, we need to extract text content
          const tempDiv = document.createElement('div')
          const rendered = col.render(null, item, index)
          if (typeof rendered === 'string') {
            td.textContent = rendered
          } else {
            // Try to extract text from React element
            td.textContent = col.key === 'customer' ? (item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim()) :
                            col.key === 'contact' ? (item.mobile || item.phone || item.email || 'N/A') :
                            col.key === 'status' ? (item.status || 'N/A') :
                            item[col.key] || 'N/A'
          }
        } else {
          td.textContent = item[col.key] || 'N/A'
        }
        
        row.appendChild(td)
      })
      
      tbody.appendChild(row)
    })
    
    table.appendChild(tbody)
    
    // Create a temporary container
    const container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.appendChild(table)
    document.body.appendChild(container)
    
    // Create print window
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f8f9fa; padding: 8px; border: 1px solid #dee2e6; text-align: left; }
            td { padding: 8px; border: 1px solid #dee2e6; }
            h1 { color: #333; }
            @media print {
              body { margin: 0; }
              @page { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <p>Generated on: ${new Date().toLocaleString()}</p>
          ${table.outerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
      document.body.removeChild(container)
    }, 250)
    
    return { success: true, message: 'PDF export initiated' }
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    return { success: false, message: 'Failed to export PDF: ' + error.message }
  }
}

/**
 * Export photographer data to PDF
 */
export const exportPhotographersToPDF = (photographers, filters = {}) => {
  const columns = [
    { key: 'photographerId', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'email', label: 'Email' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'total_orders', label: 'Orders' },
    { key: 'total_earnings', label: 'Earnings' },
    { key: 'status', label: 'Status' }
  ]
  
  // Filter data if needed
  let filteredData = [...photographers]
  
  if (filters.status) {
    filteredData = filteredData.filter(p => p.status === filters.status)
  }
  
  if (filters.search) {
    const search = filters.search.toLowerCase()
    filteredData = filteredData.filter(p => 
      p.name?.toLowerCase().includes(search) ||
      p.email?.toLowerCase().includes(search) ||
      p.mobile?.toLowerCase().includes(search) ||
      p.specialization?.toLowerCase().includes(search)
    )
  }
  
  const filename = `photographers_${new Date().toISOString().split('T')[0]}.pdf`
  return exportToPDF(filteredData, columns, 'Photographers List', filename)
}

/**
 * Export single photographer details to PDF
 */
export const exportSinglePhotographerToPDF = (photographer) => {
  if (!photographer) {
    return { success: false, message: 'No photographer data available' }
  }

  try {
    const photographerName = photographer.name || `${photographer.firstName || ''} ${photographer.lastName || ''}`.trim() || 'N/A'
    const photographerId = photographer.photographerId || photographer.id || 'N/A'
    
    // Format currency
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(amount || 0)
    }

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    // Create detailed HTML content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Photographer Details - ${photographerName}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 30px;
              color: #2c3e50;
              background: #ffffff;
              line-height: 1.6;
            }
            .container {
              max-width: 900px;
              margin: 0 auto;
              background: #ffffff;
            }
            .header {
              background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
              color: white;
              padding: 40px 30px;
              border-radius: 10px 10px 0 0;
              text-align: center;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header h1 {
              font-size: 32px;
              font-weight: 700;
              margin-bottom: 10px;
              text-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .header .subtitle {
              font-size: 14px;
              opacity: 0.95;
              font-weight: 300;
            }
            .header .photographer-id {
              background: rgba(255,255,255,0.2);
              display: inline-block;
              padding: 8px 20px;
              border-radius: 20px;
              margin-top: 15px;
              font-weight: 600;
              font-size: 16px;
            }
            .content {
              background: #ffffff;
              padding: 30px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 20px;
              margin-bottom: 30px;
            }
            .stat-card {
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              padding: 25px;
              border-radius: 10px;
              border-left: 5px solid #22c55e;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .stat-card.earnings {
              border-left-color: #10b981;
              background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            }
            .stat-card.wallet {
              border-left-color: #3b82f6;
              background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
            }
            .stat-card.rating {
              border-left-color: #f59e0b;
              background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            }
            .stat-card.orders {
              border-left-color: #8b5cf6;
              background: linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%);
            }
            .stat-label {
              font-size: 13px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
              font-weight: 600;
            }
            .stat-value {
              font-size: 28px;
              font-weight: 700;
              color: #1f2937;
            }
            .section {
              margin-bottom: 30px;
              background: #ffffff;
              border: 1px solid #e5e7eb;
              border-radius: 10px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            }
            .section-title {
              background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
              color: white;
              padding: 15px 20px;
              font-size: 18px;
              font-weight: 600;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .section-title::before {
              content: '';
              width: 4px;
              height: 20px;
              background: white;
              border-radius: 2px;
            }
            .section-content {
              padding: 20px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 15px;
            }
            .info-item {
              padding: 12px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .info-item:last-child {
              border-bottom: none;
            }
            .info-label {
              font-size: 12px;
              color: #6b7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 5px;
              font-weight: 600;
            }
            .info-value {
              font-size: 16px;
              color: #1f2937;
              font-weight: 500;
            }
            .badge {
              display: inline-block;
              padding: 6px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
            }
            .badge.active {
              background: #d1fae5;
              color: #065f46;
            }
            .badge.suspended {
              background: #fee2e2;
              color: #991b1b;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
            .divider {
              height: 1px;
              background: linear-gradient(to right, transparent, #e5e7eb, transparent);
              margin: 20px 0;
            }
            @media print {
              body { 
                margin: 0;
                padding: 20px;
              }
              @page { 
                margin: 1cm;
                size: A4;
              }
              .section {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📸 Photographer Profile</h1>
              <div class="subtitle">${photographerName}</div>
              <div class="photographer-id">ID: ${photographerId}</div>
              <div style="margin-top: 15px; font-size: 12px; opacity: 0.9;">
                Generated on: ${new Date().toLocaleString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            
            <div class="content">
              <!-- Statistics Cards -->
              <div class="stats-grid" style="grid-template-columns: repeat(3, 1fr);">
                <div class="stat-card earnings">
                  <div class="stat-label">Total Amount</div>
                  <div class="stat-value">${formatCurrency(photographer.total_earnings || photographer.total_amount || 0)}</div>
                </div>
                <div class="stat-card wallet">
                  <div class="stat-label">Paid Amount</div>
                  <div class="stat-value" style="color: #059669;">${formatCurrency(photographer.paid_amount || photographer.wallet_balance || 0)}</div>
                </div>
                <div class="stat-card rating">
                  <div class="stat-label">Remaining Amount</div>
                  <div class="stat-value" style="color: ${((photographer.total_earnings || photographer.total_amount || 0) - (photographer.paid_amount || photographer.wallet_balance || 0)) > 0 ? '#dc2626' : '#059669'};">${formatCurrency(photographer.remaining_amount || ((photographer.total_earnings || photographer.total_amount || 0) - (photographer.paid_amount || photographer.wallet_balance || 0)))}</div>
                </div>
              </div>
              <div style="margin-bottom: 20px;">
                <div class="stat-card orders" style="max-width: 300px; margin: 0 auto;">
                  <div class="stat-label">Total Services</div>
                  <div class="stat-value">${photographer.total_orders || photographer.totalOrders || photographer.total_services || 0}</div>
                </div>
              </div>

              <!-- Personal Information -->
              <div class="section">
                <div class="section-title">👤 Personal Information</div>
                <div class="section-content">
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Full Name</div>
                      <div class="info-value">${photographerName}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Email Address</div>
                      <div class="info-value">${photographer.email || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Mobile Number</div>
                      <div class="info-value">${photographer.mobile || photographer.phone || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Address</div>
                      <div class="info-value">${photographer.address || 'N/A'}</div>
                    </div>
                    ${photographer.location ? `
                    <div class="info-item">
                      <div class="info-label">Location</div>
                      <div class="info-value">${[photographer.location.city, photographer.location.state, photographer.location.country].filter(Boolean).join(', ') || 'N/A'}</div>
                    </div>
                    ` : ''}
                  </div>
                </div>
              </div>

              <!-- Professional Information -->
              <div class="section">
                <div class="section-title">💼 Professional Information</div>
                <div class="section-content">
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Specialization</div>
                      <div class="info-value" style="font-weight: 600; color: #22c55e;">${photographer.specialization || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Experience</div>
                      <div class="info-value">${photographer.experience_years || 0} years</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Hourly Rate</div>
                      <div class="info-value" style="font-weight: 600; color: #059669;">${formatCurrency(photographer.hourly_rate || 0)}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Camera Equipment</div>
                      <div class="info-value">${photographer.camera_equipment || 'N/A'}</div>
                    </div>
                    ${photographer.portfolio_url ? `
                    <div class="info-item" style="grid-column: 1 / -1;">
                      <div class="info-label">Portfolio URL</div>
                      <div class="info-value" style="color: #3b82f6; word-break: break-all;">${photographer.portfolio_url}</div>
                    </div>
                    ` : ''}
                  </div>
                </div>
              </div>

              <!-- Branch Information -->
              <div class="section">
                <div class="section-title">🏢 Branch Information</div>
                <div class="section-content">
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Branch Name</div>
                      <div class="info-value">${photographer.branch_name || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Branch Code</div>
                      <div class="info-value">${photographer.branch_code || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Additional Information -->
              <div class="section">
                <div class="section-title">📅 Additional Information</div>
                <div class="section-content">
                  <div class="info-grid">
                    <div class="info-item">
                      <div class="info-label">Status</div>
                      <div class="info-value">
                        <span class="badge ${photographer.status === 'active' ? 'active' : 'suspended'}">
                          ${photographer.status ? photographer.status.charAt(0).toUpperCase() + photographer.status.slice(1) : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div class="info-item">
                      <div class="info-label">Joined Date</div>
                      <div class="info-value">${formatDate(photographer.joinedDate || photographer.created_at)}</div>
                    </div>
                    ${photographer.updated_at ? `
                    <div class="info-item">
                      <div class="info-label">Last Updated</div>
                      <div class="info-value">${formatDate(photographer.updated_at)}</div>
                    </div>
                    ` : ''}
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="footer">
                <p>This document was generated automatically by Photo Studio Management System</p>
                <p>© ${new Date().getFullYear()} Photo Studio Management. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    // Create print window
    const printWindow = window.open('', '_blank')
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print()
    }, 250)
    
    return { success: true, message: 'PDF export initiated' }
  } catch (error) {
    console.error('Error exporting photographer PDF:', error)
    return { success: false, message: 'Failed to export PDF: ' + error.message }
  }
}

