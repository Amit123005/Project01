import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const YieldFilter = ({ dateRange, shift, area }) => {
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
          `http://163.125.102.142:5000/api/yield_filter_chart?start_date=${startDate}&end_date=${endDate}&shift=${shift}`
        );
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        setData(transformData(result));
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
    const yieldPercentage = { name: "Yield %", data: [] };
    const rejectionPercentage = { name: "Rejection %", data: [] };

    if (Array.isArray(data) && data.length > 0) {
      data.forEach((item) => {
        const dateString = `${item.date} ${item.hour || "00:00:00"}`;
        const date = new Date(dateString);
        if (!isNaN(date.getTime())) {
          const yieldValue = parseFloat(item["Yield Percentage"]);
          const rejectionValue = parseFloat(item["Rejection Percentage"]);
          if (!isNaN(yieldValue)) yieldPercentage.data.push({ x: date, y: yieldValue });
          if (!isNaN(rejectionValue)) rejectionPercentage.data.push({ x: date, y: rejectionValue });
        }
      });
    }
    return [yieldPercentage, rejectionPercentage];
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (data.length === 0) return <div>No data available</div>;

  const chartOptions = {
    chart: {
      type: "line",
      toolbar: { show: true },
      zoom: { enabled: false },
      foreColor: colors.grey[100],
    },
    title: {
      text: "Yield vs Rejection (%)",
      align: "center",
      style: { fontSize: "18px", fontWeight: "600", color: colors.grey[100] },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeFormatter: { year: "yyyy", month: "MMM dd", day: "dd", hour: "HH:mm" },
        style: { colors: colors.grey[300] },
      },
      title: { text: "Date", style: { color: colors.grey[300] } },
    },
    yaxis: {
      min: 0,
      max: 100,
      tickAmount: 5,
      labels: {
        formatter: (val) => `${val}%`,
        style: { colors: colors.grey[300] },
      },
      title: { text: "Percentage", style: { color: colors.grey[300] } },
    },
    stroke: { curve: "smooth", width: 2 }, // <-- smoother & bolder line
    markers: { size: 0 }, // no dots, cleaner
    colors: ["#00A6F3", "#EE4E2A"], // elegant green & red
    tooltip: {
      theme: "dark",
      x: { format: "MMM dd HH:mm" },
      y: { formatter: (val) => `${val.toFixed(1)}%` },
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      labels: { colors: colors.grey[200] },
    },
    grid: {
      borderColor: colors.grey[800],
      strokeDashArray: 1, // subtle dotted grid
    },
    dataLabels: { enabled: false },
  };

  return <Chart options={chartOptions} series={data} type="line" height="100%" />;
};

export default YieldFilter;
