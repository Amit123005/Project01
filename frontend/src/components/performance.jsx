import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import './spinner.css'; // Import the spinner CSS

const Performance_gauge = () => {
  const [performanceData, setperformanceData] = useState(null); // Use null as initial state to represent uninitialized data

  useEffect(() => {
    fetch('http://163.125.102.142:5000/api/performance')
      .then(response => response.json())
      .then(data => {
        const performanceValue = parseFloat(data.performance) || 0;
        setperformanceData(performanceValue);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setperformanceData(0); // Set to 0 if there's an error fetching the data
      });
  }, []);

  // Don't render chart until performanceData is fetched and set
  if (performanceData === null) {
    return <div className="spinner"></div>; // Show the spinner while data is loading
  }

  const getperformanceColor = (value) => {
    if (value > 90) {
      return '#70cfad';
    } else if (value >= 80) {
      return '#d9e69a';
    } else if (value >= 0.1) {
      return '#de8e9a';
    } else {
      return '#d28e9a';
    }
  };

  const chartOptions = {
    chart: {
      type: 'donut',
      toolbar: {
        show: false
      }
    },
    labels: ['Performance', 'Remaining'],
    colors: [getperformanceColor(performanceData), '#dfe2e8'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: false,
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333'
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#333'
            },
            total: {
              show: true,
              label: 'Performance',
              color: '#333',
              formatter: () => `${performanceData.toFixed(2)}%`
            }
          }
        },
        dropShadow: {
          enabled: true,
          top: 5,
          left: 5,
          blur: 8,
          opacity: 0.3
        }
      }
    },
    stroke: {
      width: 2,
      colors: ['#fff'] // Add a white border to make the segments stand out
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: '14px',
        fontWeight: 'normal',
        colors: ['#000'] // Customize label color
      }
    },
    legend: {
      show: false // Disable the legend
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`
      }
    },
    responsive: [{
      breakpoint: 600,
      options: {
        chart: {
          height: 300
        },
        plotOptions: {
          pie: {
            donut: {
              size: '60%'
            }
          }
        }
      }
    }]
  };

  const chartSeries = [
  parseFloat(performanceData.toFixed(2)),
  parseFloat((100 - performanceData).toFixed(2))
];

  return (
    <div>
      <ApexCharts options={chartOptions} series={chartSeries} type="donut" height={250} />
    </div>
  );
};

export default Performance_gauge;
