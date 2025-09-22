import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";   // ✅ Use Chart here
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const LineChart = ({ dateRange, shift, area }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState([]);
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
          `http://163.125.102.142:5000/api/line_chart?start_date=${startDate}&end_date=${endDate}&shift=${shift}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log("Data is : ", result);
        const transformedData = transformData(result);
        setData(transformedData);
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
    const availability = [];
    const performance = [];
    const qualityRate = [];
    const oee = [];

    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item) => {
        const dateString = `${item.hour}`;
        const date = new Date(dateString);

        if (!isNaN(date.getTime())) {
          oee.push({ x: date, y: item.max_oee });
          availability.push({ x: date, y: item.max_availability });
          performance.push({ x: date, y: item.max_performance });
          qualityRate.push({ x: date, y: item.max_quality_rate });
        }
      });
    }
    return [
      { name: "OEE", data: oee },
      { name: "Availability", data: availability },
      { name: "Performance", data: performance },
      { name: "Quality Rate", data: qualityRate },
    ];
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (data.length === 0) return <div>No data available</div>;

  const chartOptions = {
    chart: {
      type: "line",
      height: "100%",
      toolbar: { show: false },
      zoom: { enabled: true },
      foreColor: colors.grey[100],
    },
    xaxis: {
      type: "datetime",
      labels: {
        format: "MMM dd HH:mm", // ✅ show hours also
        style: { colors: colors.grey[100] },
      },
      axisBorder: { show: true, color: colors.grey[100] },
      axisTicks: { show: true, color: colors.grey[100] },
      title: {
        text: "Date / Time",
        style: { color: colors.grey[100], fontSize: "12px", fontWeight: "normal" },
      },
    },
    yaxis: {
      min: 0,
      max: 100, // ✅ cap at 100
      tickAmount: 5,
      labels: {
        formatter: (value) => Math.floor(value),
        style: { colors: colors.grey[100] },
      },
      axisBorder: { show: true, color: colors.grey[100] },
      axisTicks: { show: true, color: colors.grey[100] },
      title: {
        text: "Percentage",
        style: { color: colors.grey[100], fontSize: "12px", fontWeight: "normal" },
      },
    },
    stroke: { curve: "smooth", width: 2 },
    colors: [
      "rgba(119,93,208, 0.9)",
      "rgba(255,69,96, 0.9)",
      "rgba(0,227,150, 0.9)",
      "rgba(254,176,25, 0.9)",
    ],
    tooltip: {
      theme: "dark",
      x: {
        formatter: function (value) {
          const startHour = new Date(value).getHours();
          const endHour = (startHour + 1) % 24;
          return `${startHour.toString().padStart(2, "0")}:00 - ${endHour
            .toString()
            .padStart(2, "0")}:00`;
        },
      },
    },
    legend: {
      position: "right",
      labels: { colors: colors.grey[100] },
    },
    grid: { show: true, borderColor: colors.grey[800] },
    dataLabels: { enabled: false },
  };

  return (
    <Chart
      options={chartOptions}
      series={data.map((item) => ({
        ...item,
        type: "line", // ✅ force all series as line
      }))}
      height={340}
    />
  );
};

export default LineChart;
