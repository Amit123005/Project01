import { Box, colors, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
import Chart from "react-apexcharts";
import { useNavigate } from "react-router-dom";

function GLQual1({chartData, date}) {

  const filteredData = date
    ? chartData.filter((item) => dayjs(item.date).format("YYYY-MM-DD") === date)
    : chartData;
    
  const dates = [...new Set(filteredData.map((item) => dayjs(item.date).format("YYYY-MM-DD")))].sort();
  const dates2 = [...new Set(filteredData.map((item) => dayjs(item.date).format("DD-MM-YYYY")))].sort();
  const navigate = useNavigate();

  const avOverallRej = dates.map((date) => {
    const entry = filteredData.filter((item) => dayjs(item.date).format("YYYY-MM-DD") === date);
    return entry.length > 0 ? (entry.reduce((arr, i) => arr + (i.overall_rej_perc || 0), 0)).toFixed(2)/entry.length : 0;
  })

  const options = {
  chart: {
    id: "overall_rej_per",
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
        const clickDate = dates[config.dataPointIndex];
        navigate(`/gltab?date=${clickDate}`);
      },
    },
  },
  title: {
    text: "KPI Quality (Overall Rejection %)",
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
    categories: dates,
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
      text: "Overall Rejection %",
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
      horizontal: false,
      borderRadius: 1,
      dataLabels: {
        position: "top",
      },
    },
  },
  dataLabels: {
    enabled: dates.length <= 5, // ✅ only show if <= 5 points
    formatter: (val) => val.toFixed(2),
    style: {
      fontSize: "6px",
    },
    background: {
      enabled: true,
      borderRadius: 2, // ✅ make radius smaller (default ~4)
    },
  },
  colors: ["#1976d2"],
  legend: {
    show: false,
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
        y: 2,
        borderColor: "#e91e63",
        strokeDashArray: 5,
      },
    ],
  },
  tooltip: {
    style: {
      fontSize: "6px",
    },
    x: {
      formatter: (value) => dayjs(value).format("DD-MMM-YYYY"),
    },
    y: {
      formatter: (val) => val.toFixed(2) + "%",
    },
  },
};


  const series = [
    {
      name: "Overall Rejection Percentage",
      data : avOverallRej
    }
  ]

  return (
    <Box sx={{width:'100%', height : '100%', pl: "5px"}}>
      <Chart options={options} series={series} type="bar" width="100%" height="100%"/> 
    </Box>
  )
}

export default GLQual1;