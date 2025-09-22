import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const Rejection_Filter = ({ dateRange, shift, area }) => {
  const [chartData, setChartData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const startDate = dateRange[0].format("YYYY-MM-DD");
        const endDate = dateRange[1].format("YYYY-MM-DD");

        const response = await fetch(
          `http://163.125.102.142:5000/api/yield_filter_chart?start_date=${startDate}&end_date=${endDate}&shift=${shift}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        transformData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, shift, area]);

  const transformData = (data) => {
    const startupRejection = [];
    const lineRejection = [];
    const xCategories = [];

    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item) => {
        const dateString = `${item.hour || "2025-01-18 00:00:00"}`;
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
          console.error("Invalid date format", item, dateString);
          return;
        }

        xCategories.push(
          date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        );

        const startup = parseFloat(item["Startup Rejection"]);
        const line = parseFloat(item["Line Rejection"]);

        startupRejection.push(!isNaN(startup) ? startup : 0);
        lineRejection.push(!isNaN(line) ? line : 0);
      });
    }

    setChartData([
      { name: "Startup Rejection", data: startupRejection },
      { name: "Line Rejection", data: lineRejection },
    ]);
    setCategories(xCategories);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (chartData.length === 0) return <div>No Data Available</div>;

  const options = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    title: {
      text: "Startup and Line Rejection", // <-- Your chart title
      align: "center",          // 'left', 'center', 'right'
      margin: 10,
      offsetY: 10,
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#263238',       // you can customize the color
      }
    },
    stroke: { curve: "smooth", width: 2 },
    markers: { size: 4 },
    dataLabels: { enabled: false },
    xaxis: {
      categories: categories,
      labels: { rotate: 0 },
      title: { text: "Date/Time" },
    },
    yaxis: {
      title: { text: "Kg" },
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: { show: true },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
  };

  return <Chart options={options} series={chartData} type="line" height="100%" />;
};

export default Rejection_Filter;
