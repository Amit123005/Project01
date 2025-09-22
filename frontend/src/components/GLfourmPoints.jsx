import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";

export default function GL4MPoints() {
  const [month, setMonth] = useState(""); 
  const [area, setArea] = useState(""); 
  const [line, setLine] = useState(""); 

  const [data, setData] = useState([]);

  // Fetch data with filters
  const fetchData = async () => {
    let url = "http://163.125.102.142:5000/api/gl_4m_points?";
    if (month) url += `month=${month}&`;
    if (area) url += `area=${encodeURIComponent(area)}&`;
    if (line) url += `line=${line}&`;

    try {
      const res = await fetch(url);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching 4M points:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [month, area, line]);

  return (
    <Box sx={{ p: 2, ml: "80px" }}>
      {/* Filters */}
      <Box display="flex" gap={2} alignItems="center" mb={2}>
        <TextField
          type="month"
          size="small"
          label="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
        <TextField
          size="small"
          value={area}
          label="Plant"
          onChange={(e) => setArea(e.target.value)}
          disabled
        />
        <TextField
          select
          size="small"
          label="Sub Area / Line"
          value={line}
          onChange={(e) => setLine(e.target.value)}
        >
          <MenuItem value="">All Lines</MenuItem>
          {["Line 1", "Line 2", "Line 3", "Line 4", "Line 5", "Line 6", "Line 8"].map((num) => (
            <MenuItem key={num} value={num}>
              {num}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Table */}
      <Paper sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Plant</TableCell>
              <TableCell>Area</TableCell>
              <TableCell>Sub Area</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Detail</TableCell>
              <TableCell>Breakdown Reason</TableCell>
              <TableCell>Breakdown Time</TableCell>
              <TableCell>Total Qty</TableCell>
              <TableCell>Action Taken</TableCell>
              <TableCell>Retro Total</TableCell>
              <TableCell>Retro OK</TableCell>
              <TableCell>Retro NG</TableCell>
              <TableCell>Suspected Total</TableCell>
              <TableCell>Suspected OK</TableCell>
              <TableCell>Suspected NG</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={20} align="center">
                  No records found
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.date ? dayjs(row.date).format("YYYY-MM-DD") : "NA"}</TableCell>
                  <TableCell>{row.shift}</TableCell>
                  <TableCell>{row.plant}</TableCell>
                  <TableCell>{row.area}</TableCell>
                  <TableCell>{row.sub_area}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.detail}</TableCell>
                  <TableCell>{row.bd_reason}</TableCell>
                  <TableCell>{row.bd_time}</TableCell>
                  <TableCell>{row.total_qty}</TableCell>
                  <TableCell>{row.action_taken}</TableCell>
                  <TableCell>{row.retro_total}</TableCell>
                  <TableCell>{row.retro_ok}</TableCell>
                  <TableCell>{row.retro_ng}</TableCell>
                  <TableCell>{row.suspected_total}</TableCell>
                  <TableCell>{row.suspected_ok}</TableCell>
                  <TableCell>{row.suspected_ng}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
