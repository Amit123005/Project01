import { Box } from "@mui/material";
import Chart from "react-apexcharts";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

function GLQual2({ chartData, date }) {
  const filteredData = date
    ? chartData.filter((item) => dayjs(item.date).format("YYYY-MM-DD") === date)
    : chartData;

  // ✅ Keep raw dates for calculation + formatted for display
  const dates = [...new Set(filteredData.map((item) => dayjs(item.date).format("YYYY-MM-DD")))].sort();
  const dates2 = [...new Set(filteredData.map((item) => dayjs(item.date).format("DD-MM-YYYY")))].sort();

  const navigate = useNavigate();

  const avStartup = dates.map((date) => {
    const entry = filteredData.filter((i) => dayjs(i.date).format("YYYY-MM-DD") === date);
    return entry.length > 0 ? entry.reduce((arr, item) => arr + (item.startup_rej || 0), 0) / entry.length : 0;
  });

  const options = {
    chart: {
      id: "startup-rej",
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
      },
      zoom: { enabled: true },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const clickedDate = dates[config.dataPointIndex];
          navigate(`/gltab?date=${clickedDate}`);
        },
      },
    },
    title: {
      text: "Sub KPI Quality (Startup Scrap)",
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
      categories: dates, // ✅ display formatted dates
      tickAmount: Math.min(dates.length, 5), // ✅ max 5 ticks
      labels: {
        rotate: 0, // ✅ no rotation
        formatter: (val) => {
          // ✅ truncate if more than 3 chars
          return val.length > 3 ? val.substring(0, 10) + "..." : val;
        },
        style: {
          fontSize: "6px",
        },
      },
      title: {
        text: "Dates",
        style: {
          fontSize: "8px",
          fontWeight: "bold",
          color: "#000000ff",
        },
      },
    },
    yaxis: {
      title: {
        text: "Startup Rejection (Kg)",
        style: {
          fontSize: "8px",
          fontWeight: "bold",
          color: "#000000ff",
        },
      },
      min: 0,
      tickAmount: 4,
      labels: {
        formatter: (val) => val.toFixed(1),
        style: {
          fontSize: "6px",
        },
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
    tooltip: {
      style: {
        fontSize: "6px",
      },
      x: {
        formatter: (val) => dayjs(val).format("DD-MMM-YYYY"),
      },
      y: {
        formatter: (val) => val.toFixed(2) + " Kg",
      },
    },
    legend: {
      show: false, // ✅ same as GLQual1
      showForSingleSeries: true,
      showForNullSeries: false,
      showForZeroSeries: true,
      showForAnnotations: false,
      markers: {
        fillColors: ["#1976d2"],
      },
      labels: {
        fontSize: "6px",
      },
    },
    annotations: {
      yaxis: [
        {
          y: 11.1,
          borderColor: "#e91e63",
          strokeDashArray: 5,
        },
      ],
    },
  };

  const series = [
    {
      name: "Startup Rej",
      data: avStartup,
    },
  ];

  return (
    <Box sx={{ width: "100%", height: "100%", pl: "5px" }}>
      <Chart options={options} series={series} type="bar" width="100%" height="100%" />
    </Box>
  );
}

export default GLQual2;
