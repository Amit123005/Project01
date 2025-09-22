import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';
import './spinner.css'; // Ensure you have the spinner.css for loading spinner

const OEE_gauge = () => {
  const [oeeData, setOeeData] = useState(null); // Use null as initial state to represent uninitialized data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://163.125.102.142:5000/api/oee');
        const data = await response.json();
        const oeeValue = parseFloat(data.oee) || 0;
        setOeeData(oeeValue); 
      } catch (error) {
        console.error('Error fetching data:', error);
        setOeeData(0); // Set to 0 if there's an error fetching the data
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 20000); // Update every 20 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  // Don't render chart until oeeData is fetched and set
  if (oeeData === null) {
    return <div className="spinner">Loading</div>; // Or show a spinner while data is loading
  }

  const getOeeColor = (value) => {
    if (value >= 90) {
      return '#7a72b5';
    } else if (value >= 80) {
      return '#f2de02';
    } else if (value >= 60) {
      return '#f2de02';
    } else if (value >= 0.1) {
      return '#c73104';
    } else {
      return '#d28e9a'; // Color for low values
    }
  };

  const chartOptions = {
    chart: {
      type: 'donut',
      toolbar: {
        show: false
      }
    },
    labels: ['OEE', 'Remaining'],
    colors: [getOeeColor(oeeData), '#dfe2e8'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#333'
            },
            value: {
              show: true,
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#333',
              formatter: (val) => `${val}%`
            },
            total: {
              show: true,
              label: 'OEE',
              color: '#333',
              formatter: () => isNaN(oeeData) || oeeData === 0 ? 'Loading...' : `${oeeData.toFixed(2)}%`
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
      enabled: false
    },
    legend: {
      show: false
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
      <ApexCharts options={chartOptions} series={chartSeries} type="donut" height={380} />
    </div>
  );
};

export default OEE_gauge;
