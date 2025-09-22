import { Box } from "@mui/material";
import dayjs from "dayjs";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

function GLCost2({ chartData, date }) {
  const filteredData = date
    ? chartData.filter(
        (item) => dayjs(item.date).format("YYYY-MM-DD") === date
      )
    : chartData;

  // Unique sorted dates
  const rawDates = [...new Set(filteredData.map((item) => item.date))].sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const dates = rawDates.map((d) => dayjs(d).format("DD-MM-YY"));
  const navigate = useNavigate();

  // Calculating totals
  const totalIndirect = rawDates.map((date) => {
    const entry = filteredData.filter(
      (i) => dayjs(i.date).format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD")
    );
    return entry.reduce(
      (arr, item) =>
        arr +
        ((item.old_dhoti || 0) * 10 + (item.corrogard || 0) * 270 + (item.hand_gloves || 0) * 10),
      0
    );
  });

  const options = {
    chart: {
      id: "Indirect-cost",
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, { dataPointIndex, w }) => {
          if (dataPointIndex !== undefined && dataPointIndex >= 0) {
            const clickedDate = w.globals.categoryLabels[dataPointIndex];
            if (clickedDate) {
              setTimeout(() => navigate(`/gltab?date=${clickedDate}`), 50);
            }
          }
        },
      },
    },
    title: {
      text: "Indirect Cost",
      align: "center",
      offsetY: 5,
      margin: 10,
      style: {
        fontSize: "8px",
        fontWeight: "bold",
        color: "#263238",
      },
    },
    xaxis: {
      type: "category",
      categories: dates,
      tickAmount: Math.min(dates.length, 5), // ✅ show up to 5 ticks
      labels: { style: { fontSize: "6px" }, rotate: 0 }, // ✅ zero rotation
      title: {
        text: "Date",
        style: { fontSize: "8px", fontWeight: "bold", color: "#000" },
      },
    },
    yaxis: {
      title: {
        text: "Indirect Cost(Rs.)",
        style: { fontSize: "8px", fontWeight: "bold", color: "#000" },
      },
      min: 0,
      labels: {
        style: { fontSize: "6px" },
        formatter: (val) => (val !== null && val !== undefined ? val.toFixed(0) : ""),
      },
    },
    stroke: { curve: "smooth", width: 1.5 },
    markers: { size: 2.5, strokeWidth: 0.5 },
    tooltip: {
      style: { fontSize: "6px" },
      y: { formatter: (val) => (val !== null && val !== undefined ? val.toFixed(2) : "") },
    },
    legend: {
      show: false,
      fontSize: "5px",
      markers: { width: 4, height: 4 },
      itemMargin: { horizontal: 1, vertical: 0 },
    },
    annotations: {
      yaxis: [
        {
          y: 1000,
          borderColor: "#e91e63",
          strokeDashArray: 5,
        },
      ],
    },
  };

  const series = [
    {
      name: "Indirect Cost",
      data: totalIndirect,
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "100%", pl: "5px" }}>
      <Chart options={options} series={series} type="line" width="100%" height="100%" />
    </Box>
  );
}

export default GLCost2;
