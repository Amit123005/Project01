import { Box } from "@mui/material";
import dayjs from "dayjs";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

function GLCost1({ chartData, customer, date }) {
  const navigate = useNavigate();

  // Filter data by customer
  let filteredData =
    customer && customer !== "All Customers"
      ? chartData.filter((item) => item.customer === customer)
      : chartData;

  if (date) {
    filteredData = filteredData.filter(
      (item) => dayjs(item.date).format("YYYY-MM-DD") === date
    );
  }

  // Unique sorted dates
  const rawDates = [...new Set(filteredData.map((item) => item.date))].sort(
    (a, b) => new Date(a) - new Date(b)
  );
  const datesNew = rawDates.map((d) => dayjs(d).format("DD-MM-YY"));

  // Unique parts (models)
  const parts = [...new Set(filteredData.map((item) => item.model))];

  // Series per part
  const series = parts.map((part) => {
    const data = rawDates.map((date) => {
      const entry = filteredData.find(
        (i) =>
          i.model === part &&
          dayjs(i.date).format("YYYY-MM-DD") === dayjs(date).format("YYYY-MM-DD")
      );
      return entry ? entry.gpm : null;
    });
    return { name: part, data };
  });

  const options = {
    chart: {
      id: "all-items",
      toolbar: {
        show: false,
        offsetX: -5,
        offsetY: -5,
      },
      zoom: { enabled: true },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const dataIndex = config.dataPointIndex;
          if (dataIndex !== undefined && dataIndex >= 0) {
            const clickedDate = rawDates[dataIndex];
            if (clickedDate) {
              setTimeout(
                () =>
                  navigate(
                    `/gltab?date=${dayjs(clickedDate).format(
                      "YYYY-MM-DD"
                    )}&customer=${customer}`
                  ),
                50
              );
            }
          }
        },
      },
    },
    title: {
      text: `KPI Cost (Consumption) ${
        customer ? "- " + customer : ""
      }`,
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
      type: "category",
      categories: datesNew,
      title: {
        text: "Dates",
        style: { fontSize: "8px", fontWeight: "bold", color: "#000" },
      },
      labels: {
        rotate: 0,
        style: { fontSize: "6px" },
        formatter: (val) => (datesNew.length > 5 ? val.substring(0, 5) + "..." : val),
      },
    },
    yaxis: {
      title: {
        text: "Consumption (g/mtr)",
        style: { fontSize: "8px", fontWeight: "bold", color: "#000" },
        
      },
      min: 0,
      labels: { 
        style: { fontSize: "6px" } ,
        formatter: (val) => (val !== null && val !== undefined ? val.toFixed(1) : "")
      },
    },
    tooltip: {
      style: { fontSize: "6px" },
      shared: true,
      intersect: false,
      y: {
        formatter: (val) => (val !== null && val !== undefined ? val.toFixed(2) : "")
      },
    },
    stroke: { curve: "smooth" },
    dataLabels: {
      enabled: false,
      style: { fontSize: "6px", fontWeight: "bold" },
      formatter: (val) =>
        val === null || val === undefined ? "" : val.toFixed(2),
    },
    legend: {
      show: false,
      fontSize: "5px",
      markers: { width: 6, height: 6 },
      itemMargin: { horizontal: 1, vertical: 0 },
    },
  };

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

export default GLCost1;
