import { Box } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

function GLProd1({ chartData, date }) {
  // ✅ Filter by selected date
  const filteredData = date
    ? chartData.filter(
        (item) => dayjs(item.date).format("YYYY-MM-DD") === date
      )
    : chartData;

  // ✅ Sort by actual date, format for axis
  const rawDates = [
    ...new Set(filteredData.map((item) => item.date)),
  ].sort((a, b) => new Date(a) - new Date(b));

  const dates = rawDates.map((d) => dayjs(d).format("DD-MM-YY")); // ✅ axis labels
  const navigate = useNavigate();

  // ✅ Calculate averages
  const averages = rawDates.map((date) => {
    const items = filteredData.filter(
      (i) => dayjs(i.date).format("YYYY-MM-DD") ===
              dayjs(date).format("YYYY-MM-DD")
    );
    return items.length > 0
      ? items.reduce((sum, i) => sum + (i.efficiency || 0), 0) /
          items.length
      : 0;
  });

  const options = {
    chart: {
      id: "efficiency-bar",
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const clickedDate = rawDates[config.dataPointIndex]; // use raw for navigation
          navigate(`/gltab?date=${dayjs(clickedDate).format("YYYY-MM-DD")}`);
        },
      },
    },
    title: {
      text: "KPI Productivity (Overall Efficiency)",
      align: "center",
      margin: 10,
      offsetY: 5,
      style: {
        fontSize: "8px", // ✅ chart title 8px
        fontWeight: "bold",
        color: "#263238",
      },
    },
    xaxis: {
      type: "category",
      categories: dates, // ✅ short format labels
      title: {
        text: "Dates",
        style: { fontSize: "8px", fontWeight: "bold", color: "#000" }, // ✅ axis title
      },
      labels: {
        rotate: 0,
        style: { fontSize: "6px" }, // ✅ tick labels
      },
    },
    yaxis: {
      title: {
        text: "Overall Efficiency",
        style: { fontSize: "8px", fontWeight: "bold", color: "#000" }, // ✅ axis title
      },
      min: 0,
      max: 100,
      tickAmount: 4,
      labels: {
        formatter: (val) => Math.round(val),
        style: { fontSize: "6px" }, // ✅ tick labels
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 1,
        dataLabels: {
          position: "top",
        },
      },
    },
    stroke: {
      show: false,
      width: 5,
      colors: ["transparent"],
    },
    colors: ["#1976d2"],
    dataLabels: {
      enabled: dates.length <= 5, // ✅ only show if <= 5 points
      formatter: (val) => val.toFixed(2),
      style: {
        fontSize: "6px",
      },
      background: {
        enabled: true,
        borderRadius: 2,
      },
    },
    legend: {
      show: false,
      showForSingleSeries: true,
      showForNullSeries: false,
      showForZeroSeries: true,
      showForAnnotations: false, // 🚫 hide annotation legend
      markers: {
        fillColors: ["#1976d2"], // ✅ only bar legend
      },
      labels: {
        colors: "#000",
        useSeriesColors: false,
      },
      fontSize: "6px", // ✅ legend font size
    },
    annotations: {
      yaxis: [
        {
          y: 100,
          borderColor: "#e91e63",
          strokeDashArray: 5,
        },
      ],
    },
    tooltip: {
      style: { fontSize: "6px" }, // ✅ tooltip font size
      x: {
        formatter: (val, opts) =>
          dayjs(rawDates[opts.dataPointIndex]).format("DD-MMM-YYYY"),
      },
      y: {
        formatter: (val) => val.toFixed(2) + "%",
      },
    },
  };

  const series = [
    {
      name: "Avg Efficiency",
      data: averages,
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "100%", pl: "5px" }}>
      <Chart
        options={options}
        series={series}
        type="bar"
        width="100%"
        height="100%"
      />
    </Box>
  );
}

export default GLProd1;
