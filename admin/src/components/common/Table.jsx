import React, { useState } from 'react'
import { Table as BootstrapTable, Pagination, FormSelect, Row, Col } from 'react-bootstrap'
import PropTypes from 'prop-types'

const Table = ({ 
  data = [], 
  columns = [], 
  loading = false,
  emptyMessage = 'No data available',
  striped = false,
  hover = true,
  bordered = true,
  small = false,
  className = '',
  onRowClick,
  // Pagination props
  pagination = false,
  currentPage = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  showPageSize = true,
  pageSizeOptions = [5, 10, 25, 50],
  onPageSizeChange,
  // Sorting props
  sortable = true,
  sortableColumns = [], // Array of column keys that should be sortable
  ...props 
}) => {
  const [sortColumn, setSortColumn] = useState('')
  const [sortDirection, setSortDirection] = useState('asc')
  const getTableClasses = () => {
    const classes = ['table']
    
    if (striped) classes.push('table-striped')
    if (hover) classes.push('table-hover')
    if (bordered) classes.push('table-bordered')
    if (small) classes.push('table-sm')
    if (className) classes.push(className)
    
    return classes.join(' ')
  }

  const handleRowClick = (row, index) => {
    if (onRowClick) {
      onRowClick(row, index)
    }
  }

  // Sorting functions
  const handleSort = (columnKey) => {
    if (!isColumnSortable(columnKey)) return

    if (sortColumn === columnKey) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New column, start with ascending
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const sortData = (dataToSort) => {
    if (!sortColumn || !sortable) return dataToSort

    return [...dataToSort].sort((a, b) => {
      let aValue = a[sortColumn]
      let bValue = b[sortColumn]

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })
  }

  const getSortIcon = (columnKey) => {
    if (!isColumnSortable(columnKey)) return null
    
    if (sortColumn === columnKey) {
      return sortDirection === 'asc' ? '↑' : '↓'
    }
    return '↕'
  }

  const isColumnSortable = (columnKey) => {
    if (!sortable || !columnKey) return false
    // If sortableColumns array is provided, only allow those columns
    if (sortableColumns.length > 0) {
      return sortableColumns.includes(columnKey)
    }
    // If no sortableColumns specified, allow all except actions
    return columnKey !== 'actions'
  }

  // Sort data first, then paginate
  const sortedData = sortData(data)
  
  // Pagination calculations
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const paginatedData = pagination ? sortedData.slice(startIndex, startIndex + pageSize) : sortedData

  const handlePageChange = (page) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const handlePageSizeChange = (newPageSize) => {
    if (onPageSizeChange) {
      onPageSizeChange(newPageSize)
    }
  }

  const renderPagination = () => {
    if (!pagination) return null

    const getVisiblePages = () => {
      const delta = 2
      const range = []
      const rangeWithDots = []

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i)
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...')
      } else {
        rangeWithDots.push(1)
      }

      rangeWithDots.push(...range)

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages)
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages)
      }

      // Remove duplicates while preserving order
      return [...new Set(rangeWithDots)]
    }

    return (
      <div className="mt-3">
        <Row className="align-items-center">
          <Col md={6}>
            {/* Page Size and Info - Left Side */}
            <div className="d-flex align-items-center">
              <span className="text-muted me-2">Show:</span>
              {showPageSize && (
                <FormSelect
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                  size="sm"
                  style={{ width: 'auto' }}
                  className="me-3"
                >
                  {pageSizeOptions.map(size => (
                    <option key={`page-size-${size}`} value={size}>{size}</option>
                  ))}
                </FormSelect>
              )}
              <span className="text-muted">
                Showing {startIndex + 1} to {endIndex} of {totalItems} entries
              </span>
            </div>
          </Col>
          <Col md={6}>
            {/* Centered Pagination - Right Side */}
            <div className="d-flex justify-content-end">
              <Pagination
                aria-label="Table pagination"
                size="sm"
              >
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                
                {getVisiblePages().map((page, index) => {
                  if (page === '...') {
                    return (
                      <Pagination.Ellipsis key={`dots-${index}-${currentPage}`} />
                    )
                  }
                  
                  return (
                    <Pagination.Item
                      key={`page-${page}-${index}`}
                      active={currentPage === page}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Pagination.Item>
                  )
                })}
                
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Pagination>
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  const renderHeader = () => {
    return (
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th 
              key={`header-${index}-${column.key}`} 
              scope="col"
              className={isColumnSortable(column.key) ? 'cursor-pointer user-select-none' : ''}
              onClick={() => handleSort(column.key)}
              style={{ 
                cursor: isColumnSortable(column.key) ? 'pointer' : 'default',
                userSelect: 'none'
              }}
            >
              <div className="d-flex align-items-center justify-content-between">
                <span>{column.header || column.label}</span>
                {isColumnSortable(column.key) && (
                  <span className="ms-2 text-muted" style={{ fontSize: '0.8em' }}>
                    {getSortIcon(column.key)}
                  </span>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    )
  }

  const renderBody = () => {
    if (loading) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length} className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </td>
          </tr>
        </tbody>
      )
    }

    if (data.length === 0) {
      return (
        <tbody>
          <tr>
            <td colSpan={columns.length} className="text-center py-4 text-muted">
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      )
    }

    return (
      <tbody>
        {paginatedData.map((row, rowIndex) => {
          // Generate a truly unique key
          const uniqueKey = row.id ? `row-${row.id}` : `row-${startIndex + rowIndex}`
          return (
            <tr 
              key={uniqueKey} 
              className={onRowClick ? 'cursor-pointer' : ''}
              onClick={() => handleRowClick(row, rowIndex)}
            >
              {columns.map((column, colIndex) => (
                <td key={`${uniqueKey}-col-${colIndex}`}>
                  {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                </td>
              ))}
            </tr>
          )
        })}
      </tbody>
    )
  }

  return (
    <>
      <BootstrapTable className={getTableClasses()} {...props}>
        {renderHeader()}
        {renderBody()}
      </BootstrapTable>
      {renderPagination()}
    </>
  )
}

Table.propTypes = {
  data: PropTypes.array,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    header: PropTypes.string,
    label: PropTypes.string,
    render: PropTypes.func
  })),
  loading: PropTypes.bool,
  emptyMessage: PropTypes.string,
  striped: PropTypes.bool,
  hover: PropTypes.bool,
  bordered: PropTypes.bool,
  small: PropTypes.bool,
  className: PropTypes.string,
  onRowClick: PropTypes.func,
  // Pagination props
  pagination: PropTypes.bool,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  totalItems: PropTypes.number,
  onPageChange: PropTypes.func,
  showPageSize: PropTypes.bool,
  pageSizeOptions: PropTypes.array,
  onPageSizeChange: PropTypes.func,
  // Sorting props
  sortable: PropTypes.bool,
  sortableColumns: PropTypes.arrayOf(PropTypes.string)
}

export default Table
