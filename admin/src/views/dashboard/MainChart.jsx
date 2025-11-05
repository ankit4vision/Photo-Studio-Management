import React, { useEffect, useRef } from 'react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = ({ dateRange }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (chartRef.current) {
        setTimeout(() => {
          chartRef.current.options.scales.x.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.x.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.x.ticks.color = getStyle('--cui-body-color')
          chartRef.current.options.scales.y.grid.borderColor = getStyle(
            '--cui-border-color-translucent',
          )
          chartRef.current.options.scales.y.grid.color = getStyle('--cui-border-color-translucent')
          chartRef.current.options.scales.y.ticks.color = getStyle('--cui-body-color')
          chartRef.current.update()
        })
      }
    })
  }, [chartRef])

  const random = (min = 0, max = 100) => Math.round(Math.random() * (max - min) + min)

  // Generate realistic data for the last 30 days
  const generateData = () => {
    const data = []
    let baseValue = 100
    for (let i = 0; i < 30; i++) {
      baseValue += random(-10, 15)
      data.push(Math.max(50, baseValue))
    }
    return data
  }

  // Generate labels based on date range
  const generateLabels = () => {
    if (!dateRange?.startDate || !dateRange?.endDate) {
      // Default to last 30 days if no date range
      const labels = []
      const today = new Date()
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      }
      return labels
    }

    const labels = []
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    const diffTime = Math.abs(endDate - startDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    // Limit to reasonable number of data points for performance
    const maxPoints = 90
    const step = Math.max(1, Math.floor(diffDays / maxPoints))
    
    for (let i = 0; i <= diffDays; i += step) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
    }
    
    return labels
  }

  const labels = generateLabels()

  // Generate revenue data based on labels length
  const generateRevenueData = () => {
    const data = []
    let baseValue = 100
    for (let i = 0; i < labels.length; i++) {
      baseValue += random(-10, 15)
      data.push(Math.max(50, baseValue * 45)) // Revenue in dollars
    }
    return data
  }

  const revenueData = generateRevenueData()

  return (
    <>
      <CChartLine
        ref={chartRef}
        style={{ height: '300px', marginTop: '40px' }}
        data={{
          labels: labels,
          datasets: [
            {
              label: 'Revenue ($)',
              backgroundColor: `rgba(${getStyle('--cui-success-rgb')}, .1)`,
              borderColor: getStyle('--cui-success'),
              pointHoverBackgroundColor: getStyle('--cui-success'),
              borderWidth: 3,
              data: revenueData,
              fill: true,
              tension: 0.4,
            },
          ],
        }}
        options={{
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                usePointStyle: true,
                padding: 20,
                color: getStyle('--cui-body-color'),
              },
            },
            tooltip: {
              mode: 'index',
              intersect: false,
              backgroundColor: getStyle('--cui-body-bg'),
              titleColor: getStyle('--cui-body-color'),
              bodyColor: getStyle('--cui-body-color'),
              borderColor: getStyle('--cui-border-color'),
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              grid: {
                color: getStyle('--cui-border-color-translucent'),
                drawOnChartArea: false,
              },
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 10,
              },
            },
            y: {
              beginAtZero: true,
              border: {
                color: getStyle('--cui-border-color-translucent'),
              },
              grid: {
                color: getStyle('--cui-border-color-translucent'),
              },
              ticks: {
                color: getStyle('--cui-body-color'),
                maxTicksLimit: 6,
                callback: function(value) {
                  return '$' + value.toLocaleString();
                }
              },
            },
          },
          elements: {
            line: {
              tension: 0.4,
            },
            point: {
              radius: 3,
              hitRadius: 10,
              hoverRadius: 6,
              hoverBorderWidth: 2,
            },
          },
          interaction: {
            intersect: false,
            mode: 'index',
          },
        }}
      />
    </>
  )
}

export default MainChart
