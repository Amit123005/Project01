import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const Consumption_Filter = ({ dateRange, shift, area, isDashboard = false }) => {
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
          `http://163.125.102.142:5000/api/consumption_filter_chart?start_date=${startDate}&end_date=${endDate}&shift=${shift}`
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
    const consumpValues = [];
    const formattedDates = [];

    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item) => {
        const dateString = item.hour ? `${item.date} ${item.hour}` : item.date;
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
          console.error("Invalid date format", item, dateString);
          return;
        }

        const consump = parseFloat(item["Material Consumed"]);
        if (!isNaN(consump)) {
          consumpValues.push(consump);
          formattedDates.push(
            date.toLocaleString("en-US", {
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          );
        }
      });
    }

    setChartData([{ name: "Material Consumed", data: consumpValues }]);
    setCategories(formattedDates);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (chartData.length === 0) return <div>No Data Available</div>;

  const options = {
    chart: {
      type: "line",
      toolbar: { show: true },
      zoom: { enabled: true },
    },
    title: {
      text: "Material Consumption(Kg)", // <-- Your chart title
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
      tickAmount: categories.length > 5 ? 5 : categories.length,
      labels: {
        rotate: 0,
      },
      title: {
        text: "Date/Time",
      },
    },
    yaxis: {
      title: {
        text: "Kg",
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      x: { show: true },
      y: {
        formatter: (val) => `${val} Kg`,
      },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
    },
    fill: {
      opacity: 0.3, // like the area in Nivo
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.5,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
  };

  return <Chart options={options} series={chartData} type="line" height="100%" />;
};

export default Consumption_Filter;
