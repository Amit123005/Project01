import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, MenuItem, Button } from "@mui/material";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Chart from "react-apexcharts";
import { YAxis } from "recharts";
 
function getCurrentShiftAndDate() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  let shift = "A";
  let date = now.toISOString().split("T")[0]; // default today
 
  if (hours >= 6 && (hours < 14 || (hours === 14 && minutes <= 30))) {
    shift = "A";
  } else if ((hours > 14 || (hours === 14 && minutes > 30)) && hours < 23) {
    shift = "B";
  } else {
    shift = "C";
    // for shift C (23:00 – 06:00), if time < 6AM then use yesterday’s date
    if (hours < 6) {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      date = yesterday.toISOString().split("T")[0];
    }
  }
 
  return { shift, date };
}
 
export default function PABBoard() {
  const { shift: initialShift, date: initialDate } = getCurrentShiftAndDate();
 
  const [rows, setRows] = useState([]);
  const [chartData, setChartData] = useState({ categories: [], target: [], actual: [] });
  const [date, setDate] = useState(initialDate);
  const [shift, setShift] = useState(initialShift);
 
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `http://163.125.102.142:5000/api/pab?date=${date}&shift=${shift}`
      );
      setRows(res.data);
 
      setChartData({
        categories: res.data.map((d) => d.hour_slot),
        target: res.data.map((d) => d.target),
        actual: res.data.map((d) => d.actual),
      });
    } catch (err) {
      console.error("Error fetching PAB data:", err);
    }
  };
 
  useEffect(() => {
    fetchData();
  }, [date, shift]); // 🔹 re-fetch whenever date or shift changes automatically
 
  const columns = [
    { field: "id", headerName: "Time-Slot", flex: 1 },
    { field: "model", headerName: "Model", flex: 1 },
    { field: "partna", headerName: "Part Name", flex: 1 },
    { field: "hour_slot", headerName: "Time (Hour)", flex: 1 },
    { field: "target", headerName: "Target", flex: 1 },
    { field: "actual", headerName: "Actual", flex: 1 },
    { field: "gap", headerName: "Gap", flex: 1 },
    { field: "efficiency", headerName: "Efficiency (%)", flex: 1 },
    
  ];
 
  const chartOptions = {
    chart: { type: "bar", stacked: false },
    xaxis: { 
      categories: chartData.categories,
      labels : {
        style : {
          fontSize : "18px",
          fontWeight : "bold"
        }
      }
     },
     yaxis: {
    labels: {
      style: {
        fontSize: "18px",
        fontWeight: "bold",
      },
    },
  },
    dataLabels: { enabled: true },
    colors: ["#008FFB", "#00E396"],
  };
 
  const chartSeries = [
    { name: "Target", data: chartData.target },
    { name: "Actual", data: chartData.actual },
  ];
 
  return (
    <Box p={3} ml={0}>
      <Typography variant="h1" fontWeight="bold" sx={{ textAlign: "center" }} gutterBottom>
        📊 Production Analysis Board (PAB)
      </Typography>
 
      {/* 🔹 Filters */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          type="date"
          label="Select Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
 
        <TextField
          select
          label="Shift"
          value={shift}
          onChange={(e) => setShift(e.target.value)}
        >
          <MenuItem value="A">A</MenuItem>
          <MenuItem value="B">B</MenuItem>
          <MenuItem value="C">C</MenuItem>
        </TextField>
 
        {/* <Button variant="contained" color="primary" onClick={fetchData}>
          Apply
        </Button> */}
      </Box>
 
      {/* 🔹 Data Table */}
      <Box mb={3} sx={{ height: 500 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row, index) => row.id ?? `${row.hour_slot}-${index}`}
          sx={{
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f5f5f5", // optional, just for better visibility
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontWeight: "bold",
              fontSize: "1.5rem", // adjust as needed
            },
            "& .MuiDataGrid-cell": {
              fontSize: "1.1rem", // row text size
            },
          }}
        />
      </Box>
 
      {/* 🔹 Chart */}
      <Chart options={chartOptions} series={chartSeries} type="bar" height={350} />
    </Box>
  );
}