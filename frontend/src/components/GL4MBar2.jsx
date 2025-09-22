// src/components/FourMLineChart.jsx
import React from "react";
import Chart from "react-apexcharts";
import { Card, CardContent, Typography, Box } from "@mui/material";
import dayjs from "dayjs";

export default function FourMLineChart({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return <Typography color="text.secondary">No data available</Typography>;
  }

  // Step 1: Get all unique dates sorted
  const dates = Array.from(
    new Set(chartData.map((item) => dayjs(item.date).format("YYYY-MM-DD")))
  ).sort();

  // Step 2: Define categories
  const categories = ["Man", "Machine", "Material", "Method"];

  // Step 3: Build series
  const series = categories.map((cat) => ({
    name: cat,
    data: dates.map((date) => {
      const count = chartData.filter(
        (item) =>
          dayjs(item.date).format("YYYY-MM-DD") === date &&
          item.category === cat
      ).length;
      return count;
    }),
  }));

  const options = {
    chart: {
      type: "line",
      toolbar: { show: true },
    },
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 5 },
    colors: ["#1976d2", "#388e3c", "#f57c00", "#d32f2f"],
    xaxis: {
      categories: dates,
      labels: { rotate: -45, style: { fontSize: "12px" } },
      title: { text: "Date" },
    },
    yaxis: {
      title: { text: "Count" },
      labels: { formatter: (val) => val.toFixed(0) },
    },
    tooltip: {
      shared: true,
    },
    legend: {
      position: "top",
    },
  };

  return (
    <Card
  sx={{
    height: "100%", // fill parent container
    borderRadius: "16px",
    boxShadow: "0px 6px 15px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
  }}
>
  <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
    <Typography
      variant="h4"
      fontWeight="bold"
      mb={2}
      textAlign="center"
    >
      Daily 4M Category Trends
    </Typography>
    <Box sx={{ flex: 1 }}>
      <Chart
        options={options}
        series={series}
        type="line"
        height="100%"
        width="100%"
      />
    </Box>
  </CardContent>
</Card>

  );
}
