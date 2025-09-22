import { Box } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

function GLProd2({ chartData, date }) {
  const filteredData = date
    ? chartData.filter(
        (item) => dayjs(item.date).format("YYYY-MM-DD") === date
      )
    : chartData;

  // ✅ sort raw dates first
  const rawDates = [
    ...new Set(filteredData.map((item) => item.date)),
  ].sort((a, b) => new Date(a) - new Date(b));

  // ✅ format for axis labels
  const dates = rawDates.map((d) => dayjs(d).format("DD-MM-YY"));

  const navigate = useNavigate();

  // ✅ averages
  const avCo = rawDates.map((date) => {
    const entry = filteredData.filter(
      (i) => dayjs(i.date).format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD")
    );
    return entry.length > 0
      ? entry.reduce((sum, i) => sum + (i.co_time || 0), 0) / entry.length
      : 0;
  });

  const avSetup = rawDates.map((date) => {
    const entry = filteredData.filter(
      (i) => dayjs(i.date).format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD")
    );
    return entry.length > 0
      ? entry.reduce((sum, i) => sum + (i.setup_time || 0), 0) / entry.length
      : 0;
  });

  const avBd = rawDates.map((date) => {
    const entry = filteredData.filter(
      (i) => dayjs(i.date).format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD")
    );
    return entry.length > 0
      ? entry.reduce((sum, i) => sum + (i.dt_time || 0), 0) / entry.length
      : 0;
  });

  // 🔹 Targets
  const targetCo = 50;
  const targetSetup = 25;
  const targetBd = 0;

  const options = {
  chart: {
    id: "time-line",
    toolbar: {
      show: false,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        pan: true,
        reset: true,
      },
      offsetX: -5,
      offsetY: -5,
    },
  },
  title: {
    text: "Sub KPI Productivity",
    align: "center",
    margin: 10,
    offsetY: 5,
    style: {
      fontSize: "8px",
      fontWeight: "bold",
      color: "#263238",
    },
  },
  xaxis: {
    categories: dates,
    title: {
      text: "Dates",
      style: { fontSize: "8px", fontWeight: "bold", color: "#000" },
    },
    labels: {
      rotate: 0,
      style: { fontSize: "6px" },
    },
  },
  yaxis: {
    title: {
      text: "Minutes (min)",
      style: { fontSize: "8px", fontWeight: "bold", color: "#000" },
    },
    min: 0,
    tickAmount: 4,
    labels: {
      formatter: (val) => val.toFixed(0),
      style: { fontSize: "6px" },
    },
  },
  stroke: {
    curve: "smooth",
    width: [1, 1, 1, 0.5, 0.5, 0.5], // ✅ thinner lines
    dashArray: [0, 0, 0, 2, 2, 2],
  },
  markers: {
    size: 2, // ✅ smaller datapoints
    strokeWidth: 2,
  },
  colors: [
    "#1976d2",
    "#388e3c",
    "#d32f2f",
    "#1976d2",
    "#388e3c",
    "#d32f2f",
  ],
  tooltip: {
    style: { fontSize: "6px" },
    x: {
      formatter: (value, opts) =>
        dayjs(rawDates[opts.dataPointIndex]).format("DD-MMM-YYYY"),
    },
    y: {
      formatter: (val) => val.toFixed(2) + " min",
    },
  },
  legend: {
    position: "top",
    fontSize: "5px", // ✅ smaller legend text
    markers: { width: 1, height: 1 }, // ✅ smaller legend dots
    itemMargin: { horizontal: 1, vertical: 0 },
  },
};

  const series = [
    { name: "CO Time", data: avCo },
    { name: "Setup Time", data: avSetup },
    { name: "Breakdown Time", data: avBd },
    { name: "CO Target", data: rawDates.map(() => targetCo) },
    { name: "Setup Target", data: rawDates.map(() => targetSetup) },
    { name: "Breakdown Target", data: rawDates.map(() => targetBd) },
  ];

  return (
    <Box sx={{ width: "100%", height: "100%", pl: "5px" }}>
      <Chart
        options={options}
        series={series}
        type="line"
        width="100%"
        height="100%"
      />
    </Box>
  );
}

export default GLProd2;
