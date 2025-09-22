import { Box } from "@mui/material";
import dayjs from "dayjs";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

function GLCost3({ chartData }) {
  const navigate = useNavigate();

  // ✅ Collect all unique dates from full dataset
  const dates = [...new Set(chartData.map((item) => dayjs(item.date).format("YYYY-MM-DD")))].sort();
  const dates2 = [...new Set(chartData.map((item) => dayjs(item.date).format("DD-MM-YY")))].sort();
  console.log(`Data is Chart : `,chartData);
  

  // ✅ Calculate energy per date
  const energy = dates.map((date) => {
  const entry = chartData.filter((i) => dayjs(i.date).format("YYYY-MM-DD") === date);
  const energyForDate = entry.reduce((sum, item) => sum + (item.end_reading - item.start_reading) * 10, 0);

  // ✅ Log the details for this date
  console.log(`Date: ${date}, Energy: ${energyForDate}, Entries:`, entry);

  return energyForDate;
});

  const series = [
    {
      name: "Energy",
      data: energy,
    },
  ];

  const options = {
  chart: {
    id: "Energy",
    background: "white",
    toolbar: { show: true },
    events: {
      dataPointSelection: (event, chartContext, config) => {
        const dataIndex = config.dataPointIndex;
        if (dataIndex !== undefined && dataIndex >= 0) {
          const clickedDate = dates[dataIndex];
          if (clickedDate) {
            navigate(`/gltab?date=${clickedDate}`);
          }
        }
      },
    },
  },
  title: {
    text: "Energy",
    align: "center",
    offsetY: 5,
    margin: 10,
    style: {
      fontSize: "8px",  // smaller title
      fontWeight: "bold",
      color: "black",
    },
  },
  xaxis: {
    type: "category",
    categories: dates2,
    title: {
      text: "Date",
      style: { fontSize: "8px", fontWeight: "bold", color: "black" },
    },
    labels: {
      style: { fontSize: "6px", colors: "black" },
      rotate: 0,       // no rotation
      tickAmount: 5,   // max 5 ticks
    },
  },
  yaxis: {
    title: {
      text: "Energy Cost (Rs)",
      style: { fontSize: "8px", fontWeight: "bold", color: "black" },
    },
    min: 0,
    labels: {
      style: { fontSize: "6px", colors: "black" },
      formatter: (val) => (val !== null && val !== undefined ? val.toFixed(0) : ""),
    },
  },
  dataLabels: {
    enabled: dates2.length <= 5, // ✅ disable if more than 5 data points
    style: { fontSize: "6px", colors: ["black"] },
    formatter: (val) => (val !== null && val !== undefined ? val.toFixed(2) : ""),
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
          y: 2500,
          borderColor: "#e91e63",
          strokeDashArray: 5,
        },
      ],
    },
};

  return (
    <Box sx={{ width: "100%", height: "100%", pl: "5px" }}>
      <Chart options={options} series={series} type="bar" width="100%" height="100%" back/>
    </Box>
  );
}

export default GLCost3;
