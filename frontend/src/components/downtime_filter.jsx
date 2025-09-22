import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const Downtime_filter = ({ dateRange, shift, isDashboard = false }) => {
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const startDate = dateRange[0].format('YYYY-MM-DD');
        const endDate = dateRange[1].format('YYYY-MM-DD');

        const response = await fetch(
          `http://163.125.102.142:5000/api/downtime_filter?start_date=${startDate}&end_date=${endDate}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          const formattedCategories = [];
          const downtimeValues = [];

          data.forEach(item => {
            const date = new Date(item.date);
            formattedCategories.push(
              date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            );
            downtimeValues.push(item.total_downtime ? parseFloat(item.total_downtime).toFixed(2) : 0);
          });

          setCategories(formattedCategories);
          setChartData([{ name: 'Total Downtime', data: downtimeValues }]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, shift]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (chartData.length === 0) return <div>No Data Available</div>;

  const options = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: true },
      zoom: { enabled: false },
    },
    title: {
      text: "Total Downtime Day Wise", // <-- Your chart title
      align: "center",          // 'left', 'center', 'right'
      margin: 10,
      offsetY: 10,
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#263238',       // you can customize the color
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '50%',
        borderRadius: 5,
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val,
    },
    xaxis: {
      categories: categories,
      title: {
        text: 'Date',
      },
      labels: {
        rotate: 0,
      },
      tickAmount : 5
    },
    yaxis: {
      title: {
        text: 'Total Downtime (hours)',
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => `${val} hours`,
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
    },
    fill: {
      colors: ['#4f9bab'],
    },
  };

  return <Chart options={options} series={chartData} type="bar" height="100%" />;
};

export default Downtime_filter;
