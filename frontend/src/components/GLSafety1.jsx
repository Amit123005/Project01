import React, { useRef } from "react";
import { Box } from "@mui/material";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function GLSafety1({ chartData, date }) {
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const filteredData = date
    ? chartData.filter((item) => dayjs(item.date).format("YYYY-MM-DD") === date)
    : chartData;

  const safetyData = filteredData.filter((item) => item.category === "Safety");

  const openCount = safetyData.filter((item) => item.status === "Open").length;
  const closedCount = safetyData.filter((item) => item.status === "Closed").length;

  const data = {
    labels: ["Open", "Closed"],
    datasets: [
      {
        label: "Safety Points",
        data: [openCount, closedCount],
        backgroundColor: ["#E74C3C", "#5DADE2"],
        borderColor: ["#E74C3C", "#5DADE2"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Safety Identified Points Status",
        color: "#263238",
        font: {
          size: 8,       // 🔹 smaller title size
          weight: "bold",
        },
        padding: {
          top: 5,
          bottom: 10,
        },
      },
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 6,    // 🔹 smaller legend labels
          },
        },
      },
      tooltip: {
        bodyFont: {
          size: 10,      // 🔹 smaller tooltip font
        },
        callbacks: {
          label: function (tooltipItem) {
            const value = tooltipItem.raw;
            return `${tooltipItem.label}: ${value} cases`;
          },
        },
      },
    },
  };

  const handleClick = (event) => {
    const chart = chartRef.current;
    if (!chart) return;

    const elements = chart.getElementsAtEventForMode(
      event,
      "nearest",
      { intersect: true },
      true
    );

    if (!elements.length) return;

    const index = elements[0].index;
    const statusClicked = data.labels[index];

    const items = safetyData.filter((item) => item.status === statusClicked);
    const statusNew = "Safety";

    if (items.length > 0) {
      const latestDate = items.reduce((a, b) =>
        new Date(a.date) > new Date(b.date) ? a : b
      ).date;
      navigate(`/glpt?status2=${statusClicked}&date=${latestDate}&status=${statusNew}`);
    } else {
      navigate(`/glpt?status2=${statusClicked}&status=${statusNew}`);
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100%", paddingTop: 1, paddingBottom: 1 }}>
      <Doughnut
        ref={chartRef}
        data={data}
        options={options}
        onClick={handleClick}
      />
    </Box>
  );
}

export default GLSafety1;
