// src/components/FourMBarChart.jsx
import React from "react";
import Chart from "react-apexcharts";
import { Card, CardContent, Typography } from "@mui/material";

export default function FourMBarChart({ chartData }) {
  if (!chartData || chartData.length === 0) {
    return <Typography color="text.secondary">No data available</Typography>;
  }

  // ✅ Group by category
  const categoryCounts = chartData.reduce((acc, item) => {
    const category = item.category || "Unknown";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  // ✅ Convert to arrays for ApexCharts
  const categories = Object.keys(categoryCounts);
  const counts = Object.values(categoryCounts);

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        distributed: true, 
        columnWidth: "30%",   
      },
    },
    colors: ["#1976d2", "#388e3c", "#f57c00", "#d32f2f"], // Man, Machine, Material, Method
    dataLabels: {
      enabled: true,
      style: { fontSize: "14px", fontWeight: "bold" },
    },
    xaxis: {
      categories: categories,
      labels: { style: { fontSize: "14px", fontWeight: "bold" } },
    },
    yaxis: {
     
      labels: { style: { fontSize: "14px" },
      formatter : (val) => val.toFixed(0), },
    },
    legend: {
      show: true,
      position : "top"
    },
    tooltip: {
      y: { formatter: (val) => `${val} points` },
    },
  };

  const series = [
    {
      name: "Count",
      data: counts,
    },
  ];

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "10px",
        boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
      }}
    >
      <CardContent sx={{ height: "100%" }}>
        <Typography variant="h4" fontWeight="bold" mb={2} textAlign="center">
          4M Category Distribution
        </Typography>
        <div style={{ width: "100%", height: "calc(100% - 40px)" }}>
          <Chart options={options} series={series} type="bar" height="100%" width="100%" />
        </div>
      </CardContent>
    </Card>
  );
}
