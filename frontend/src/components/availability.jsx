import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import './spinner.css';

const Availability_gauge = () => {
  const [oeeData, setOeeData] = useState(null); // Use null as initial state to represent uninitialized data

  useEffect(() => {
    fetch('http://163.125.102.142:5000/api/availability')
      .then(response => response.json())
      .then(data => {
        let oeeValue = parseFloat(data.availability) || 0; // Default to 0 if the value is not valid
        setOeeData(oeeValue);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setOeeData(0); // Set to 0 if there's an error fetching the data
      });
  }, []);

  // Don't render chart until oeeData is fetched and set
  if (oeeData === null) {
    return <div className="spinner"></div>; // Or show a spinner
  }

  const getOeeColor = (value) => {
    if (value > 90) {
      return '#70cfad';
    } else if (value >= 80) {
      return '#d9e69a';
    } else if (value >= 0.1) {
      return '#de8e9a';
    } else if (value < 0) {
      return '#d28e9a'; // Color for negative values
    } else {
      return '#d28e9a'; // Default color for small positive values
    }
  };

  const chartOptions = {
    chart: {
      type: 'donut',
      toolbar: {
        show: false
      }
    },
    labels: ['Availability', 'Remaining'],
    colors: [getOeeColor(oeeData), '#dfe2e8'],
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
              label: 'OEE',
              color: '#333',
              formatter: () => {
                return `${oeeData.toFixed(2)}%`; // Display the value
              }
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
  parseFloat(oeeData.toFixed(2)),
  parseFloat((100 - oeeData).toFixed(2))
];

  return (
    <div>
      <ApexCharts options={chartOptions} series={chartSeries} type="donut" height={250} />
    </div>
  );
};

export default Availability_gauge;
