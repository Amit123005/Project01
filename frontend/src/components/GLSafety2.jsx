import { Box } from "@mui/material";
import dayjs from "dayjs";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

function GLSafety2({ chartData, date }) {
  const navigate = useNavigate();

  const filteredData = date
    ? chartData.filter((item) => dayjs(item.date).format("YYYY-MM-DD") === date)
    : chartData;

  const accidentData = filteredData.filter((item) => item.category === "Accident");

  const dates = [...new Set(accidentData.map((item) => dayjs(item.date).format("YYYY-MM-DD")))].sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const categories = [...new Set(accidentData.map((item) => item.incident_cat))];

  const series = categories.map((cat) => {
    const data = dates.map((date) =>
      accidentData.filter(
        (i) => i.incident_cat === cat && dayjs(i.date).format("YYYY-MM-DD") === date
      ).length
    );
    return { name: cat, data };
  });

  const options = {
    chart: {
      id: "safety-2",
      toolbar: { show: true },
      zoom: { enabled: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const pointIndex = config?.dataPointIndex;
          const seriesIndex = config?.seriesIndex;
          if (pointIndex == null || seriesIndex == null) return;

          const clickedDate = dates[pointIndex];
          const clickedStatus = "Accident";

          if (clickedStatus) {
            navigate(`/glpt?status=${clickedStatus}&date=${clickedDate}`);
          } else {
            navigate(`/glpt?date=${clickedDate}`);
          }
        },
      },
    },
    markers: {
      size: 4,          // smaller markers
      strokeWidth: 1.5,
      hover: { size: 6 },
    },
    stroke: { curve: "smooth", width: 2 },
    tooltip: {
      shared: false,
      intersect: true,
      style: { fontSize: "6px" },
    },
    title: {
      text: "Accidents by Category",
      align: "center",
      style: { fontSize: "8px", fontWeight: "bold" }, // smaller title
    },
    xaxis: {
      type: "category",
      categories: dates,
      title: { text: "Date", style: { fontSize: "8px" } },
      labels: { style: { fontSize: "6px" }, rotate: -45 },
    },
    yaxis: {
      title: { text: "Accident Count", style: { fontSize: "8px" } },
      min: 0,
      labels: { style: { fontSize: "6px" } },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: "6px" },
      formatter: (val) => (val ? val.toFixed(0) : ""),
    },
    legend: {
      position: "top",
      horizontalAlign: "center",
      labels: { useSeriesColors: true, style: { fontSize: "6px" } },
    },
  };

  return (
    <Box sx={{ width: "100%", height: "100%", pl: "5px" }}>
      <Chart options={options} series={series} type="bar" width="100%" height="100%" />
    </Box>
  );
}

export default GLSafety2;
